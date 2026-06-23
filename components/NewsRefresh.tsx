"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const POLL_MS = 60_000;

export default function NewsRefresh() {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [router]);

  return null;
}
