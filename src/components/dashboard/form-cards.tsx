import Link from "next/link";

import { BiRightArrowAlt } from "react-icons/bi";
import { FaEdit, FaWpforms } from "react-icons/fa";
import { LuView } from "react-icons/lu";

import type { SelectForm } from "@/db/schema/form";
import type { Dictionary } from "@/lib/get-dictionary";
import { type Locale, localize } from "@/lib/locale";
import { formatLocalizedDistance } from "@/lib/date";
import { getForms } from "@/actions/form/get-forms";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export async function FormCards({ dictionary }: { dictionary: Dictionary }) {
  const forms = await getForms();
  return (
    <>
      {forms.map((form: SelectForm) => (
        <FormCard key={form.id} form={form} dictionary={dictionary} />
      ))}
    </>
  );
}

export function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
}

function FormCard({
  form,
  dictionary
}: {
  form: SelectForm;
  dictionary: Dictionary;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{form.name}</span>
          {form.published && (
            <Badge>{dictionary.dashboard["badge:published"]}</Badge>
          )}
          {!form.published && (
            <Badge variant={"destructive"}>
              {dictionary.dashboard["badge:draft"]}
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatLocalizedDistance(form.createdAt, dictionary.lang as Locale)}
          {form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || dictionary.dashboard["description:no-description"]}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={localize(dictionary.lang, `/forms/${form.id}`)}>
              {dictionary.dashboard["button:view-submissions"]}{" "}
              <BiRightArrowAlt />
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button
            asChild
            variant={"secondary"}
            className="w-full mt-2 text-md gap-4"
          >
            <Link href={localize(dictionary.lang, `/builder/${form.id}`)}>
              {dictionary.dashboard["button:edit-form"]} <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
