import { BsFileEarmarkPlus } from "react-icons/bs";

import type { Dictionary } from "@/lib/get-dictionary";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

export function CreateFormButton({
  className,
  dictionary
}: {
  className?: string;
  dictionary: Dictionary;
}) {
  return (
    <Button
      variant={"outline"}
      className={cn(
        "group border-2 border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4",
        className
      )}
    >
      <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
      <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">
        {dictionary.dashboard["dialog.title:create-form"]}
      </p>
    </Button>
  );
}
