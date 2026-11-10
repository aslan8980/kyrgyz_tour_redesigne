import { Button } from "@/components/ui/button";
import KyrgyzstanImage from "../assets/images/site/editorial/home-about-ala-archa.jpg";
import { useLanguage } from "../lib/language";

const Welcome = () => {
  const { t } = useLanguage();
  const handleExploreClick = () => {
    const itinerariesSection =
      document.getElementById("itineraries");

    if (itinerariesSection) {
      itinerariesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="bg-[#f5f5ef] text-[#283128] py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        
        {/* Text */}
        <div className="space-y-6">
          <h3 className="inline-flex items-center gap-2 bg-[#e9eddf] border border-[#dfe4d5] text-[#283128] rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-[#4a5c23] rounded-full"></span>

            <span className="text-sm font-medium">
              {t("Welcome to Kyrgyzstan")}
            </span>
          </h3>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            {t("Discover the Land of Mountains and Nomads")}
          </h2>

          <p className="text-gray-600 leading-relaxed">
            {t("Kyrgyzstan is a country of breathtaking mountains, crystal-clear lakes, vast valleys and centuries-old nomadic traditions. From peaceful mountain landscapes to unforgettable adventures, every journey offers something new to discover.")}
          </p>

          <p className="text-gray-600 leading-relaxed">
            {t("Explore the beauty of Issyk-Kul, hike through Ala-Archa, discover Karakol and experience the unique hospitality and culture of the Kyrgyz people.")}
          </p>

          {/* Explore Itineraries */}
          <Button
            onClick={handleExploreClick}
            className="bg-[#4A5C23] hover:bg-[#85BC03] text-white mt-4"
          >
            {t("Explore Itineraries")}
          </Button>
        </div>

        {/* Image */}
        <div className="relative">
          <img
            src={KyrgyzstanImage}
            alt="Beautiful landscape of Kyrgyzstan"
            className="w-full h-[420px] rounded-sm relative z-10 object-cover shadow-2xl"
          />

          <div className="bg-[#59664a]/25 absolute -bottom-4 -right-4 w-32 h-32 rounded-full z-0"></div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
