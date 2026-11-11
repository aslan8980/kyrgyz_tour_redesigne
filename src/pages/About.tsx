import { useEffect, useRef, useState } from "react";
import Navigation from "../components/Navigation";
import PageHero from "../components/PageHero";
import { usePublicTestimonials } from "../hooks/usePublicTestimonials";

import Slide1 from "../assets/images/slide-1.webp";
import AboutHospitality from "../assets/images/site/editorial/about-hospitality.jpg";
import AboutTrail from "../assets/images/site/editorial/about-alpine-trail.jpg";
import AboutJourney from "../assets/images/site/editorial/about-journey.jpg";
import AboutShepherd from "../assets/images/site/editorial/about-shepherd.jpg";

import {
  ArrowRight,
  Heart,
  Mountain,
  Users,
  Globe2,
  Compass,
  ShieldCheck,
  Sparkles,
  MapPin,
  Star,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Cultural respect",
    text: "We introduce local customs and traditions with context, and encourage visitors to approach each community with curiosity and respect.",
  },
  {
    icon: Mountain,
    title: "Time outdoors",
    text: "Our routes make room for the landscapes that draw many visitors here: mountain valleys, alpine lakes and open highland pastures.",
  },
  {
    icon: Users,
    title: "A human welcome",
    text: "Travel is better when there is time to meet people, share a meal and learn about life in the places you visit.",
  },
  {
    icon: Globe2,
    title: "Responsible travel",
    text: "We encourage considerate travel that respects local communities, customs and the natural places along the route.",
  },
];

const advantages = [
  {
    icon: Compass,
    title: "Routes with context",
    text: "Each tour page brings together its route, duration, location and day-by-day plan so you can understand what the trip involves.",
  },
  {
    icon: Sparkles,
    title: "Direct answers",
    text: "Ask us about dates, availability, trip pace or practical details before you decide which route to book.",
  },
  {
    icon: Users,
    title: "Useful planning",
    text: "Compare shorter and longer itineraries, then send us your dates and group size to discuss the arrangements.",
  },
  {
    icon: ShieldCheck,
    title: "Clear booking steps",
    text: "A request is not a confirmed booking. We check availability and confirm the final price and arrangements with you first.",
  },
];

const stats = [
  {
    number: "3 days",
    label: "Bishkek & Ala-Archa",
  },
  {
    number: "4 days",
    label: "Issyk-Kul & Song-Kul",
  },
  {
    number: "5 days",
    label: "Winter in Karakol",
  },
  {
    number: "14 days",
    label: "A wider journey across Kyrgyzstan",
  },
];

const CountUp = ({ value }: { value: string }) => {
  const target = Number(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9,]/g, "");
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || started.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      observer.disconnect();

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        setCount(target);
        return;
      }

      const duration = 1400;
      const startTime = performance.now();
      let frameId = 0;
      const animate = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(target * eased));
        if (progress < 1) frameId = requestAnimationFrame(animate);
      };
      frameId = requestAnimationFrame(animate);
    }, { threshold: 0.35 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString("en-US")}{suffix}</span>;
};

const About = () => {
  const testimonials = usePublicTestimonials();
  const featuredTestimonial = testimonials[1] || testimonials[0];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      <PageHero
        image={Slide1}
        imageAlt="A Kyrgyz eagle hunter riding across a mountain valley"
        eyebrow="About Kyrgyz Tours"
        title="Local journeys through Kyrgyzstan"
        description="Explore the country through thoughtfully planned routes, mountain landscapes and encounters with everyday Kyrgyz culture. Choose a ready-made itinerary or contact us to discuss your plans."
      >
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="/itineraries"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-3.5 rounded-full font-semibold hover:bg-[#f0f1eb] transition-colors"
              >
                Browse our tours
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/70 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Plan your trip
              </a>
            </div>
      </PageHero>

      {/* OUR STORY */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#c9cebd] rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-[#4a5c23] rounded-full" />
                <span className="text-sm font-medium">Who we are</span>
              </div>

              <h2 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
                Based in Bishkek,
                <br />
                here to help you explore.
              </h2>

              <div className="mt-7 space-y-5 text-gray-600 text-lg leading-relaxed">
                <p>
                  Kyrgyz Tours is a Bishkek-based travel company with a simple focus:{" "}
                  <span className="font-semibold text-gray-900">
                    making it easier to plan a trip around Kyrgyzstan.
                  </span>
                </p>

                <p>
                  We bring routes, destinations and practical travel details together so visitors can compare options and contact us about the journey that suits them.
                </p>

                <p>
                  A trip here can include city life, mountain trails, lakeside stops and time in a yurt. Each itinerary explains what is planned; the final arrangements are confirmed with you before the trip.
                </p>

                <p>
                  Tell us your dates, group size and interests, and we can help you understand which published route may fit.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3 text-[#4A5C23] font-semibold">
                <MapPin className="w-5 h-5" />
                Bishkek, Kyrgyzstan
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="pt-12">
                <img
                  src={AboutHospitality}
                  alt="Kyrgyz family welcoming visitors inside a yurt"
                  className="w-full h-[340px] object-cover rounded-3xl"
                />
              </div>

              <div>
                <img
                  src={AboutTrail}
                  alt="A trail through a Kyrgyz alpine valley"
                  className="w-full h-[340px] object-cover rounded-3xl"
                />
              </div>

              <div className="col-span-2">
                <img
                  src={AboutShepherd}
                  alt="A Kyrgyz shepherd and flock in a mountain pasture"
                  className="w-full h-[240px] object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-[#f4f5f0] py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-[#4a5c23] rounded-full" />
            <span className="text-sm font-medium">What to expect</span>
          </div>

          <h2 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
            Travel at your own pace,
            <br />
            discover Kyrgyzstan.
          </h2>

          <p className="mt-7 text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Compare routes, ask questions and confirm the details directly with our team before you book. We aim to make planning clear while leaving room for the people and places you meet along the way.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#c9cebd] rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-[#4a5c23] rounded-full" />
            <span className="text-sm font-medium">How we work</span>
            </div>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold">
              A thoughtful way to travel
            </h2>

            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              Clear itineraries, local context and direct communication help you plan with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="group border border-gray-100 rounded-3xl p-7 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#4A5C23] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="mt-7 text-xl font-bold">
                    {value.title}
                  </h3>

                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {value.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-[#17200f] text-white py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-[#d7b85a] rounded-full" />
                <span className="text-sm font-medium">
                  Why Kyrgyz Tours
                </span>
              </div>

              <h2 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
                Travel deeper.
                <br />
                Experience more.
              </h2>

              <p className="mt-6 text-white/70 text-lg leading-relaxed max-w-xl">
                Kyrgyzstan is not a destination you simply check off a
                list. It is a country you experience. That's why we focus
                on meaningful journeys instead of ordinary sightseeing.
              </p>

              <a
                href="/itineraries"
                className="inline-flex items-center gap-2 mt-8 bg-white text-gray-900 px-7 py-3.5 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Discover Our Tours
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {advantages.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="border border-white/10 bg-white/5 rounded-3xl p-7"
                  >
                    <Icon className="w-7 h-7 text-[#d7b85a]" />

                    <h3 className="mt-6 text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-white/65 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#c9cebd] rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-[#4a5c23] rounded-full" />
              <span className="text-sm font-medium">Choose your trip length</span>
            </div>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold">
              Routes from a few days to two weeks
            </h2>

            <p className="mt-5 text-lg text-gray-600">
              Start with a short stay near Bishkek, focus on the alpine lakes, visit Karakol in winter or explore more of the country on a longer itinerary.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-14">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#f4f5f0] rounded-3xl p-7 md:p-10 text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#4A5C23]">
                  <CountUp value={stat.number} />
                </div>

                <p className="mt-3 text-gray-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FUTURE */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#c9cebd] rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-[#4a5c23] rounded-full" />
                <span className="text-sm font-medium">
                  Plan with clear details
                </span>
              </div>

              <h2 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
                Know the route
                <br />
                before you book.
              </h2>

              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Review the itinerary, check the price and send us your preferred dates. We will confirm availability and the final arrangements with you.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-[#4A5C23] rounded-full mt-2.5 shrink-0" />
                  <p className="text-gray-700">
                    Choose the route and travel dates that suit your plans.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-[#4A5C23] rounded-full mt-2.5 shrink-0" />
                  <p className="text-gray-700">
                    Tell us about your group size and travel preferences.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-[#4A5C23] rounded-full mt-2.5 shrink-0" />
                  <p className="text-gray-700">
                    Ask about accommodation, transport and what is included.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-[#4A5C23] rounded-full mt-2.5 shrink-0" />
                  <p className="text-gray-700">
                    Confirm availability and payment arrangements with our team.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={AboutJourney}
                alt="Future of travel in Kyrgyzstan"
                className="w-full h-[550px] object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[2rem]">
          <div className="relative z-10 rounded-[2rem] bg-[#17200f] py-12 px-7 text-white md:py-16 md:px-14">
            <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
              <div className="text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Ready to explore Kyrgyzstan?
                </h2>

                <p className="max-w-2xl mt-5 text-lg text-white/75">
                  Browse the itineraries or get in touch with your dates and questions. We will help you take the next step.
                </p>

                <a
                  href="/itineraries"
                  className="inline-flex items-center gap-2 mt-7 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Browse itineraries
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              <blockquote className="border-l-2 border-[#d7b85a] pl-6 md:pl-8">
                {featuredTestimonial && <div className="mb-4 flex gap-1 text-[#d7b85a]" aria-label={`${featuredTestimonial.rating} out of 5 stars`}>
                  {Array.from({ length: featuredTestimonial.rating }, (_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>}
                {featuredTestimonial ? (
                  <>
                    <p className="text-xl leading-relaxed md:text-2xl">“{featuredTestimonial.text}”</p>
                    <footer className="mt-5 text-sm text-white/65">{featuredTestimonial.name} <span className="mx-1">·</span> {featuredTestimonial.country}</footer>
                  </>
                ) : (
                  <>
                    <p className="text-xl leading-relaxed md:text-2xl">A clear route, practical trip details and a direct way to ask questions before you book.</p>
                    <footer className="mt-5 text-sm text-white/65">Kyrgyz Tours · Bishkek</footer>
                  </>
                )}
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
