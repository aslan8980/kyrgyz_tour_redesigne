import { useEffect } from "react";
import { testSupabaseConnection } from "../lib/testSupabase";



import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Welcome from "../components/Welcome";
import ImageCard from "@/components/ImageCard";

import Gallery from "./Gallery";
import Testimonials from "./Testimonials";
import Contact from "./Contact us";

import { itinerariesCard } from "../data";

const Index = () => {
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
        className="kt-section-blend relative py-[120px] bg-[#10120f] bg-cover bg-no-repeat bg-center text-white"
      >
        <div className="container mx-auto px-4">

          {/* Section heading */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 mx-auto">
              <h3 className="font-AlbertSans font-semibold text-white flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-[#4a5c23] rounded-full"></span>
                Kyrgyzstan Itineraries
              </h3>
            </div>

            <h2 className="font-AlbertSans text-4xl md:text-4xl font-bold text-white mt-3">
              Explore Kyrgyzstan with Expert-Planned Journeys
            </h2>
          </div>

          {/* Itinerary cards */}
          <ImageCard arr={itinerariesCard} />

        </div>
      </section>

      {/* Gallery */}
      <section id="gallery">
        <Gallery />
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