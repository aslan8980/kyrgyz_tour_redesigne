import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Building2, CheckCircle2, Compass, Handshake, LoaderCircle, MapPinned, Plane, Route, Truck } from "lucide-react";
import Navigation from "../components/Navigation";
import PageHero from "../components/PageHero";
import PartnersHero from "../assets/images/site/editorial/about-hospitality.jpg";
import { supabase } from "../lib/supabase";

type PartnerType = "travel_agency" | "accommodation" | "other";

const partnerFields = [
  { name: "company_name", label: "Название компании", required: true, type: "text" },
  { name: "contact_person", label: "Контактное лицо", required: true, type: "text" },
  { name: "country", label: "Страна", required: true, type: "text" },
  { name: "email", label: "Рабочий email", required: true, type: "email" },
  { name: "website", label: "Сайт компании (необязательно)", required: false, type: "url" },
] as const;

const agencyBenefits = [
  "Организация туристических маршрутов и индивидуальных программ",
  "Встреча в аэропорту, транспорт и трансферы",
  "Бронирование размещения и услуги местных гидов",
  "Специальные B2B-тарифы для партнёров",
];

const accommodationBenefits = [
  "Размещение объекта в каталоге сайта",
  "Рекомендации вашего объекта нашим туристам",
  "Взаимное продвижение, в том числе в социальных сетях",
  "Совместные туристические предложения",
];

const advantages = [
  { icon: Compass, title: "Местная экспертиза", text: "Знаем направления, маршруты и туристическую инфраструктуру Кыргызстана." },
  { icon: Route, title: "Комплексная организация", text: "Координируем транспорт, размещение, гидов и впечатления на маршруте." },
  { icon: Handshake, title: "Гибкое сотрудничество", text: "Подбираем формат и услуги под задачи каждого партнёра." },
  { icon: Building2, title: "Взаимное развитие", text: "Строим долгосрочные отношения и растём вместе с локальным бизнесом." },
];

const steps = [
  { number: "01", title: "Свяжитесь с нами", text: "Расскажите о своей компании и интересующем формате сотрудничества." },
  { number: "02", title: "Обсудим условия", text: "Согласуем услуги, цены и удобную модель партнёрства." },
  { number: "03", title: "Начнём сотрудничество", text: "Организуем совместную работу и будем принимать ваших туристов." },
];

const inputClass = "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#17200f] outline-none transition placeholder:text-gray-400 focus:border-[#4A5C23] focus:ring-2 focus:ring-[#4A5C23]/10";

const Partners = () => {
  const [partnerType, setPartnerType] = useState<PartnerType>("travel_agency");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const value = (name: string) => String(values.get(name) ?? "").trim();
    const payload = {
      partner_type: partnerType,
      company_name: value("company_name"),
      contact_person: value("contact_person"),
      country: value("country"),
      email: value("email"),
      website: value("website") || null,
      estimated_tourists: partnerType === "travel_agency" ? value("estimated_tourists") || null : null,
      main_markets: partnerType === "travel_agency" ? value("main_markets") || null : null,
      property_name: partnerType === "accommodation" ? value("property_name") || null : null,
      property_location: partnerType === "accommodation" ? value("property_location") || null : null,
      accommodation_type: partnerType === "accommodation" ? value("accommodation_type") || null : null,
      message: value("message") || null,
    };

    setSending(true);
    setFeedback(null);
    try {
      const { error } = await supabase.from("partner_inquiries").insert(payload);
      if (error) throw error;
      form.reset();
      setFeedback({ type: "success", text: "Спасибо! Заявка отправлена. Мы свяжемся с вами по рабочей почте." });
    } catch (error) {
      console.error("Partner inquiry submission failed:", error);
      setFeedback({ type: "error", text: "Не удалось отправить заявку. Проверьте подключение и настройки Supabase, затем попробуйте ещё раз." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <PageHero
        image={PartnersHero}
        imageAlt="Гостеприимство в Кыргызстане"
        eyebrow="Сотрудничество"
        title="Станьте нашим партнёром"
        description="Давайте вместе развивать туризм в Кыргызстане. Мы помогаем туристическим компаниям и гостиничному бизнесу создавать незабываемые путешествия для своих клиентов."
      >
        <a href="#partner-inquiry" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#17200f] transition hover:bg-[#e9eddf]">
          Обсудить сотрудничество <ArrowRight size={17} />
        </a>
      </PageHero>

      <main>
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionHeading eyebrow="Наши партнёры" title="С кем мы сотрудничаем" description="Открыты к сотрудничеству с компаниями, которые помогают путешественникам открывать Кыргызстан." />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <PartnerCard
              icon={<Plane size={22} />}
              title="Туристические агентства и туроператоры"
              description="Расширьте ассортимент своих туристических предложений благодаря сотрудничеству с местной туристической компанией в Кыргызстане. Мы организуем путешествия и необходимые услуги на месте."
              items={agencyBenefits}
              cta="Стать туристическим партнёром"
            />
            <PartnerCard
              icon={<Building2 size={22} />}
              title="Отели, хостелы и гостиничный бизнес"
              description="Давайте вместе привлекать путешественников и создавать взаимовыгодное сотрудничество между туристическим и гостиничным бизнесом."
              items={accommodationBenefits}
              cta="Стать партнёром по размещению"
            />
          </div>
        </section>

        <section className="bg-[#f7f8f4]">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
            <SectionHeading eyebrow="Почему Kyrgyz Tours" title="Партнёрство, основанное на местном опыте" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {advantages.map(({ icon: Icon, title, text }) => (
                <article key={title} className="flex gap-4 rounded-2xl border border-[#e7e9e1] bg-white p-5 sm:p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e9eddf] text-[#4A5C23]"><Icon size={20} /></span>
                  <div><h3 className="font-semibold text-[#17200f]">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionHeading eyebrow="Три шага" title="Как происходит сотрудничество" />
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.number} className="relative border-t border-[#dfe4d5] pt-5">
                <p className="text-sm font-semibold tracking-[0.16em] text-[#71805a]">{step.number}</p>
                <h3 className="mt-3 text-xl font-semibold text-[#17200f]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{step.text}</p>
                {index < steps.length - 1 && <ArrowRight aria-hidden="true" className="absolute right-1 top-5 hidden text-[#a8b191] md:block" size={18} />}
              </article>
            ))}
          </div>
        </section>

        <section id="partner-inquiry" className="scroll-mt-24 bg-[#f7f8f4]">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#71805a]">Начнём разговор</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#17200f] sm:text-4xl">Расскажите о вашей компании</h2>
                <p className="mt-4 max-w-md leading-7 text-gray-600">Заполните форму, и мы свяжемся с вами, чтобы обсудить формат и условия сотрудничества.</p>
                <div className="mt-7 flex items-start gap-3 text-sm leading-6 text-gray-600"><MapPinned size={18} className="mt-1 shrink-0 text-[#4A5C23]" />Кыргызстан — на месте координируем маршруты, размещение и транспорт.</div>
                <div className="mt-4 flex items-start gap-3 text-sm leading-6 text-gray-600"><Truck size={18} className="mt-1 shrink-0 text-[#4A5C23]" />Подготовим предложение под вашу компанию и запросы путешественников.</div>
              </div>

              <form onSubmit={handleSubmit} className="rounded-3xl border border-[#e5e8de] bg-white p-5 shadow-sm sm:p-8">
                <div>
                  <label htmlFor="partner-type" className="text-sm font-medium text-gray-700">Тип партнёрства *</label>
                  <select id="partner-type" value={partnerType} onChange={(event) => setPartnerType(event.target.value as PartnerType)} className={inputClass}>
                    <option value="travel_agency">Туристическое агентство / Туроператор</option>
                    <option value="accommodation">Отель / Хостел / Гостевой дом</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {partnerFields.map((field) => (
                    <div key={field.name} className={field.name === "website" ? "sm:col-span-2" : ""}>
                      <label htmlFor={field.name} className="text-sm font-medium text-gray-700">{field.label}{field.required ? " *" : ""}</label>
                      <input id={field.name} name={field.name} type={field.type} required={field.required} maxLength={field.name === "email" ? 254 : 200} className={inputClass} placeholder={field.name === "email" ? "name@company.com" : undefined} />
                    </div>
                  ))}
                </div>

                {partnerType === "travel_agency" && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div><label htmlFor="estimated_tourists" className="text-sm font-medium text-gray-700">Примерное количество туристов в год</label><input id="estimated_tourists" name="estimated_tourists" className={inputClass} placeholder="Например, 50–100" /></div>
                    <div><label htmlFor="main_markets" className="text-sm font-medium text-gray-700">Основные рынки и страны</label><input id="main_markets" name="main_markets" className={inputClass} placeholder="Например, Германия, Франция" /></div>
                  </div>
                )}

                {partnerType === "accommodation" && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div><label htmlFor="property_name" className="text-sm font-medium text-gray-700">Название объекта *</label><input id="property_name" name="property_name" required className={inputClass} /></div>
                    <div><label htmlFor="property_location" className="text-sm font-medium text-gray-700">Местоположение *</label><input id="property_location" name="property_location" required className={inputClass} placeholder="Город или регион" /></div>
                    <div className="sm:col-span-2"><label htmlFor="accommodation_type" className="text-sm font-medium text-gray-700">Тип размещения *</label><select id="accommodation_type" name="accommodation_type" required className={inputClass}><option value="">Выберите тип</option><option>Отель</option><option>Хостел</option><option>Гостевой дом</option><option>Юрточный лагерь</option><option>Другое</option></select></div>
                  </div>
                )}

                <div className="mt-5"><label htmlFor="partner-message" className="text-sm font-medium text-gray-700">Сообщение</label><textarea id="partner-message" name="message" rows={4} maxLength={5000} className={inputClass} placeholder="Расскажите, какой формат сотрудничества вас интересует" /></div>

                {feedback && <div role={feedback.type === "success" ? "status" : "alert"} className={`mt-5 rounded-xl p-4 text-sm leading-6 ${feedback.type === "success" ? "bg-[#edf3e5] text-[#35451a]" : "bg-red-50 text-red-700"}`}>{feedback.text}</div>}

                <button type="submit" disabled={sending} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4A5C23] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#35451a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                  {sending ? <><LoaderCircle size={17} className="animate-spin" />Отправляем заявку…</> : <>Отправить заявку на сотрудничество <ArrowRight size={17} /></>}
                </button>
                <p className="mt-3 text-xs leading-5 text-gray-500">Отправляя форму, вы разрешаете нам использовать контактные данные, чтобы ответить на заявку.</p>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const SectionHeading = ({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) => (
  <div className="max-w-3xl">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#71805a]">{eyebrow}</p>
    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#17200f] sm:text-4xl">{title}</h2>
    {description && <p className="mt-4 max-w-2xl leading-7 text-gray-600">{description}</p>}
  </div>
);

const PartnerCard = ({ icon, title, description, items, cta }: { icon: ReactNode; title: string; description: string; items: string[]; cta: string }) => (
  <article className="flex h-full flex-col rounded-3xl border border-[#e5e8de] bg-white p-6 sm:p-8">
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9eddf] text-[#4A5C23]">{icon}</span>
    <h3 className="mt-5 text-xl font-semibold leading-snug text-[#17200f]">{title}</h3>
    <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
    <ul className="mt-5 space-y-3">
      {items.map((item) => <li key={item} className="flex items-start gap-2.5 text-sm leading-5 text-gray-600"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#71805a]" />{item}</li>)}
    </ul>
    <a href="#partner-inquiry" className="mt-7 inline-flex items-center gap-2 self-start font-semibold text-[#4A5C23] transition hover:text-[#17200f]">{cta}<ArrowRight size={17} /></a>
  </article>
);

export default Partners;
