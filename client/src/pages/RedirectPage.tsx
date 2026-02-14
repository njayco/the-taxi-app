import { useEffect } from "react";
import { useLocation } from "wouter";

interface RedirectPageProps {
  to: string;
  hash?: string;
}

export default function RedirectPage({ to, hash }: RedirectPageProps) {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate(to, { replace: true });
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, [navigate, to, hash]);

  return null;
}
