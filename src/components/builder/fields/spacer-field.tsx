"use client";
import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuSeparatorHorizontal } from "react-icons/lu";

import { useDesigner } from "@/components/builder/use-designer";
import { useDictionary } from "@/components/dictionary-context";
import type { Dictionary } from "@/lib/get-dictionary";
import type {
  FormElementInstance,
  ElementsType,
  FormElement
} from "@/components/builder/form-elements";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

const propertiesSchema = z.object({
  height: z.number().min(5).max(200)
});

const type: ElementsType = "SpacerField" as const;

export const createSpacerFieldElement = (
  dictionary: Dictionary
): FormElement => ({
  type,
  construct: (id: string): FormElementInstance => ({
    id,
    type,
    extraAttributes: {
      height: 20
    }
  }),
  designerButtonElement: {
    icon: LuSeparatorHorizontal,
    label: dictionary["form-elements"].spacer["icon:label"]
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true
});

type CustomInstance = FormElementInstance & {
  extraAttributes: {
    height: number;
  };
};

function DesignerComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance;
}) {
  const { dictionary } = useDictionary();
  const element = elementInstance as CustomInstance;
  const { height } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <Label className="text-muted-foreground">
        {dictionary["form-elements"].spacer["designer:label:label"]} {height}
        {dictionary["form-elements"].spacer["designer:label:pixel"]}
      </Label>
      <LuSeparatorHorizontal className="h-8 w-8" />
    </div>
  );
}

function FormComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;

  const { height } = element.extraAttributes;
  return <div style={{ height, width: "100%" }}></div>;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance;
}) {
  const { dictionary } = useDictionary();
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      height: element.extraAttributes.height
    }
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { height } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        height
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {dictionary["form-elements"].spacer["props:input.label:height"]}{" "}
                {form.watch("height")}
              </FormLabel>
              <FormControl className="pt-2">
                <Slider
                  defaultValue={[field.value]}
                  min={5}
                  max={200}
                  step={1}
                  onValueChange={(value) => {
                    field.onChange(value[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
