"use client";
import { useCallback, useRef, useState, useTransition } from "react";
import { HiCursorClick } from "react-icons/hi";
import { ImSpinner2 } from "react-icons/im";

import { useDictionary } from "./dictionary-context";
import { submitForm as submit } from "@/actions/form/submit-form";
import {
  type FormElementInstance,
  createFormElements
} from "@/components/builder/form-elements";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function FormSubmit({
  formUrl,
  content
}: {
  content: FormElementInstance[];
  formUrl: string;
}) {
  const { dictionary } = useDictionary();
  const formElements = createFormElements(dictionary);
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());

  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || "";
      const valid = formElements[field.type].validate(field, actualValue);

      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }

    return true;
  }, [content, formElements]);

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value;
  }, []);

  const submitForm = async () => {
    formErrors.current = {};
    const validForm = validateForm();
    if (!validForm) {
      setRenderKey(new Date().getTime());
      toast({
        title: dictionary.submit["toast.title:error"],
        description: dictionary.submit["toast.desc:form-error"],
        variant: "destructive"
      });
      return;
    }

    try {
      const jsonContent = JSON.stringify(formValues.current);
      await submit(formUrl, jsonContent);
      setSubmitted(true);
    } catch (error) {
      toast({
        title: dictionary.submit["toast.title:error"],
        description: dictionary.submit["toast.desc:generic-error"],
        variant: "destructive"
      });
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center w-full h-full items-center p-8">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border rounded">
          <h1 className="text-2xl font-bold">Form submitted</h1>
          <p className="text-muted-foreground">
            {dictionary.submit["message:thanks-for-submit"]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full items-center p-8">
      <div
        key={renderKey}
        className="max-w-[620px] flex flex-col gap-4 w-full p-8 border rounded"
      >
        {content.map((element) => {
          const FormElement = formElements[element.type].formComponent;
          return (
            <FormElement
              key={element.id}
              elementInstance={element}
              submitValue={submitValue}
              isInvalid={formErrors.current[element.id]}
              defaultValue={formValues.current[element.id]}
            />
          );
        })}
        <Button
          className="mt-8"
          onClick={() => {
            startTransition(submitForm);
          }}
          disabled={pending}
        >
          {!pending && (
            <>
              <HiCursorClick className="mr-2" />
              {dictionary.submit["button:submit"]}
            </>
          )}
          {pending && <ImSpinner2 className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
