import type { Dictionary } from "@/lib/get-dictionary";
import type { Locale } from "@/lib/locale";
import { Logo } from "@/components/logo";
import { LangSwitcher } from "@/components/lang-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserButton } from "@/components/user-button";

export async function Navbar({ dictionary }: { dictionary: Dictionary }) {
  return (
    <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
      <Logo
        lang={dictionary.lang as Locale}
        title={dictionary["/"]["site:name"]}
      />
      <div className="flex gap-4 items-center">
        <ThemeSwitcher className="invisible md:visible" />
        <LangSwitcher className="invisible md:visible" />
        <UserButton dictionary={dictionary} />
      </div>
    </nav>
  );
}
