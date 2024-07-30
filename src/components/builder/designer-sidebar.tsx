"use client";
import { useDesigner } from "@/components/builder/use-designer";
import { FormElementsSidebar } from "@/components/builder/form-elements-sidebar";
import { PropertiesFormSidebar } from "@/components/builder/props-form-sidebar";
import { useDictionary } from "../dictionary-context";

export function DesignerSidebar() {
  const { selectedElement } = useDesigner();
  const { dictionary } = useDictionary();
  return (
    <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
      {!selectedElement && <FormElementsSidebar dictionary={dictionary} />}
      {selectedElement && <PropertiesFormSidebar dictionary={dictionary} />}
    </aside>
  );
}
