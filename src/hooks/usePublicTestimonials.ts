import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type PublicTestimonial = {
  id: string;
  name: string;
  country: string;
  rating: number;
  title: string;
  text: string;
};

const fallbackTestimonials: PublicTestimonial[] = [
  { id: "alex", name: "Alex", country: "Germany", rating: 5, title: "Warm hospitality", text: "Kyrgyzstan surprised me with its incredible mountains, beautiful lakes and warm hospitality." },
  { id: "sofia", name: "Sofia", country: "Italy", rating: 5, title: "A new adventure every day", text: "The landscapes were unforgettable. From the mountains to Issyk-Kul, every day felt like a new adventure." },
  { id: "daniel", name: "Daniel", country: "United Kingdom", rating: 5, title: "A different travel experience", text: "A completely different travel experience. The nature, culture and nomadic traditions were amazing." },
  { id: "emma", name: "Emma", country: "France", rating: 5, title: "Mountains, lakes and culture", text: "The combination of mountains, lakes and nomadic culture made this one of my favorite trips." },
  { id: "michael", name: "Michael", country: "United States", rating: 5, title: "An authentic destination", text: "Kyrgyzstan feels incredibly authentic. The landscapes and hospitality were unforgettable." },
  { id: "anna", name: "Anna", country: "Poland", rating: 5, title: "A beautiful country", text: "A beautiful country with incredible nature. I would definitely come back again." },
];

export function usePublicTestimonials() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    let active = true;
    supabase.from("testimonials").select("id,name,country,rating,title,text").order("sort_order").order("created_at")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error("Failed to load testimonials:", error.message);
        else setTestimonials((data ?? []) as PublicTestimonial[]);
      });
    return () => { active = false; };
  }, []);

  return testimonials;
}
