
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import Logo from "../assets/images/logo1.webp";
import { useLanguage } from "../lib/language";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 70);

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Itineraries", path: "/itineraries" },
    { name: "Blog", path: "/blog" },
    { name: "Map", path: "/map" },
    { name: "Favorites", path: "/saved", icon: true },
    { name: "Contact Us", path: "/contact" },
  ];

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path ||
        location.pathname.startsWith(`${path}/`);

  return (
    <nav
      className={`kt-navigation fixed inset-x-0 top-0 z-[9999] transition-all duration-500 ${
        scrolled
          ? "kt-navigation-scrolled"
          : "kt-navigation-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between lg:h-24">
          <Link to="/" className="flex shrink-0 items-center">
            <img
              src={Logo}
              alt="Kyrgyz Tours"
              className={`kt-navigation-logo h-auto w-[135px] object-contain transition-all duration-500 lg:w-[155px] ${
                scrolled ? "" : "kt-logo-on-hero"
              }`}
            />
          </Link>

          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`kt-nav-link relative flex items-center gap-1.5 py-2 text-[13px] transition-colors duration-500 ${
                  isActive(item.path) ? "kt-nav-active" : ""
                }`}
              >
                {item.icon && <Heart size={15} />}
                {t(item.name)}
                <span className="kt-nav-underline" />
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="kt-menu-toggle text-2xl transition-colors duration-500 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="kt-mobile-menu mb-4 rounded-2xl p-3 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`kt-mobile-link flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                  isActive(item.path) ? "font-medium" : ""
                }`}
              >
                {item.icon && <Heart size={16} />}
                {t(item.name)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
