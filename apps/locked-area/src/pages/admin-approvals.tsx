import { useState, useEffect, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/auth/use-auth";
import {
  fetchPendingUsers,
  approveUser,
  denyUser,
  deleteUser,
  AdminApiError,
  type PendingUser,
} from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Seo } from "@/components/seo";

/**
 * Confirmation for an irreversible action.
 *
 * Replaces window.confirm(), which blocked the thread, ignored the design
 * system, and - worse - previously confirmed an action the app then did not
 * perform: the old deny handler asked "are you sure?" and answered by telling
 * the operator to go do it by hand in the Supabase dashboard.
 */
function ConfirmDelete({
  user,
  busy,
  onCancel,
  onConfirm,
}: {
  user: PendingUser;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dark/60 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <Card className="w-full max-w-md p-8 text-center shadow-lg">
        <div className="w-12 h-12 rounded-input bg-brand-red-light flex items-center justify-center mx-auto mb-4">
          <AlertTriangle
            className="w-6 h-6 text-brand-red"
            aria-hidden="true"
          />
        </div>
        <h2
          id="confirm-delete-title"
          className="text-xl font-display font-bold text-text mb-2"
        >
          Ta bort {user.full_name || user.email}?
        </h2>
        <p className="text-text-muted text-sm mb-6 leading-relaxed">
          Kontot tas bort permanent och kan inte återskapas. Personen måste
          registrera sig på nytt för att få tillgång igen.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onCancel} disabled={busy}>
            Avbryt
          </Button>
          <Button variant="default" onClick={onConfirm} disabled={busy}>
            {busy ? (
              <Spinner size="sm" tone="onDark" label="Tar bort" />
            ) : (
              "Ta bort permanent"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function AdminApprovals() {
  const { isAdmin, user: currentUser } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [confirming, setConfirming] = useState<PendingUser | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Sets no state before its first await. Doing so synchronously inside an
  // effect triggers a cascading render, which is what react-hooks flags.
  //
  // It also reads better: `loading` starts true and only ever goes false, so a
  // refetch after an approve leaves the list on screen while the affected row
  // shows its own spinner, instead of blanking the whole page.
  const load = useCallback(async () => {
    try {
      const users = await fetchPendingUsers();
      setPendingUsers(users);
      setError("");
    } catch (err) {
      setError(
        err instanceof AdminApiError
          ? err.message
          : "Kunde inte hämta användare.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Depends on isAdmin rather than running once and hoping.
  //
  // The previous version guarded on `if (!isAdmin) return` with an empty
  // dependency array and two lint suppressions. If isAdmin ever became true
  // after mount, the fetch never ran and `loading` stayed true forever - a
  // permanent spinner. ProtectedRoute happens to make that unreachable today,
  // which meant the suppressions were what held it together, not the logic.
  // Depends on isAdmin rather than running once and hoping.
  //
  // The previous version guarded on `if (!isAdmin) return` with an empty
  // dependency array and two lint suppressions. Had isAdmin ever become true
  // after mount, the fetch would never have run and `loading` would have
  // stayed true forever. ProtectedRoute makes that unreachable today, which
  // meant the suppressions were what held it together, not the logic.
  //
  // The fetch is inlined rather than calling `load()` so the await boundary is
  // visible to react-hooks - and so it can be cancelled, which `load` cannot.
  // No setState runs before the first await.
  useEffect(() => {
    if (!isAdmin) return;

    let cancelled = false;

    void (async () => {
      try {
        const users = await fetchPendingUsers();
        if (cancelled) return;
        setPendingUsers(users);
        setError("");
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof AdminApiError
            ? err.message
            : "Kunde inte hämta användare.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const runAction = async (id: string, action: () => Promise<void>) => {
    setActionError("");
    setBusyId(id);
    try {
      await action();
      await load();
    } catch (err) {
      setActionError(
        err instanceof AdminApiError
          ? err.message
          : "Något gick fel. Försök igen.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleApprove = (id: string) => runAction(id, () => approveUser(id));

  const handleDelete = async (user: PendingUser) => {
    setConfirming(null);
    await runAction(user.id, async () => {
      // Record the decision before attempting deletion. If the edge function
      // fails, the account is still out of the queue and the operator is not
      // left re-deciding it after every hiccup.
      await denyUser(user.id);
      await deleteUser(user.id);
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface">
        <Seo title="Godkänn användare" />
        <div className="container-page py-12">
          <Alert variant="error">
            Du har inte behörighet att se denna sida.
          </Alert>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Spinner size="lg" tone="accent" label="Laddar användare" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-body">
      <Seo title="Godkänn användare" description="Administrera nya konton." />

      <div className="container-page py-12">
        <h1 className="text-3xl font-display font-bold text-text mb-6">
          Godkänn nya användare
        </h1>

        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}
        {actionError && (
          <div className="mb-6">
            <Alert variant="error">{actionError}</Alert>
          </div>
        )}

        {pendingUsers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-text-muted leading-relaxed">
              Inga användare väntar på godkännande.
            </p>
          </Card>
        ) : (
          <ul className="space-y-4">
            {pendingUsers.map((pending) => {
              const busy = busyId === pending.id;
              const isSelf = pending.id === currentUser?.id;

              return (
                <li
                  key={pending.id}
                  className="bg-card border border-border rounded-card shadow-sm p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                >
                  <div>
                    <p className="font-semibold text-text">
                      {pending.full_name || "Okänd"}
                    </p>
                    {pending.email && (
                      <p className="text-sm text-text-muted mt-0.5">
                        {pending.email}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      shape="rounded"
                      disabled={busy}
                      onClick={() => handleApprove(pending.id)}
                    >
                      {busy ? (
                        <Spinner size="sm" tone="onDark" label="Sparar" />
                      ) : (
                        "Godkänn"
                      )}
                    </Button>
                    <Button
                      variant="danger"
                      shape="rounded"
                      // The edge function refuses both of these anyway; the UI
                      // just avoids offering an action that cannot succeed.
                      disabled={busy || isSelf || pending.is_admin}
                      onClick={() => setConfirming(pending)}
                    >
                      Neka
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {confirming && (
        <ConfirmDelete
          user={confirming}
          busy={busyId === confirming.id}
          onCancel={() => setConfirming(null)}
          onConfirm={() => handleDelete(confirming)}
        />
      )}
    </div>
  );
}
