import { Locale, localize } from "@/lib/locale";
import Image from "next/image";
import Link from "next/link";

export function Logo({ lang, title }: { lang: Locale; title: string }) {
  return (
    <div className="flex gap-1 items-center">
      <Image src="/images/Logo.svg" width={32} height={32} alt="Logo" />
      <Link
        href={localize(lang, "/")}
        className="font-bold text-3xl hover:cursor-pointer"
      >
        {title}
      </Link>
    </div>
  );
}
