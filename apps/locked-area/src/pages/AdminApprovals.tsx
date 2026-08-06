import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabase";

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

  const denyUser = async (id: string) => {
    const confirmed = window.confirm(
      "Är du säker på att du vill neka denna användare? Detta raderar kontot.",
    );
    if (!confirmed) return;

    // Delete from profiles (trigger cascades to auth.users)
    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) {
      // RLS might block the delete — try via auth admin API instead
      alert(
        "Kunde inte ta bort användaren från profilen. Du kan behöva ta bort dem via Supabase dashboard > Authentication > Users.",
      );
      return;
    }

    await fetchPending();
  };

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  if (!isAdmin) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-text-muted">
          Du har inte behörighet att se denna sida.
        </p>
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  if (error)
    return <div className="p-6 text-red-500 max-w-4xl mx-auto">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Godkänn nya användare</h1>
      {pendingUsers.length === 0 ? (
        <div className="bg-surface rounded-2xl p-8 text-center border border-border/60">
          <p className="text-text-muted leading-relaxed">
            Inga användare väntar på godkännande.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {pendingUsers.map((user) => (
            <li
              key={user.id}
              className="bg-white border border-border/60 rounded-2xl p-5 flex justify-between items-center"
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
              <div className="space-x-2">
                <button
                  onClick={() => approveUser(user.id)}
                  className="bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-brand-green/90 transition-colors font-medium text-sm"
                >
                  Godkänn
                </button>
                <button
                  onClick={() => denyUser(user.id)}
                  className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                >
                  Neka
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
