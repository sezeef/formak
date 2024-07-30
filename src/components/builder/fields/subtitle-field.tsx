"use client";
import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuHeading2 } from "react-icons/lu";

import { useDesigner } from "@/components/builder/use-designer";
import { useDictionary } from "@/components/dictionary-context";
import type { Dictionary } from "@/lib/get-dictionary";
import type {
  ElementsType,
  FormElementInstance
} from "@/components/builder/form-elements";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

const type: ElementsType = "SubTitleField";

const propertiesSchema = z.object({
  title: z.string().min(2).max(50)
});

export const createSubtitleFieldElement = (dictionary: Dictionary) => ({
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes: {
      title: dictionary["form-elements"].subtitle["extra:title"]
    }
  }),
  designerButtonElement: {
    icon: LuHeading2,
    label: dictionary["form-elements"].subtitle["icon:label"]
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true
});

type CustomInstance = FormElementInstance & {
  extraAttributes: {
    title: string;
  };
};

function DesignerComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance;
}) {
  const { dictionary } = useDictionary();
  const element = elementInstance as CustomInstance;
  const { title } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">
        {dictionary["form-elements"].subtitle["designer:label:label"]}
      </Label>
      <p className="text-lg">{title}</p>
    </div>
  );
}

function FormComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;

  const { title } = element.extraAttributes;
  return <p className="text-lg">{title}</p>;
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
      title: element.extraAttributes.title
    }
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { title } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        title
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {
                  dictionary["form-elements"].subtitle[
                    "props:input.label:title"
                  ]
                }
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
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
