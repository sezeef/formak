import type { IconType } from "react-icons/lib";
import type { Dictionary } from "@/lib/get-dictionary";

import { createTitleFieldElement } from "@/components/builder/fields/title-field";
import { createSubtitleFieldElement } from "@/components/builder/fields/subtitle-field";
import { createParagraphFieldElement } from "@/components/builder/fields/paragraph-field";
import { createSeparatorFieldElement } from "@/components/builder/fields/separator-field";
import { createSpacerFieldElement } from "@/components/builder/fields/spacer-field";
import { createTextFieldElement } from "@/components/builder/fields/text-field";
import { createTextAreaElement } from "@/components/builder/fields/text-area-field";
import { createNumberFieldElement } from "@/components/builder/fields/number-field";
import { createCheckboxFieldElement } from "@/components/builder/fields/checkbox-field";
import { createSelectFieldElement } from "@/components/builder/fields/select-field";
import { createDateFieldElement } from "@/components/builder/fields/date-field";

export type ElementsType =
  | "TextField"
  | "TitleField"
  | "SubTitleField"
  | "ParagraphField"
  | "SeparatorField"
  | "SpacerField"
  | "NumberField"
  | "TextAreaField"
  | "DateField"
  | "SelectField"
  | "CheckboxField";

export type SubmitFunction = (key: string, value: string) => void;

export type FormElementInstance = {
  id: string;
  type: ElementsType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraAttributes?: Record<string, any>;
};

export type FormElement = {
  type: ElementsType;
  construct: (id: string) => FormElementInstance;
  validate: (formElement: FormElementInstance, currentValue: string) => boolean;

  designerButtonElement: {
    icon: IconType;
    label: string;
  };

  designerComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;

  formComponent: React.FC<{
    elementInstance: FormElementInstance;
    submitValue?: SubmitFunction;
    isInvalid?: boolean;
    defaultValue?: string;
  }>;

  propertiesComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
};

export const createFormElements = (
  dictionary: Dictionary
): Record<ElementsType, FormElement> => ({
  TitleField: createTitleFieldElement(dictionary),
  SubTitleField: createSubtitleFieldElement(dictionary),
  ParagraphField: createParagraphFieldElement(dictionary),
  SeparatorField: createSeparatorFieldElement(dictionary),
  SpacerField: createSpacerFieldElement(dictionary),
  TextField: createTextFieldElement(dictionary),
  TextAreaField: createTextAreaElement(dictionary),
  NumberField: createNumberFieldElement(dictionary),
  CheckboxField: createCheckboxFieldElement(dictionary),
  SelectField: createSelectFieldElement(dictionary),
  DateField: createDateFieldElement(dictionary)
});
