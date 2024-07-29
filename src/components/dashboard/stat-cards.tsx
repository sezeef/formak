import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";

import type { Dictionary } from "@/lib/get-dictionary";
import { getStats } from "@/actions/form/get-stats";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function StatCardsWrapper({
  dictionary
}: {
  dictionary: Dictionary;
}) {
  const stats = await getStats();
  return <StatCards loading={false} data={stats} dictionary={dictionary} />;
}

export function StatCards({
  data,
  loading,
  dictionary
}: {
  data?: Awaited<ReturnType<typeof getStats>>;
  loading: boolean;
  dictionary: Dictionary;
}) {
  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-3">
      <StatCard
        title={dictionary.dashboard["header:total-visits"]}
        icon={<LuView className="text-blue-600" />}
        helperText={dictionary.dashboard["description:total-visits"]}
        value={data?.visits.toLocaleString() || ""}
        loading={loading}
        className="shadow-sm shadow-blue-600"
      />

      <StatCard
        title={dictionary.dashboard["header:total-submissions"]}
        icon={<FaWpforms className="text-yellow-600" />}
        helperText={dictionary.dashboard["description:total-submissions"]}
        value={data?.submissions.toLocaleString() || ""}
        loading={loading}
        className="shadow-sm shadow-yellow-600"
      />

      <StatCard
        title={dictionary.dashboard["header:submission-rate"]}
        icon={<HiCursorClick className="text-green-600" />}
        helperText={dictionary.dashboard["description:submission-rate"]}
        value={data?.submissionRate.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-sm shadow-green-600"
      />
    </div>
  );
}

export function StatCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className
}: {
  title: string;
  value: string;
  helperText: string;
  className?: string;
  loading: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="pt-4 flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-xl font-bold">
          {loading ? (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
}
