import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { getDictionary } from "@/lib/get-dictionary";
import type { Locale } from "@/lib/locale";

export default async function Layout({
  children,
  params: { lang }
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen h-screen">
      <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
        <Logo lang={lang} title={dictionary["/"]["site:name"]} />
        <ThemeSwitcher />
      </nav>
      <main className="flex w-full flex-grow">{children}</main>
    </div>
  );
}
