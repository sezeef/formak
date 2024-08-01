"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { Dictionary } from "@/lib/get-dictionary";

export function ThemeSubmenu({ dictionary }: { dictionary: Dictionary }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { setTheme } = useTheme();

  if (!mounted) return null; // avoid rehydration errors
  return (
    <DropdownMenuSubContent>
      <DropdownMenuItem onClick={() => setTheme("light")}>
        {dictionary["/"]["button:theme:light"]}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>
        {dictionary["/"]["button:theme:dark"]}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => setTheme("system")}>
        {dictionary["/"]["button:theme:system"]}
      </DropdownMenuItem>
    </DropdownMenuSubContent>
  );
}
