import { useEffect, useState } from "react";
import { testSupabaseConnection } from "../lib/testSupabase";



import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Welcome from "../components/Welcome";
import ImageCard from "@/components/ImageCard";

import BlogSection from "../components/BlogSection";
import Testimonials from "./Testimonials";
import Contact from "./Contact us";
import { supabase } from "../lib/supabase";

import { itinerariesCard } from "../data";
import { useLanguage } from "../lib/language";
import { isPublicTourContent } from "../lib/tourContent";

const Index = () => {
  const { t } = useLanguage();
  const [homeTours, setHomeTours] = useState<{ id: string; slug: string; title: string; main_image: string | null }[]>([]);
  const [homeToursLoaded, setHomeToursLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.from("tours")
      .select("id,slug,title,main_image")
      .eq("status", "published")
      .eq("show_on_home", true)
      .order("duration", { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error("Failed to load seasonal tours:", error.message);
        else {
          setHomeTours((data ?? []).filter(isPublicTourContent));
          setHomeToursLoaded(true);
        }
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    // Page title
    document.title = "Kyrgyz Tours — Discover Kyrgyzstan";

    // Meta description
    let descriptionTag = document.querySelector(
      "meta[name='description']"
    );

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute(
      "content",
      "Discover Kyrgyzstan through unforgettable journeys, breathtaking mountains, crystal-clear lakes and unique nomadic culture."
    );

    // Canonical URL
    let canonicalTag = document.querySelector(
      "link[rel='canonical']"
    );

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }

    canonicalTag.setAttribute(
      "href",
      window.location.origin + "/"
    );
  }, []);


  useEffect(() => {
  testSupabaseConnection();
}, []);



  return (
    <div
      id="home"
      className="min-h-screen overflow-hidden"
    >
      {/* Navigation */}
      <Navigation />

      {/* Hero */}
      <Hero />

      {/* About */}
      <section id="about">
        <Welcome />
      </section>

      {/* Itineraries */}
      <section
        id="itineraries"
        className="kt-section-blend relative bg-[#f5f6f1] py-14 text-[#283128] md:py-16"
      >
        <div className="container mx-auto px-4">

          {/* Section heading */}
          <div className="mb-8 text-center md:mb-10">
            <h2 className="font-AlbertSans text-4xl font-bold text-[#283128]">
              {t("Journeys through Kyrgyzstan")}
            </h2>
          </div>

          {/* Itinerary cards */}
          <ImageCard arr={homeToursLoaded && homeTours.length > 0
            ? homeTours.map((tour) => ({
              id: tour.id,
              img: tour.main_image || itinerariesCard.find((item) => item.url.endsWith(`/${tour.slug}`))?.img || itinerariesCard[0].img,
              title: tour.title,
              url: `/itineraries/${tour.slug}`,
            }))
            : itinerariesCard} />

        </div>
      </section>

      {/* Blog */}
      <section id="blog">
        <BlogSection />
      </section>

      {/* Testimonials */}
      <section id="testimonials">
        <Testimonials />
      </section>

      {/* Contact */}
      <Contact />

      </div>
  );
};

export default Index;
