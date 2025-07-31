"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const router = useRouter();

  // This redirects to the home page with the modal open
  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}