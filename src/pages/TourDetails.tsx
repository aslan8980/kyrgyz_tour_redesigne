import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Heart,
  Languages,
  MapPin,
  MessageCircle,
  Minus,
  Mountain,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";

import Navigation from "../components/Navigation";
import { supabase } from "../lib/supabase";

import ThreeDays from "../assets/images/3-days.webp";
import FourDays from "../assets/images/4-days.webp";
import FiveDays from "../assets/images/5-days.webp";
import FourteenDays from "../assets/images/14-days.webp";

type Currency = "USD" | "EUR" | "KGS";

type TourDay = {
  day: number;
  title: string;
  description: string;
};

type Tour = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  duration: number;
  durationLabel: string;
  location: string;
  difficulty: string;
  price: number;
  currency: string;
  image: string;
  gallery: string[];
  highlights: string[];
  days: TourDay[];
  included: string[];
  excluded: string[];
};

type DatabaseTour = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  duration: number;
  duration_label: string | null;
  location: string | null;
  difficulty: string | null;
  price: number | string;
  currency: string;
  main_image: string | null;
  gallery: unknown;
  highlights: unknown;
  itinerary: unknown;
  included_services: unknown;
  excluded_services: unknown;
};

const LOCAL_IMAGES: Record<string, string> = {
  "3-days": ThreeDays,
  "4-days": FourDays,
  "5-days": FiveDays,
  "14-days": FourteenDays,
};

const FAVORITES_KEY = "kyrgyz-tours-favorites";

const CURRENCY_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 1,
  KGS: 87,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  KGS: "сом",
};

const DEMO_REVIEWS = [
  {
    name: "Emily",
    country: "United Kingdom",
    date: "Example review",
    rating: 5,
    title: "An unforgettable mountain adventure",
    text: "This is fictional placeholder feedback for layout preview. Replace it with a genuine customer review before publishing.",
    initials: "E",
  },
  {
    name: "Marco",
    country: "Italy",
    date: "Example review",
    rating: 5,
    title: "Beautiful places and a great experience",
    text: "This is fictional placeholder feedback for layout preview. Replace it with a genuine customer review before publishing.",
    initials: "M",
  },
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function parseItinerary(value: unknown): TourDay[] {
  if (!Array.isArray(value)) return [];

  return value.map((raw, index) => {
    const item = (raw ?? {}) as Record<string, unknown>;
    const dayValue = item.day;
    const dayNumber =
      typeof dayValue === "number"
        ? dayValue
        : Number(String(dayValue ?? "").match(/\d+/)?.[0]) || index + 1;

    return {
      day: dayNumber,
      title: typeof item.title === "string" ? item.title : `Day ${dayNumber}`,
      description:
        typeof item.description === "string" ? item.description : "",
    };
  });
}

function parseGallery(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function mapTour(row: DatabaseTour): Tour {
  const fallbackImage = LOCAL_IMAGES[row.slug] || FourteenDays;
  const gallery = parseGallery(row.gallery);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description || row.description || "",
    description: row.description || row.short_description || "",
    duration: Number(row.duration) || 1,
    durationLabel: row.duration_label || `${row.duration} Days`,
    location: row.location || "Kyrgyzstan",
    difficulty: row.difficulty || "To be confirmed",
    price: Number(row.price) || 0,
    currency: (row.currency || "EUR").toUpperCase(),
    image: row.main_image || fallbackImage,
    gallery: gallery.length ? gallery : [row.main_image || fallbackImage],
    highlights: stringArray(row.highlights),
    days: parseItinerary(row.itinerary),
    included: stringArray(row.included_services),
    excluded: stringArray(row.excluded_services),
  };
}

function getSavedTours(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const value: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function formatPrice(amount: number, currency: Currency): string {
  if (currency === "KGS") {
    return `${Math.round(amount).toLocaleString("en-US")} сом`;
  }

  return `${CURRENCY_SYMBOLS[currency]}${amount.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
}

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isFutureOrToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

const TourDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [savedTours, setSavedTours] = useState<string[]>(getSavedTours);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [guideContactOpen, setGuideContactOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadTours() {
      setLoading(true);
      const { data, error } = await supabase
        .from("tours")
        .select(
          "id, slug, title, short_description, description, duration, duration_label, location, difficulty, price, currency, main_image, gallery, highlights, itinerary, included_services, excluded_services"
        )
        .eq("status", "published")
        .order("duration", { ascending: true });

      if (!active) return;

      if (error) {
        console.error("Failed to load tours:", error.message);
        setLoadError("We couldn't load this tour. Please try again later.");
        setAllTours([]);
      } else {
        setAllTours(((data || []) as DatabaseTour[]).map(mapTour));
        setLoadError("");
      }
      setLoading(false);
    }

    loadTours();

    return () => {
      active = false;
    };
  }, []);

  const tour = useMemo(
    () => allTours.find((item) => item.slug === id),
    [allTours, id]
  );

  const isSaved = Boolean(tour && savedTours.includes(tour.slug));
  const price = tour?.price ?? 0;
  const priceCurrency: Currency =
    tour?.currency === "EUR" || tour?.currency === "KGS" ? tour.currency : "USD";

  const galleryImages = useMemo(() => {
    if (!tour) return [];
    return Array.from(new Set([tour.image, ...tour.gallery].filter(Boolean)));
  }, [tour]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allTours.slice(0, 4);
    return allTours
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [allTours, searchQuery]);

  const toggleFavorite = () => {
  if (!tour) return;

  const next = isSaved
    ? savedTours.filter((slug) => slug !== tour.slug)
    : [...savedTours, tour.slug];

  setSavedTours(next);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));

  window.dispatchEvent(new Event("favorites-updated"));

  setNotice(
    isSaved
      ? "Removed from saved tours."
      : "Tour saved to favorites."
  );
};

  const changeGallery = (direction: number) => {
    if (galleryImages.length < 2) return;
    setGalleryIndex(
      (current) =>
        (current + direction + galleryImages.length) % galleryImages.length
    );
  };

  const openBooking = () => {
  if (!selectedDate) {
    setNotice("Please choose a date before requesting to book.");
    document
      .getElementById("tour-calendar")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const params = new URLSearchParams({
    tour: tour.title,
    date: selectedDate,
    travelers: String(guests),
  });

  window.location.assign(`/contact?${params.toString()}`);
};


  const handleGuideContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGuideContactOpen(false);
    setNotice(
      "The contact form is prepared. Message delivery needs to be connected to a backend or messaging service."
    );
  };

  const calendarCells = useMemo(() => {
    const firstDay = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1
    );
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      0
    ).getDate();

    return [
      ...Array.from({ length: mondayOffset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [calendarMonth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8f4]">
        <Navigation />
        <main className="mx-auto max-w-4xl px-6 pb-24 pt-40 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#dfe4d5] border-t-[#4A5C23]" />
          <p className="mt-5 text-gray-600">Loading tour details...</p>
        </main>
      </div>
    );
  }

  if (loadError || !tour || !id) {
    return (
      <div className="min-h-screen bg-[#f7f8f4]">
        <Navigation />
        <main className="mx-auto max-w-3xl px-6 pb-24 pt-40 text-center">
          <Mountain className="mx-auto mb-5 h-12 w-12 text-[#4A5C23]" />
          <h1 className="text-3xl font-bold text-[#17200f]">
            {loadError ? "Unable to load tour" : "Tour not found"}
          </h1>
          <p className="mt-3 leading-7 text-gray-600">
            {loadError ||
              "This tour may be unpublished or the address may be incorrect."}
          </p>
          <Link
            to="/itineraries"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#4A5C23] px-6 py-3 font-semibold text-white transition hover:bg-[#35451a]"
          >
            <ArrowLeft size={18} />
            Browse all tours
          </Link>
        </main>
      </div>
    );
  }

  const currentMonthLabel = `${
    MONTH_NAMES[calendarMonth.getMonth()]
  } ${calendarMonth.getFullYear()}`;

  const changeMonth = (direction: number) => {
    setCalendarMonth(
      (month) =>
        new Date(month.getFullYear(), month.getMonth() + direction, 1)
    );
  };

  const canGoPreviousMonth = (() => {
    const now = new Date();
    return (
      calendarMonth.getFullYear() > now.getFullYear() ||
      (calendarMonth.getFullYear() === now.getFullYear() &&
        calendarMonth.getMonth() > now.getMonth())
    );
  })();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      <div className="sticky top-[88px] z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-8">
          <Link
            to="/itineraries"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#4A5C23] hover:gap-3"
          >
            <ArrowLeft size={17} />
            All tours
          </Link>

          <div className="relative ml-auto flex min-w-0 items-center">
            <Search size={17} className="absolute left-3 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => window.setTimeout(() => setSearchOpen(false), 150)}
              placeholder="Search tours"
              aria-label="Search tours"
              className="w-40 rounded-full border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#4A5C23] sm:w-56"
            />
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                {searchResults.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/itineraries/${item.slug}`}
                    className="block rounded-xl px-3 py-3 text-sm hover:bg-[#f4f5f0]"
                  >
                    <span className="block font-semibold text-[#17200f]">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-gray-500">
                      {item.location}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          

          <label className="flex shrink-0 items-center gap-2 text-sm text-gray-600">
            <span className="hidden sm:inline">Currency</span>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as Currency)}
              className="rounded-full border border-gray-200 bg-white px-3 py-2 outline-none focus:border-[#4A5C23]"
              aria-label="Display currency"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="KGS">KGS</option>
            </select>
          </label>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-8 md:px-8 md:pt-12">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#4A5C23]">
            Home
          </Link>
          <span>/</span>
          <Link to="/itineraries" className="hover:text-[#4A5C23]">
            Tours
          </Link>
          <span>/</span>
          <span className="truncate text-gray-800">{tour.title}</span>
        </div>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-10">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e9eddf] px-4 py-2 text-sm font-semibold text-[#4A5C23]">
                <Clock3 size={16} />
                {tour.durationLabel}
              </span>
              {tour.difficulty !== "To be confirmed" && (
                <span className="inline-flex items-center gap-2 rounded-full bg-[#f4f5f0] px-4 py-2 text-sm text-gray-600">
                  <Mountain size={16} />
                  {tour.difficulty}
                </span>
              )}
            </div>

            <div className="mt-5 flex items-start justify-between gap-4">
              <h1 className="min-w-0 text-4xl font-bold leading-tight tracking-tight text-[#17200f] md:text-6xl">
                {tour.title}
              </h1>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-2">
                <MapPin size={17} className="text-[#4A5C23]" />
                {tour.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <Users size={17} className="text-[#4A5C23]" />
                Private or small-group request
              </span>
              <span className="inline-flex items-center gap-2">
                <Languages size={17} className="text-[#4A5C23]" />
                Confirm guide language
              </span>
            </div>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              {tour.shortDescription}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {galleryImages.slice(0, 3).map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() => {
                    setGalleryIndex(index);
                    setGalleryOpen(true);
                  }}
                  className={`group relative overflow-hidden rounded-2xl bg-[#f4f5f0] ${
                    index === 0 ? "col-span-2 row-span-2 h-72 sm:h-[390px]" : "h-[138px] sm:h-[187px]"
                  }`}
                  aria-label={`Open tour photo ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${tour.title} — photo ${index + 1}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {index === 2 && galleryImages.length > 3 && (
                    <span className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 font-semibold text-white">
                      <Camera size={20} />
                      +{galleryImages.length - 3} photos
                    </span>
                  )}
                </button>
              ))}
              {galleryImages.length === 0 && (
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="col-span-2 h-72 w-full rounded-2xl object-cover sm:h-[390px]"
                />
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setGuideContactOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 font-semibold transition hover:bg-[#f7f8f4]"
              >
                <MessageCircle size={18} />
                Contact the guide
              </button>
            </div>

            <section className="border-b border-gray-100 py-10">
              <h2 className="text-3xl font-bold text-[#17200f]">
                About this journey
              </h2>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-gray-600">
                {tour.description}
              </p>

              {tour.highlights.length > 0 && (
                <>
                  <h3 className="mt-7 text-xl font-bold text-[#17200f]">
                    Highlights
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tour.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="inline-flex items-center gap-2 rounded-full bg-[#f4f5f0] px-4 py-2 text-sm text-gray-700"
                      >
                        <Check size={15} className="text-[#4A5C23]" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </section>

            <section id="itinerary" className="scroll-mt-32 border-b border-gray-100 py-10">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#71805a]">
                Day by day
              </span>
              <h2 className="mt-3 text-3xl font-bold text-[#17200f] md:text-4xl">
                Your itinerary
              </h2>

              {tour.days.length > 0 ? (
                <div className="mt-7 space-y-4">
                  {tour.days.map((day) => (
                    <article
                      key={`${day.day}-${day.title}`}
                      className="flex gap-4 rounded-2xl border border-gray-100 p-5 sm:gap-6 sm:p-6"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e9eddf] font-bold text-[#4A5C23]">
                        {day.day}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#71805a]">
                          Day {day.day}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-[#17200f]">
                          {day.title}
                        </h3>
                        <p className="mt-2 leading-7 text-gray-600">
                          {day.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl bg-[#f7f8f4] p-5 leading-7 text-gray-600">
                  The day-by-day itinerary will be added by the tour organizer.
                </p>
              )}
            </section>

            <section className="grid gap-6 border-b border-gray-100 py-10 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#f4f5f0] p-6">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="text-[#4A5C23]" size={22} />
                  <h2 className="text-xl font-bold text-[#17200f]">
                    Included
                  </h2>
                </div>
                {tour.included.length ? (
                  <ul className="mt-5 space-y-3">
                    {tour.included.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-6 text-gray-600">
                        <Check size={17} className="mt-1 shrink-0 text-[#4A5C23]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    Included services will be confirmed by the organizer.
                  </p>
                )}
              </div>

              <div className="rounded-3xl bg-[#f7f8f4] p-6">
                <div className="flex items-center gap-3">
                  <Compass className="text-[#4A5C23]" size={22} />
                  <h2 className="text-xl font-bold text-[#17200f]">
                    Not included
                  </h2>
                </div>
                {tour.excluded.length ? (
                  <ul className="mt-5 space-y-3">
                    {tour.excluded.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-6 text-gray-600">
                        <Minus size={17} className="mt-1 shrink-0 text-gray-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    Excluded services will be confirmed by the organizer.
                  </p>
                )}
              </div>
            </section>

            <section id="meeting-point" className="scroll-mt-32 border-b border-gray-100 py-10">
              <h2 className="text-3xl font-bold text-[#17200f]">
                Meeting point
              </h2>
              <div className="mt-5 flex gap-4 rounded-2xl border border-gray-100 p-5">
                <MapPin className="mt-1 shrink-0 text-[#4A5C23]" size={22} />
                <div>
                  <p className="font-semibold text-[#17200f]">{tour.location}</p>
                  <p className="mt-2 leading-7 text-gray-600">
                    The exact meeting point and pickup time will be confirmed by the organizer after your request.
                  </p>
                </div>
              </div>
            </section>

            <section id="booking-conditions" className="scroll-mt-32 border-b border-gray-100 py-10">
              <h2 className="text-3xl font-bold text-[#17200f]">
                Booking conditions
              </h2>
              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 shrink-0 text-[#4A5C23]" size={21} />
                  <p className="leading-7 text-gray-600">
                    Your booking is a request until the organizer confirms availability, final pricing and conditions. No online payment is collected on this page.
                  </p>
                </div>
                <div className="flex gap-3">
                  <CalendarDays className="mt-1 shrink-0 text-[#4A5C23]" size={21} />
                  <p className="leading-7 text-gray-600">
                    Calendar dates are date requests only. They do not indicate confirmed departure availability yet.
                  </p>
                </div>
              </div>
            </section>

<section id="tour-calendar" className="scroll-mt-32 border-b border-gray-100 py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#17200f]">Choose a date</h3>
                <span className="text-xs text-gray-500">Request only</span>
              </div>

              <div className="mt-3 w-full max-w-[830px] rounded-2xl border border-gray-100 bg-[#fbfcf9] px-3 py-4 sm:px-5">
                <div className="grid grid-cols-[36px_minmax(0,1fr)_36px] items-center">
                  <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    disabled={!canGoPreviousMonth}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#4A5C23] transition hover:bg-[#e9eddf] disabled:cursor-not-allowed disabled:text-gray-300"
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={19} />
                  </button>

                  <p className="text-center text-sm font-bold text-[#17200f]">
                    {currentMonthLabel}
                  </p>

                  <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#4A5C23] transition hover:bg-[#e9eddf]"
                    aria-label="Next month"
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-7 justify-items-center gap-y-1 text-center">
                  {WEEK_DAYS.map((day) => (
                    <span
                      key={day}
                      className="w-full py-1 text-[10px] font-bold uppercase tracking-wide text-gray-500"
                    >
                      {day}
                    </span>
                  ))}

                  {calendarCells.map((day, index) => {
                    if (day === null) {
                      return <span key={`empty-${index}`} className="h-8 w-9" />;
                    }

                    const date = new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth(),
                      day
                    );
                    const dateKey = getDateKey(date);
                    const valid = isFutureOrToday(date);
                    const selected = selectedDate === dateKey;

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        disabled={!valid}
                        onClick={() => setSelectedDate(dateKey)}
                        className={`flex h-8 w-9 items-center justify-center rounded-lg text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5C23] ${
                          selected
                            ? "bg-[#4A5C23] font-bold text-white shadow-sm"
                            : valid
                              ? "text-[#26311d] hover:bg-[#e9eddf] active:bg-[#dce4ce]"
                              : "cursor-not-allowed text-gray-300"
                        }`}
                        aria-label={`Select ${dateKey}`}
                        aria-pressed={selected}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="mt-2 max-w-[430px] text-[11px] leading-4 text-gray-500">
                Selecting a date sends a request preference only; it does not confirm availability.
              </p>
            </section>

            <section id="reviews" className="scroll-mt-32 border-b border-gray-100 py-10">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#71805a]">
                Traveler feedback
              </span>
              <h2 className="mt-3 text-3xl font-bold text-[#17200f] md:text-4xl">
                Reviews
              </h2>
              <div className="mt-6 flex items-center gap-5 rounded-3xl bg-[#f7f8f4] p-6">
                <div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} size={18} className="fill-[#4A5C23] text-[#4A5C23]" />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-[#17200f]">Sample traveler feedback</p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    These are fictional layout examples, not verified customer reviews.
                  </p>
                </div>
              </div>
              <div className="mt-7 space-y-7">
                {DEMO_REVIEWS.map((review) => (
                  <article key={review.name} className="border-b border-gray-100 pb-7 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#edf0e6] text-lg font-bold text-[#4A5C23]">
                        {review.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-[#17200f]">{review.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">{review.country}</p>
                          </div>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <div className="mt-3 flex gap-1">
                          {Array.from({ length: 5 }, (_, index) => (
                            <Star
                              key={index}
                              size={15}
                              className={index < review.rating ? "fill-[#4A5C23] text-[#4A5C23]" : "text-gray-300"}
                            />
                          ))}
                        </div>
                        <h4 className="mt-3 font-semibold text-[#17200f]">{review.title}</h4>
                        <p className="mt-2 leading-7 text-gray-600">{review.text}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="py-10">
              <h2 className="text-3xl font-bold text-[#17200f]">Frequently asked questions</h2>
              <div className="mt-6 space-y-3">
                {[
                  {
                    question: "How do I request a booking?",
                    answer: "Select a date, choose the number of travelers and send your contact details. The organizer will confirm availability and final terms.",
                  },
                  {
                    question: "What should I bring?",
                    answer: "Clothing and equipment depend on the season and route. Ask the organizer for a packing list for your selected dates.",
                  },
                  {
                    question: "Can the itinerary change?",
                    answer: "Weather and road conditions can affect mountain routes. The organizer should confirm any changes and alternatives with you.",
                  },
                ].map((faq) => (
                  <details key={faq.question} className="group rounded-2xl border border-gray-200 p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                      {faq.question}
                      <ChevronDown size={19} className="shrink-0 transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-4 leading-7 text-gray-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-32 lg:h-fit">
            <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_15px_60px_rgba(23,32,15,0.08)] md:p-7">
              <p className="text-sm text-gray-500">Price per person</p>
              {price > 0 ? (
                <p className="mt-1 text-4xl font-bold tracking-tight text-[#17200f]">
                  {formatPrice(
                    price * CURRENCY_RATES[currency] / CURRENCY_RATES[priceCurrency],
                    currency
                  )}
                </p>
              ) : (
                <p className="mt-2 text-2xl font-bold text-[#17200f]">Contact for price</p>
              )}
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {price > 0
                  ? `Price stored in the database: ${price} ${tour.currency}. Confirm final price with the organizer.`
                  : "The organizer has not added a price yet."}
              </p>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Travelers</span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 disabled:opacity-30"
                      aria-label="Remove traveler"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="min-w-4 text-center font-semibold">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(Math.min(20, guests + 1))}
                      disabled={guests >= 20}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 disabled:opacity-30"
                      aria-label="Add traveler"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5 text-sm">
                <span className="text-gray-500">Total for {guests}</span>
                <span className="text-lg font-bold">
                  {price > 0
                    ? formatPrice(
                        price * guests * CURRENCY_RATES[currency] / CURRENCY_RATES[priceCurrency],
                        currency
                      )
                    : "To be confirmed"}
                </span>
              </div>

              <button
                type="button"
                onClick={openBooking}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#4A5C23] px-5 py-4 font-semibold text-white transition hover:bg-[#35451a]"
              >
                <CalendarDays size={19} />
                Request to book
              </button>
              <button
                type="button"
                onClick={toggleFavorite}
                aria-pressed={isSaved}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4A5C23]/20 ${
                  isSaved
                    ? "border-[#4A5C23] bg-[#e9eddf] text-[#4A5C23]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-[#4A5C23] hover:bg-[#f4f5f0] hover:text-[#4A5C23]"
                }`}
              >
                <Heart size={17} className={isSaved ? "fill-current" : ""} />
                {isSaved ? "Saved to favorites" : "Save to favorites"}
              </button>

              <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#4A5C23]" />
                  <p className="text-sm leading-6 text-gray-600">
                    Confirm the final price and booking conditions before paying.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle size={19} className="mt-0.5 shrink-0 text-[#4A5C23]" />
                  <button
                    type="button"
                    onClick={() => setGuideContactOpen(true)}
                    className="text-left text-sm leading-6 text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-[#4A5C23]"
                  >
                    Ask the organizer about availability
                  </button>
                </div>
              </div>


            </div>
          </aside>
        </section>

        {allTours.filter((item) => item.slug !== tour.slug).length > 0 && (
          <section className="mt-16 border-t border-gray-100 pt-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#71805a]">
                  Keep exploring
                </span>
                <h2 className="mt-3 text-3xl font-bold text-[#17200f] md:text-4xl">
                  You may also like
                </h2>
              </div>
              <Link to="/itineraries" className="inline-flex items-center gap-2 font-semibold text-[#4A5C23] hover:gap-3">
                All tours <ArrowRight size={18} />
              </Link>
            </div>
            <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allTours.filter((item) => item.slug !== tour.slug).slice(0, 3).map((item) => (
                <Link
                  key={item.slug}
                  to={`/itineraries/${item.slug}`}
                  className="group overflow-hidden rounded-3xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#4A5C23]">
                      {item.durationLabel}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-500">{item.location}</p>
                    <h3 className="mt-2 text-xl font-bold leading-snug text-[#17200f]">{item.title}</h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">{item.shortDescription}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {item.price > 0
                          ? `From ${formatPrice(
                              (item.price * CURRENCY_RATES[currency]) /
                                CURRENCY_RATES[
                                  item.currency === "EUR" || item.currency === "KGS"
                                    ? item.currency
                                    : "USD"
                                ],
                              currency
                            )}`
                          : "Contact for price"}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf0e6] text-[#4A5C23] transition group-hover:bg-[#4A5C23] group-hover:text-white">
                        <ArrowRight size={17} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-4 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div>
          <p className="text-xs text-gray-500">Price per person</p>
          <p className="text-xl font-bold">
            {price > 0
              ? formatPrice(
                  (price * CURRENCY_RATES[currency]) / CURRENCY_RATES[priceCurrency],
                  currency
                )
              : "Contact for price"}
          </p>
        </div>
        <button type="button" onClick={openBooking} className="rounded-full bg-[#4A5C23] px-6 py-3 font-semibold text-white">
          Book tour
        </button>
      </div>

      {galleryOpen && galleryImages.length > 0 && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Tour photo gallery"
          onClick={() => setGalleryOpen(false)}
        >
          <button
            type="button"
            onClick={() => setGalleryOpen(false)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                changeGallery(-1);
              }}
              className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:left-8"
              aria-label="Previous photo"
            >
              <ArrowLeft size={22} />
            </button>
          )}
          <img
            src={galleryImages[galleryIndex % galleryImages.length]}
            alt={`${tour.title} photo ${galleryIndex + 1}`}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
          />
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                changeGallery(1);
              }}
              className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-8"
              aria-label="Next photo"
            >
              <ArrowRight size={22} />
            </button>
          )}
          <span className="absolute bottom-5 text-sm text-white/80">
            {galleryIndex + 1} / {galleryImages.length}
          </span>
        </div>
      )}

      {guideContactOpen && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setGuideContactOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-contact-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="guide-contact-title" className="text-2xl font-bold text-[#17200f]">
                  Contact the guide
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Ask a question about {tour.title}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGuideContactOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100"
                aria-label="Close contact form"
              >
                <X size={21} />
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleGuideContactSubmit}>
              <input name="name" required placeholder="Your name" className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#4A5C23]" />
              <input name="email" type="email" required placeholder="Your email" className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#4A5C23]" />
              <textarea
                name="message"
                required
                rows={4}
                defaultValue={`Hello! I have a question about ${tour.title}.`}
                placeholder="Your question"
                className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#4A5C23]"
              />
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4A5C23] px-5 py-4 font-semibold text-white transition hover:bg-[#35451a]">
                <Send size={18} />
                Prepare message
              </button>
              <p className="text-xs leading-5 text-gray-400">
                Message delivery is not connected yet.
              </p>
            </form>
          </div>
        </div>
      )}

      {notice && (
        <div
          className="fixed bottom-24 left-1/2 z-[10002] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl bg-[#17200f] px-5 py-4 text-sm text-white shadow-xl md:bottom-6"
          role="status"
        >
          <span className="flex-1 leading-6">{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TourDetails;
