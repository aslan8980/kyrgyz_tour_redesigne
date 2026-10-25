
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Heart,
  MapPin,
  Trash2,
} from "lucide-react";

import Navigation from "../components/Navigation";
import { supabase } from "../lib/supabase";

import ThreeDays from "../assets/images/3-days.webp";
import FourDays from "../assets/images/4-days.webp";
import FiveDays from "../assets/images/5-days.webp";
import FourteenDays from "../assets/images/14-days.webp";

const FAVORITES_KEY = "kyrgyz-tours-favorites";

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

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item: unknown) => {
        if (typeof item === "string") return item;

        if (item && typeof item === "object") {
          const value = item as { id?: unknown; slug?: unknown };

          if (typeof value.slug === "string") return value.slug;
          if (typeof value.id === "string") return value.id;
        }

        return null;
      })
      .filter((item): item is string => item !== null);
  } catch {
    return [];
  }
}

const SavedTours = () => {
  const [favorites, setFavorites] = useState<string[]>(readFavorites);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFavorites = useCallback(() => {
    setFavorites(readFavorites());
  }, []);

  useEffect(() => {
    const loadTours = async () => {
      setLoading(true);
      setError("");

      const { data, error: queryError } = await supabase
        .from("tours")
        .select(
          "id, slug, title, duration, duration_label, location, main_image, short_description, description, highlights"
        )
        .eq("status", "published")
        .order("duration", { ascending: true });

      if (queryError) {
        console.error("Failed to load saved tours:", queryError.message);
        setError("We couldn't load your saved journeys. Please try again.");
      } else {
        setTours((data ?? []) as Tour[]);
      }

      setLoading(false);
    };

    void loadTours();

    window.addEventListener("storage", loadFavorites);
    window.addEventListener("favorites-updated", loadFavorites);

    return () => {
      window.removeEventListener("storage", loadFavorites);
      window.removeEventListener("favorites-updated", loadFavorites);
    };
  }, [loadFavorites]);

  const savedTours = tours.filter(
    (tour) => favorites.includes(tour.slug) || favorites.includes(tour.id)
  );

  const removeTour = (tour: Tour) => {
    const updated = favorites.filter(
      (value) => value !== tour.slug && value !== tour.id
    );

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    setFavorites(updated);
    window.dispatchEvent(new Event("favorites-updated"));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      <section className="px-4 pb-10 pt-36 md:px-8 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/itineraries"
            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-[#4A5C23]"
          >
            <ArrowLeft size={17} />
            Back to itineraries
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Saved journeys.
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
                All the places and adventures you want to explore in
                Kyrgyzstan, collected in one place.
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {savedTours.length}{" "}
              {savedTours.length === 1 ? "journey" : "journeys"} saved
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <p className="py-16 text-center text-gray-500">
              Loading saved journeys...
            </p>
          ) : error ? (
            <div className="rounded-3xl bg-[#f4f5f0] px-6 py-16 text-center">
              <p className="text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-full bg-[#4A5C23] px-6 py-3 font-semibold text-white hover:bg-[#35451a]"
              >
                Try again
              </button>
            </div>
          ) : savedTours.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedTours.map((tour) => (
                <article
                  key={tour.id}
                  className="group overflow-hidden rounded-3xl bg-[#f4f5f0] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link
                    to={`/itineraries/${tour.slug}`}
                    className="block"
                    aria-label={`View ${tour.title}`}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={
                          tour.main_image ||
                          localImages[tour.slug] ||
                          FourteenDays
                        }
                        alt={tour.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold">
                        <Clock size={15} className="text-[#4A5C23]" />
                        {tour.duration_label || `${tour.duration} Days`}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={16} className="shrink-0 text-[#4A5C23]" />
                      {tour.location || "Kyrgyzstan"}
                    </div>

                    <Link to={`/itineraries/${tour.slug}`}>
                      <h2 className="mt-3 text-xl font-bold leading-snug text-[#17200f] transition-colors hover:text-[#4A5C23]">
                        {tour.title}
                      </h2>
                    </Link>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {tour.short_description || tour.description || ""}
                    </p>

                    {tour.highlights && tour.highlights.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {tour.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="rounded-full bg-white px-3 py-1.5 text-xs text-gray-600"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-200 pt-5">
                      <Link
                        to={`/itineraries/${tour.slug}`}
                        className="inline-flex items-center gap-2 font-semibold text-[#4A5C23]"
                      >
                        View journey
                        <ArrowRight size={17} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => removeTour(tour)}
                        className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${tour.title} from favorites`}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-[#f4f5f0] px-6 py-16 text-center md:py-24">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white">
                <Heart size={28} className="text-[#4A5C23]" />
              </div>

              <h2 className="mt-6 text-2xl font-bold md:text-3xl">
                No saved journeys yet
              </h2>

              <p className="mx-auto mt-3 max-w-md leading-relaxed text-gray-600">
                Found a tour you love? Tap the heart on its page and it will
                appear here. No account needed.
              </p>

              <Link
                to="/itineraries"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#4A5C23] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#35451a]"
              >
                Explore itineraries
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SavedTours;
