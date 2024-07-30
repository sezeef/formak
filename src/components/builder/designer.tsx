"use client";
import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-context";
import { useDesigner } from "@/components/builder/use-designer";
import { useDragEndHandler } from "@/components/builder/use-drag-end-handler";
import { DesignerSidebar } from "@/components/builder/designer-sidebar";
import { DesignerElementWrapper } from "@/components/builder/designer-element-wrapper";
import { createFormElements } from "@/components/builder/form-elements";

export function Designer() {
  const { dictionary } = useDictionary();
  const formElements = createFormElements(dictionary);
  const {
    elements,
    addElement,
    selectedElement,
    setSelectedElement,
    removeElement
  } = useDesigner();

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true
    }
  });

  useDndMonitor({
    onDragEnd: useDragEndHandler(
      elements,
      addElement,
      removeElement,
      formElements
    )
  });

  return (
    <div className="flex w-full h-full">
      <div
        className="p-4 w-full"
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
            droppable.isOver && "ring-4 ring-primary ring-inset"
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
              {dictionary.builder["input.label:designer-drop-area"]}
            </p>
          )}

          {droppable.isOver && elements.length === 0 && (
            <div className="p-4 w-full">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}
          {elements.length > 0 && (
            <div className="flex flex-col  w-full gap-2 p-4">
              {elements.map((element) => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
}
