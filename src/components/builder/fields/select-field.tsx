"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RxDropdownMenu } from "react-icons/rx";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";

import { cn } from "@/lib/utils";
import { useDesigner } from "@/components/builder/use-designer";
import { useDictionary } from "@/components/dictionary-context";
import type { Dictionary } from "@/lib/get-dictionary";
import type {
  ElementsType,
  FormElementInstance,
  SubmitFunction
} from "@/components/builder/form-elements";

import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

const type: ElementsType = "SelectField" as const;

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  options: z.array(z.string()).default([])
});
function validate(formElement: FormElementInstance, currentValue: string) {
  const element = formElement as CustomInstance;
  if (element.extraAttributes.required) {
    return currentValue.length > 0;
  }

  return true;
}

export const createSelectFieldElement = (dictionary: Dictionary) => ({
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes: {
      label: dictionary["form-elements"].select["extra:label"],
      helperText: dictionary["form-elements"].select["extra:helper"],
      placeHolder: dictionary["form-elements"].select["extra:placeholder"],
      required: false,
      options: []
    }
  }),
  designerButtonElement: {
    icon: RxDropdownMenu,
    label: dictionary["form-elements"].select["icon:label"]
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
    options: string[];
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
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
      </Select>
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

  const { label, required, placeHolder, helperText, options } =
    element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Select
        defaultValue={value}
        onValueChange={(value) => {
          setValue(value);
          if (!submitValue) return;
          const valid = validate(element, value);
          setError(!valid);
          submitValue(element.id, value);
        }}
      >
        <SelectTrigger className={cn("w-full", error && "border-red-500")}>
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
  const { updateElement, setSelectedElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeHolder: element.extraAttributes.placeHolder,
      options: element.extraAttributes.options
    }
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, placeHolder, required, options } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        placeHolder,
        required,
        options
      }
    });

    toast({
      title: dictionary["form-elements"].select["props:toast.label:success"],
      description:
        dictionary["form-elements"].select["props:toast.desc:success"]
    });

    setSelectedElement(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(applyChanges)} className="space-y-3">
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
        <Separator />
        <FormField
          control={form.control}
          name="options"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>
                  {
                    dictionary["form-elements"].select[
                      "props:input.label:options"
                    ]
                  }
                </FormLabel>
                <Button
                  variant={"outline"}
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault(); // avoid submit
                    form.setValue("options", field.value.concat("New option"));
                  }}
                >
                  <AiOutlinePlus />
                  {dictionary["form-elements"].select["props:button:add"]}
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {form.watch("options").map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-1"
                  >
                    <Input
                      placeholder=""
                      value={option}
                      onChange={(e) => {
                        field.value[index] = e.target.value;
                        field.onChange(field.value);
                      }}
                    />
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={(e) => {
                        e.preventDefault();
                        const newOptions = [...field.value];
                        newOptions.splice(index, 1);
                        field.onChange(newOptions);
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                  </div>
                ))}
              </div>

              <FormDescription>
                {
                  dictionary["form-elements"].select[
                    "props:input.desc:options-1"
                  ]
                }
                <br />
                {
                  dictionary["form-elements"].select[
                    "props:input.desc:options-2"
                  ]
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
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
        <Separator />
        <Button className="w-full" type="submit">
          {dictionary["form-elements"].select["props:button:save"]}
        </Button>
      </form>
    </Form>
  );
}
