export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image_url: string;
  category: string;
  published: boolean;
  created_at: string;
  sources: { label: string; url: string }[];
};

export const starterBlogPosts: BlogPost[] = [
  {
    id: "starter-souvenirs",
    slug: "souvenirs-to-buy-in-kyrgyzstan",
    title: "Souvenirs to Buy in Kyrgyzstan: Handmade Finds with a Story",
    excerpt: "From felt craft and woven textiles to small gifts for your suitcase, here are meaningful things to look for — and how to choose them thoughtfully.",
    category: "Culture & shopping",
    image_url: "/images/gallery/gallery-craft.jpg",
    published: true,
    created_at: "2026-11-11T00:00:00.000Z",
    content: [
      "The most memorable souvenirs from Kyrgyzstan are often made by hand and connected to everyday life. Look for work made from felt, wool, leather or textile, and ask the maker or seller where it comes from. A little conversation can turn a purchase into a story you will remember long after the trip.",
      "A small shyrdak or ala-kiyiz piece is an easy way to take home Kyrgyz felt-making traditions without carrying a full-sized rug. These patterned felt pieces can be used as a wall hanging, table accent or cushion cover. Check the stitching, finish and size, and choose a design you genuinely like rather than buying only because it looks traditional.",
      "The ak kalpak, the white felt hat associated with Kyrgyz culture, is another distinctive gift. You will find versions in different materials and levels of detail. If you are buying one to wear, try it on; if it is a gift, ask about sizing and how it should be stored. Small felt ornaments, embroidered pouches and textile accessories are lighter alternatives.",
      "For edible gifts, consider locally made honey, dried fruit, nuts, spices or kurut, the small dried dairy snack. Food products may be subject to airline and destination-country import rules, so check those rules before packing them. Keep packaged goods sealed and avoid buying more than you can comfortably carry.",
      "Bazaars are lively places to browse, while craft shops and artisan workshops can make it easier to learn about materials and makers. Compare a few options, ask politely about the price and origin, and carry small cash for market purchases. When possible, buy directly from the artisan or a local cooperative so your purchase supports the people who made it.",
      "A good souvenir does not need to be expensive or large. Choose something well made, easy to transport and meaningful to you. For larger textiles, antiques, wildlife products or anything that may be regulated, confirm export and customs requirements before you buy.",
    ],
    sources: [
      { label: "UNESCO: Kyrgyz felt carpets — shyrdak and ala-kiyiz", url: "https://ich.unesco.org/en/RL/ala-kiyiz-and-shyrdak-art-of-kyrgyz-traditional-felt-carpet-making-00993" },
      { label: "UNESCO: Ak-kalpak craftsmanship", url: "https://ich.unesco.org/en/RL/ak-kalpak-craftsmanship-traditional-knowledge-and-skills-in-making-and-wearing-kyrgyz-mens-headwear-01398" },
    ],
  },
  {
    id: "starter-apps",
    slug: "useful-apps-for-travel-in-kyrgyzstan",
    title: "Useful Apps for Traveling in Kyrgyzstan",
    excerpt: "A practical phone toolkit for getting around Bishkek, translating everyday phrases and preparing for places where mobile coverage may be limited.",
    category: "Travel tips",
    image_url: "/images/gallery/gallery-ala-archa.jpg",
    published: true,
    created_at: "2026-11-11T00:00:00.000Z",
    content: [
      "A few well-chosen apps can make the practical side of a Kyrgyzstan trip easier. Install them before you travel, check that they work on your phone and download the maps or language packs you may need while you still have a reliable connection.",
      "For city navigation, try 2GIS for business listings and directions, and keep Google Maps or another familiar map as a backup. Before a day trip or mountain drive, save the route and destination details offline. Map coverage and road information can vary outside towns, so a phone map is a planning aid, not a substitute for local advice or a guide on remote routes.",
      "For rides in Bishkek and other cities where the service is available, Yandex Go can help you request a taxi and see the fare estimate in the app. Availability, payment options and phone-number requirements can change, so check the app before relying on it. For intercity travel and remote areas, arrange transport with your accommodation or tour organizer in advance.",
      "Download Russian and Kyrgyz language packs in Google Translate or your preferred translation app. Offline translation is useful for short exchanges when data is slow or unavailable. Save key addresses, accommodation phone numbers and your organizer's contact details in your notes as well.",
      "For hikes and rural travel, install an offline outdoor map app such as Organic Maps or Maps.me and download the relevant region before leaving town. Let someone know your route and return time. Mountain weather, trail conditions and mobile coverage can change quickly; use current local information and do not depend on a single app for safety.",
      "Finally, keep WhatsApp or another messaging app your contacts use, a weather app, and a currency converter. Save essential information offline, bring a power bank and keep a paper or screenshot copy of important addresses. Apps are most useful when they support a plan you have already checked with people on the ground.",
    ],
    sources: [
      { label: "2GIS Kyrgyzstan", url: "https://2gis.kg/" },
      { label: "Yandex Go", url: "https://go.yandex/" },
      { label: "Organic Maps", url: "https://organicmaps.app/" },
      { label: "Travel advice for Kyrgyzstan — hiking.kg", url: "https://hiking.kg/en/info" },
    ],
  },
];
