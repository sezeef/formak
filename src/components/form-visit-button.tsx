"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDictionary } from "./dictionary-context";

export function VisitButton({ shareUrl }: { shareUrl: string }) {
  const { dictionary } = useDictionary();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const shareLink = `${window.location.origin}/submit/${shareUrl}`;
  return (
    <Button
      className="w-[200px]"
      onClick={() => {
        window.open(shareLink, "_blank");
      }}
    >
      {dictionary.forms["button:visit"]}
    </Button>
  );
}
