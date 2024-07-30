import { format } from "date-fns";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";

import { getForm } from "@/actions/form/get-form";
import { getFormWithSubmissions } from "@/actions/form/get-form-with-submissions";

import { type Dictionary, getDictionary } from "@/lib/get-dictionary";
import { type Locale } from "@/lib/locale";
import { formatLocalizedDistance } from "@/lib/date";
import type {
  ElementsType,
  FormElementInstance
} from "@/components/builder/form-elements";
import { StatCard } from "@/components/dashboard/stat-cards";
import { FormLinkShare } from "@/components/form-link-share";
import { VisitButton } from "@/components/form-visit-button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default async function FormDetailPage({
  params: { id, lang }
}: {
  params: {
    id: string;
    lang: Locale;
  };
}) {
  const dictionary = await getDictionary(lang);
  const form = await getForm(id);
  if (!form) {
    throw new Error(dictionary.forms["error:form-not-found"]);
  }

  const { visits, submissions } = form;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  return (
    <>
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <VisitButton shareUrl={form.shareUrl} />
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={form.shareUrl} />
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-3 container">
        <StatCard
          title={dictionary.dashboard["header:total-visits"]}
          icon={<LuView className="text-blue-600" />}
          helperText={dictionary.dashboard["description:total-visits"]}
          value={visits.toLocaleString() || ""}
          loading={false}
          className="shadow-sm shadow-blue-600"
        />

        <StatCard
          title={dictionary.dashboard["header:total-submissions"]}
          icon={<FaWpforms className="text-yellow-600" />}
          helperText={dictionary.dashboard["description:total-submissions"]}
          value={submissions.toLocaleString() || ""}
          loading={false}
          className="shadow-sm shadow-yellow-600"
        />

        <StatCard
          title={dictionary.dashboard["header:submission-rate"]}
          icon={<HiCursorClick className="text-green-600" />}
          helperText={dictionary.dashboard["description:submission-rate"]}
          value={submissionRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-sm shadow-green-600"
        />
      </div>

      <div className="container pt-10">
        <SubmissionsTable id={form.id} lang={lang} dictionary={dictionary} />
      </div>
    </>
  );
}

type Row = { [key: string]: string } & {
  submittedAt: Date;
};

async function SubmissionsTable({
  id,
  dictionary,
  lang
}: {
  id: string;
  dictionary: Dictionary;
  lang: Locale;
}) {
  const form = await getFormWithSubmissions(id);
  const formElements = form?.content
    ? (JSON.parse(form.content) as FormElementInstance[])
    : [];
  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type
        });
        break;
      default:
        break;
    }
  });

  const rows: Row[] = [];
  form.submissions.forEach((submission) => {
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      submittedAt: submission.createdAt
    });
  });

  return (
    <>
      <h1 className="text-2xl font-bold my-4">Submissions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase rtl:text-left">
                {dictionary.forms["table.head:submitted-at"]}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className="text-muted-foreground text-right rtl:text-left">
                  {formatLocalizedDistance(row.submittedAt, lang)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: React.ReactNode = value;

  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }

  return <TableCell>{node}</TableCell>;
}
