import { MdPreview } from "react-icons/md";

import type { Dictionary } from "@/lib/get-dictionary";
import { useDesigner } from "@/components/builder/use-designer";
import { createFormElements } from "@/components/builder/form-elements";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function PreviewDialogButton({
  dictionary
}: {
  dictionary: Dictionary;
}) {
  const formElements = createFormElements(dictionary);
  const { elements } = useDesigner();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="gap-2">
          <MdPreview className="h-6 w-6" />
          {dictionary.builder["button:preview"]}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
        <div className="flex flex-col items-center px-4 py-2 border-b">
          <p className="text-lg font-bold text-muted-foreground">
            {dictionary.builder["dialog.title:form-preview"]}
          </p>
          <p className="text-sm text-muted-foreground">
            {dictionary.builder["dialog.desc:form-preview"]}
          </p>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/images/paper.svg)] dark:bg-[url(/images/paper-dark.svg)] overflow-y-auto">
          <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
            {Array.isArray(elements) ? (
              elements.map((element) => {
                const FormComponent = formElements[element.type].formComponent;
                return (
                  <FormComponent key={element.id} elementInstance={element} />
                );
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
