import { Card } from "@/components/ui/card";
import Link from "next/link";

const Announcements = () => {
  return (
    <Card className="p-4 shadow-md border-none">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold mb-2">Announcements</h1>
        <Link href={"#"} className="hover:underline text-sm">
          View all
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <AnnouncementCard />
        <AnnouncementCard />
        <AnnouncementCard />
        <AnnouncementCard />
      </div>
    </Card>
  );
};

export default Announcements;

const AnnouncementCard = () => {
  return (
    <div className="p-4 bg-slate-200/50 dark:bg-slate-800/80 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Event Title</h2>
        <span className="text-muted-foreground text-sm font-semibold">
          10-12-2025
        </span>
      </div>
      <p className="text-muted-foreground text-sm">
        Lorem ipsum dolor sit amet, consectetur
      </p>
    </div>
  );
};
