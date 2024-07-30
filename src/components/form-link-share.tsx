"use client";
import { ImShare } from "react-icons/im";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useDictionary } from "./dictionary-context";

export function FormLinkShare({ shareUrl }: { shareUrl: string }) {
  const { dictionary } = useDictionary();
  const url = `${window.location.origin}/submit/${shareUrl}`;
  return (
    <div className="flex flex-grow gap-4 items-center">
      <Input value={url} readOnly />
      <Button
        className="w-[250px]"
        onClick={() => {
          navigator.clipboard.writeText(url);
          toast({
            title: dictionary.forms["toast.title:copied"],
            description: dictionary.forms["toast.desc:copied"]
          });
        }}
      >
        <ImShare className="mr-2 h-4 w-4" />
        {dictionary.forms["button:share-link"]}
      </Button>
    </div>
  );
}
