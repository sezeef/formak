"use client";
import { type DragEndEvent } from "@dnd-kit/core";

import {
  type ElementsType,
  FormElement,
  type FormElementInstance
} from "@/components/builder/form-elements";

type DraggedElement = {
  isDesignerButton: boolean;
  isDesignerElement: boolean;
  type?: ElementsType;
  elementId?: string;
};

type DropTarget = {
  isDesignerDropArea: boolean;
  isTopHalfDesignerElement: boolean;
  isBottomHalfDesignerElement: boolean;
  elementId?: string;
};

/*
    This function is used to handle drag events:
    1. Sidebar buttons being dragged over canvas
    2. Sidebar buttons being dragged over existing elements
    3. Elements being dragged over other elements (re-ordering)
*/
export function useDragEndHandler(
  elements: FormElementInstance[],
  addElement: (index: number, element: FormElementInstance) => void,
  removeElement: (id: string) => void,
  formElements: Record<ElementsType, FormElement>
) {
  return (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const draggedElement = getDraggedElement(active);
    const dropTarget = getDropTarget(over);

    if (isNewElementDrop(draggedElement, dropTarget)) {
      handleNewElementDrop(
        draggedElement,
        dropTarget,
        elements,
        addElement,
        formElements
      );
    } else if (isElementReorder(draggedElement, dropTarget)) {
      handleElementReorder(
        draggedElement,
        dropTarget,
        elements,
        addElement,
        removeElement
      );
    }
  };
}

function getDraggedElement(active: DragEndEvent["active"]): DraggedElement {
  return {
    isDesignerButton: active.data?.current?.isDesignerButton || false,
    isDesignerElement: active.data?.current?.isDesignerElement || false,
    type: active.data?.current?.type,
    elementId: active.data?.current?.elementId
  };
}

function getDropTarget(over: DragEndEvent["over"]): DropTarget {
  return {
    isDesignerDropArea: over?.data?.current?.isDesignerDropArea || false,
    isTopHalfDesignerElement:
      over?.data?.current?.isTopHalfDesignerElement || false,
    isBottomHalfDesignerElement:
      over?.data?.current?.isBottomHalfDesignerElement || false,
    elementId: over?.data?.current?.elementId
  };
}

function isNewElementDrop(
  draggedElement: DraggedElement,
  dropTarget: DropTarget
): boolean {
  return (
    draggedElement.isDesignerButton &&
    (dropTarget.isDesignerDropArea ||
      dropTarget.isTopHalfDesignerElement ||
      dropTarget.isBottomHalfDesignerElement)
  );
}

function isElementReorder(
  draggedElement: DraggedElement,
  dropTarget: DropTarget
): boolean {
  return (
    draggedElement.isDesignerElement &&
    (dropTarget.isTopHalfDesignerElement ||
      dropTarget.isBottomHalfDesignerElement)
  );
}

function handleNewElementDrop(
  draggedElement: DraggedElement,
  dropTarget: DropTarget,
  elements: FormElementInstance[],
  addElement: (index: number, element: FormElementInstance) => void,
  formElements: Record<ElementsType, FormElement>
) {
  console.log({ formElements });
  if (!draggedElement.type) throw new Error("Element type is undefined");
  const newElement = formElements[draggedElement.type].construct(
    crypto.randomUUID()
  );
  console.log({ formElements, newElement });
  const dropIndex = getDropIndex(dropTarget, elements);
  addElement(dropIndex, newElement);
}

function handleElementReorder(
  draggedElement: DraggedElement,
  dropTarget: DropTarget,
  elements: FormElementInstance[],
  addElement: (index: number, element: FormElementInstance) => void,
  removeElement: (id: string) => void
) {
  if (!draggedElement.elementId)
    throw new Error("Dragged element ID is undefined");
  const draggedElementIndex = elements.findIndex(
    (el) => el.id === draggedElement.elementId
  );
  if (draggedElementIndex === -1) throw new Error("Dragged element not found");

  const draggedElementCopy = { ...elements[draggedElementIndex] };
  removeElement(draggedElement.elementId);

  const dropIndex = getDropIndex(dropTarget, elements);
  addElement(dropIndex, draggedElementCopy);
}

function getDropIndex(
  dropTarget: DropTarget,
  elements: FormElementInstance[]
): number {
  if (dropTarget.isDesignerDropArea) return elements.length;

  if (!dropTarget.elementId)
    throw new Error("Drop target element ID is undefined");
  const overElementIndex = elements.findIndex(
    (el) => el.id === dropTarget.elementId
  );
  if (overElementIndex === -1) throw new Error("Drop target element not found");

  return dropTarget.isBottomHalfDesignerElement
    ? overElementIndex + 1
    : overElementIndex;
}
