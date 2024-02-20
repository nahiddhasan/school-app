import { notices } from "@/const/data";
import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

const NoticeScroll = () => {
  return (
    <Container className="flex items-center justify-center">
      <div className="hidden md:w-[90%] h-full lg:h-[500px] md:flex flex-col lg:flex-row items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-red-500 to-red-700 rounded-lg p-4">
        <div className="md:w-1/2 lg:w-[30%] flex items-center justify-center flex-col ">
          <h1 className="text-4xl mb-8 text-white font-bold">Recent Notices</h1>
          <Image
            src={"/img/marketing.svg"}
            height={200}
            width={200}
            alt="announcement"
          />
        </div>
        <div className="w-full lg:w-[70%] h-[70vh] lg:h-[90%] relative rounded-2xl px-4 pt-4 bg-[url('/img/notice-bnr.png')] bg-contain bg-no-repeat bg-center">
          <div className="w-[350px] h-[230px] absolute top-14 left-44 lg:left-56 overflow-y-auto">
            {notices.map((notice) => (
              <div
                key={notice.title}
                className="flex items-center gap-3 text-white mb-2 cursor-pointer"
              >
                <span className="font-bold text-primary-950 whitespace-nowrap">
                  10 Dec:
                </span>
                <Link
                  href={notice.path}
                  className="text-primary-700 hover:underline truncate"
                >
                  {notice.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default NoticeScroll;
