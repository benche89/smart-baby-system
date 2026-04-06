"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        border: "1px solid rgba(15,23,42,0.08)",
        background: "#ffffff",
        color: "#0f172a",
        borderRadius: 12,
        padding: "10px 14px",
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}