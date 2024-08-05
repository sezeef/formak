import { type NextRequest, NextResponse } from "next/server";
import { AsyncParser } from "@json2csv/whatwg";
import { safeGetUser } from "@/lib/user";
import { getFormWithSubmissionsById } from "@/db/query/form";
import type { FormElementInstance } from "@/components/builder/form-elements";

export const GET = async (req: NextRequest) => {
  const user = await safeGetUser();
  if (!user) {
    return new NextResponse("Unautherized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const formId = searchParams.get("formId");

  if (!formId) {
    return new NextResponse("Missing id parameter", { status: 400 });
  }

  const formWithSubmissions = await getFormWithSubmissionsById({ formId });

  if (!formWithSubmissions) {
    return new NextResponse("Failed to fetch form submissions", {
      status: 400
    });
  }

  const csv = await buildCsv(formWithSubmissions);

  const headers = new Headers();
  headers.set("Content-Type", "text/csv");
  headers.set("Content-Disposition", "attachment; filename=data.csv");

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(csv));
      controller.close();
    }
  });

  return new NextResponse(stream, {
    headers
  });
};

async function buildCsv(
  formWithSubmissions: Exclude<
    Awaited<ReturnType<typeof getFormWithSubmissionsById>>,
    undefined
  >
) {
  const formElements = JSON.parse(
    formWithSubmissions.content || "[]"
  ) as FormElementInstance[];

  const fields = formElements
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
      value: element.id,
      label: element.extraAttributes?.label || element.type
    }));

  const parser = new AsyncParser({ withBOM: true, fields });

  let csv = "";

  for (let i = 0; i < formWithSubmissions.submissions.length; ++i) {
    const s = formWithSubmissions.submissions[i].content;
    if (!s) continue;
    const c = await parser.parse(s).promise();
    csv = i === 0 ? c : csv + "\n" + c;
  }

  return csv;
}
