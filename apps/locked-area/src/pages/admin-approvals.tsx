import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/auth/use-auth";
import { supabase } from "@/lib/supabase";

interface PendingUser {
  id: string;
  full_name: string | null;
  approved: boolean;
  is_admin: boolean;
  email: string;
}

export default function AdminApprovals() {
  const { isAdmin } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError("");

    // Fetch profiles that are not approved
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email, approved, is_admin")
      .eq("approved", false)
      .order("created_at", { ascending: true });

    if (profilesError) {
      setError("Kunde inte hämta användare.");
      console.error(profilesError);
      setLoading(false);
      return;
    }

    const usersWithEmail: PendingUser[] = (profiles || []).map((p) => ({
      ...p,
      email: p.email ?? "",
    }));

    setPendingUsers(usersWithEmail);
    setLoading(false);
  }, []);

  const approveUser = async (id: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ approved: true })
      .eq("id", id);

    if (error) {
      alert("Kunde inte godkänna användare: " + error.message);
      return;
    }

    await fetchPending();
  };

  const denyUser = async (_id: string) => {
    const confirmed = window.confirm(
      "Att neka en användare kräver borttagning från Supabase Auth (Authentication > Users i dashboarden). Vill du fortsätta?",
    );
    if (!confirmed) return;

    // Client-side RLS blocks DELETE on auth.users.
    // The profile can be updated to mark as denied, but full removal
    // requires the Supabase dashboard or a server-side function.
    // For now, show guidance to the admin.
    alert(
      "Gå till Supabase Dashboard → Authentication → Users för att ta bort användaren helt. Profilen försvinner automatiskt (cascade).",
    );
  };

  useEffect(() => {
    if (!isAdmin) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPending();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="container-page py-12">
          <p className="text-text-muted">
            Du har inte behörighet att se denna sida.
          </p>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"
          role="status"
          aria-label="Laddar"
        />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-surface">
        <div className="container-page py-12">
          <p className="text-error">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-surface font-body">
      <div className="container-page py-12">
        <h1 className="text-3xl font-display font-bold text-text mb-6">
          Godkänn nya användare
        </h1>
        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-card border border-border p-8 text-center shadow-sm">
            <p className="text-text-muted leading-relaxed">
              Inga användare väntar på godkännande.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {pendingUsers.map((user) => (
              <li
                key={user.id}
                className="bg-white border border-border rounded-card p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-text">
                    {user.full_name || "Okänd"}
                  </p>
                  {user.email && (
                    <p className="text-sm text-text-muted mt-0.5">
                      {user.email}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveUser(user.id)}
                    className="bg-success text-white px-4 py-2 rounded-input hover:bg-success/90 transition-colors font-medium text-sm"
                  >
                    Godkänn
                  </button>
                  <button
                    onClick={() => denyUser(user.id)}
                    className="border border-brand-red text-brand-red px-4 py-2 rounded-input hover:bg-brand-red/5 transition-colors font-medium text-sm"
                  >
                    Neka
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
