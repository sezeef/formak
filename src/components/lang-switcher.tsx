"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { i18n, type Locale } from "@/lib/locale";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useDictionary } from "./dictionary-context";

export function LangSwitcher() {
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
    <DropdownMenu>
      <DropdownMenuTrigger className="h-9 w-16 rounded-lg bg-muted border flex justify-center items-center">
        <div className="h-7 w-12 rounded-md flex justify-center items-center bg-background ">
          <div className="flex justify-between gap-1 items-baseline">
            <Image
              src={options[currLang]}
              width={14}
              height={14}
              alt={currLang}
            />
            <span className="font-light text-[0.9rem] capitalize tracking-tighter">
              {currLang}
            </span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-16 w-16">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
