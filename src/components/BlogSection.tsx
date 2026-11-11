import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { starterBlogPosts, type BlogPost } from "../data/blogPosts";
import BlogBackground from "../assets/images/site/hero/hero-gallery.jpg";

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>(starterBlogPosts);

  useEffect(() => {
    let active = true;
    supabase.from("blog_posts")
      .select("id,slug,title,excerpt,content,category,image_url,sources,published,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.warn("Blog posts are using the starter content until the blog migration is applied.");
          return;
        }
        setPosts((data ?? []) as BlogPost[]);
      });
    return () => { active = false; };
  }, []);

  return posts;
}

export default function BlogSection() {
  const posts = useBlogPosts();
  return (
    <section className="relative isolate overflow-hidden px-5 py-12 text-white sm:px-8 md:py-16">
      <img src={BlogBackground} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-[#11170f]/75" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent via-[#11170f]/80 to-[#11170f]" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5 md:mb-9">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c7d0af]">Field notes & practical guides</p>
            <h2 className="mt-2 font-montserrat text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">The Kyrgyzstan Blog</h2>
          </div>
          <Link to="/blog" className="group inline-flex items-center gap-2 border-b border-white/50 pb-1 text-sm font-medium text-white/90 transition-colors hover:border-white hover:text-white">
            All articles <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {posts.slice(0, 2).map((post, index) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group grid overflow-hidden rounded-3xl bg-[#f5f6f1] text-[#283128] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c7d0af] motion-safe:animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="relative aspect-[1.9] overflow-hidden bg-[#d9decf]">
                <img src={post.image_url} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-semibold text-[#35451a] shadow-sm backdrop-blur">{post.category}</span>
              </div>
              <div className="flex flex-col p-5 sm:p-6">
                <h3 className="font-montserrat text-lg font-semibold leading-snug tracking-tight sm:text-xl">{post.title}</h3>
                <p className="mt-2.5 line-clamp-3 text-sm leading-5 text-gray-600">{post.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-[#4a5c23]">
                  Read article <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          ))}
          {!posts.length && <p className="col-span-full py-10 text-center text-white/70">New articles are coming soon.</p>}
        </div>
      </div>
    </section>
  );
}
