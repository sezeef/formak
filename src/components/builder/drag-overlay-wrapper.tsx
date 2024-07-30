"use client";
import { useState } from "react";
import { type Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";

import { useDictionary } from "@/components/dictionary-context";
import { useDesigner } from "@/components/builder/use-designer";
import {
  type ElementsType,
  FormElement,
  type FormElementInstance,
  createFormElements
} from "@/components/builder/form-elements";

import { SidebarButtonOverlay } from "@/components/builder/sidebar-button";
import { Dictionary } from "@/lib/get-dictionary";

export function DragOverlayWrapper() {
  const { dictionary } = useDictionary();
  const { elements } = useDesigner();
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (event) => setDraggedItem(event.active),
    onDragCancel: () => setDraggedItem(null),
    onDragEnd: () => setDraggedItem(null)
  });

  if (!draggedItem) return null;

  return (
    <DragOverlay>
      {getOverlayContent({ draggedItem, elements, dictionary })}
    </DragOverlay>
  );
}

function getOverlayContent({
  draggedItem,
  elements,
  dictionary
}: {
  draggedItem: Active;
  elements: FormElementInstance[];
  dictionary: Dictionary;
}) {
  const formElements = createFormElements(dictionary);
  const dragData = draggedItem.data?.current;

  if (dragData?.isDesignerButton) {
    return renderSidebarBtnOverlay({
      formElements,
      type: dragData.type
    });
  }

  if (dragData?.isDesignerElement) {
    return renderDesignerElementOverlay({
      elementId: dragData.elementId,
      elements,
      dictionary,
      formElements
    });
  }

  return <div>{dictionary.builder["drag-overlay:no-overlay"]}</div>;
}

function renderSidebarBtnOverlay({
  type,
  formElements
}: {
  type: ElementsType;
  formElements: Record<ElementsType, FormElement>;
}) {
  return <SidebarButtonOverlay formElement={formElements[type]} />;
}

function renderDesignerElementOverlay({
  elementId,
  elements,
  dictionary,
  formElements
}: {
  elementId: string;
  elements: FormElementInstance[];
  dictionary: Dictionary;
  formElements: Record<ElementsType, FormElement>;
}) {
  const element = elements.find((el) => el.id === elementId);

  if (!element)
    return <div>{dictionary.builder["drag-overlay:no-element"]}</div>;

  const DesignerElementComponent =
    formElements[element.type as ElementsType].designerComponent;

  return (
    <div className="flex bg-accent border rounded-md h-[120px] w-full py-2 px-4 opacity-80 pointer pointer-events-none">
      <DesignerElementComponent elementInstance={element} />
    </div>
  );
}
