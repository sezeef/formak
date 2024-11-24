import type { Locale } from "@/lib/locale";
import { getDictionary } from "@/lib/get-dictionary";
import { getForm } from "@/actions/form/get-form";

import { FormBuilder } from "@/components/builder/form-builder";

type Params = Promise<{ id: string, lang: Locale }>;

export default async function BuilderPage({
  params
}: {
  params: Params
}) {
  const { id, lang } = await params;
  const dictionary = await getDictionary(lang);

  try {
    const form = await getForm(id);
    return <FormBuilder form={form} dictionary={dictionary} />;
  } catch {
    throw new Error(dictionary.builder["error:form-not-found"]);
  }
}
