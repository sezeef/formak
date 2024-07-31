import type { Locale } from "@/lib/locale";
import type { FormElementInstance } from "@/components/builder/form-elements";
import { getFormContentByUrl } from "@/actions/form/get-form-content";
import { FormSubmit } from "@/components/form-submit";
import { getDictionary } from "@/lib/get-dictionary";

export default async function SubmitPage({
  params: { formUrl, lang }
}: {
  params: {
    formUrl: string;
    lang: Locale;
  };
}) {
  const dictionary = await getDictionary(lang);
  const form = await getFormContentByUrl(formUrl);

  if (!form || !form?.content) {
    throw new Error(dictionary.submit["error:form-not-found"]);
  }

  const formContent = JSON.parse(form.content) as FormElementInstance[];

  return <FormSubmit formUrl={formUrl} content={formContent} />;
}
