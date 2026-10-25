import Navigation from "../components/Navigation";
import { ArrowRight, Quote, Star } from "lucide-react";

import Slide1 from "../assets/images/slide-1.webp";
import Slide3 from "../assets/images/slide-3.webp";
import FourDays from "../assets/images/4-days.webp";

const testimonials = [
  {
    name: "Alex",
    country: "Germany",
    text: "Kyrgyzstan surprised me with its incredible mountains, beautiful lakes and warm hospitality.",
  },
  {
    name: "Sofia",
    country: "Italy",
    text: "The landscapes were unforgettable. From the mountains to Issyk-Kul, every day felt like a new adventure.",
  },
  {
    name: "Daniel",
    country: "United Kingdom",
    text: "A completely different travel experience. The nature, culture and nomadic traditions were amazing.",
  },
  {
    name: "Emma",
    country: "France",
    text: "The combination of mountains, lakes and nomadic culture made this one of my favorite trips.",
  },
  {
    name: "Michael",
    country: "United States",
    text: "Kyrgyzstan feels incredibly authentic. The landscapes and hospitality were unforgettable.",
  },
  {
    name: "Anna",
    country: "Poland",
    text: "A beautiful country with incredible nature. I would definitely come back again.",
  },
];

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      {/* HERO */}
      <section className="relative min-h-[620px] flex items-center overflow-hidden">
        <img
          src={Slide1}
          alt="Kyrgyzstan mountains"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 pt-28">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-[#d7b85a] rounded-full" />
              <span className="text-sm font-medium">
                Traveler Stories
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Stories From
              <br />
              The Journey
            </h1>

            <p className="mt-7 text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
              Traveling is about more than places. It is about the people
              you meet, the memories you create and the stories you take
              home with you.
            </p>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#c9cebd] rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-[#4a5c23] rounded-full" />
            <span className="text-sm font-medium">
              Voices From The Road
            </span>
          </div>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold">
            Why people remember Kyrgyzstan
          </h2>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            The mountains may be what brings travelers here, but the
            experiences, people and culture are what make them want to
            return.
          </p>
        </div>
      </section>

      {/* FEATURED QUOTE */}
      <section className="px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto bg-[#17200f] rounded-[2rem] overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[420px]">
              <img
                src={FourDays}
                alt="Issyk-Kul and Song-Kul"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/25" />
            </div>

            <div className="p-10 md:p-14 lg:p-16 text-white flex flex-col justify-center">
              <Quote className="w-12 h-12 text-[#d7b85a]" />

              <p className="mt-7 text-2xl md:text-3xl font-medium leading-relaxed">
                “The landscapes were unforgettable. Every day felt like
                discovering a completely different world.”
              </p>

              <div className="mt-8">
                <p className="font-bold">Sofia</p>
                <p className="text-white/60 mt-1">
                  Italy · Traveler
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
                Traveler Experiences
              </span>
            </div>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold">
              Every journey is different.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {testimonials.map((testimonial) => (
              <article
                key={`${testimonial.name}-${testimonial.country}`}
                className="bg-white rounded-3xl p-7 md:p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-[#d7b85a] text-[#d7b85a]"
                    />
                  ))}
                </div>

                <p className="mt-7 text-gray-600 leading-relaxed text-lg">
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
            src={Slide3}
            alt="Kyrgyzstan nature"
            className="w-full h-[500px] object-cover rounded-3xl"
          />

          <div>
            <div className="inline-flex items-center gap-2 bg-[#c9cebd] rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-[#4a5c23] rounded-full" />
              <span className="text-sm font-medium">
                Your Story Could Be Next
              </span>
            </div>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
              Come experience
              <br />
              Kyrgyzstan yourself.
            </h2>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Everyone experiences Kyrgyzstan differently. Some come for
              the mountains. Some come for the lakes. Others come to
              experience a culture unlike anywhere else.
            </p>

            <a
              href="/itineraries"
              className="inline-flex items-center gap-2 mt-8 bg-[#4A5C23] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#364518] transition-colors"
            >
              Find Your Journey
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto bg-[#17200f] rounded-[2rem] py-20 px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold">
            Your story starts here.
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/70">
            Discover Kyrgyzstan and create memories worth sharing.
          </p>

          <a
            href="/contact"
            className="inline-flex items-center gap-2 mt-8 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;