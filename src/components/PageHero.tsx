import type { ReactNode } from "react";
import { useLanguage } from "../lib/language";

type PageHeroProps = {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

const PageHero = ({ image, imageAlt, eyebrow, title, description, children }: PageHeroProps) => {
  const { t } = useLanguage();
  return (
  <section className="kt-page-hero relative flex h-[88svh] min-h-[680px] max-h-[980px] items-center overflow-hidden text-white">
    <img
      src={image}
      alt={imageAlt}
      className="absolute inset-0 h-full w-full object-cover object-center"
      fetchPriority="high"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/10" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
    <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 sm:px-10 md:px-8 lg:px-12">
      <div className="max-w-4xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-5 py-3 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[#d7b85a]" />
          <span className="text-sm font-medium text-white">{t(eyebrow)}</span>
        </div>
        <h1 className="max-w-4xl text-5xl font-light leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[clamp(4rem,6vw,6rem)]">
          {t(title)}
        </h1>
        <p className="mt-7 max-w-3xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8 md:text-xl">
          {t(description)}
        </p>
        {children}
      </div>
    </div>
  </section>
  );
};

export default PageHero;
