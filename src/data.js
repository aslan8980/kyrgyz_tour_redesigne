import ThreeDays from "../src/assets/images/3-days.webp";
import FourDays from "../src/assets/images/4-days.webp";
import FiveDays from "../src/assets/images/5-days.webp";
import FourteenDays from "../src/assets/images/14-days.webp";

export const itineraryData = {
  "3-days": {
    title: "3 Days — Bishkek & Ala-Archa",
    shortDescription:
      "Discover Bishkek and explore the spectacular mountains of Ala-Archa National Park.",
    duration: "3 Days / 2 Nights",
    location: "Bishkek & Chuy Region",
    image: ThreeDays,

    days: [
      {
        day: "Day 1",
        title: "Arrival in Bishkek",
        description:
          "Explore the capital of Kyrgyzstan, visit Ala-Too Square, Oak Park and the local city center.",
      },
      {
        day: "Day 2",
        title: "Ala-Archa National Park",
        description:
          "Travel to Ala-Archa National Park and spend the day surrounded by spectacular mountain landscapes.",
      },
      {
        day: "Day 3",
        title: "Bishkek & Departure",
        description:
          "Enjoy your final morning in Bishkek, explore local markets and prepare for departure.",
      },
    ],
  },

  "4-days": {
    title: "4 Days — Issyk-Kul & Song-Kul",
    shortDescription:
      "Experience the crystal-clear waters of Issyk-Kul and the remote alpine landscapes of Song-Kul.",
    duration: "4 Days / 3 Nights",
    location: "Issyk-Kul & Naryn Region",
    image: FourDays,

    days: [
      {
        day: "Day 1",
        title: "Bishkek → Issyk-Kul",
        description:
          "Leave Bishkek and travel towards Issyk-Kul. Visit Burana Tower along the way and continue towards the lake.",
      },
      {
        day: "Day 2",
        title: "Discover Issyk-Kul",
        description:
          "Explore the shores of Issyk-Kul, enjoy the mountain scenery and discover the unique landscapes surrounding the lake.",
      },
      {
        day: "Day 3",
        title: "Issyk-Kul → Song-Kul",
        description:
          "Travel towards the high mountains of Naryn Region and arrive at Song-Kul. Experience traditional nomadic life and stay in a yurt.",
      },
      {
        day: "Day 4",
        title: "Song-Kul → Bishkek",
        description:
          "Enjoy the morning at Song-Kul, then begin the journey back to Bishkek through spectacular mountain landscapes.",
      },
    ],
  },

  "5-days": {
    title: "5 Days — Skiing & Snowboarding in Karakol",
    shortDescription:
      "Combine the beauty of Issyk-Kul with unforgettable skiing and snowboarding adventures in Karakol.",
    duration: "5 Days / 4 Nights",
    location: "Issyk-Kul Region",
    image: FiveDays,

    days: [
      {
        day: "Day 1",
        title: "Bishkek → Issyk-Kul",
        description:
          "Travel from Bishkek towards Issyk-Kul and enjoy the changing mountain landscapes along the way.",
      },
      {
        day: "Day 2",
        title: "Issyk-Kul → Karakol",
        description:
          "Explore the eastern part of Issyk-Kul and continue towards Karakol.",
      },
      {
        day: "Day 3",
        title: "Skiing in Karakol",
        description:
          "Spend the day skiing or snowboarding in the mountains surrounding Karakol.",
      },
      {
        day: "Day 4",
        title: "Mountain Adventure",
        description:
          "Enjoy another day in the mountains with skiing, snowboarding or other winter activities.",
      },
      {
        day: "Day 5",
        title: "Karakol → Bishkek",
        description:
          "Enjoy your final morning in Karakol before returning to Bishkek.",
      },
    ],
  },

  "14-days": {
    title: "14 Days — Discover Kyrgyzstan",
    shortDescription:
      "A complete journey through Kyrgyzstan's mountains, lakes, valleys, cities and nomadic culture.",
    duration: "14 Days / 13 Nights",
    location: "Kyrgyzstan",
    image: FourteenDays,

    days: [
      {
        day: "Day 1",
        title: "Arrival in Bishkek",
        description:
          "Arrival and introduction to Bishkek.",
      },
      {
        day: "Day 2",
        title: "Bishkek & Ala-Archa",
        description:
          "Explore Bishkek and visit Ala-Archa National Park.",
      },
      {
        day: "Day 3",
        title: "Bishkek → Issyk-Kul",
        description:
          "Travel towards the famous Issyk-Kul Lake.",
      },
      {
        day: "Day 4",
        title: "Issyk-Kul",
        description:
          "Explore the northern shores and surrounding landscapes.",
      },
      {
        day: "Day 5",
        title: "Issyk-Kul → Karakol",
        description:
          "Continue towards Karakol and explore the city.",
      },
      {
        day: "Day 6",
        title: "Karakol & Mountains",
        description:
          "Discover the mountain landscapes around Karakol.",
      },
      {
        day: "Day 7",
        title: "Jeti-Oguz",
        description:
          "Visit the famous red rock formations and surrounding valleys.",
      },
      {
        day: "Day 8",
        title: "Karakol → Naryn",
        description:
          "Travel through spectacular mountain landscapes towards Naryn.",
      },
      {
        day: "Day 9",
        title: "Song-Kul",
        description:
          "Experience the high-altitude lake and traditional nomadic lifestyle.",
      },
      {
        day: "Day 10",
        title: "Song-Kul → Naryn",
        description:
          "Leave Song-Kul and continue exploring the Naryn region.",
      },
      {
        day: "Day 11",
        title: "Naryn Region",
        description:
          "Explore remote mountain landscapes and local culture.",
      },
      {
        day: "Day 12",
        title: "Naryn → Bishkek",
        description:
          "Return towards Bishkek.",
      },
      {
        day: "Day 13",
        title: "Bishkek",
        description:
          "Final day to explore Bishkek, shop for souvenirs and enjoy local cuisine.",
      },
      {
        day: "Day 14",
        title: "Departure",
        description:
          "Transfer to the airport and departure from Kyrgyzstan.",
      },
    ],
  },
};

export const itinerariesCard = [
  {
    id: 1,
    img: ThreeDays,
    title: "3 Days — Bishkek & Ala-Archa",
    url: "/itineraries/3-days",
  },
  {
    id: 2,
    img: FourDays,
    title: "4 Days — Issyk-Kul & Song-Kul",
    url: "/itineraries/4-days",
  },
  {
    id: 3,
    img: FiveDays,
    title: "5 Days — Skiing & Snowboarding in Karakol",
    url: "/itineraries/5-days",
  },
  {
    id: 4,
    img: FourteenDays,
    title: "14 Days — Discover Kyrgyzstan",
    url: "/itineraries/14-days",
  },
];