"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button variant="outline" loading={loading} onClick={onLogout}>
      {loading ? "Signing out..." : "Logout"}
    </Button>
  );
}
