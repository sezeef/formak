import { SelectForm } from "@/db/schema/form";
import { FormLinkShare } from "@/components/forms/form-link-share";
import { VisitButton } from "@/components/forms/form-visit-button";

export function FormsPageHeader({
  name,
  shareUrl
}: Pick<SelectForm, "name" | "shareUrl">) {
  return (
    <>
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{name}</h1>
          <VisitButton shareUrl={shareUrl} />
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={shareUrl} />
        </div>
      </div>
    </>
  );
}
