import type { Dictionary } from "@/lib/get-dictionary";
import { SidebarButtonElement } from "@/components/builder/sidebar-button";
import { createFormElements } from "@/components/builder/form-elements";

import { Separator } from "@/components/ui/separator";

export function FormElementsSidebar({
  dictionary
}: {
  dictionary: Dictionary;
}) {
  const formElements = createFormElements(dictionary);
  return (
    <div>
      <p className="text-sm text-foreground/70">
        {dictionary.builder["header:dnd-elements"]}
      </p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center">
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
          {dictionary.builder["header:layout-elements"]}
        </p>
        <SidebarButtonElement formElement={formElements.TitleField} />
        <SidebarButtonElement formElement={formElements.SubTitleField} />
        <SidebarButtonElement formElement={formElements.ParagraphField} />
        <SidebarButtonElement formElement={formElements.SeparatorField} />
        <SidebarButtonElement formElement={formElements.SpacerField} />

        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
          {dictionary.builder["header:form-elements"]}
        </p>
        <SidebarButtonElement formElement={formElements.TextField} />
        <SidebarButtonElement formElement={formElements.NumberField} />
        <SidebarButtonElement formElement={formElements.TextAreaField} />
        <SidebarButtonElement formElement={formElements.DateField} />
        <SidebarButtonElement formElement={formElements.SelectField} />
        <SidebarButtonElement formElement={formElements.CheckboxField} />
      </div>
    </div>
  );
}
