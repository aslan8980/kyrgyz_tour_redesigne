import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import PageHero from "../components/PageHero";
import { ArrowRight, ChevronLeft, ChevronRight, X, Images } from "lucide-react";
import { supabase } from "../lib/supabase";
import { usePublicTestimonials } from "../hooks/usePublicTestimonials";

import GalleryHero from "../assets/images/site/hero/hero-gallery.jpg";
import IssykKul from "../assets/images/site/gallery/gallery-issyk-kul.jpg";
import AlaArcha from "../assets/images/site/gallery/gallery-ala-archa.jpg";
import SongKulDusk from "../assets/images/site/gallery/gallery-song-kul-dusk.jpg";
import Craft from "../assets/images/site/gallery/gallery-craft.jpg";
import Burana from "../assets/images/site/gallery/gallery-burana.jpg";
import Horseman from "../assets/images/site/gallery/gallery-horseman.jpg";
import { useLanguage } from "../lib/language";

const galleryImages = [
  { image: IssykKul, title: "The Shores of Issyk-Kul", category: "Lake" },
  { image: AlaArcha, title: "Ala-Archa National Park", category: "Mountains" },
  { image: SongKulDusk, title: "Evening at Song-Kul", category: "Nomadic Life" },
  { image: Craft, title: "The Art of Shyrdak", category: "Kyrgyz Culture" },
  { image: Burana, title: "Burana Tower", category: "History" },
  { image: Horseman, title: "Life on the Steppe", category: "Tradition" },
];
type GalleryPhoto = { id: string; image_url: string; title: string; category: string };

const Gallery = () => {
  const { t } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [managedPhotos, setManagedPhotos] = useState<GalleryPhoto[] | null>(null);
  const visiblePhotos = managedPhotos ?? galleryImages;
  const [featuredReview] = usePublicTestimonials();

  useEffect(() => {
    let active = true;
    supabase.from("gallery_photos").select("id,image_url,title,category").order("sort_order").order("created_at")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error("Failed to load gallery photos:", error.message);
        else setManagedPhotos(data ?? []);
      });
    return () => { active = false; };
  }, []);

  const closeLightbox = () => setActiveImageIndex(null);

  const showPreviousImage = () => {
    setActiveImageIndex((current) =>
      current === null ? null : (current - 1 + visiblePhotos.length) % visiblePhotos.length
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((current) =>
      current === null ? null : (current + 1) % visiblePhotos.length
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

      <PageHero
        image={GalleryHero}
        imageAlt="Red sandstone cliffs above a green mountain valley in Kyrgyzstan"
        eyebrow={t("The Kyrgyzstan Experience")}
        title={t("See the Journey. Feel the Place.")}
        description={t("Mountains, lakes, valleys and unforgettable moments. Take a visual journey through the places that make Kyrgyzstan unique.")}
      />

      {/* GALLERY */}
      <section className="px-4 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#c9cebd] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#4a5c23]" />
                <span className="text-sm font-medium">{t("Explore Through Photos")}</span>
              </div>
              <h2 className="mt-6 text-4xl font-bold md:text-5xl">{t("Moments from Kyrgyzstan")}</h2>
            </div>
            <p className="max-w-md leading-relaxed text-gray-600">
              {t("Every landscape tells a story. Explore some of the places and experiences waiting for you.")}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {(showAllPhotos ? visiblePhotos : visiblePhotos.slice(0, 3)).map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                aria-label={`${t("Open photo")}: ${item.title}`}
                className={`group relative block overflow-hidden rounded-3xl text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4a5c23] ${
                  index === 0 ? "lg:row-span-2" : index === 4 ? "lg:col-span-2" : ""
                }`}
              >
                <img
                  src={"image_url" in item ? item.image_url : item.image}
                  alt={item.title}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    index === 0 ? "h-[620px]" : "h-[300px]"
                  }`}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6 text-white md:p-7">
                  <p className="text-sm text-white/70">{t(item.category)}</p>
                  <h3 className="mt-1 text-2xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/80 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {t("Click to view full screen")}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllPhotos((shown) => !shown)}
              aria-expanded={showAllPhotos}
              className="inline-flex items-center gap-3 rounded-full border border-[#4A5C23] bg-[#4A5C23] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#35451a]"
            >
              <Images size={18} />
              {showAllPhotos ? t("Show fewer photos") : t("View all photos")}
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#17200f]">
          <div className={`grid gap-10 px-7 py-12 text-white md:items-center md:gap-14 md:px-14 md:py-16 ${featuredReview ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
            {featuredReview && <blockquote className="border-l-2 border-[#d7b85a] pl-6 md:pl-8">
              <div className="mb-4 flex gap-1 text-[#d7b85a]" aria-label="5 out of 5 stars">
                {Array.from({ length: featuredReview.rating }, (_, i) => <span key={i}>★</span>)}
              </div>
              <p className="text-xl leading-relaxed md:text-2xl">“{featuredReview.text}”</p>
              <footer className="mt-5 text-sm text-white/65">{featuredReview.name} <span className="mx-1">·</span> {featuredReview.country}</footer>
            </blockquote>}
            <div className={featuredReview ? "text-center md:text-left" : "text-center"}>
              <h2 className="text-4xl font-bold md:text-5xl">Ready to see it<br className="hidden md:block" /> for yourself?</h2>
              <p className="mt-5 text-lg text-white/75">Your Kyrgyzstan story could be the next one in our gallery.</p>
              <a href="/contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-gray-900 transition-colors hover:bg-gray-100">
                Start Your Journey <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FULL-SCREEN PHOTO VIEWER */}
      {activeImageIndex !== null && activeImageIndex < visiblePhotos.length && (
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
              key={"image_url" in visiblePhotos[activeImageIndex] ? visiblePhotos[activeImageIndex].image_url : visiblePhotos[activeImageIndex].image}
              src={"image_url" in visiblePhotos[activeImageIndex] ? visiblePhotos[activeImageIndex].image_url : visiblePhotos[activeImageIndex].image}
              alt={visiblePhotos[activeImageIndex].title}
              className="max-h-[calc(100vh-130px)] max-w-full rounded-lg object-contain"
            />
            <div className="mt-4 text-center text-white">
              <p className="text-lg font-semibold">{visiblePhotos[activeImageIndex].title}</p>
              <p className="mt-1 text-sm text-white/65">{activeImageIndex + 1} / {visiblePhotos.length}</p>
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
