"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Confetti from "react-confetti";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

import type { Dictionary } from "@/lib/get-dictionary";
import type { SelectForm } from "@/db/schema/form";
import { localize } from "@/lib/locale";
import { useDesigner } from "@/components/builder/use-designer";

import { Designer } from "@/components/builder/designer";
import { DragOverlayWrapper } from "@/components/builder/drag-overlay-wrapper";
import { PublishFormButton } from "@/components/builder/publish-form-button";
import { PreviewDialogButton } from "@/components/builder/preview-dialog-button";
import { SaveFormButton } from "@/components/builder/save-form-button";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function FormBuilder({
  form,
  dictionary
}: {
  form: SelectForm;
  dictionary: Dictionary;
}) {
  // sets up state
  const { setElements, setSelectedElement } = useDesigner();
  const [isReady, setIsReady] = useState(false);

  // sets up mouse sensor, activates drag when the mouse moves at least 10 pixels from the initial point of contact
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10 // pixel
    }
  });
  // sets up touch sensor. activates after a 300ms delay and allows for a 5-pixel tolerance in movement
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5
    }
  });
  // combine sensors
  const sensors = useSensors(mouseSensor, touchSensor);

  // initialize form.content if it exists and then set up ready state
  useEffect(() => {
    if (isReady) return;

    const elements = form.content ? JSON.parse(form.content) : [];

    // after parsing elements as fetched from db, we load them into state (designer context)
    setElements(elements);
    // we set the selected element to null, idk why?
    setSelectedElement(null);

    // we set up an artificial delay, idk why?
    const readyTimeout = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(readyTimeout);
  }, [form, setElements, isReady, setSelectedElement]);

  // return spinner if isReady is set to false
  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <ImSpinner2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  // idk why we are using `window.location.origin` here instead of simply omitting that
  // TODO: change when decided on a route for submissions
  const shareUrl = `${window.location.origin}/submit/${form.shareUrl}`;

  // if form is published render this:

  if (form.published) {
    return (
      <>
        {/* just some confetti don't be alarmed */}
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={1000}
        />

        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="max-w-md">
            <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
              🎊🎊 {dictionary.builder["header:form-published"]} 🎊🎊
            </h1>
            <h2 className="text-2xl">
              {dictionary.builder["header.sub:share-form-1"]}
            </h2>
            <h3 className="text-xl text-muted-foreground border-b pb-10">
              {dictionary.builder["header.sub:share-form-2"]}
            </h3>
            <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
              <Input className="w-full" readOnly value={shareUrl} />
              <Button
                className="mt-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast({
                    title: dictionary.builder["toast.title:copied"],
                    description: dictionary.builder["toast.desc:copied"]
                  });
                }}
              >
                {dictionary.builder["button:copy-link"]}
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant={"link"} asChild>
                <Link
                  href={localize(dictionary.lang, "/dashboard")}
                  className="gap-2"
                >
                  <BsArrowLeft />
                  {dictionary.builder["button:back-to-home"]}
                </Link>
              </Button>
              <Button variant={"link"} asChild>
                <Link
                  href={localize(dictionary.lang, `/forms/${form.id}`)}
                  className="gap-2"
                >
                  {dictionary.builder["button:form-details"]}
                  <BsArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // actual component here
  // we wrap everything is DndContext
  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        {/* this is the nav element and it contains the header and buttons and shit like that */}
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
          {/* just a dumb header */}
          <h2 className="truncate font-medium">
            <span className="text-muted-foreground mx-2">
              {dictionary.builder["header.label:form"]}
            </span>
            {form.name}
          </h2>
          {/* the buttons; idk why you can view this page if you can't save or publish, but what ever */}
          <div className="flex items-center gap-2">
            <PreviewDialogButton dictionary={dictionary} />
            {!form.published && (
              <>
                <SaveFormButton id={form.id} dictionary={dictionary} />
                <PublishFormButton id={form.id} dictionary={dictionary} />
              </>
            )}
          </div>
        </nav>

        {/* this is the big dick compoenet I think */}
        <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/images/paper.svg)] dark:bg-[url(/images/paper-dark.svg)]">
          <Designer />
        </div>
      </main>

      {/* 
        - This component is responsible for the drag overlay 
        - Drag overlay = visual element that is rendered when a drag is active
        - DragOverlayWrapper utilizes the useDndMonitor hook to trigger 
          callback functions and update a `draggedItem` state, it then
          renders the appropriate overlay accordingly
      */}
      <DragOverlayWrapper />
    </DndContext>
  );
}
