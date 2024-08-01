import { Locale, localize } from "@/lib/locale";
import Image from "next/image";
import Link from "next/link";

export function Logo({ lang, title }: { lang: Locale; title: string }) {
  return (
    <Link
      href={localize(lang, "/")}
      className="flex gap-1 items-center hover:cursor-pointer"
    >
      <Image src="/images/Logo.svg" width={32} height={32} alt="Logo" />
      <div className="font-robotoSlab font-medium text-3xl">{title}</div>
    </Link>
  );
}
