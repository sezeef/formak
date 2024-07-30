import { AiOutlineClose } from "react-icons/ai";

import { useDesigner } from "@/components/builder/use-designer";
import { createFormElements } from "@/components/builder/form-elements";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dictionary } from "@/lib/get-dictionary";

export function PropertiesFormSidebar({
  dictionary
}: {
  dictionary: Dictionary;
}) {
  const formElements = createFormElements(dictionary);
  const { selectedElement, setSelectedElement } = useDesigner();
  if (!selectedElement) return null;

  const PropertiesForm =
    formElements[selectedElement.type]?.propertiesComponent;

  return (
    <div className="flex flex-col p-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-foreground/70">
          {dictionary.builder["header:element-props"]}
        </p>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => {
            setSelectedElement(null);
          }}
        >
          <AiOutlineClose />
        </Button>
      </div>
      <Separator className="mb-4" />
      <PropertiesForm elementInstance={selectedElement} />
    </div>
  );
}
