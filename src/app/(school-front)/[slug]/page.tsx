import AboutSchool from "@/components/AboutSchool";
import Counter from "@/components/Counter";
import CustomCard from "@/components/CustomCard";
import HeroCarousel from "@/components/heroCarousel/HeroCarousel";
import MarqueeContainer from "@/components/notices/marquee/MarqueeContainer";
import NoticeBoard from "@/components/notices/noticeBoard/NoticeBoard";
import PhotoGallery from "@/components/PhotoGalery";
import TestimonialSlider from "@/components/Testimonials";
import { prisma } from "@/lib/connect";
import Image from "next/image";

const SchoolHomePage = async ({ params }: { params: any }) => {
  const school = await prisma.schoolInfo.findFirst({
    where: {
      domainPrefix: params.slug,
    },
    include: {
      Facilities: true,
      Highlights: true,
      Testimonials: true,
      SliderImage: true,
    },
  });
  if (!school) {
    return;
  }
  const notices = await prisma.notice.findMany({
    where: {
      schoolId: school.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mx-auto">
      <MarqueeContainer notices={notices} slug={params.slug} />
      {/* Hero Section */}
      {/* <EmblaCarousel /> */}
      <HeroCarousel slides={school.SliderImage} />
      {/* Motto, Mission, Vision */}
      <section className="text-center space-y-4 my-16">
        <h2 className="text-xl font-semibold">{school.motto}</h2>
        <p className="text-gray-600">{school.mission}</p>
        <p className="text-gray-600">{school.vision}</p>
      </section>
      {/* about school  */}
      <AboutSchool school={school} />
      {/* Highlights */}
      <section className="my-16">
        <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {school.Highlights.map((item, idx) => (
            <CustomCard key={idx}>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </CustomCard>
          ))}
        </div>
      </section>

      {/* Facilities */}
      <section className="my-16">
        <h2 className="text-2xl font-bold mb-4">Our Facilities</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {school.Facilities.map((f, idx) => (
            <CustomCard key={idx}>
              <Image
                src={f.imageUrl!}
                alt={f.title}
                width={400}
                height={250}
                className="rounded-t-xl object-cover overflow-hidden"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.description}</p>
              </div>
            </CustomCard>
          ))}
        </div>
      </section>
      {/* counter  */}
      <Counter />
      {/* notice board  */}
      <NoticeBoard notices={notices} slug={params.slug} />
      {/* Testimonials */}
      <TestimonialSlider testimonials={school.Testimonials} />
      {/* Gallery */}
      <PhotoGallery schoolId={school.id} />
    </main>
  );
};

export default SchoolHomePage;
