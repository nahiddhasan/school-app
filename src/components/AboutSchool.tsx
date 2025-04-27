import Image from "next/image";
import Container from "./Container";

const AboutSchool = () => {
  return (
    <Container className="flex flex-col lg:flex-row gap-8 my-20">
      <div className="w-full lg:w-2/3 shadow-[0px_20px_20px_10px_#00000024] rounded-md p-4">
        <h1 className="text-xl md:text-2xl lg:text-4xl font-bold mb-6 bg-primary-base-500 text-white px-4 py-2 rounded-ss-xl rounded-ee-xl">
          About this School
        </h1>
        <p className="font-trio">
          জীবের মধ্যে সবচেয়ে সম্পূর্ণতা মানুষের। কিন্তু সবচেয়ে অসম্পূর্ণ হয়ে
          সে জন্মগ্রহণ করে। বাঘ ভালুক তার জীবনযাত্রার পনেরো- আনা মূলধন নিয়ে আসে
          প্রকৃতির <br />
          <br />
          মানুষ আসবার পূর্বেই জীবসৃষ্টিযজ্ঞে প্রকৃতির ভূরিব্যয়ের পালা শেষ হয়ে
          এসেছে। বিপুল মাংস, কঠিন বর্ম, প্রকাণ্ড লেজ নিয়ে জলে স্থলে পৃথুল দেহের
          যে অমিতাচার প্রবল হয়ে উঠেছিল তাতে ধরিত্রীকে দিলে ক্লান্ত করে। প্রমাণ
          হল আতিশয্যের পরাভব অনিবার্য। পরীক্ষায় এটাও স্থির হয়ে গেল যে,
          প্রশ্রয়ের পরিমাণ যত বেশি হয় দুর্বলতার বোঝাও তত দুর্বহ হয়ে ওঠে। নূতন
          পর্বে প্রকৃতি যথাসম্ভব মানুষের বরাদ্দ কম করে দিয়ে নিজে রইল নেপথ্যে।
          মানুষকে দেখতে হল খুব ছোটো, কিন্তু সেটা একটা কৌশল মাত্র। এবারকার
          জীবযাত্রার পালায় বিপুলতাকে করা হল বহুলতায় পরিণত। মহাকায় জন্তু ছিল
          প্রকাণ্ড একলা, মানুষ হল দূরপ্রসারিত অনেক। প্রমাণ হল আতিশয্যের পরাভব
          অনিবার্য। পরীক্ষায় এটাও স্থির হয়ে গেল যে, প্রশ্রয়ের পরিমাণ যত বেশি
          হয় দুর্বলতার বোঝাও তত দুর্বহ হয়ে ওঠে।
          <br />
          <br /> নূতন পর্বে প্রকৃতি যথাসম্ভব মানুষের বরাদ্দ কম করে দিয়ে নিজে
          রইল নেপথ্যে। মানুষকে দেখতে হল খুব ছোটো, কিন্তু সেটা একটা কৌশল মাত্র।
          এবারকার জীবযাত্রার পালায় বিপুলতাকে করা হল বহুলতায় পরিণত। মহাকায়
          জন্তু ছিল প্রকাণ্ড একলা, মানুষ হল দূরপ্রসারিত অনেক।
        </p>
        <div className="flex flex-col mt-6">
          <span className="text-primary-base-900 text-2xl">
            মোঃ কখগ উদ্দিন ভুঁইয়া
          </span>
          <span className="text-lg">প্রধান শিক্ষক, কখগ উচ্চ বিদ্যালয়</span>
        </div>
      </div>
      <div className="w-full py-8 lg:w-2/6 flex flex-col items-center justify-center h-auto shadow-[0px_20px_20px_10px_#00000024] rounded-md group">
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
          <span className="text-primary-base-900 text-2xl">
            মোঃ কখগ উদ্দিন ভুঁইয়া
          </span>
          <span className="">প্রধান শিক্ষক, কখগ উচ্চ বিদ্যালয়</span>
        </div>
      </div>
    </Container>
  );
};

export default AboutSchool;
