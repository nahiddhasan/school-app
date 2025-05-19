import { Announcement } from "@/app/generated/prisma";
import { Card } from "@/components/ui/card";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";

export const fetchAnnouncements = async (): Promise<Announcement[]> => {
  return fetcher(`/api/announcements`);
};

const Announcements = async () => {
  const announcements = await fetchAnnouncements();

  return (
    <Card className="p-4 shadow-md border-none">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold mb-2">Announcements</h1>
        <Link
          href={"/dashboard/announcements"}
          className="hover:underline text-sm"
        >
          View all
        </Link>
      </div>
      <div className="flex flex-col gap-2 ">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))
        ) : (
          <p>No announcements found!</p>
        )}
      </div>
    </Card>
  );
};

export default Announcements;

const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
  return (
    <div className="p-4  even:bg-[hsl(var(--chart-2))]/10 odd:bg-[hsl(var(--chart-1))]/10 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{announcement.title}</h2>
        <span className="text-muted-foreground text-sm font-semibold">
          {new Date(announcement.createdAt).toLocaleDateString("en-GB")}
        </span>
      </div>
      <p className="text-muted-foreground text-sm">{announcement.desc}</p>
    </div>
  );
};
