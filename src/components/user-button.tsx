import { safeGetUser } from "@/lib/user";
import Link from "next/link";
import { logout } from "@/actions/auth/logout";
import type { Dictionary } from "@/lib/get-dictionary";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuSub } from "@radix-ui/react-dropdown-menu";
import { ThemeSubmenu } from "./theme-submenu";
import { LangSubmenu } from "./lang-submenu";
import { localize } from "@/lib/locale";

export async function UserButton({ dictionary }: { dictionary: Dictionary }) {
  const user = await safeGetUser();

  if (!user) {
    return (
      <Button>
        <Link href={"/auth/login"}>{dictionary["/"]["button:login"]}</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* TODO: Impl avatars */}
            <AvatarImage src="#" alt="@shadcn" />
            <AvatarFallback>
              {(user?.name ?? user.email).at(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={localize(dictionary.lang, "/dashboard")}>
            {dictionary["/"]["button:dashboard"]}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {dictionary["/"]["button:language"]}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <LangSubmenu />
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {dictionary["/"]["button:theme"]}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <ThemeSubmenu dictionary={dictionary} />
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={logout}>
            <input type="submit" value={dictionary["/"]["button:logout"]} />
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
