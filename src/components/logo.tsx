import { Locale, localize } from "@/lib/locale";
import Link from "next/link";

export function Logo({ lang, title }: { lang: Locale; title: string }) {
  return (
    <Link
      href={localize(lang, "/")}
      className="font-bold text-3xl hover:cursor-pointer"
    >
      {title}
    </Link>
  );
}
