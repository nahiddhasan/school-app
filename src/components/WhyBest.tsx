import { teachers } from "@/const/data";
import Image from "next/image";
import Container from "./Container";

const WhyBest = () => {
  return (
    <Container className="flex flex-col gap-8 my-20">
      <h1 className="text-4xl text-center font-bold bg-primary-base-500 text-white px-4 py-2 rounded-ss-xl rounded-ee-xl">
        Why We Best
      </h1>
      <div className="grid grid-cols-5 gap-4 place-items-center">
        {teachers.map((gov, index) => (
          <div
            key={index}
            className="shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)] rounded-md p-4 w-full"
          >
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative w-[70%] aspect-square rounded-full overflow-hidden shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]">
                <Image
                  src={gov.image}
                  fill
                  alt="head-teacher"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col mt-6">
                <span className="text-primary-900">{gov.name}</span>
                <span className="text-xs">{gov.des}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default WhyBest;
