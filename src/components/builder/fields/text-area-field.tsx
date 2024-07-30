"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BsTextareaResize } from "react-icons/bs";

import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/dictionary-context";
import { useDesigner } from "@/components/builder/use-designer";
import type { Dictionary } from "@/lib/get-dictionary";
import type {
  ElementsType,
  FormElementInstance,
  SubmitFunction
} from "@/components/builder/form-elements";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

const type: ElementsType = "TextAreaField" as const;

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  rows: z.number().min(1).max(10)
});

function validate(formElement: FormElementInstance, currentValue: string) {
  const element = formElement as CustomInstance;
  if (element.extraAttributes.required) {
    return currentValue.length > 0;
  }

  return true;
}

export const createTextAreaElement = (dictionary: Dictionary) => ({
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes: {
      label: dictionary["form-elements"]["text-area"]["extra:label"],
      helperText: dictionary["form-elements"]["text-area"]["extra:helper"],
      placeHolder:
        dictionary["form-elements"]["text-area"]["extra:placeholder"],
      required: false,
      rows: 3
    }
  }),
  designerButtonElement: {
    icon: BsTextareaResize,
    label: dictionary["form-elements"]["text-area"]["icon:label"]
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate
});

type CustomInstance = FormElementInstance & {
  extraAttributes: {
    label: string;
    helperText: string;
    placeHolder: string;
    required: boolean;
    rows: number;
  };
};

function DesignerComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, placeHolder, helperText } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Textarea readOnly disabled placeholder={placeHolder} />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const element = elementInstance as CustomInstance;

  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const { label, required, placeHolder, helperText, rows } =
    element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Textarea
        className={cn(error && "border-red-500")}
        rows={rows}
        placeholder={placeHolder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return;
          const valid = validate(element, e.target.value);
          setError(!valid);
          if (!valid) return;
          submitValue(element.id, e.target.value);
        }}
        value={value}
      />
      {helperText && (
        <p
          className={cn(
            "text-muted-foreground text-[0.8rem]",
            error && "text-red-500"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
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
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeHolder: element.extraAttributes.placeHolder,
      rows: element.extraAttributes.rows
    }
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, placeHolder, required, rows } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        placeHolder,
        required,
        rows
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
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {dictionary["form-elements"].common["props:input.label:label"]}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                {dictionary["form-elements"].common["props:input.desc:label-1"]}
                <br />
                {dictionary["form-elements"].common["props:input.desc:label-2"]}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {
                  dictionary["form-elements"].common[
                    "props:input.label:placeholder"
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
              <FormDescription>
                {
                  dictionary["form-elements"].common[
                    "props:input.desc:placeholder"
                  ]
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {dictionary["form-elements"].common["props:input.label:helper"]}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                {
                  dictionary["form-elements"].common[
                    "props:input.desc:helper-1"
                  ]
                }
                <br />
                {
                  dictionary["form-elements"].common[
                    "props:input.desc:helper-2"
                  ]
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rows"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {
                  dictionary["form-elements"]["text-area"][
                    "props:input.label:rows"
                  ]
                }{" "}
                {form.watch("rows")}
              </FormLabel>
              <FormControl>
                <Slider
                  defaultValue={[field.value]}
                  min={1}
                  max={10}
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
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>
                  {
                    dictionary["form-elements"].common[
                      "props:input.label:required"
                    ]
                  }
                </FormLabel>
                <FormDescription>
                  {
                    dictionary["form-elements"].common[
                      "props:input.desc:required-1"
                    ]
                  }
                  <br />
                  {
                    dictionary["form-elements"].common[
                      "props:input.desc:required-2"
                    ]
                  }
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
