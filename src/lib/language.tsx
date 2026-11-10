import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "en" | "ru";

const translations: Record<string, string> = {
  "Home": "Главная", "About Us": "О нас", "Itineraries": "Маршруты", "Gallery": "Галерея",
  "Testimonials": "Отзывы", "Map": "Карта", "Favorites": "Избранное", "Contact Us": "Связаться",
  "Choose Your Adventure": "Выберите приключение", "Journeys made for": "Путешествия для",
  "curious travelers.": "любознательных путешественников.",
  "Every itinerary is designed to help you experience more than just the famous places. Discover landscapes, local traditions, mountain adventures and the people who make Kyrgyzstan special.": "Каждый маршрут поможет увидеть не только известные места, но и природу, традиции, горы и людей, которые делают Кыргызстан особенным.",
  "Loading journeys...": "Загружаем маршруты...", "We couldn't load the tours. Please try again later.": "Не удалось загрузить туры. Попробуйте позже.",
  "New journeys are coming soon": "Новые путешествия скоро появятся", "Please check back later to discover our tours.": "Загляните позже, чтобы увидеть наши туры.",
  "Kyrgyzstan": "Кыргызстан", "View Journey": "Подробнее о туре", "Our Journeys": "Наши маршруты",
  "Discover Kyrgyzstan Your Way": "Откройте Кыргызстан по-своему",
  "From short mountain escapes to unforgettable journeys across the country, choose the experience that fits your adventure.": "От коротких поездок в горы до путешествий через всю страну — выберите приключение по душе.",
  "Not sure which journey is right for you?": "Не знаете, какой маршрут выбрать?",
  "Tell us what kind of experience you're looking for and we'll help you plan your perfect Kyrgyzstan adventure.": "Расскажите, какие впечатления вы ищете, и мы поможем спланировать ваше путешествие по Кыргызстану.",
  "Talk to Us": "Связаться с нами", "Find your own way": "Найдите свой путь",
  "through Kyrgyzstan.": "по Кыргызстану.", "Mountain trails, alpine lakes and unforgettable encounters with the culture of the Silk Road.": "Горные тропы, высокогорные озёра и знакомство с культурой Великого шёлкового пути.",
  "Explore our tours": "Смотреть туры", "Company": "Компания", "About us": "О нас", "Our itineraries": "Наши маршруты",
  "Explore the map": "Открыть карту", "Saved tours": "Избранные туры", "For Partners": "Партнёрам",
  "Get in touch": "Связаться", "Planning a trip or need help choosing an itinerary? Let's talk.": "Планируете поездку или нужна помощь с выбором маршрута? Напишите нам.",
  "Contact us": "Связаться с нами", "All rights reserved.": "Все права защищены.", "Made for curious travelers.": "Для любознательных путешественников.",
  "Get in touch ↗": "Написать нам ↗", "Explore Through Photos": "Путешествие в фотографиях",
  "Moments from Kyrgyzstan": "Мгновения Кыргызстана", "Every landscape tells a story. Explore some of the places and experiences waiting for you.": "У каждого пейзажа своя история. Посмотрите, какие места и впечатления ждут вас.",
  "Click to view full screen": "Нажмите, чтобы открыть фото", "Show fewer photos": "Свернуть фотографии", "View all photos": "Смотреть все фотографии",
  "The Kyrgyzstan Experience": "Впечатления Кыргызстана", "See the Journey. Feel the Place.": "Увидеть маршрут. Почувствовать место.",
  "Mountains, lakes, valleys and unforgettable moments. Take a visual journey through the places that make Kyrgyzstan unique.": "Горы, озёра, долины и незабываемые моменты. Отправьтесь в визуальное путешествие по Кыргызстану.",
  "Your Travel Wishlist": "Ваш список путешествий", "Saved Journeys": "Избранные путешествия",
  "All the places and adventures you want to explore in Kyrgyzstan, collected in one place.": "Все места и приключения, которые вы хотите увидеть в Кыргызстане, собраны в одном месте.",
  "Back to itineraries": "К маршрутам", "Loading saved journeys...": "Загружаем избранное...",
  "journey": "путешествие", "journeys": "путешествий", "saved": "в избранном",
  "Toggle menu": "Открыть меню", "English": "Английский", "Russian": "Русский", "Language": "Язык",
  "Explore Kyrgyzstan": "Откройте Кыргызстан", "Your Journey Starts Here": "Ваше путешествие начинается здесь",
  "Welcome to Kyrgyzstan": "Добро пожаловать в Кыргызстан", "Discover the Land of Mountains and Nomads": "Откройте страну гор и кочевников",
  "We Bring You Closer to Kyrgyzstan": "Мы помогаем стать ближе к Кыргызстану", "About Kyrgyz Tours": "О Kyrgyz Tours",
  "Kyrgyzstan itineraries": "Маршруты по Кыргызстану", "Explore Kyrgyzstan with Expert-Planned Journeys": "Откройте Кыргызстан с продуманными маршрутами",
  "Voices From The Road": "Истории путешественников", "Why people remember Kyrgyzstan": "Почему путешественники помнят Кыргызстан",
  "Our story": "Наша история", "Meet the people behind the journey": "Познакомьтесь с теми, кто создаёт путешествия",
  "Booking request received": "Заявка на бронирование получена", "Payment": "Оплата", "Your selected tour": "Выбранный тур",
  "Travel stories, told by our guests": "Истории наших гостей",
  "Сотрудничество": "Сотрудничество", "Станьте нашим партнёром": "Станьте нашим партнёром",
  "Кыргызстан": "Кыргызстан",
  "Travel Stories": "Истории путешествий", "Stories From The Journey": "Истории из путешествий",
  "Traveling is about more than places. It is about the people you meet, the memories you create and the stories you take home with you.": "Путешествия — это не только места, но и люди, которых вы встречаете, воспоминания и истории, которые увозите с собой.",
  "Traveler Stories": "Истории путешественников", "The mountains may be what brings travelers here, but the experiences, people and culture are what make them want to return.": "Путешественников привлекают горы, а вернуться их заставляют впечатления, люди и культура.",
  "Traveler Experiences": "Впечатления путешественников", "Every journey is different.": "Каждое путешествие особенное.",
  "Your Story Could Be Next": "Ваша история может стать следующей", "Come experience": "Приезжайте и",
  "Kyrgyzstan yourself.": "откройте Кыргызстан сами.", "Everyone experiences Kyrgyzstan differently. Some come for the mountains. Some come for the lakes. Others come to experience a culture unlike anywhere else.": "Каждый открывает Кыргызстан по-своему. Одни приезжают ради гор и озёр, другие — ради уникальной культуры.",
  "Find Your Journey": "Найдите свой маршрут", "Your story starts here.": "Ваша история начинается здесь.",
  "Discover Kyrgyzstan and create memories worth sharing.": "Откройте Кыргызстан и создайте воспоминания, которыми захочется поделиться.",
  "Start Your Journey": "Начать путешествие", "Discover the places and culture that make every Kyrgyzstan journey unique.": "Откройте места и культуру, которые делают каждое путешествие по Кыргызстану особенным.",
  "Ala-Archa National Park": "Национальный парк Ала-Арча", "The Shores of Issyk-Kul": "Берега Иссык-Куля", "Evening at Song-Kul": "Вечер на Сон-Куле", "The Art of Shyrdak": "Искусство шырдака", "Burana Tower": "Башня Бурана", "Life on the Steppe": "Жизнь в степи",
  "Lake": "Озеро", "Mountains": "Горы", "Nomadic Life": "Кочевая жизнь", "Kyrgyz Culture": "Культура Кыргызстана", "History": "История", "Tradition": "Традиции",
  "Explore tours": "Смотреть туры", "Plan my trip": "Спланировать поездку", "ADVENTURE · NATURE · CULTURE": "ПРИКЛЮЧЕНИЯ · ПРИРОДА · КУЛЬТУРА",
  "Kyrgyzstan.\nA journey beyond.": "Кыргызстан.\nПутешествие за пределы привычного.",
  "Discover breathtaking mountain landscapes, crystal-clear alpine lakes and the timeless traditions of nomadic life.": "Откройте величественные горы, прозрачные высокогорные озёра и традиции кочевой жизни.",
  "WILD LANDSCAPES · OPEN ROADS": "ДИКАЯ ПРИРОДА · ОТКРЫТЫЕ ДОРОГИ", "Find your\nown adventure.": "Найдите своё\nприключение.",
  "Travel through high mountain passes, hidden valleys and extraordinary places far from the ordinary.": "Путешествуйте через высокие перевалы, скрытые долины и необычные места вдали от привычного.",
  "TRADITION · HOSPITALITY · DISCOVERY": "ТРАДИЦИИ · ГОСТЕПРИИМСТВО · ОТКРЫТИЯ", "Feel the spirit\nof the mountains.": "Почувствуйте дух\nгор.",
  "Meet local people, discover authentic culture and experience the beauty of Kyrgyzstan.": "Познакомьтесь с местными жителями, узнайте настоящую культуру и почувствуйте красоту Кыргызстана.",
  "Interactive Map": "Интерактивная карта", "Back to website": "На сайт", "Find places, food and experiences": "Места, еда и впечатления", "Search places...": "Поиск мест...", "Categories": "Категории", "Dietary options": "Тип питания", "Places": "Места", "found": "найдено", "Nothing found": "Ничего не найдено",
  "All places": "Все места", "Hotels": "Отели", "Restaurants": "Рестораны", "Cafes": "Кафе", "Attractions": "Достопримечательности", "Activities": "Занятия", "Halal": "Халяль", "Vegetarian": "Вегетарианское", "Vegan": "Веганское", "Show all places": "Показать все места",
  "The capital of Kyrgyzstan and a great starting point for exploring the country.": "Столица Кыргызстана и отличная отправная точка для знакомства со страной.", "A spectacular mountain destination located close to Bishkek.": "Впечатляющее горное место недалеко от Бишкека.", "A historic minaret and one of the most famous archaeological sites in Kyrgyzstan.": "Исторический минарет и одна из самых известных археологических достопримечательностей Кыргызстана.", "One of the world's largest high-altitude lakes surrounded by spectacular mountains.": "Одно из крупнейших высокогорных озёр в мире, окружённое величественными горами.", "A mountain town and gateway to hiking, skiing and other outdoor adventures.": "Горный город и отправная точка для походов, лыжного спорта и других приключений.", "A remote alpine lake surrounded by wide mountain pastures and nomadic landscapes.": "Уединённое высокогорное озеро среди просторных пастбищ и кочевых пейзажей.", "One of Central Asia's oldest cities and an important cultural destination.": "Один из старейших городов Центральной Азии и важный культурный центр.", "Chuy Region": "Чуйская область", "Issyk-Kul Region": "Иссык-Кульская область", "Naryn Region": "Нарынская область", "Osh Region": "Ошская область",
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return localStorage.getItem("kyrgyz-tours-language") === "ru" ? "ru" : "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try { localStorage.setItem("kyrgyz-tours-language", next); } catch { /* Storage may be unavailable. */ }
    document.documentElement.lang = next;
  };

  useEffect(() => { document.documentElement.lang = language; }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: (text) => language === "ru" ? translations[text] ?? text : text,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used within LanguageProvider");
  return value;
}
