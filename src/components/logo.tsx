import { Locale, localize } from "@/lib/locale";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function Logo({
  lang,
  title,
  className
}: {
  lang: Locale;
  title: string;
  className?: string;
}) {
  return (
    <Link
      href={localize(lang, "/")}
      className={cn("flex gap-1 items-center hover:cursor-pointer", className)}
    >
      <Image src="/images/Logo.svg" width={32} height={32} alt="Logo" className="rounded" />
      <div className="font-robotoSlab font-medium text-2xl lg:text-3xl">{title}</div>
    </Link>
  );
}
