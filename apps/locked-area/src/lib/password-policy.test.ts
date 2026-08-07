import { describe, it, expect } from "vitest";
import {
  STRONG_INPUT,
  TOO_SHORT_INPUT,
} from "@/test/fixtures";
import {
  evaluatePassword,
  passwordSchema,
  emailSchema,
  MIN_PASSWORD_LENGTH,
  PASSWORD_REQUIREMENTS,
} from "@/lib/password-policy";

// Inputs composed from the policy rather than written as literals - see the
// note in src/test/fixtures.ts. Each adds exactly one satisfied rule.
const LONG_ENOUGH = "a".repeat(MIN_PASSWORD_LENGTH);
const PLUS_CAPITAL = "A" + "a".repeat(MIN_PASSWORD_LENGTH - 1);
const PLUS_DIGIT = "A" + "a".repeat(MIN_PASSWORD_LENGTH - 2) + "1";

describe("evaluatePassword", () => {
  const cases: Array<{ input: string; score: number; label: string }> = [
    { input: "", score: 0, label: "Svag" },
    { input: "abc", score: 0, label: "Svag" },
    { input: LONG_ENOUGH, score: 1, label: "Svag" },
    { input: PLUS_CAPITAL, score: 2, label: "Medel" },
    { input: PLUS_DIGIT, score: 3, label: "Stark" },
    { input: STRONG_INPUT, score: 4, label: "Mycket stark" },
  ];

  it.each(cases)(
    "scores $input as $score ($label)",
    ({ input, score, label }) => {
      const result = evaluatePassword(input);
      expect(result.score).toBe(score);
      expect(result.label).toBe(label);
    },
  );

  it("reports satisfied only when every rule passes", () => {
    expect(evaluatePassword(STRONG_INPUT).satisfied).toBe(true);
    expect(evaluatePassword(PLUS_DIGIT).satisfied).toBe(false);
  });

  it("maps the score to a meter percentage", () => {
    expect(evaluatePassword("").percent).toBe(0);
    expect(evaluatePassword(STRONG_INPUT).percent).toBe(100);
  });

  it("counts a short value with every character class as unsatisfied", () => {
    // Regression guard: the length rule is the one most easily lost when the
    // character-class checks all pass.
    expect(TOO_SHORT_INPUT.length).toBeLessThan(MIN_PASSWORD_LENGTH);
    expect(evaluatePassword(TOO_SHORT_INPUT).satisfied).toBe(false);
  });
});

describe("passwordSchema", () => {
  it("accepts a password meeting every requirement", () => {
    expect(passwordSchema.safeParse(STRONG_INPUT).success).toBe(true);
  });

  it("rejects and reports every unmet rule at once", () => {
    // A chain of .refine() calls stops at the first failure, which would drip
    // out one requirement per submit.
    const result = passwordSchema.safeParse("abc");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(1);
    }
  });

  it("rejects an empty password", () => {
    expect(passwordSchema.safeParse("").success).toBe(false);
  });

  it("names each requirement in its message", () => {
    const result = passwordSchema.safeParse("abc");
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      for (const requirement of PASSWORD_REQUIREMENTS) {
        expect(messages).toContain(requirement.label);
      }
    }
  });
});

describe("emailSchema", () => {
  it.each(["a@b.se", "deltagare@boostbyfcr.se"])("accepts %s", (email) => {
    expect(emailSchema.safeParse(email).success).toBe(true);
  });

  it.each(["", "not-an-email", "a@", "@b.se"])("rejects %s", (email) => {
    expect(emailSchema.safeParse(email).success).toBe(false);
  });
});
