"use client";

import { useEffect } from "react";
import Link from "next/link";

import { localize } from "@/lib/locale";
import { isAppError } from "@/lib/error";
import { useDictionary } from "@/components/dictionary-context";

import { Button } from "@/components/ui/button";

export default function DashboardErrorPage({ error }: { error: Error }) {
  const { dictionary } = useDictionary();

  useEffect(() => {
    console.error(error.message);
  }, [error]);

  return (
    <div className="flex w-full h-full flex-col items-center justify-center gap-4">
      <h2 className="text-destructive text-4xl">
        {isAppError(error)
          ? dictionary.error[error.message]
          : dictionary.error.SYS_UNK_ERR}
      </h2>
      <Button asChild>
        <Link href={localize(dictionary.lang, "/dashboard")}>
          {dictionary["/"]["button:back-to-home"]}
        </Link>
      </Button>
    </div>
  );
}
