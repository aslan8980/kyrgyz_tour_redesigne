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

export function usePublicTestimonials() {
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([]);

  useEffect(() => {
    let active = true;
    supabase.from("testimonials").select("id,name,country,rating,title,text").order("sort_order").order("created_at")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error("Failed to load testimonials:", error.message);
        else setTestimonials(((data ?? []) as PublicTestimonial[]).filter((review) => {
          const text = `${review.name} ${review.title} ${review.text}`;
          return !/(^|[^\p{L}\p{N}])(test|demo|sample|placeholder|lorem|тест)([^\p{L}\p{N}]|$)/iu.test(text);
        }));
      });
    return () => { active = false; };
  }, []);

  return testimonials;
}
