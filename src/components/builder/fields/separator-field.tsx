"use client";
import { RiSeparator } from "react-icons/ri";

import type { Dictionary } from "@/lib/get-dictionary";
import type { ElementsType } from "@/components/builder/form-elements";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useDictionary } from "@/components/dictionary-context";

const type: ElementsType = "SeparatorField" as const;

export const createSeparatorFieldElement = (dictionary: Dictionary) => ({
  type,
  construct: (id: string) => ({ id, type }),
  designerButtonElement: {
    icon: RiSeparator,
    label: dictionary["form-elements"].separator["icon:label"]
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true
});

function DesignerComponent() {
  const { dictionary } = useDictionary();
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">
        {dictionary["form-elements"].separator["designer:label:label"]}
      </Label>
      <Separator />
    </div>
  );
}

function FormComponent() {
  return <Separator />;
}

function PropertiesComponent() {
  const { dictionary } = useDictionary();
  return <p>{dictionary["form-elements"].separator["props:no-props"]}</p>;
}
