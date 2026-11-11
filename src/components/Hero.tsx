
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Slide2 from "../assets/images/site/hero/home-journey-b.jpg";
import Slide3 from "../assets/images/site/hero/home-journey-c.jpg";
import { useLanguage } from "../lib/language";

const slides = [
  {
    image: "/images/kyrgyzstan-hero.png",
    imageAlt: "A mountain road crossing the Tian Shan in Kyrgyzstan",
    eyebrow: "MOUNTAINS · LAKES · CULTURE",
    title: "Kyrgyzstan,\ncloser than you think.",
    description:
      "Plan a journey through mountain valleys, high-altitude lakes and the living traditions of Kyrgyzstan.",
  },
  {
    image: Slide2,
    imageAlt: "A horse rider crossing an alpine valley with yurts in Kyrgyzstan",
    eyebrow: "WILD LANDSCAPES · OPEN ROADS",
    title: "Choose your\nkind of journey.",
    description:
      "Choose a short escape or a longer route, then shape the details around your dates and travel style.",
  },
  {
    image: Slide3,
    imageAlt: "Kyrgyz family welcoming travelers beside a yurt",
    eyebrow: "TRADITION · HOSPITALITY · DISCOVERY",
    title: "Meet the people\nand places of Kyrgyzstan.",
    description:
      "Explore the country at a thoughtful pace, with time for its landscapes, towns and local culture.",
  },
];

const Hero = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const goToItineraries = () => {
    const section = document.getElementById("itineraries");

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = "/itineraries";
    }
  };

  return (
    <section className="kt-hero relative isolate h-[100svh] min-h-[680px] max-h-[1100px] w-full overflow-hidden text-white">
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          aria-hidden={currentSlide !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.imageAlt}
            className="absolute inset-0 h-full w-full object-cover object-center"
            fetchPriority={index === 0 ? "high" : "auto"}
          />

          {/* Gentle contrast over the landscape */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center px-6 pb-16 pt-24 sm:px-10 lg:px-16">
            <div className="max-w-[760px] animate-fadeIn">
              <p className="mb-6 text-[10px] font-normal uppercase tracking-[0.28em] text-white/90 sm:text-xs">
                {t(slide.eyebrow)}
              </p>

              <h1 className="whitespace-pre-line font-montserrat text-5xl font-light leading-[1.08] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[clamp(4.3rem,7vw,7rem)]">
                {t(slide.title)}
              </h1>

              <p className="mt-6 max-w-[540px] text-sm font-light leading-7 text-white/95 sm:text-base sm:leading-8">
                {t(slide.description)}
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Button
                  onClick={goToItineraries}
                  className="h-[54px] rounded-full border border-white bg-white px-7 text-xs font-medium tracking-wide text-[#273126] transition hover:bg-white/90"
                >
                  {t("Explore tours")}
                  <ArrowUpRight className="ml-3 h-4 w-4" strokeWidth={1.5} />
                </Button>

                <Button
                  onClick={() => {
                    window.location.href = "/contact";
                  }}
                  variant="outline"
                  className="h-[54px] rounded-full border border-white/75 bg-transparent px-7 text-xs font-normal tracking-wide text-white transition hover:bg-white/15 hover:text-white"
                >
                  {t("Plan a custom tour")}
                  <ArrowUpRight className="ml-3 h-4 w-4" strokeWidth={1.5} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Seamless fade into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-36 bg-gradient-to-b from-transparent via-black/10 to-[#171a17]" />

    </section>
  );
};

export default Hero;
