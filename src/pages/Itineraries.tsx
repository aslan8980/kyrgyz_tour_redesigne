
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Star } from "lucide-react";

import Navigation from "../components/Navigation";
import PageHero from "../components/PageHero";
import { supabase } from "../lib/supabase";
import { usePublicTestimonials } from "../hooks/usePublicTestimonials";

import ThreeDays from "../assets/images/3-days.webp";
import FourDays from "../assets/images/4-days.webp";
import FiveDays from "../assets/images/5-days.webp";
import FourteenDays from "../assets/images/14-days.webp";
import ItinerariesHero from "../assets/images/site/hero/hero-itineraries.jpg";
import { useLanguage } from "../lib/language";

type Tour = {
  id: string;
  slug: string;
  title: string;
  duration: number;
  duration_label: string | null;
  location: string | null;
  main_image: string | null;
  short_description: string | null;
  description: string | null;
  highlights: string[] | null;
};

const localImages: Record<string, string> = {
  "3-days": ThreeDays,
  "4-days": FourDays,
  "5-days": FiveDays,
  "14-days": FourteenDays,
};

const Itineraries = () => {
  const { t } = useLanguage();
  const testimonials = usePublicTestimonials();
  const featuredTestimonial = testimonials[1] || testimonials[0];
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTours() {
      const { data, error } = await supabase
        .from("tours")
        .select(
          "id, slug, title, duration, duration_label, location, main_image, short_description, description, highlights"
        )
        .eq("status", "published")
        .order("duration", { ascending: true });

      if (!active) return;

      if (error) {
        console.error("Failed to load tours:", error.message);
        setError("We couldn't load the tours. Please try again later.");
      } else {
        setTours((data ?? []) as Tour[]);
      }

      setLoading(false);
    }

    loadTours();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      <PageHero
        image={ItinerariesHero}
        imageAlt="Mountain landscape in Kyrgyzstan"
        eyebrow={t("Our Journeys")}
        title={t("Discover Kyrgyzstan Your Way")}
        description={t("From short mountain escapes to unforgettable journeys across the country, choose the experience that fits your adventure.")}
      />

      {/* INTRO AND TOURS */}
      <section className="px-4 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-end gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#c9cebd] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#4a5c23]" />
                <span className="text-sm font-medium">
                  {t("Choose Your Adventure")}
                </span>
              </div>

              <h2 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
                {t("Journeys made for")}
                <br />
                {t("curious travelers.")}
              </h2>
            </div>

            <p className="max-w-xl text-lg leading-relaxed text-gray-600">
              {t("Every itinerary is designed to help you experience more than just the famous places. Discover landscapes, local traditions, mountain adventures and the people who make Kyrgyzstan special.")}
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {loading && (
              <p className="col-span-full py-12 text-center text-gray-500">
                {t("Loading journeys...")}
              </p>
            )}

            {error && (
              <p className="col-span-full py-12 text-center text-red-700">
                {error}
              </p>
            )}

            {!loading && !error && tours.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <h3 className="text-xl font-semibold">
                  {t("New journeys are coming soon")}
                </h3>
                <p className="mt-2 text-gray-600">
                  {t("Please check back later to discover our tours.")}
                </p>
              </div>
            )}

            {tours.map((tour) => (
              <Link
                key={tour.id}
                to={`/itineraries/${tour.slug}`}
                className="group block overflow-hidden rounded-3xl bg-[#f4f5f0] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4A5C23]/40"
                aria-label={`View journey: ${tour.title}`}
              >
                <div className="relative h-[250px] overflow-hidden sm:h-[270px] md:h-[285px]">
                  <img
                    src={tour.main_image || localImages[tour.slug] || FourteenDays}
                    alt={tour.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 backdrop-blur-md">
                    <Clock className="h-4 w-4 text-[#4A5C23]" />
                    <span className="text-sm font-semibold">
                      {tour.duration_label || `${tour.duration} Days`}
                    </span>
                  </span>
                </div>

                <div className="flex min-h-[285px] flex-col p-6 md:p-7">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 shrink-0 text-[#4A5C23]" />
                    {tour.location || t("Kyrgyzstan")}
                  </div>

                  <h3 className="mt-3 text-xl font-bold leading-snug text-[#17200f] transition-colors group-hover:text-[#4A5C23] md:text-2xl">
                    {tour.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600 md:text-base">
                    {tour.short_description || tour.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {(tour.highlights || []).map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full bg-white px-3 py-1.5 text-xs text-gray-600 md:text-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center gap-2 pt-6 font-semibold text-[#4A5C23]">
                    {t("View Journey")}
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO STRIP */}
      <section className="px-4 pb-20 md:px-8 md:pb-24">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-3 md:gap-4">
          <img
            src={ThreeDays}
            alt="Ala-Archa"
            className="h-[160px] w-full rounded-2xl object-cover md:h-[300px] md:rounded-3xl"
          />
          <img
            src={FourDays}
            alt="Issyk-Kul and Song-Kul"
            className="h-[160px] w-full rounded-2xl object-cover md:h-[300px] md:rounded-3xl"
          />
          <img
            src={FiveDays}
            alt="Karakol"
            className="h-[160px] w-full rounded-2xl object-cover md:h-[300px] md:rounded-3xl"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 md:px-8 md:pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#17200f] px-7 py-12 text-white md:px-14 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold md:text-5xl">
                Not sure which journey is right for you?
              </h2>

              <p className="mt-5 max-w-2xl text-lg text-white/70">
                Tell us what kind of experience you're looking for and we'll
                help you plan your perfect Kyrgyzstan adventure.
              </p>

              <Link
                to="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-gray-900 transition-colors hover:bg-gray-100"
              >
                Talk to Us
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <blockquote className="border-l-2 border-[#d7b85a] pl-6 md:pl-8">
              <div className="mb-4 flex gap-1 text-[#d7b85a]" aria-label={`${featuredTestimonial?.rating || 5} out of 5 stars`}>
                {Array.from({ length: featuredTestimonial?.rating || 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-xl leading-relaxed md:text-2xl">
                “{featuredTestimonial?.text || "Discover the places and culture that make every Kyrgyzstan journey unique."}”
              </p>
              <footer className="mt-5 text-sm text-white/65">{featuredTestimonial?.name || "Kyrgyz Tours"} <span className="mx-1">·</span> {featuredTestimonial?.country || "Traveler"}</footer>
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Itineraries;
