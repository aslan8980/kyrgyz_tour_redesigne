import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";

import Slide1 from "../assets/images/slide-1.webp";
import Slide2 from "../assets/images/slide-2.webp";
import Slide3 from "../assets/images/slide-3.webp";
import ThreeDays from "../assets/images/3-days.webp";
import FourDays from "../assets/images/4-days.webp";
import FiveDays from "../assets/images/5-days.webp";
import FourteenDays from "../assets/images/14-days.webp";

const galleryImages = [
  { image: Slide1, title: "Mountain Adventures", category: "Nature" },
  { image: Slide2, title: "The Beauty of Kyrgyzstan", category: "Landscapes" },
  { image: Slide3, title: "Nature & Culture", category: "Experience" },
  { image: ThreeDays, title: "Ala-Archa", category: "Mountains" },
  { image: FourDays, title: "Issyk-Kul & Song-Kul", category: "Lakes" },
  { image: FiveDays, title: "Karakol", category: "Adventure" },
  { image: FourteenDays, title: "Across Kyrgyzstan", category: "Journey" },
];

const Gallery = () => {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const closeLightbox = () => setActiveImageIndex(null);

  const showPreviousImage = () => {
    setActiveImageIndex((current) =>
      current === null ? null : (current - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((current) =>
      current === null ? null : (current + 1) % galleryImages.length
    );
  };

  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPreviousImage();
      if (event.key === "ArrowRight") showNextImage();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImageIndex]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      {/* HERO */}
      <section className="relative flex min-h-[620px] items-center overflow-hidden">
        <img src={Slide2} alt="Kyrgyzstan landscape" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 md:px-8">
          <div className="max-w-3xl text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#d7b85a]" />
              <span className="text-sm font-medium">The Kyrgyzstan Experience</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              See the Journey.<br />Feel the Place.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
              Mountains, lakes, valleys and unforgettable moments. Take a visual journey through the places that make Kyrgyzstan unique.
            </p>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="px-4 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#c9cebd] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#4a5c23]" />
                <span className="text-sm font-medium">Explore Through Photos</span>
              </div>
              <h2 className="mt-6 text-4xl font-bold md:text-5xl">Moments from Kyrgyzstan</h2>
            </div>
            <p className="max-w-md leading-relaxed text-gray-600">
              Every landscape tells a story. Explore some of the places and experiences waiting for you.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                aria-label={`Open photo: ${item.title}`}
                className={`group relative block overflow-hidden rounded-3xl text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4a5c23] ${
                  index === 0 ? "lg:row-span-2" : index === 4 ? "lg:col-span-2" : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    index === 0 ? "h-[620px]" : "h-[300px]"
                  }`}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6 text-white md:p-7">
                  <p className="text-sm text-white/70">{item.category}</p>
                  <h3 className="mt-1 text-2xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/80 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    Click to view full screen
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO STORY */}
      <section className="bg-[#f4f5f0] px-4 py-24 md:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#4a5c23]" />
              <span className="text-sm font-medium">More Than A Photograph</span>
            </div>
            <h2 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
              Come for the views.<br />Stay for the stories.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              The most memorable part of traveling through Kyrgyzstan isn't always the destination. It's the people you meet, the roads you take and the moments you never planned for.
            </p>
            <a href="/itineraries" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#4A5C23] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#364518]">
              Explore Our Journeys <ArrowRight className="h-5 w-5" />
            </a>
          </div>
          <img src={Slide3} alt="Kyrgyzstan experience" className="h-[500px] w-full rounded-3xl object-cover" />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 md:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem]">
          <img src={FourteenDays} alt="Discover Kyrgyzstan" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 px-6 py-24 text-center text-white">
            <h2 className="text-4xl font-bold md:text-6xl">Ready to see it<br />for yourself?</h2>
            <p className="mt-6 text-lg text-white/85">Your Kyrgyzstan story could be the next one in our gallery.</p>
            <a href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-gray-900 transition-colors hover:bg-gray-100">
              Start Your Journey <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* FULL-SCREEN PHOTO VIEWER */}
      {activeImageIndex !== null && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen photo gallery"
          onClick={closeLightbox}
        >
          <button type="button" onClick={closeLightbox} aria-label="Close photo viewer" className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-6">
            <X size={25} />
          </button>

          <button type="button" onClick={(event) => { event.stopPropagation(); showPreviousImage(); }} aria-label="Previous photo" className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6 sm:h-14 sm:w-14">
            <ChevronLeft size={30} />
          </button>

          <div className="flex h-full w-full max-w-6xl flex-col items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <img
              key={galleryImages[activeImageIndex].image}
              src={galleryImages[activeImageIndex].image}
              alt={galleryImages[activeImageIndex].title}
              className="max-h-[calc(100vh-130px)] max-w-full rounded-lg object-contain"
            />
            <div className="mt-4 text-center text-white">
              <p className="text-lg font-semibold">{galleryImages[activeImageIndex].title}</p>
              <p className="mt-1 text-sm text-white/65">{activeImageIndex + 1} / {galleryImages.length}</p>
            </div>
          </div>

          <button type="button" onClick={(event) => { event.stopPropagation(); showNextImage(); }} aria-label="Next photo" className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:h-14 sm:w-14">
            <ChevronRight size={30} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
