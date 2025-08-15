import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { MoodLogger } from "@/components/dashboard/mood-logger";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardGreeting />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MoodLogger />
        </div>
        <div className="lg:col-span-1">
          <UpcomingEvents />
        </div>
        <div className="lg:col-span-3">
            <RecentActivity />
        </div>
      </div>
    </div>
  );
}
