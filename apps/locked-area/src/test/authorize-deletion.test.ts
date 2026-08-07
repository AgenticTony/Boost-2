import { describe, it, expect } from "vitest";
import {
  authorizeDeletion,
  type Principal,
} from "../../supabase/functions/_shared/authorize-deletion";

const admin: Principal = { id: "admin-1", isAdmin: true };
const otherAdmin: Principal = { id: "admin-2", isAdmin: true };
const member: Principal = { id: "member-1", isAdmin: false };

/**
 * The edge function itself is Deno and cannot run under vitest, so the rules
 * live in an import-free module that both sides share. This is the part that
 * decides whether an account gets destroyed, so it is tested directly rather
 * than through the UI.
 */
describe("authorizeDeletion", () => {
  it("allows an admin to delete an ordinary member", () => {
    expect(authorizeDeletion(admin, member)).toEqual({ allowed: true });
  });

  it("rejects an unauthenticated caller", () => {
    const decision = authorizeDeletion(null, member);
    expect(decision).toMatchObject({ allowed: false, status: 401 });
  });

  it("rejects a signed-in non-admin", () => {
    const decision = authorizeDeletion(member, {
      id: "member-2",
      isAdmin: false,
    });
    expect(decision).toMatchObject({ allowed: false, code: "not_admin" });
  });

  it("rejects a missing target", () => {
    const decision = authorizeDeletion(admin, null);
    expect(decision).toMatchObject({ allowed: false, status: 404 });
  });

  it("rejects self-deletion", () => {
    const decision = authorizeDeletion(admin, { ...admin });
    expect(decision).toMatchObject({ allowed: false, code: "self_deletion" });
  });

  it("rejects deleting another admin", () => {
    const decision = authorizeDeletion(admin, otherAdmin);
    expect(decision).toMatchObject({ allowed: false, code: "target_is_admin" });
  });

  it("checks identity before admin status when deleting yourself", () => {
    // An admin deleting themselves must read as self_deletion, not
    // target_is_admin - the message the operator sees should describe what
    // they actually did.
    const decision = authorizeDeletion(admin, admin);
    expect(decision).toMatchObject({ code: "self_deletion" });
  });

  it("never returns a Swedish-free error", () => {
    // Every rejection reaches an operator's screen, so each needs a message
    // they can act on rather than a bare code.
    const rejections = [
      authorizeDeletion(null, member),
      authorizeDeletion(member, member),
      authorizeDeletion(admin, null),
      authorizeDeletion(admin, admin),
      authorizeDeletion(admin, otherAdmin),
    ];

    for (const decision of rejections) {
      expect(decision.allowed).toBe(false);
      if (!decision.allowed) {
        expect(decision.message.length).toBeGreaterThan(10);
      }
    }
  });
});
