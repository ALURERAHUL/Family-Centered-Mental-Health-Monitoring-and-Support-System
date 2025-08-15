import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { QuickAccess } from "@/components/dashboard/quick-access";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { MoodLogger } from "@/components/dashboard/mood-logger";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardGreeting />
      <QuickAccess />
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
