import { useTransition } from "react";
import { HiSaveAs } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";

import type { Dictionary } from "@/lib/get-dictionary";
import { useDesigner } from "@/components/builder/use-designer";
import { updateContent } from "@/actions/form/update-content";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function SaveFormButton({
  id,
  dictionary
}: {
  id: string;
  dictionary: Dictionary;
}) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      await updateContent(id, jsonElements);
      toast({
        title: dictionary.builder["toast.title:success-save"],
        description: dictionary.builder["toast.desc:success-save"]
      });
    } catch (error) {
      toast({
        title: dictionary.builder["toast.title:error"],
        description: dictionary.builder["toast.desc:error"],
        variant: "destructive"
      });
    }
  };
  return (
    <Button
      variant={"outline"}
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(updateFormContent);
      }}
    >
      <HiSaveAs className="h-4 w-4" />
      {dictionary.builder["button:save"]}
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
}
