import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useBlogPosts } from "../components/BlogSection";
import BlogHeroImage from "../assets/images/site/hero/hero-itineraries.jpg";

export default function Blog() {
  const { slug } = useParams();
  const posts = useBlogPosts();
  const post = slug ? posts.find((item) => item.slug === slug) : undefined;

  if (slug && post) {
    return (
      <div className="min-h-screen bg-[#f5f6f1] text-[#283128]">
        <Navigation />
        <article className="mx-auto max-w-4xl px-5 pb-20 pt-32 sm:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-[#4a5c23] hover:underline"><ArrowLeft size={16} />All articles</Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#71805a]">{post.category}</p>
          <h1 className="mt-3 font-montserrat text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-8 text-gray-600">{post.excerpt}</p>
          <img src={post.image_url} alt={post.title} className="mt-9 aspect-[1.8] w-full rounded-3xl object-cover" />
          <div className="mx-auto mt-9 max-w-3xl space-y-5 text-base leading-8 text-gray-700 sm:text-lg sm:leading-9">
            {(Array.isArray(post.content) ? post.content : String(post.content ?? "").split(/\n\s*\n/)).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
          {!!post.sources?.length && (
            <aside className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#e1e5da] bg-white p-5 sm:p-6">
              <h2 className="font-semibold">Further reading</h2>
              <ul className="mt-3 space-y-2">
                {post.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[#4a5c23] underline underline-offset-4 hover:text-[#283128]">{source.label}<ArrowUpRight size={14} /></a></li>)}
              </ul>
            </aside>
          )}
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f1] text-[#283128]">
      <Navigation />
      <header className="relative isolate flex min-h-[430px] h-[56svh] max-h-[650px] items-center overflow-hidden text-white">
        <img src={BlogHeroImage} alt="Kyrgyz mountain landscape" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/65 via-black/35 to-black/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/15 via-transparent to-black/35" />
        <div className="mx-auto w-full max-w-6xl px-5 pt-24 sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e1e7d3]">Field notes & practical guides</p>
          <h1 className="mt-3 max-w-3xl font-montserrat text-4xl font-light leading-tight tracking-tight sm:text-5xl md:text-6xl">The Kyrgyzstan Blog</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">Practical ideas for exploring Kyrgyzstan, from local crafts to planning your days on the road.</p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((item) => (
            <Link key={item.id} to={`/blog/${item.slug}`} className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4a5c23]">
              <div className="aspect-[1.9] overflow-hidden bg-[#d9decf]"><img src={item.image_url} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" /></div>
              <div className="p-5 sm:p-6"><p className="text-[11px] font-semibold uppercase tracking-wider text-[#71805a]">{item.category}</p><h2 className="mt-2.5 font-montserrat text-lg font-semibold leading-snug sm:text-xl">{item.title}</h2><p className="mt-2.5 text-sm leading-5 text-gray-600">{item.excerpt}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4a5c23]">Read article <ArrowUpRight size={16} /></span></div>
            </Link>
          ))}
          {!posts.length && <p className="col-span-full rounded-3xl bg-white p-8 text-center text-gray-600">New articles are coming soon.</p>}
        </div>
      </main>
    </div>
  );
}
