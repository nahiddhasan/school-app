import { mainGov } from "@/const/data";
import Image from "next/image";
import Container from "./Container";

const MainGov = () => {
  return (
    <Container className="flex flex-wrap my-20">
      {mainGov.map((gov, index) => (
        <div
          key={index}
          className="w-full md:w-1/2 lg:w-1/3 mb-8 shadow-[0px_20px_20px_10px_#00000024] rounded-md p-4"
        >
          <h1 className="text-xl text-center font-bold mb-6 bg-primary-500 text-white px-4 py-2 rounded-ss-xl rounded-ee-xl">
            {gov.title}
          </h1>
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative w-1/2 aspect-square rounded-full overflow-hidden shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]">
              <Image
                src={gov.image}
                fill
                alt="head-teacher"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col mt-6">
              <span className="text-primary-900 text-2xl">{gov.name}</span>
              <span className="">{gov.des}</span>
            </div>
          </div>
        </div>
      ))}
    </Container>
  );
};

export default MainGov;
