import { useRef } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { usePublicTestimonials } from "../hooks/usePublicTestimonials";

import TestimonialsHero from "../assets/images/site/hero/hero-testimonials.jpg";
import GatheringPhoto from "../assets/images/site/editorial/testimonial-gathering.jpg";
import { useLanguage } from "../lib/language";

const Testimonials = () => {
  const { t } = useLanguage();
  const testimonials = usePublicTestimonials();
  const featuredTestimonial = testimonials[1] || testimonials[0];
  const carouselRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {location.pathname === "/testimonials" && <Navigation />}

      {/* Reviews over the existing photo, with a soft blend from the blog section above. */}
      <section className="relative isolate flex min-h-[700px] items-center overflow-hidden px-5 py-20 sm:px-8 md:min-h-[740px] md:py-24">
        <img src={TestimonialsHero} alt="Travelers and their Kyrgyz guide in the mountains" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/65 via-black/35 to-black/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/10 to-black/45" />
        <div className="absolute inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-[#11170f] via-[#11170f]/75 to-transparent" />
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div className="text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Guest experiences</p>
              <h2 className="mt-2 font-montserrat text-2xl font-semibold sm:text-3xl">Traveler reviews</h2>
            </div>
            <div className="flex shrink-0 gap-2">
            <button type="button" aria-label="Previous reviews" onClick={() => carouselRef.current?.scrollBy({ left: -carouselRef.current.clientWidth, behavior: "smooth" })} className="grid h-11 w-11 place-items-center rounded-full border border-white/50 bg-black/25 text-white transition hover:bg-white hover:text-[#283128] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <ArrowLeft size={19} />
            </button>
            <button type="button" aria-label="Next reviews" onClick={() => carouselRef.current?.scrollBy({ left: carouselRef.current.clientWidth, behavior: "smooth" })} className="grid h-11 w-11 place-items-center rounded-full border border-white/50 bg-black/25 text-white transition hover:bg-white hover:text-[#283128] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <ArrowRight size={19} />
            </button>
            </div>
          </div>
          <div ref={carouselRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {testimonials.map((testimonial) => (
              <article key={testimonial.id} className="flex min-h-[270px] w-[min(86vw,340px)] shrink-0 snap-start flex-col rounded-3xl border border-white/60 bg-white/95 p-5 text-[#283128] shadow-xl backdrop-blur-sm sm:min-h-[290px] sm:p-6 md:w-[calc((100%_-_3rem)_/_4)]">
                <div className="flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: testimonial.rating }, (_, index) => <Star key={index} className="h-4 w-4 fill-[#d7b85a] text-[#d7b85a]" />)}
                </div>
                {testimonial.title && <h2 className="mt-4 font-semibold">{testimonial.title}</h2>}
                <p className="mt-3 line-clamp-6 flex-1 text-sm leading-6 text-gray-600">“{testimonial.text}”</p>
                <div className="mt-5 border-t border-gray-200 pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{testimonial.country}</p>
                </div>
              </article>
            ))}
            {!testimonials.length && <p className="w-full rounded-3xl bg-white/95 p-8 text-center text-gray-600">Guest reviews will appear here.</p>}
          </div>
        </div>
      </section>

      {/* IMAGE + TEXT */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <img
                src={GatheringPhoto}
            alt="Kyrgyzstan nature"
            className="w-full h-[500px] object-cover rounded-3xl"
          />

          <div>
            <div className="inline-flex items-center gap-2 bg-[#c9cebd] rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-[#4a5c23] rounded-full" />
              <span className="text-sm font-medium">
                {t("Your Story Could Be Next")}
              </span>
            </div>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
              {t("Come experience")}
              <br />
              {t("Kyrgyzstan yourself.")}
            </h2>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              {t("Everyone experiences Kyrgyzstan differently. Some come for the mountains. Some come for the lakes. Others come to experience a culture unlike anywhere else.")}
            </p>

            <a
              href="/itineraries"
              className="inline-flex items-center gap-2 mt-8 bg-[#4A5C23] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#364518] transition-colors"
            >
              {t("Find Your Journey")}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto bg-[#17200f] rounded-[2rem] py-12 px-7 text-white md:py-16 md:px-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold">{t("Your story starts here.")}</h2>
              <p className="mt-5 max-w-xl text-lg text-white/70">
                {t("Discover Kyrgyzstan and create memories worth sharing.")}
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 mt-7 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                {t("Start Your Journey")}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
            {featuredTestimonial ? <blockquote className="border-l-2 border-[#d7b85a] pl-6 md:pl-8">
              <div className="mb-4 flex gap-1 text-[#d7b85a]" aria-label={`${featuredTestimonial?.rating || 5} out of 5 stars`}>
                {Array.from({ length: featuredTestimonial?.rating || 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-xl leading-relaxed md:text-2xl">“{featuredTestimonial.text}”</p>
              <footer className="mt-5 text-sm text-white/65">{featuredTestimonial.name} <span className="mx-1">·</span> {featuredTestimonial.country}</footer>
            </blockquote> : <div className="border-l-2 border-[#d7b85a] pl-6 md:pl-8"><p className="text-xl leading-relaxed md:text-2xl">Plan a trip around your interests, dates and preferred pace.</p></div>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
