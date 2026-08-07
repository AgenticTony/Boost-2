import { describe, it, expect } from "vitest";
import {
  QUERIES,
  isQueryKey,
  pickVariables,
} from "../../supabase/functions/_shared/exercise-queries";

/**
 * The edge function is Deno and cannot run under vitest, so the part worth
 * testing - what it will and will not send to Hygraph - lives in an
 * import-free module both sides share.
 *
 * The risk being guarded here is a proxy that relays whatever GraphQL the
 * client sends. That is not a proxy, it is the Hygraph API with the credential
 * attached: any signed-in member could read other models or send mutations.
 */
describe("query whitelist", () => {
  it("recognises only the two known queries", () => {
    expect(isQueryKey("listExercises")).toBe(true);
    expect(isQueryKey("exerciseById")).toBe(true);
  });

  it.each([
    "deleteExercises",
    "__schema",
    "",
    "constructor",
    "toString",
    "listexercises",
    "exerciseBySlug",
  ])("rejects %j", (candidate) => {
    expect(isQueryKey(candidate)).toBe(false);
  });

  it("rejects non-string keys", () => {
    for (const candidate of [null, undefined, 42, {}, ["listExercises"]]) {
      expect(isQueryKey(candidate)).toBe(false);
    }
  });

  it("does not treat inherited Object properties as queries", () => {
    // Object.hasOwn rather than `in` or a bare property read: "constructor"
    // and "toString" exist on every object and would otherwise pass.
    expect(isQueryKey("hasOwnProperty")).toBe(false);
    expect(isQueryKey("valueOf")).toBe(false);
  });

  it("only ever reads published content", () => {
    for (const query of Object.values(QUERIES)) {
      expect(query).toContain("stage: PUBLISHED");
    }
  });

  it("contains no mutations", () => {
    for (const query of Object.values(QUERIES)) {
      expect(query).not.toMatch(/\bmutation\b/);
    }
  });
});

describe("variable whitelist", () => {
  it("passes a slug through for exerciseById", () => {
    expect(pickVariables("exerciseById", { id: "abc123" })).toEqual({
      id: "abc123",
    });
  });

  it("drops everything the query did not ask for", () => {
    // A client that can smuggle extra variables can influence a query it was
    // never meant to shape.
    expect(
      pickVariables("exerciseById", {
        id: "ok",
        first: 10000,
        stage: "DRAFT",
      }),
    ).toEqual({ id: "ok" });
  });

  it("drops a non-string id", () => {
    expect(pickVariables("exerciseById", { id: { $ne: null } })).toEqual({});
    expect(pickVariables("exerciseById", { id: 1 })).toEqual({});
  });

  it("takes no variables for the list query", () => {
    expect(pickVariables("listExercises", { id: "x", first: 999 })).toEqual({});
  });

  it("tolerates a missing or malformed body", () => {
    expect(pickVariables("exerciseById", undefined)).toEqual({});
    expect(pickVariables("exerciseById", null)).toEqual({});
    expect(pickVariables("exerciseById", "id=x")).toEqual({});
  });
});
