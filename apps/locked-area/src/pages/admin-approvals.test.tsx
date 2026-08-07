import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminApprovals from "@/pages/admin-approvals";
import { renderWithProviders } from "@/test/test-utils";
import {
  supabaseMock,
  makeSession,
  makeProfile,
  type MockQueryCall,
} from "@/test/supabase-mock";

const ADMIN_ID = "admin-1";

const PENDING = [
  {
    id: "member-1",
    full_name: "Ny Deltagare",
    email: "ny@boostbyfcr.se",
    approved: false,
    is_admin: false,
    denied: false,
  },
];

/**
 * Signed in as an admin, with the pending list served from `profiles`.
 *
 * The admin's own profile and the pending list come from the same table, so
 * the handler distinguishes them by whether the chain ended in `.single()`.
 */
function asAdminWith(pending = PENDING) {
  supabaseMock.setInitialSession(makeSession({ id: ADMIN_ID }));
  supabaseMock.setQueryHandler((call: MockQueryCall) => {
    if (call.single) {
      return {
        data: makeProfile({ id: ADMIN_ID, is_admin: true, approved: true }),
        error: null,
      };
    }
    if (call.operation === "update") return { data: null, error: null };
    return { data: pending, error: null };
  });
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => vi.restoreAllMocks());

describe("AdminApprovals — access", () => {
  it("refuses a non-admin", async () => {
    supabaseMock.setInitialSession(makeSession({ id: "member-9" }));
    supabaseMock.resolveQueries({
      data: makeProfile({ id: "member-9", is_admin: false }),
      error: null,
    });

    renderWithProviders(<AdminApprovals />);

    expect(
      await screen.findByText("Du har inte behörighet att se denna sida."),
    ).toBeInTheDocument();
  });
});

describe("AdminApprovals — approve", () => {
  it("writes only the approved column", async () => {
    const user = userEvent.setup();
    const writes: MockQueryCall[] = [];
    asAdminWith();
    const base = supabaseMock;
    base.setQueryHandler((call) => {
      if (call.operation === "update") {
        writes.push(call);
        return { data: null, error: null };
      }
      if (call.single) {
        return {
          data: makeProfile({ id: ADMIN_ID, is_admin: true }),
          error: null,
        };
      }
      return { data: PENDING, error: null };
    });

    renderWithProviders(<AdminApprovals />);
    await user.click(await screen.findByRole("button", { name: "Godkänn" }));

    await waitFor(() => expect(writes).toHaveLength(1));
    // Column-level grants (sql/02) only permit approved and denied. A write
    // touching anything else would be rejected by the database.
    expect(writes[0].payload).toEqual({ approved: true });
  });
});

describe("AdminApprovals — deny", () => {
  it("asks for confirmation before deleting anything", async () => {
    const user = userEvent.setup();
    asAdminWith();
    renderWithProviders(<AdminApprovals />);

    await user.click(await screen.findByRole("button", { name: "Neka" }));

    expect(await screen.findByRole("dialog")).toHaveAccessibleName(
      /Ta bort Ny Deltagare/,
    );
    expect(supabaseMock.client.functions.invoke).not.toHaveBeenCalled();
  });

  it("does nothing when the confirmation is cancelled", async () => {
    const user = userEvent.setup();
    asAdminWith();
    renderWithProviders(<AdminApprovals />);

    await user.click(await screen.findByRole("button", { name: "Neka" }));
    await user.click(await screen.findByRole("button", { name: "Avbryt" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(supabaseMock.client.functions.invoke).not.toHaveBeenCalled();
  });

  it("marks denied before invoking the delete function", async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    asAdminWith();
    supabaseMock.setQueryHandler((call) => {
      if (call.operation === "update") {
        order.push(`update:${JSON.stringify(call.payload)}`);
        return { data: null, error: null };
      }
      if (call.single) {
        return {
          data: makeProfile({ id: ADMIN_ID, is_admin: true }),
          error: null,
        };
      }
      return { data: PENDING, error: null };
    });
    supabaseMock.setFunctionHandler((name) => {
      order.push(`invoke:${name}`);
      return { data: { ok: true }, error: null };
    });

    renderWithProviders(<AdminApprovals />);
    await user.click(await screen.findByRole("button", { name: "Neka" }));
    await user.click(
      await screen.findByRole("button", { name: "Ta bort permanent" }),
    );

    // The soft flag lands first, so a failed deletion still takes the account
    // out of the queue.
    await waitFor(() => expect(order).toContain("invoke:delete-user"));
    expect(order).toEqual(['update:{"denied":true}', "invoke:delete-user"]);
  });

  it("surfaces the edge function's message when deletion is refused", async () => {
    const user = userEvent.setup();
    asAdminWith();
    supabaseMock.setFunctionHandler(() => ({
      data: {
        code: "target_is_admin",
        message: "Administratörer kan inte tas bort här.",
      },
      error: { message: "Edge Function returned a non-2xx status code" },
    }));

    renderWithProviders(<AdminApprovals />);
    await user.click(await screen.findByRole("button", { name: "Neka" }));
    await user.click(
      await screen.findByRole("button", { name: "Ta bort permanent" }),
    );

    // The raw "non-2xx status code" is useless to an operator; the function's
    // own Swedish message is what should reach the screen.
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Administratörer kan inte tas bort här.");
    expect(alert).not.toHaveTextContent("non-2xx");
  });

  it("does not offer deletion for the admin's own account", async () => {
    asAdminWith([
      {
        id: ADMIN_ID,
        full_name: "Jag Själv",
        email: "admin@boostbyfcr.se",
        approved: false,
        is_admin: true,
        denied: false,
      },
    ]);

    renderWithProviders(<AdminApprovals />);

    expect(await screen.findByRole("button", { name: "Neka" })).toBeDisabled();
  });
});
