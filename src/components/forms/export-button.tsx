"use client";
import { useDictionary } from "@/components/dictionary-context";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function ExportButton({ formId }: { formId: string }) {
  const { dictionary } = useDictionary();
  return (
    <Button
      variant="outline"
      className="h-8"
      onClick={async () => {
        try {
          const response = await fetch(`/api/export/csv?formId=${formId}`);
          if (!response.ok) {
            throw new Error();
          }
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          const now = new Date().toISOString();
          a.download = `${now}-${formId}.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          toast({
            title: dictionary.forms["toast.title:downloading"],
            description: dictionary.forms["toast.desc:downloading"]
          });
        } catch (error) {
          toast({
            title: dictionary.forms["toast.title:download-failure"],
            description: dictionary.forms["toast.desc:download-failure"],
            variant: "destructive"
          });
        }
      }}
    >
      {dictionary.forms["button:export"]}
    </Button>
  );
}
