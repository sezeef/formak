import { getForm } from "@/actions/form/get-form";
import { FormBuilder } from "@/components/builder/form-builder";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/locale";

export default async function BuilderPage({
  params: { id, lang }
}: {
  params: {
    id: string;
    lang: Locale;
  };
}) {
  const dictionary = await getDictionary(lang);
  try {
    const form = await getForm(id);
    return <FormBuilder form={form} dictionary={dictionary} />;
  } catch {
    throw new Error(dictionary.builder["error:form-not-found"]);
  }
}
