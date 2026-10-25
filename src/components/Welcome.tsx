import { Button } from "@/components/ui/button";
import KyrgyzstanImage from "../assets/images/cheetah-close.webp";

const Welcome = () => {
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
    <section className="kt-section-blend bg-[#10120f] text-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        
        {/* Text */}
        <div className="space-y-6">
          <h3 className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-[#4a5c23] rounded-full"></span>

            <span className="text-sm font-medium">
              Welcome to Kyrgyzstan
            </span>
          </h3>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Discover the Land of Mountains and Nomads
          </h2>

          <p className="text-white/70 leading-relaxed">
            Kyrgyzstan is a country of breathtaking mountains,
            crystal-clear lakes, vast valleys and centuries-old
            nomadic traditions. From peaceful mountain landscapes
            to unforgettable adventures, every journey offers
            something new to discover.
          </p>

          <p className="text-white/70 leading-relaxed">
            Explore the beauty of Issyk-Kul, hike through
            Ala-Archa, discover Karakol and experience the unique
            hospitality and culture of the Kyrgyz people.
          </p>

          {/* Explore Itineraries */}
          <Button
            onClick={handleExploreClick}
            className="bg-[#4A5C23] hover:bg-[#85BC03] text-white mt-4"
          >
            Explore Itineraries
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