import * as path from "https://deno.land/std@0.87.0/path/mod.ts";

const addedImports = {
  "jest-globals": "./jest-poly.ts",
};

const root = ["..", "..", "..", "src", "lib"];
const getDir = (pathParts: string[]) =>
  Array.from(
    Deno.readDirSync(path.resolve(...pathParts)),
  ).map((v) => ({ path: pathParts, ...v }));
const dirs: (Deno.DirEntry & { path: string[] })[] = getDir(root);
const filesPaths: [string, URL][] = [];
const resolveToUrl = (paths: string[]) =>
  path.toFileUrl(path.resolve(...paths));
for (; dirs.length;) {
  const dirEntry = dirs.pop();
  if (dirEntry?.isFile && dirEntry.name.endsWith(".ts")) {
    filesPaths.push([
      path.basename(dirEntry.name, ".ts"),
      resolveToUrl([...dirEntry.path, dirEntry.name]),
    ]);
  } else if (dirEntry?.isDirectory) {
    getDir([...dirEntry.path, dirEntry.name]).forEach((v) => dirs.push(v));
  }
}

const getEmptyObj = (): Record<string, unknown> => ({});
const imports = filesPaths.reduce((acc, v) => {
  acc[v[0]] = v[1];
  return acc;
}, getEmptyObj());
const extraResolvedImports = Object.entries(addedImports).reduce(
  (acc, [key, value]) => {
    acc[key] = resolveToUrl([value]);
    return acc;
  },
  getEmptyObj(),
);
const importMap = JSON.stringify(
  {
    imports: { ...imports, ...extraResolvedImports },
  },
  (_, value) => {
    if (value == null || value.constructor != Object) {
      return value;
    }
    return Object.keys(value).sort((a, b) => b.length - a.length).reduce(
      (s, k) => {
        s[k] = value[k];
        return s;
      },
      getEmptyObj(),
    );
  },
  2,
);

Deno.writeTextFileSync(path.join("build", "import-map.json"), importMap);
