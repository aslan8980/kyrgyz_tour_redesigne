import Navigation from "../components/Navigation";

import Slide1 from "../assets/images/slide-1.webp";
import Slide2 from "../assets/images/slide-2.webp";
import Slide3 from "../assets/images/slide-3.webp";
import ThreeDays from "../assets/images/3-days.webp";
import FourDays from "../assets/images/4-days.webp";
import FiveDays from "../assets/images/5-days.webp";
import FourteenDays from "../assets/images/14-days.webp";

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
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Authenticity",
    text: "We believe the best way to discover Kyrgyzstan is to experience its real people, traditions, food and way of life.",
  },
  {
    icon: Mountain,
    title: "Adventure",
    text: "From high mountain passes to remote valleys, we create experiences that take you beyond the ordinary tourist route.",
  },
  {
    icon: Users,
    title: "Hospitality",
    text: "Our guests are more than customers. We want every traveler to feel welcomed, comfortable and connected.",
  },
  {
    icon: Globe2,
    title: "Responsible Travel",
    text: "We support local communities and promote respectful travel through Kyrgyzstan's natural and cultural heritage.",
  },
];

const advantages = [
  {
    icon: Compass,
    title: "Local Knowledge",
    text: "We know Kyrgyzstan beyond the standard tourist routes and help you discover places worth remembering.",
  },
  {
    icon: Sparkles,
    title: "Personal Experiences",
    text: "Our trips can be adapted to your interests, schedule, travel style and level of adventure.",
  },
  {
    icon: Users,
    title: "Local Connections",
    text: "We connect travelers with local guides, guesthouses, drivers, families and communities.",
  },
  {
    icon: ShieldCheck,
    title: "Travel With Confidence",
    text: "We take care of the important details so you can focus on enjoying your journey.",
  },
];

const stats = [
  {
    number: "1,500+",
    label: "Travelers welcomed",
  },
  {
    number: "25+",
    label: "Destinations",
  },
  {
    number: "40+",
    label: "Travel experiences",
  },
  {
    number: "15+",
    label: "Local partners",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      {/* HERO */}
      <section className="relative min-h-[700px] flex items-center overflow-hidden">
        <img
          src={Slide1}
          alt="Kyrgyzstan mountains"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 pt-28">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-[#d7b85a] rounded-full" />
              <span className="text-sm font-medium">
                About Kyrgyz Tours
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              We Bring You
              <br />
              Closer to Kyrgyzstan
            </h1>

            <p className="mt-7 text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
              We create unforgettable journeys through the mountains,
              lakes, valleys and nomadic culture of one of Central Asia's
              most extraordinary countries.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="/itineraries"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-3.5 rounded-full font-semibold hover:bg-[#f0f1eb] transition-colors"
              >
                Explore Our Tours
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/70 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Start Your Journey
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#c9cebd] rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-[#4a5c23] rounded-full" />
                <span className="text-sm font-medium">Our Story</span>
              </div>

              <h2 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
                Born in the mountains,
                <br />
                made for explorers.
              </h2>

              <div className="mt-7 space-y-5 text-gray-600 text-lg leading-relaxed">
                <p>
                  Kyrgyz Tours was created from a simple idea:{" "}
                  <span className="font-semibold text-gray-900">
                    Kyrgyzstan deserves to be discovered.
                  </span>
                </p>

                <p>
                  What started as a small local team with a passion for
                  our country's mountains, lakes and nomadic culture grew
                  into a travel company focused on creating authentic
                  experiences for travelers from around the world.
                </p>

                <p>
                  We believe that traveling through Kyrgyzstan is not
                  simply about visiting beautiful places. It is about
                  drinking tea in a yurt, meeting local families, riding
                  through mountain valleys, waking up beside a mountain
                  lake and experiencing a culture that has remained deeply
                  connected to its traditions.
                </p>

                <p>
                  Our goal is to make those experiences accessible,
                  comfortable and unforgettable.
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
                  src={Slide2}
                  alt="Kyrgyzstan landscape"
                  className="w-full h-[340px] object-cover rounded-3xl"
                />
              </div>

              <div>
                <img
                  src={Slide3}
                  alt="Kyrgyzstan nature"
                  className="w-full h-[340px] object-cover rounded-3xl"
                />
              </div>

              <div className="col-span-2">
                <img
                  src={FourDays}
                  alt="Travel in Kyrgyzstan"
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
            <span className="text-sm font-medium">Our Mission</span>
          </div>

          <h2 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
            To show the world
            <br />
            the real Kyrgyzstan.
          </h2>

          <p className="mt-7 text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We want every traveler who visits Kyrgyzstan to leave with
            more than photographs. We want them to leave with stories,
            friendships, memories and a genuine connection to our country.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#c9cebd] rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-[#4a5c23] rounded-full" />
              <span className="text-sm font-medium">What We Believe In</span>
            </div>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold">
              Our Values
            </h2>

            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              These principles shape every journey we create and every
              traveler we welcome.
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
              <span className="text-sm font-medium">By The Numbers</span>
            </div>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold">
              Our Journey So Far
            </h2>

            <p className="mt-5 text-lg text-gray-600">
              Every number represents people, places and memories that
              have become part of our story.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-14">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#f4f5f0] rounded-3xl p-7 md:p-10 text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#4A5C23]">
                  {stat.number}
                </div>

                <p className="mt-3 text-gray-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO STORY */}
      <section className="py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 md:col-span-7">
              <img
                src={FiveDays}
                alt="Kyrgyzstan mountains"
                className="w-full h-[420px] md:h-[560px] object-cover rounded-3xl"
              />
            </div>

            <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-4 md:gap-6">
              <img
                src={ThreeDays}
                alt="Ala-Archa"
                className="w-full h-[260px] md:h-full object-cover rounded-3xl"
              />

              <img
                src={FourteenDays}
                alt="Discover Kyrgyzstan"
                className="w-full h-[260px] md:h-full object-cover rounded-3xl"
              />
            </div>
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
                  What's Next
                </span>
              </div>

              <h2 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
                We are just
                <br />
                getting started.
              </h2>

              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Our vision goes beyond organizing tours. We are building
                a complete way for travelers to discover Kyrgyzstan —
                from finding the perfect destination to planning an
                entire journey.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-[#4A5C23] rounded-full mt-2.5 shrink-0" />
                  <p className="text-gray-700">
                    Expand our network of local guides and partners.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-[#4A5C23] rounded-full mt-2.5 shrink-0" />
                  <p className="text-gray-700">
                    Create more unique and personalized travel experiences.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-[#4A5C23] rounded-full mt-2.5 shrink-0" />
                  <p className="text-gray-700">
                    Build a smart travel platform for discovering Kyrgyzstan.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-[#4A5C23] rounded-full mt-2.5 shrink-0" />
                  <p className="text-gray-700">
                    Welcome travelers from more countries around the world.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={Slide3}
                alt="Future of travel in Kyrgyzstan"
                className="w-full h-[550px] object-cover rounded-3xl"
              />

              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-6">
                <p className="text-sm text-gray-500">
                  Our vision
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  Make Kyrgyzstan easier to discover, one journey at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[2rem]">
          <img
            src={Slide2}
            alt="Kyrgyzstan"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 py-24 px-6 md:px-12 text-center text-white">
            <h2 className="text-4xl md:text-6xl font-bold">
              Your Kyrgyzstan
              <br />
              adventure starts here.
            </h2>

            <p className="max-w-2xl mx-auto mt-6 text-lg text-white/85">
              Explore breathtaking landscapes, experience nomadic culture
              and create memories that stay with you long after the journey.
            </p>

            <a
              href="/itineraries"
              className="inline-flex items-center gap-2 mt-9 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Our Itineraries
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;