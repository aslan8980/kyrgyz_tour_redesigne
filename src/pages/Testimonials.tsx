import Navigation from "../components/Navigation";
import PageHero from "../components/PageHero";
import { ArrowRight, Quote, Star } from "lucide-react";
import { usePublicTestimonials } from "../hooks/usePublicTestimonials";

import TestimonialsHero from "../assets/images/site/hero/hero-testimonials.jpg";
import GatheringPhoto from "../assets/images/site/editorial/testimonial-gathering.jpg";
import ReflectionPhoto from "../assets/images/site/editorial/testimonial-reflection.jpg";
import { useLanguage } from "../lib/language";

const Testimonials = () => {
  const { t } = useLanguage();
  const testimonials = usePublicTestimonials();
  const featuredTestimonial = testimonials[1] || testimonials[0];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      <PageHero
        image={TestimonialsHero}
        imageAlt="Travelers and a Kyrgyz guide celebrating on a mountain ridge"
        eyebrow={t("Traveler Stories")}
        title={t("Stories From The Journey")}
        description={t("Traveling is about more than places. It is about the people you meet, the memories you create and the stories you take home with you.")}
      />

      {/* INTRO */}
      <section className="py-12 px-4 md:px-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#c9cebd] rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-[#4a5c23] rounded-full" />
            <span className="text-sm font-medium">
              {t("Voices From The Road")}
            </span>
          </div>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold">
            {t("Why people remember Kyrgyzstan")}
          </h2>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            {t("The mountains may be what brings travelers here, but the experiences, people and culture are what make them want to return.")}
          </p>
        </div>
      </section>

      {/* FEATURED QUOTE */}
      <section className="px-4 pb-12 md:px-8 md:pb-16">
        <div className="max-w-7xl mx-auto bg-[#17200f] rounded-[2rem] overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[420px]">
              <img
                src={ReflectionPhoto}
                alt="Issyk-Kul and Song-Kul"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/25" />
            </div>

            <div className="p-8 md:p-10 lg:p-12 text-white flex flex-col justify-center">
              <Quote className="w-12 h-12 text-[#d7b85a]" />

              <p className="mt-7 text-2xl md:text-3xl font-medium leading-relaxed">
                “{featuredTestimonial?.text || "Discover the places and culture that make every Kyrgyzstan journey unique."}”
              </p>

              <div className="mt-8">
                <p className="font-bold">{featuredTestimonial?.name || "Kyrgyz Tours"}</p>
                <p className="text-white/60 mt-1">
                  {featuredTestimonial?.country || "Traveler"} · Traveler
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL CARDS */}
      <section className="bg-[#f4f5f0] py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-[#4a5c23] rounded-full" />
              <span className="text-sm font-medium">
                {t("Traveler Experiences")}
              </span>
            </div>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold">
              {t("Every journey is different.")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="bg-white rounded-3xl p-7 md:p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }, (_, index) => (
                    <Star
                      key={index}
                      className="w-4 h-4 fill-[#d7b85a] text-[#d7b85a]"
                    />
                  ))}
                </div>

                {testimonial.title && <h3 className="mt-5 font-semibold text-gray-900">{testimonial.title}</h3>}
                <p className="mt-4 text-gray-600 leading-relaxed text-lg">
                  “{testimonial.text}”
                </p>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="font-bold text-gray-900">
                    {testimonial.name}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {testimonial.country}
                  </p>
                </div>
              </article>
            ))}
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
            <blockquote className="border-l-2 border-[#d7b85a] pl-6 md:pl-8">
              <div className="mb-4 flex gap-1 text-[#d7b85a]" aria-label={`${featuredTestimonial?.rating || 5} out of 5 stars`}>
                {Array.from({ length: featuredTestimonial?.rating || 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-xl leading-relaxed md:text-2xl">“{featuredTestimonial?.text || "Discover the places and culture that make every Kyrgyzstan journey unique."}”</p>
              <footer className="mt-5 text-sm text-white/65">{featuredTestimonial?.name || "Kyrgyz Tours"} <span className="mx-1">·</span> {featuredTestimonial?.country || "Traveler"}</footer>
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
