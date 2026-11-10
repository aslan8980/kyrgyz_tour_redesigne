import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Link } from "react-router-dom";

import {
  Activity,
  ArrowUpRight,
  Coffee,
  Compass,
  Hotel,
  Leaf,
  LocateFixed,
  MapPin,
  Menu,
  Mountain,
  Search,
  SlidersHorizontal,
  Utensils,
  X,
} from "lucide-react";

import Logo from "../assets/images/logo1.webp";
import { useLanguage } from "../lib/language";

type Category =
  | "all"
  | "hotel"
  | "restaurant"
  | "cafe"
  | "attraction"
  | "activity";

type Dietary = "halal" | "vegetarian" | "vegan";

interface Place {
  id: number;
  name: string;
  category: Exclude<Category, "all">;
  region: string;
  description: string;
  lat: number;
  lng: number;
  dietary?: Dietary[];
  rating?: number;
  isDemo?: boolean;
}

const places: Place[] = [
  {
    id: 1,
    name: "Bishkek",
    category: "attraction",
    region: "Chuy Region",
    description:
      "The capital of Kyrgyzstan and a great starting point for exploring the country.",
    lat: 42.8746,
    lng: 74.5698,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Ala-Archa National Park",
    category: "attraction",
    region: "Chuy Region",
    description:
      "A spectacular mountain destination located close to Bishkek.",
    lat: 42.633,
    lng: 74.5,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Burana Tower",
    category: "attraction",
    region: "Chuy Region",
    description:
      "A historic minaret and one of the most famous archaeological sites in Kyrgyzstan.",
    lat: 42.7467,
    lng: 75.2556,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Issyk-Kul Lake",
    category: "attraction",
    region: "Issyk-Kul Region",
    description:
      "One of the world's largest high-altitude lakes surrounded by spectacular mountains.",
    lat: 42.45,
    lng: 77.3,
    rating: 4.9,
  },
  {
    id: 5,
    name: "Karakol",
    category: "activity",
    region: "Issyk-Kul Region",
    description:
      "A mountain town and gateway to hiking, skiing and other outdoor adventures.",
    lat: 42.4907,
    lng: 78.3936,
    rating: 4.8,
  },
  {
    id: 6,
    name: "Song-Kul Lake",
    category: "attraction",
    region: "Naryn Region",
    description:
      "A remote alpine lake surrounded by wide mountain pastures and nomadic landscapes.",
    lat: 41.833,
    lng: 75.15,
    rating: 4.9,
  },
  {
    id: 7,
    name: "Osh",
    category: "attraction",
    region: "Osh Region",
    description:
      "One of Central Asia's oldest cities and an important cultural destination.",
    lat: 40.5283,
    lng: 72.7985,
    rating: 4.7,
  },

  /*
   * DEMO BUSINESSES
   * Later we will replace these with real hotels,
   * restaurants and cafes from our database.
   */

  {
    id: 8,
    name: "Demo Hotel — Bishkek",
    category: "hotel",
    region: "Bishkek",
    description:
      "Demo hotel entry. This will later contain real hotel information, photos and prices.",
    lat: 42.876,
    lng: 74.59,
    rating: 4.5,
    isDemo: true,
  },
  {
    id: 9,
    name: "Demo Halal Restaurant — Bishkek",
    category: "restaurant",
    region: "Bishkek",
    description:
      "Demo restaurant entry for testing dietary filters.",
    lat: 42.87,
    lng: 74.58,
    dietary: ["halal"],
    rating: 4.6,
    isDemo: true,
  },
  {
    id: 10,
    name: "Demo Vegetarian Cafe — Bishkek",
    category: "cafe",
    region: "Bishkek",
    description:
      "Demo cafe entry for testing vegetarian and vegan filters.",
    lat: 42.875,
    lng: 74.575,
    dietary: ["vegetarian", "vegan"],
    rating: 4.7,
    isDemo: true,
  },
  {
    id: 11,
    name: "Demo Adventure Base — Karakol",
    category: "activity",
    region: "Karakol",
    description:
      "Demo activity entry for testing outdoor experiences.",
    lat: 42.493,
    lng: 78.39,
    rating: 4.8,
    isDemo: true,
  },
];

const categories: {
  id: Category;
  label: string;
  icon: typeof Compass;
}[] = [
  {
    id: "all",
    label: "All places",
    icon: Compass,
  },
  {
    id: "hotel",
    label: "Hotels",
    icon: Hotel,
  },
  {
    id: "restaurant",
    label: "Restaurants",
    icon: Utensils,
  },
  {
    id: "cafe",
    label: "Cafes",
    icon: Coffee,
  },
  {
    id: "attraction",
    label: "Attractions",
    icon: Mountain,
  },
  {
    id: "activity",
    label: "Activities",
    icon: Activity,
  },
];

const dietaryOptions: {
  id: Dietary;
  label: string;
}[] = [
  {
    id: "halal",
    label: "Halal",
  },
  {
    id: "vegetarian",
    label: "Vegetarian",
  },
  {
    id: "vegan",
    label: "Vegan",
  },
];

const categoryColors: Record<
  Exclude<Category, "all">,
  string
> = {
  hotel: "#2563eb",
  restaurant: "#dc2626",
  cafe: "#92400e",
  attraction: "#4A5C23",
  activity: "#7c3aed",
};

const categoryLabels: Record<
  Exclude<Category, "all">,
  string
> = {
  hotel: "Hotel",
  restaurant: "Restaurant",
  cafe: "Cafe",
  attraction: "Attraction",
  activity: "Activity",
};

type Coordinates = { lat: number; lng: number };
type BoundsLiteral = { south: number; west: number; north: number; east: number };
type GoogleMapApi = {
  fitBounds: (bounds: BoundsLiteral, padding?: number) => void;
  panTo: (location: Coordinates) => void;
  setZoom: (zoom: number) => void;
};
type GoogleMarkerApi = HTMLElement & { map: GoogleMapApi | null };
type GoogleInfoWindowApi = {
  setContent: (content: HTMLElement) => void;
  open: (options: { map: GoogleMapApi; anchor: GoogleMarkerApi }) => void;
  close: () => void;
};
type GoogleMapsNamespace = {
  Map: new (container: HTMLElement, options: Record<string, unknown>) => GoogleMapApi;
  InfoWindow: new (options?: { maxWidth?: number }) => GoogleInfoWindowApi;
  marker: {
    AdvancedMarkerElement: new (options: { map: GoogleMapApi; position: Coordinates; title: string }) => GoogleMarkerApi;
    PinElement: new (options: { background: string; borderColor: string; glyphColor: string }) => { element: HTMLElement };
  };
};
type GoogleMapsApi = GoogleMapsNamespace;
type GoogleWindow = Window & {
  google?: { maps?: Partial<GoogleMapsNamespace> };
  kyrgyzToursGoogleMapsReady?: () => void;
  gm_authFailure?: () => void;
};

let googleMapsLoading: Promise<GoogleMapsApi> | null = null;

function loadGoogleMaps(apiKey: string): Promise<GoogleMapsApi> {
  const current = (window as GoogleWindow).google?.maps;
  if (current?.Map && current.InfoWindow && current.marker?.AdvancedMarkerElement && current.marker.PinElement) {
    return Promise.resolve(current as GoogleMapsApi);
  }
  if (googleMapsLoading) return googleMapsLoading;

  googleMapsLoading = new Promise((resolve, reject) => {
    const existingScript = document.getElementById("google-maps-js");
    // A previously injected API script may have loaded without the required libraries.
    // Replace it so the callback and requested libraries are applied consistently.
    existingScript?.remove();
    const script = document.createElement("script");
    script.id = "google-maps-js";
    script.async = true;
    const googleWindow = window as GoogleWindow;
    googleWindow.kyrgyzToursGoogleMapsReady = () => {
      const maps = (window as GoogleWindow).google?.maps;
      if (maps?.Map && maps.InfoWindow && maps.marker?.AdvancedMarkerElement && maps.marker.PinElement) {
        resolve(maps as GoogleMapsApi);
      } else {
        reject(new Error("Google Maps loaded without the map or marker libraries. Check that Maps JavaScript API is enabled for this key."));
      }
    };
    script.onerror = () => reject(new Error("Google Maps could not load. Check that Maps JavaScript API is enabled, billing is active, and localhost is allowed in the key's website restrictions."));
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=maps,marker&callback=kyrgyzToursGoogleMapsReady&v=weekly`;
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    googleMapsLoading = null;
    throw error;
  });

  return googleMapsLoading;
}

const GoogleMapCanvas = ({
  places,
  selectedPlace,
  userLocation,
  onSelectPlace,
  mapRef,
  setMapError,
}: {
  places: Place[];
  selectedPlace: Place | null;
  userLocation: [number, number] | null;
  onSelectPlace: (place: Place) => void;
  mapRef: MutableRefObject<GoogleMapApi | null>;
  setMapError: (message: string) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const infoWindowRef = useRef<GoogleInfoWindowApi | null>(null);
  const markersRef = useRef<Map<number, GoogleMarkerApi>>(new globalThis.Map());
  const userMarkerRef = useRef<GoogleMarkerApi | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setMapError("Google Maps API key is missing. Add VITE_GOOGLE_MAPS_API_KEY to .env.local and restart the dev server.");
      return;
    }

    let active = true;
    const googleWindow = window as GoogleWindow;
    const handleGoogleAuthFailure = () => {
      if (active) {
        setMapError("Google rejected this API key. In Google Cloud, enable Maps JavaScript API, check billing, and allow this site's HTTP referrer and API in the key restrictions.");
      }
    };
    googleWindow.gm_authFailure = handleGoogleAuthFailure;
    void loadGoogleMaps(apiKey).then(async (googleMaps) => {
      if (!active || !containerRef.current) return;
      const map = new googleMaps.Map(containerRef.current, {
        center: { lat: 41.8, lng: 74.6 },
        zoom: 7,
        minZoom: 6,
        maxZoom: 18,
        mapId: import.meta.env.VITE_GOOGLE_MAP_ID || "DEMO_MAP_ID",
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: { position: 9 },
      });
      mapRef.current = map;
      infoWindowRef.current = new googleMaps.InfoWindow({ maxWidth: 300 });
      setMapError("");
      setMapReady(true);
    }).catch((error: unknown) => {
      if (active) setMapError(error instanceof Error ? error.message : "Google Maps could not be loaded.");
    });

    return () => {
      active = false;
      if (googleWindow.gm_authFailure === handleGoogleAuthFailure) delete googleWindow.gm_authFailure;
      markersRef.current.forEach((marker) => { marker.map = null; });
      markersRef.current.clear();
      if (userMarkerRef.current) userMarkerRef.current.map = null;
      infoWindowRef.current?.close();
      mapRef.current = null;
    };
  }, [mapRef, setMapError]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    let active = true;
    void loadGoogleMaps(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "").then(async (googleMaps) => {
      if (!active || !mapRef.current) return;

      markersRef.current.forEach((marker) => { marker.map = null; });
      markersRef.current.clear();
      infoWindowRef.current?.close();

      places.forEach((place) => {
        const marker = new googleMaps.marker.AdvancedMarkerElement({
          map: mapRef.current!,
          position: { lat: place.lat, lng: place.lng },
          title: place.name,
        });
        const pin = new googleMaps.marker.PinElement({
          background: categoryColors[place.category],
          borderColor: "#ffffff",
          glyphColor: "#ffffff",
        });
        marker.append(pin.element);
        marker.addEventListener("gmp-click", () => {
          onSelectPlace(place);
          const content = document.createElement("div");
          content.style.maxWidth = "250px";
          const category = document.createElement("p");
          category.textContent = categoryLabels[place.category];
          category.style.color = categoryColors[place.category];
          category.style.fontSize = "12px";
          const title = document.createElement("h3");
          title.textContent = place.name;
          title.style.fontWeight = "700";
          title.style.margin = "4px 0";
          const region = document.createElement("p");
          region.textContent = place.region;
          region.style.color = "#6b7280";
          region.style.fontSize = "12px";
          const description = document.createElement("p");
          description.textContent = place.description;
          description.style.marginTop = "8px";
          content.append(category, title, region, description);
          infoWindowRef.current?.setContent(content);
          infoWindowRef.current?.open({ map: mapRef.current!, anchor: marker });
        });
        markersRef.current.set(place.id, marker);
      });
    }).catch((error: unknown) => {
      if (active) setMapError(error instanceof Error ? error.message : "Could not display map markers.");
    });
    return () => { active = false; };
  }, [mapReady, mapRef, onSelectPlace, places, setMapError]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !selectedPlace) return;
    mapRef.current.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
    mapRef.current.setZoom(selectedPlace.category === "attraction" ? 10 : 13);
  }, [mapReady, mapRef, selectedPlace]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    if (!userLocation) {
      if (userMarkerRef.current) userMarkerRef.current.map = null;
      userMarkerRef.current = null;
      return;
    }
    let active = true;
    void loadGoogleMaps(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "").then(async (googleMaps) => {
      if (!active || !mapRef.current) return;
      if (userMarkerRef.current) userMarkerRef.current.map = null;
      const marker = new googleMaps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat: userLocation[0], lng: userLocation[1] },
        title: "Your location",
      });
      const pin = new googleMaps.marker.PinElement({ background: "#85BC03", borderColor: "#ffffff", glyphColor: "#ffffff" });
      marker.append(pin.element);
      userMarkerRef.current = marker;
    });
    return () => { active = false; };
  }, [mapReady, mapRef, userLocation]);

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" aria-label="Google map of Kyrgyzstan" />;
};

const MapTools = ({
  visiblePlaces,
  onLocation,
  setLocationMessage,
  mapRef,
}: {
  visiblePlaces: Place[];
  onLocation: (location: [number, number]) => void;
  setLocationMessage: (message: string) => void;
  mapRef: MutableRefObject<GoogleMapApi | null>;
}) => {
  const fitPlaces = () => {
    const map = mapRef.current;
    if (!map || !visiblePlaces.length) return;
    if (visiblePlaces.length === 1) {
      const place = visiblePlaces[0];
      map.panTo({ lat: place.lat, lng: place.lng });
      map.setZoom(12);
      return;
    }
    const lats = visiblePlaces.map((place) => place.lat);
    const lngs = visiblePlaces.map((place) => place.lng);
    map.fitBounds({ south: Math.min(...lats), west: Math.min(...lngs), north: Math.max(...lats), east: Math.max(...lngs) }, 50);
  };

  const locateUser = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const location: [number, number] = [position.coords.latitude, position.coords.longitude];
      onLocation(location);
      mapRef.current?.panTo({ lat: location[0], lng: location[1] });
      mapRef.current?.setZoom(14);
      setLocationMessage("");
    }, () => {
      setLocationMessage("We couldn't access your location. Please allow location access in your browser.");
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <button onClick={fitPlaces} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-700 shadow-lg transition-colors hover:text-[#4A5C23]" title="Show all places" aria-label="Show all places"><Compass className="h-5 w-5" /></button>
      <button onClick={locateUser} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-700 shadow-lg transition-colors hover:text-[#4A5C23]" title="My location" aria-label="My location"><LocateFixed className="h-5 w-5" /></button>
      <button onClick={toggleFullscreen} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-700 shadow-lg transition-colors hover:text-[#4A5C23]" title="Fullscreen" aria-label="Fullscreen"><ArrowUpRight className="h-5 w-5" /></button>
    </div>
  );
};

const Map = () => {
  const { language, setLanguage, t } = useLanguage();
  const mapRef = useRef<GoogleMapApi | null>(null);
  const [mapError, setMapError] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<Category>("all");

  const [selectedDietary, setSelectedDietary] =
    useState<Dietary[]>([]);

  const [search, setSearch] = useState("");

  const [selectedPlace, setSelectedPlace] =
    useState<Place | null>(null);

  const [userLocation, setUserLocation] =
    useState<[number, number] | null>(null);

  const [locationMessage, setLocationMessage] =
    useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const selectPlace = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const filteredPlaces = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesCategory =
        activeCategory === "all" ||
        place.category === activeCategory;

      const matchesSearch =
        !normalizedSearch ||
        place.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        place.region
          .toLowerCase()
          .includes(normalizedSearch) ||
        place.description
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesDietary =
        selectedDietary.length === 0 ||
        selectedDietary.every((diet) =>
          place.dietary?.includes(diet)
        );

      return (
        matchesCategory &&
        matchesSearch &&
        matchesDietary
      );
    });
  }, [
    activeCategory,
    search,
    selectedDietary,
  ]);

  const toggleDietary = (diet: Dietary) => {
    setSelectedDietary((current) =>
      current.includes(diet)
        ? current.filter((item) => item !== diet)
        : [...current, diet]
    );
  };

  const routeToPlace = (place: Place) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="h-screen bg-[#f7f8f5] overflow-hidden">
      {/* HEADER */}

      <header className="h-16 bg-white border-b border-gray-200 relative z-[1200]">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <img
              src={Logo}
              alt="Kyrgyz Tours"
              className="w-[120px] h-auto object-contain"
            />

            <div className="hidden sm:block h-7 w-px bg-gray-200"></div>

            <span className="hidden sm:block text-sm font-semibold text-gray-700">
              {t("Explore Kyrgyzstan")}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {t("Interactive Map")}
            </div>

            <label className="sr-only" htmlFor="map-language">Language</label>
            <select id="map-language" value={language} onChange={(event) => setLanguage(event.target.value as "en" | "ru")} className="rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs text-gray-700">
              <option value="en">EN</option><option value="ru">RU</option>
            </select>

            <Link
              to="/"
              className="text-sm font-medium text-[#4A5C23] hover:text-[#85BC03] transition-colors"
            >
              {t("Back to website")}
            </Link>
          </div>
        </div>
      </header>

      {/* MAP */}

      <main className="relative h-[calc(100vh-64px)]">
        <GoogleMapCanvas
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          userLocation={userLocation}
          onSelectPlace={selectPlace}
          mapRef={mapRef}
          setMapError={setMapError}
        />
        {mapError && (
          <div role="alert" className="absolute inset-x-4 top-4 z-[1050] mx-auto max-w-2xl rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700 shadow-lg lg:left-[390px]">
            {mapError}
          </div>
        )}
        <MapTools
          visiblePlaces={filteredPlaces}
          onLocation={setUserLocation}
          setLocationMessage={setLocationMessage}
          mapRef={mapRef}
        />

        {/* MOBILE FILTER BUTTON */}

        <button
          onClick={() =>
            setSidebarOpen((current) => !current)
          }
          className="lg:hidden absolute top-4 left-4 z-[1100] bg-white shadow-lg rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-medium text-gray-800"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <SlidersHorizontal className="w-5 h-5" />
          )}

          {sidebarOpen
            ? "Close"
            : "Explore places"}
        </button>

        {/* SIDEBAR */}

        <aside
          className={`
            absolute
            top-4
            bottom-4
            left-4
            z-[1100]
            w-[360px]
            max-w-[calc(100vw-2rem)]
            bg-white
            rounded-2xl
            shadow-2xl
            overflow-hidden
            flex
            flex-col
            transition-transform
            duration-300
            lg:translate-x-0
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-[120%]"
            }
          `}
        >
          {/* SEARCH */}

          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {t("Explore Kyrgyzstan")}
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  {t("Find places, food and experiences")}
                </p>
              </div>

              <button
                onClick={() =>
                  setSidebarOpen(false)
                }
                className="lg:hidden w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder={t("Search places...")}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm focus:border-[#4A5C23] focus:ring-1 focus:ring-[#4A5C23]"
              />
            </div>

            {locationMessage && (
              <div className="mt-3 text-xs leading-relaxed bg-red-50 text-red-700 rounded-lg px-3 py-2">
                {locationMessage}
              </div>
            )}
          </div>

          {/* FILTERS */}

          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />

              <h2 className="text-sm font-semibold text-gray-900">
                {t("Categories")}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => {
                const Icon = category.icon;

                const active =
                  activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() =>
                      setActiveCategory(
                        category.id
                      )
                    }
                    className={`
                      flex
                      items-center
                      gap-2
                      px-3
                      py-2.5
                      rounded-lg
                      text-left
                      text-sm
                      transition-colors
                      ${
                        active
                          ? "bg-[#4A5C23] text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 shrink-0" />

                    <span>
                      {t(category.label)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DIETARY */}

          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4 text-[#4A5C23]" />

              <h2 className="text-sm font-semibold text-gray-900">
                {t("Dietary options")}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((option) => {
                const active =
                  selectedDietary.includes(
                    option.id
                  );

                return (
                  <button
                    key={option.id}
                    onClick={() =>
                      toggleDietary(option.id)
                    }
                    className={`
                      px-3
                      py-2
                      rounded-full
                      text-xs
                      font-medium
                      border
                      transition-colors
                      ${
                        active
                          ? "bg-[#4A5C23] text-white border-[#4A5C23]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#4A5C23]"
                      }
                    `}
                  >
                  {t(option.label)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SELECTED PLACE */}

          {selectedPlace && (
            <div className="p-5 bg-[#f7f8f5] border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className="text-xs font-medium"
                    style={{
                      color:
                        categoryColors[
                          selectedPlace.category
                        ],
                    }}
                  >
                    {
                      categoryLabels[
                        selectedPlace.category
                      ]
                    }
                  </span>

                  <h2 className="font-bold text-gray-900 mt-1">
                    {selectedPlace.name}
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    {selectedPlace.region}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSelectedPlace(null)
                  }
                  className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedPlace.rating && (
                <p className="text-sm text-gray-600 mt-3">
                  ★ {selectedPlace.rating}
                </p>
              )}

              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                {selectedPlace.description}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    routeToPlace(
                      selectedPlace
                    )
                  }
                  className="flex-1 bg-[#4A5C23] hover:bg-[#85BC03] text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Route
                </button>

                <button
                  onClick={() =>
                    setSelectedPlace(null)
                  }
                  className="px-4 border border-gray-200 bg-white rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* RESULTS */}

          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                {t("Places")}
              </h2>

              <span className="text-xs text-gray-500">
                {filteredPlaces.length} {t("found")}
              </span>
            </div>

            {filteredPlaces.length === 0 ? (
              <div className="px-5 pb-6">
                <div className="text-center py-10">
                  <MapPin className="w-8 h-8 mx-auto text-gray-300" />

                  <h3 className="font-semibold text-gray-800 mt-3">
                    {t("Nothing found")}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Try changing your search or
                    filters.
                  </p>
                </div>
              </div>
            ) : (
              <div className="px-4 pb-5 space-y-2">
                {filteredPlaces.map(
                  (place) => (
                    <button
                      key={place.id}
                      onClick={() =>
                        setSelectedPlace(place)
                      }
                      className={`
                        w-full
                        text-left
                        p-3
                        rounded-xl
                        border
                        transition-all
                        ${
                          selectedPlace?.id ===
                          place.id
                            ? "border-[#4A5C23] bg-[#f7f8f5]"
                            : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                        }
                      `}
                    >
                      <div className="flex gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor:
                              `${categoryColors[place.category]}18`,
                          }}
                        >
                          <MapPin
                            className="w-5 h-5"
                            style={{
                              color:
                                categoryColors[
                                  place.category
                                ],
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">
                          {t(place.name)}
                            </h3>

                            {place.rating && (
                              <span className="text-xs text-gray-500 shrink-0">
                                ★{" "}
                                {place.rating}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#4A5C23] mt-1">
                          {t(place.region)}
                          </p>

                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {t(place.description)}
                          </p>

                          {place.dietary &&
                            place.dietary.length >
                              0 && (
                              <div className="flex gap-1 mt-2">
                                {place.dietary.map(
                                  (diet) => (
                                    <span
                                      key={diet}
                                      className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-full"
                                    >
                                      {diet}
                                    </span>
                                  )
                                )}
                              </div>
                            )}

                          {place.isDemo && (
                            <span className="inline-block text-[10px] text-gray-400 mt-2">
                              Demo place
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </aside>

        {/* MOBILE LOCATION STATUS */}

        {userLocation && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] bg-white shadow-lg rounded-full px-4 py-2 text-xs font-medium text-gray-700 flex items-center gap-2">
            <LocateFixed className="w-4 h-4 text-[#4A5C23]" />
            Your location is shown on the map
          </div>
        )}
      </main>
    </div>
  );
};

export default Map;
