import { prisma } from "@/lib/connect";
import Image from "next/image";

const PhotoGallery = async ({ schoolId }: { schoolId: string }) => {
  const photoGallery = await prisma.galleryImage.findMany({
    where: {
      schoolId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="my-16">
      <h2 className="text-3xl font-bold mb-6 text-center">📸 Photo Gallery</h2>

      {/* Masonry layout using columns */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photoGallery.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg shadow-lg break-inside-avoid relative group "
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={600}
              height={400}
              layout="responsive"
              className="rounded-lg object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
            />
            {/* Optional caption */}
            {item.title && (
              <div className="p-2 absolute bottom-0 left-0 w-full text-sm text-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                {item.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoGallery;
