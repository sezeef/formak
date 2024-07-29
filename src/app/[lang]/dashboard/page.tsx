import { Suspense } from "react";

import type { Locale } from "@/lib/locale";
import { getDictionary } from "@/lib/get-dictionary";

import {
  StatCardsWrapper,
  StatCards
} from "@/components/dashboard/stat-cards";
import { FormCards, FormCardSkeleton } from "@/components/dashboard/form-cards";
import { CreateFormButton } from "@/components/dashboard/create-form-button";

import { Separator } from "@/components/ui/separator";

export default async function BuilderPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="container pt-4">
      <Suspense
        fallback={<StatCards loading={true} dictionary={dictionary} />}
      >
        <StatCardsWrapper dictionary={dictionary} />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="text-2xl font-semibold col-span-2">
        {dictionary.dashboard["header:title"]}
      </h2>
      <Separator className="my-6" />
      <div className="grid gric-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormButton />
        <Suspense
          fallback={[1, 2].map((el) => (
            <FormCardSkeleton key={el} />
          ))}
        >
          <FormCards dictionary={dictionary} />
        </Suspense>
      </div>
    </div>
  );
}
