import type { Locale } from "@/lib/locale";
import { getDictionary } from "@/lib/get-dictionary";
import { getForm } from "@/actions/form/get-form";

import { FormsPageHeader } from "@/components/forms/header";
import { StatCards } from "@/components/forms/stat-cards";
import { SubmissionsDataTable } from "@/components/forms/data-table";

type Params = Promise<{
    id: string;
    lang: Locale;
}>;

const calculateSubmissionRate = (
  visits: number,
  submissions: number
): number => {
  return visits > 0 ? (submissions / visits) * 100 : 0;
};

export default async function FormDetailPage({
  params
}: { params: Params } ) {
  const { id, lang } = await params;
  const dictionary = await getDictionary(lang);
  const form = await getForm(id);

  if (!form) {
    throw new Error(dictionary.forms["error:form-not-found"]);
  }

  const submissionRate = calculateSubmissionRate(form.visits, form.submissions);

  return (
    <>
      <FormsPageHeader name={form.name} shareUrl={form.shareUrl} />
      <StatCards
        visits={form.visits}
        submissions={form.submissions}
        submissionRate={submissionRate}
        dictionary={dictionary}
      />
      <SubmissionsDataTable
        formId={form.id}
        lang={lang}
        dictionary={dictionary}
      />
    </>
  );
}
