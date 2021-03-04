import { assert } from "https://deno.land/std/testing/asserts.ts";
import { subslate } from "../../../mod.ts";

Deno.test({
  name: "Basic Operation",
  fn: () => {
    let result = subslate("hello ${x}", { x: "world" });
    assert(result == "hello world", "Invalid String result");
  },
});
