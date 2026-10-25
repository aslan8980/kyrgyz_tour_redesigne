import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";

import Logo from "../assets/images/logo1.webp";

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

const createMarkerIcon = (
  category: Exclude<Category, "all">
) => {
  const color = categoryColors[category];

  return L.divIcon({
    className: "kyrgyz-map-marker",
    html: `
      <div
        style="
          width:34px;
          height:34px;
          background:${color};
          border:3px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 4px 12px rgba(0,0,0,0.25);
          display:flex;
          align-items:center;
          justify-content:center;
        "
      >
        <div
          style="
            width:8px;
            height:8px;
            background:white;
            border-radius:50%;
            transform:rotate(45deg);
          "
        ></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
};

const FocusSelectedPlace = ({
  place,
}: {
  place: Place | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!place) return;

    map.flyTo(
      [place.lat, place.lng],
      place.category === "attraction" ? 10 : 13,
      {
        duration: 0.8,
      }
    );
  }, [place, map]);

  return null;
};

const MapTools = ({
  visiblePlaces,
  onLocation,
  setLocationMessage,
}: {
  visiblePlaces: Place[];
  onLocation: (location: [number, number]) => void;
  setLocationMessage: (message: string) => void;
}) => {
  const map = useMap();

  const fitPlaces = () => {
    if (!visiblePlaces.length) return;

    const bounds = L.latLngBounds(
      visiblePlaces.map((place) => [
        place.lat,
        place.lng,
      ])
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 10,
    });
  };

  const locateUser = () => {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        onLocation(location);

        map.flyTo(location, 14, {
          duration: 1,
        });

        setLocationMessage("");
      },
      () => {
        setLocationMessage(
          "We couldn't access your location. Please allow location access in your browser."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={fitPlaces}
        className="w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-700 hover:text-[#4A5C23] transition-colors"
        title="Show all places"
        aria-label="Show all places"
      >
        <Compass className="w-5 h-5" />
      </button>

      <button
        onClick={locateUser}
        className="w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-700 hover:text-[#4A5C23] transition-colors"
        title="My location"
        aria-label="My location"
      >
        <LocateFixed className="w-5 h-5" />
      </button>

      <button
        onClick={toggleFullscreen}
        className="w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-700 hover:text-[#4A5C23] transition-colors"
        title="Fullscreen"
        aria-label="Fullscreen"
      >
        <ArrowUpRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const Map = () => {
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
              Explore Kyrgyzstan
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              Interactive Map
            </div>

            <Link
              to="/"
              className="text-sm font-medium text-[#4A5C23] hover:text-[#85BC03] transition-colors"
            >
              Back to website
            </Link>
          </div>
        </div>
      </header>

      {/* MAP */}

      <main className="relative h-[calc(100vh-64px)]">
        <MapContainer
          center={[41.8, 74.6]}
          zoom={7}
          minZoom={6}
          maxZoom={18}
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ZoomControl position="bottomright" />

          <FocusSelectedPlace
            place={selectedPlace}
          />

          <MapTools
            visiblePlaces={filteredPlaces}
            onLocation={setUserLocation}
            setLocationMessage={setLocationMessage}
          />

          {userLocation && (
            <CircleMarker
              center={userLocation}
              radius={9}
              pathOptions={{
                color: "#4A5C23",
                fillColor: "#85BC03",
                fillOpacity: 0.9,
                weight: 3,
              }}
            />
          )}

          {filteredPlaces.map((place) => (
            <Marker
              key={place.id}
              position={[
                place.lat,
                place.lng,
              ]}
              icon={createMarkerIcon(
                place.category
              )}
              eventHandlers={{
                click: () => {
                  setSelectedPlace(place);
                },
              }}
            >
              <Popup maxWidth={300}>
                <div className="min-w-[220px]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span
                        className="inline-block text-xs font-medium px-2 py-1 rounded-full mb-2"
                        style={{
                          backgroundColor:
                            `${categoryColors[place.category]}18`,
                          color:
                            categoryColors[
                              place.category
                            ],
                        }}
                      >
                        {
                          categoryLabels[
                            place.category
                          ]
                        }
                      </span>

                      <h3 className="font-semibold text-gray-900 text-base">
                        {place.name}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {place.region}
                      </p>
                    </div>
                  </div>

                  {place.rating && (
                    <div className="mt-2 text-sm text-gray-600">
                      ★ {place.rating}
                    </div>
                  )}

                  <p className="text-sm text-gray-600 leading-relaxed mt-3">
                    {place.description}
                  </p>

                  {place.dietary &&
                    place.dietary.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {place.dietary.map(
                          (diet) => (
                            <span
                              key={diet}
                              className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full"
                            >
                              {diet}
                            </span>
                          )
                        )}
                      </div>
                    )}

                  <button
                    onClick={() =>
                      setSelectedPlace(place)
                    }
                    className="w-full mt-4 bg-[#4A5C23] hover:bg-[#85BC03] text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                  >
                    View details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

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
                  Explore Kyrgyzstan
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Find places, food and experiences
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
                placeholder="Search places..."
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
                Categories
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
                      {category.label}
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
                Dietary options
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
                    {option.label}
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
                Places
              </h2>

              <span className="text-xs text-gray-500">
                {filteredPlaces.length} found
              </span>
            </div>

            {filteredPlaces.length === 0 ? (
              <div className="px-5 pb-6">
                <div className="text-center py-10">
                  <MapPin className="w-8 h-8 mx-auto text-gray-300" />

                  <h3 className="font-semibold text-gray-800 mt-3">
                    Nothing found
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
                              {place.name}
                            </h3>

                            {place.rating && (
                              <span className="text-xs text-gray-500 shrink-0">
                                ★{" "}
                                {place.rating}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#4A5C23] mt-1">
                            {place.region}
                          </p>

                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                            {place.description}
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