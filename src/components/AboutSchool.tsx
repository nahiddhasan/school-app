import Image from "next/image";
import CustomCard from "./CustomCard";

const AboutSchool = async ({ school }: { school: any }) => {
  return (
    <section className="flex flex-col lg:flex-row gap-8 my-16">
      <CustomCard className="w-full lg:w-2/3  rounded-md p-4 relative">
        <h1 className="w-full text-xl md:text-2xl font-bold mb-6 bg-primary-base-500 text-white px-4 py-2 rounded-ss-xl rounded-ee-xl absolute top-0 left-0">
          About Our School
        </h1>
        {school?.description
          .split("\n")
          .filter((para: string) => para.trim() !== "")
          .map((para: string, idx: number) => (
            <p key={idx} className="mb-4 text-base">
              {para}
            </p>
          ))}
      </CustomCard>

      <CustomCard className="w-full py-8 lg:w-2/6">
        <div className="relative w-1/2 aspect-square rounded-full overflow-hidden shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]">
          <Image
            src={"/img/head-t.jpg"}
            fill
            alt="head-teacher"
            className="object-cover group-hover:scale-110 transition duration-300"
          />
          <div className="bg-black h-full w-full absolute top-0 left-0 opacity-20 scale-0 group-hover:scale-100 rounded-full transition duration-300" />
        </div>
        <div className="flex flex-col mt-6">
          <span className="text-primary-base-900 text-2xl font-semibold text-center">
            {school?.principalName}
          </span>
          <span className="">Principal, {school?.name}</span>
        </div>
      </CustomCard>
    </section>
  );
};

export default AboutSchool;
