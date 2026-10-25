
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Instagram,
  MapPin,
} from "lucide-react";
import Logo from "../assets/images/logo1.webp";

const Footer = () => {
  return (
    <footer className="bg-[#f4f5f0] text-[#17200f]">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 border-b border-[#17200f]/10 py-14 md:grid-cols-2 md:py-16 lg:grid-cols-[1.5fr_0.8fr_0.8fr] lg:gap-20">
          {/* BRAND */}
          <div>
            <Link
  to="/"
  className="inline-flex self-start -mt-2 rounded-xl p-2.5"
  aria-label="Kyrgyz Tours home"
>
  <img
    src={Logo}
    alt="Kyrgyz Tours"
    className="w-[200px] h-[90px] object-contain object-left"
  />
</Link>

            <h2 className="mt-7 max-w-md text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Find your own way
              <br />
              through Kyrgyzstan.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-gray-600 md:text-base">
              Mountain trails, alpine lakes and unforgettable encounters
              with the culture of the Silk Road.
            </p>

            <Link
              to="/itineraries"
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#4a5c23] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#35451a]"
            >
              Explore our tours
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* DISCOVER */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Discover
            </h3>

            <ul className="mt-6 space-y-4">
              {[
                { label: "About us", to: "/about" },
                { label: "Our itineraries", to: "/itineraries" },
                { label: "Gallery", to: "/gallery" },
                { label: "Explore the map", to: "/map" },
                { label: "Saved tours", to: "/saved" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-gray-600 transition hover:text-[#4a5c23]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Get in touch
            </h3>

            <p className="mt-6 max-w-xs text-sm leading-6 text-gray-600">
              Planning a trip or need help choosing an itinerary? Let's talk.
            </p>

            <Link
              to="/contact"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-[#4a5c23] transition hover:text-[#17200f]"
            >
              Contact us
              <ArrowUpRight size={17} />
            </Link>

            <div className="mt-8 space-y-4 border-t border-[#17200f]/10 pt-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin size={17} className="shrink-0 text-[#4a5c23]" />
                Bishkek, Kyrgyzstan
              </div>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-sm text-gray-600 transition hover:text-[#4a5c23]"
              >
                <Instagram size={17} className="text-[#4a5c23]" />
                Instagram
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col gap-3 py-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Kyrgyz Tours. All rights reserved.</p>

          <p>Made for curious travelers.</p>

          <Link
            to="/contact"
            className="transition hover:text-[#4a5c23]"
          >
            Get in touch ↗
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
