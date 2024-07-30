"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdTextFields } from "react-icons/md";

import { cn } from "@/lib/utils";
import { useDesigner } from "@/components/builder/use-designer";
import { useDictionary } from "@/components/dictionary-context";
import type { Dictionary } from "@/lib/get-dictionary";
import type {
  ElementsType,
  FormElementInstance,
  SubmitFunction
} from "@/components/builder/form-elements";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const type: ElementsType = "TextField" as const;

function validate(formElement: FormElementInstance, currentValue: string) {
  const element = formElement as CustomInstance;
  if (element.extraAttributes.required) {
    return currentValue.length > 0;
  }

  return true;
}

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50)
});

export const createTextFieldElement = (dictionary: Dictionary) => ({
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes: {
      label: dictionary["form-elements"].text["extra:label"],
      helperText: dictionary["form-elements"].text["extra:helper"],
      placeHolder: dictionary["form-elements"].text["extra:placeholder"],
      required: false
    }
  }),
  designerButtonElement: {
    icon: MdTextFields,
    label: dictionary["form-elements"].text["icon:label"]
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
      <Input readOnly disabled placeholder={placeHolder} />
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

  const { label, required, placeHolder, helperText } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Input
        className={cn(error && "border-red-500")}
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
      placeHolder: element.extraAttributes.placeHolder
    }
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, placeHolder, required } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        placeHolder,
        required
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
