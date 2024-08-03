import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";

import type { Dictionary } from "@/lib/get-dictionary";
import { StatCard } from "@/components/dashboard/stat-cards";

export function StatCards({
  visits,
  submissions,
  submissionRate,
  dictionary
}: {
  visits: number;
  submissions: number;
  submissionRate: number;
  dictionary: Dictionary;
}) {
  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-3 container">
      <StatCard
        title={dictionary.dashboard["header:total-visits"]}
        icon={<LuView className="text-blue-600" />}
        helperText={dictionary.dashboard["description:total-visits"]}
        value={visits.toLocaleString()}
        loading={false}
        className="shadow-sm shadow-blue-600"
      />
      <StatCard
        title={dictionary.dashboard["header:total-submissions"]}
        icon={<FaWpforms className="text-yellow-600" />}
        helperText={dictionary.dashboard["description:total-submissions"]}
        value={submissions.toLocaleString()}
        loading={false}
        className="shadow-sm shadow-yellow-600"
      />
      <StatCard
        title={dictionary.dashboard["header:submission-rate"]}
        icon={<HiCursorClick className="text-green-600" />}
        helperText={dictionary.dashboard["description:submission-rate"]}
        value={submissionRate.toLocaleString() + "%"}
        loading={false}
        className="shadow-sm shadow-green-600"
      />
    </div>
  );
}
