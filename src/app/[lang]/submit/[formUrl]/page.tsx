import type { Locale } from "@/lib/locale";
import type { FormElementInstance } from "@/components/builder/form-elements";
import { getFormContentByUrl } from "@/actions/form/get-form-content";
import { getDictionary } from "@/lib/get-dictionary";

import { FormSubmit } from "@/components/form-submit";

type Params = Promise<{
  formUrl: string;
  lang: Locale;
}>;

export default async function SubmitPage({ params }: { params: Params }) {
  const { formUrl, lang } = await params;
  const dictionary = await getDictionary(lang);
  const form = await getFormContentByUrl(formUrl);

  if (!form || !form?.content) {
    throw new Error(dictionary.submit["error:form-not-found"]);
  }

  const formContent = JSON.parse(form.content) as FormElementInstance[];

  return <FormSubmit formUrl={formUrl} content={formContent} />;
}
