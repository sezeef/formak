"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDictionary } from "@/components/dictionary-context";
import { i18n, type Locale } from "@/lib/locale";
import {
  DropdownMenuItem,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";

export function LangSubmenu() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { dictionary } = useDictionary();
  const currLang = dictionary.lang as Locale;
  const options: Record<Locale, string> = {
    ar: "/images/eg.svg",
    en: "/images/gb.svg"
  };

  const pathName = usePathname();
  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  if (!mounted) return null; // avoid rehydration errors
  return (
    <DropdownMenuSubContent>
      {i18n.locales.map((locale) => {
        return (
          <DropdownMenuItem key={locale} asChild>
            <Link href={redirectedPathName(locale)}>
              <div className="flex justify-center items-center">
                <div className="flex justify-between gap-1 items-baseline">
                  <Image
                    src={options[locale]}
                    width={14}
                    height={14}
                    alt={currLang}
                  />
                  <span className="capitalize text-[0.8rem]">{locale}</span>
                </div>
              </div>
            </Link>
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuSubContent>
  );
}
