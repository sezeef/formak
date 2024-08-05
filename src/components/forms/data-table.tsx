import { format } from "date-fns";

import { getFormWithSubmissions } from "@/actions/form/get-form-with-submissions";

import { formatLocalizedDistance } from "@/lib/date";
import type { Locale } from "@/lib/locale";
import type { Dictionary } from "@/lib/get-dictionary";
import type {
  ElementsType,
  FormElementInstance
} from "@/components/builder/form-elements";
import { ExportButton } from "@/components/forms/export-button";

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

type SubmissionRow = { [key: string]: string } & {
  submittedAt: Date;
};

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  switch (type) {
    case "DateField":
      return value ? (
        <Badge variant={"outline"}>
          {format(new Date(value), "dd/MM/yyyy")}
        </Badge>
      ) : null;
    case "CheckboxField":
      return <Checkbox checked={value === "true"} disabled />;
    default:
      return <>{value}</>;
  }
}

export async function SubmissionsDataTable({
  formId,
  dictionary,
  lang
}: {
  formId: string;
  dictionary: Dictionary;
  lang: Locale;
}) {
  const form = await getFormWithSubmissions(formId);
  if (!form) return null;

  const formElements = JSON.parse(
    form.content || "[]"
  ) as FormElementInstance[];

  const columns = formElements
    .filter((element) =>
      [
        "TextField",
        "NumberField",
        "TextAreaField",
        "DateField",
        "SelectField",
        "CheckboxField"
      ].includes(element.type)
    )
    .map((element) => ({
      id: element.id,
      label: element.extraAttributes?.label,
      required: element.extraAttributes?.required,
      type: element.type as ElementsType
    }));

  const rows: SubmissionRow[] = form.submissions.map((submission) => ({
    ...JSON.parse(submission.content),
    submittedAt: submission.createdAt
  }));

  return (
    <div className="container pt-10">
      <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold my-4">
        {dictionary.forms["header:submissions"]}
      </h1>
      <ExportButton formId={formId} />
      </div>
      <div className="rounded-md border mb-10">
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
                  <TableCell key={column.id}>
                    <RowCell type={column.type} value={row[column.id]} />
                  </TableCell>
                ))}
                <TableCell className="text-muted-foreground text-right rtl:text-left">
                  {formatLocalizedDistance(row.submittedAt, lang)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
