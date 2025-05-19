import Image from "next/image";

const featuredPhotos = [
  { id: 1, src: "/img/slide1.jpg", alt: "Photo 1" },
  { id: 2, src: "/img/slide2.jpg", alt: "Photo 2" },
  { id: 3, src: "/img/slide3.jpg", alt: "Photo 3" },
  { id: 754, src: "/img/std.jpg", alt: "Photo 3" },
  { id: 8784, src: "/img/student.jpg", alt: "Photo 3" },
  { id: 4, src: "/img/slide4.jpg", alt: "Photo 4" },
  { id: 15, src: "/img/slide1.jpg", alt: "Photo 1" },
  { id: 22, src: "/img/slide2.jpg", alt: "Photo 2" },
  { id: 32, src: "/img/slide3.jpg", alt: "Photo 3" },
  { id: 42, src: "/img/slide4.jpg", alt: "Photo 4" },
  { id: 135, src: "/img/slide1.jpg", alt: "Photo 1" },
];

const PhotoGallery = () => {
  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">📸 Photo Gallery</h2>

      {/* Masonry layout using columns */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {featuredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="overflow-hidden rounded-lg shadow-lg break-inside-avoid relative group "
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={600}
              height={400}
              layout="responsive"
              className="rounded-lg object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
            />
            {/* Optional caption */}
            {photo.alt && (
              <div className="p-2 absolute bottom-0 left-0 w-full text-sm text-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                {photo.alt}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
