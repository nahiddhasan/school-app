import { convertToRepeatingEvents } from "@/lib/handlerFn";
import { TeacherType } from "@/lib/types";
import {
  BookHeart,
  Building,
  Calendar,
  Droplet,
  Mail,
  MapPinHouse,
  Phone,
  VenusAndMars,
} from "lucide-react";
import Image from "next/image";
import BigCalender from "./BigCalender";

const TeacherProfile = async ({ teacher }: { teacher: TeacherType }) => {
  const {
    name,
    designation,
    department,
    phone,
    email,
    gender,
    dob,
    bloodGroup,
    joinedAt,
    address,
    subject,
    schedules,
    profileImg,
  } = teacher;

  const data = convertToRepeatingEvents(schedules as any);
  return (
    <div className="flex gap-4 h-[calc(100%-65px)] m-3 overflow-y-auto">
      {/* profile  */}
      <div className="w-1/3 p-4 bg-card h-full rounded-md shadow-md overflow-hidden">
        <div className="relative w-1/2 aspect-square flex items-center justify-center mx-auto my-4">
          <Image
            src={profileImg || "/default-avatar.png"}
            fill
            alt={name}
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <div className="flex items-center justify-center flex-col">
            <h1 className="text-center text-2xl truncate">{name}</h1>
            <h3>{designation || "Teacher"}</h3>
          </div>
          <div className="flex flex-col gap-3 my-4 text-sm">
            <div className="flex items-center gap-2">
              <Building size={18} className="text-gray-500" />
              <span className="font-medium">Department:</span>
              <span className="ml-auto font-semibold">
                {department || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookHeart size={18} className="text-gray-500" />
              <span className="font-medium">Subject:</span>
              <span className="ml-auto font-semibold">{subject || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-gray-500" />
              <span className="font-medium">Phone:</span>
              <span className="ml-auto font-semibold">0{phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-gray-500" />
              <span className="font-medium">Email:</span>
              <span className="ml-auto font-semibold">{email || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <VenusAndMars size={18} className="text-gray-500" />
              <span className="font-medium">Gender:</span>
              <span className="ml-auto font-semibold">{gender || "N/A"}</span>
            </div>
            {bloodGroup && (
              <div className="flex items-center gap-2">
                <Droplet size={18} className="text-gray-500" />
                <span className="font-medium">Blood Group:</span>
                <span className="ml-auto font-semibold">{bloodGroup}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <span className="font-medium">Joined At:</span>
              <span className="ml-auto font-semibold">
                {new Date(joinedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <span className="font-medium">Date of Birth:</span>
              <span className="ml-auto font-semibold">
                {new Date(dob).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinHouse size={18} className="text-gray-500" />
              <span className="font-medium">Address:</span>
              <span className="ml-auto font-semibold max-w-[60%]">
                {address}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-2/3 overflow-y-auto">
        {/* Right side content */}
        <div className="mb-4 flex gap-4 items-stretch w-full">
          {/* Attendance Card */}
          <div className="w-[200px] flex-1">
            <div className="h-full p-4 bg-card rounded-md shadow-md flex flex-col items-center justify-center">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">Attendance:</span>
              </div>
              <div className="relative w-20 h-20 mt-2">
                <svg className="absolute inset-0" viewBox="0 0 36 36">
                  <circle
                    className="text-gray-200"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="16"
                    cx="18"
                    cy="18"
                  />
                  <circle
                    className="text-[hsl(var(--chart-1))]"
                    strokeWidth="4"
                    strokeDasharray="100"
                    strokeDashoffset="10"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="16"
                    cx="18"
                    cy="18"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                  90%
                </div>
              </div>
            </div>
          </div>

          {/* Classes Card */}
          <div className="w-[200px] flex-1">
            <div className="h-full p-4 bg-card rounded-md shadow-md flex flex-col items-center justify-center">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">Classes:</span>
              </div>
              <div className="flex items-center justify-center flex-1 text-lg font-semibold">
                {schedules.length}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold border-b pb-1 mb-2">
            Weekly Schedule
          </h3>
          <BigCalender calendarEvents={data} />
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
