import { addMatchers, expect } from "https://deno.land/x/expect@v0.2.6/mod.ts";
import * as matchers from "https://deno.land/x/expect@v0.2.6/matchers.ts";
import { RhumRunner } from "https://deno.land/x/rhum@v1.1.7/mod.ts";
import { sprintf } from "https://deno.land/std@0.87.0/fmt/printf.ts";
type Expect = typeof expect;

const Rhum = new RhumRunner();

type RhumTestCase = typeof Rhum.testCase;
type RhumTestSuite = typeof Rhum.testSuite;
type Extended<T, P = unknown> = T & {
  [index: string]: P;
};

const it = (name: string, testFn: () => void): void =>
  Rhum.testCase(name, testFn);
const test = (name: string, testFn: () => void): void =>
  Rhum.testCase(name, testFn);
const describe = (name: string, testCases: () => void): void =>
  Rhum.testSuite(name, testCases);
const jest = {
  fn: <T>(fn: T): T => fn,
};

const getEachHandler = (
  base: typeof describe | typeof it,
) => {
  return (eacher: [string, ...unknown[]][]) =>
    (name: string, testCases: (...args: unknown[]) => void) =>
      eacher.forEach((v) => {
        console.log("before each");
        base(sprintf(name, ...eacher), () => testCases(...eacher));
      });
};
addMatchers({
  toBeCalledTimes: matchers.toHaveBeenCalledTimes,
});

(test as Extended<RhumTestCase>).each = (it as Extended<RhumTestCase>)
  .each = getEachHandler(it);

(describe as Extended<RhumTestSuite>).each = getEachHandler(
  describe,
);

export { describe, expect, it, jest, test };
