import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Building2, CheckCircle2, Compass, Handshake, LoaderCircle, MapPinned, Plane, Route, Truck } from "lucide-react";
import Navigation from "../components/Navigation";
import PageHero from "../components/PageHero";
import PartnersHero from "../assets/images/site/editorial/about-hospitality.jpg";
import { supabase } from "../lib/supabase";

type PartnerType = "travel_agency" | "accommodation" | "other";

const partnerFields = [
  { name: "company_name", label: "Company name", required: true, type: "text" },
  { name: "contact_person", label: "Contact person", required: true, type: "text" },
  { name: "country", label: "Country", required: true, type: "text" },
  { name: "email", label: "Work email", required: true, type: "email" },
  { name: "website", label: "Company website (optional)", required: false, type: "url" },
] as const;

const agencyBenefits = [
  "Discuss guided itineraries and custom trip requests",
  "Ask about local transport and transfers",
  "Discuss accommodation and local guide arrangements",
  "Agree on services and rates for each request",
];

const accommodationBenefits = [
  "Discuss accommodation options for our travelers",
  "Share property details and availability",
  "Explore referrals and joint promotion",
  "Discuss travel offers together",
];

const advantages = [
  { icon: Compass, title: "Local knowledge", text: "We are based in Kyrgyzstan and focus on its destinations and travel routes." },
  { icon: Route, title: "Trip coordination", text: "Discuss transport, accommodation and local guide arrangements with us." },
  { icon: Handshake, title: "Flexible collaboration", text: "We agree on scope, services and terms for each partnership." },
  { icon: Building2, title: "Local connections", text: "We welcome conversations with businesses serving travelers in Kyrgyzstan." },
];

const steps = [
  { number: "01", title: "Tell us about your business", text: "Share your company details and the kind of partnership you have in mind." },
  { number: "02", title: "Discuss the details", text: "We will review services, rates and practical arrangements together." },
  { number: "03", title: "Agree on next steps", text: "If it is a good fit, we will confirm the scope and how to work together." },
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
      setFeedback({ type: "success", text: "Thank you. Your inquiry has been sent. We will reply to your work email." });
    } catch (error) {
      console.error("Partner inquiry submission failed:", error);
      setFeedback({ type: "error", text: "We could not send your inquiry. Please check your connection and try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <PageHero
        image={PartnersHero}
        imageAlt="A local host welcomes travelers in Kyrgyzstan"
        eyebrow="Partnerships"
        title="Work with Kyrgyz Tours"
        description="We welcome travel agencies, tour operators and accommodation providers interested in working with a Kyrgyzstan-based travel business. Share your idea and we can discuss whether there is a good fit."
      >
        <a href="#partner-inquiry" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#17200f] transition hover:bg-[#e9eddf]">
          Discuss a partnership <ArrowRight size={17} />
        </a>
      </PageHero>

      <main>
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionHeading eyebrow="Who we work with" title="Partnership opportunities" description="We are open to conversations with businesses that help travelers experience Kyrgyzstan." />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <PartnerCard
              icon={<Plane size={22} />}
              title="Travel agencies and tour operators"
              description="Looking for a local contact in Kyrgyzstan? Tell us what your travelers need and we can discuss possible itineraries and on-the-ground arrangements."
              items={agencyBenefits}
              cta="Discuss travel services"
            />
            <PartnerCard
              icon={<Building2 size={22} />}
              title="Hotels, hostels and guesthouses"
              description="We welcome accommodation providers interested in discussing stays for travelers exploring Kyrgyzstan."
              items={accommodationBenefits}
              cta="Discuss accommodation"
            />
          </div>
        </section>

        <section className="bg-[#f7f8f4]">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
            <SectionHeading eyebrow="Why Kyrgyz Tours" title="Local knowledge, clear arrangements" />
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
          <SectionHeading eyebrow="Next steps" title="How a partnership starts" />
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
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#71805a]">Start a conversation</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#17200f] sm:text-4xl">Tell us about your business</h2>
                <p className="mt-4 max-w-md leading-7 text-gray-600">Send us a few details and we will get in touch to discuss your idea and possible terms.</p>
                <div className="mt-7 flex items-start gap-3 text-sm leading-6 text-gray-600"><MapPinned size={18} className="mt-1 shrink-0 text-[#4A5C23]" />Kyrgyzstan-based travel planning and local coordination.</div>
                <div className="mt-4 flex items-start gap-3 text-sm leading-6 text-gray-600"><Truck size={18} className="mt-1 shrink-0 text-[#4A5C23]" />Services and availability are discussed for each request.</div>
              </div>

              <form onSubmit={handleSubmit} className="rounded-3xl border border-[#e5e8de] bg-white p-5 shadow-sm sm:p-8">
                <div>
                  <label htmlFor="partner-type" className="text-sm font-medium text-gray-700">Partnership type *</label>
                  <select id="partner-type" value={partnerType} onChange={(event) => setPartnerType(event.target.value as PartnerType)} className={inputClass}>
                    <option value="travel_agency">Travel agency / tour operator</option>
                    <option value="accommodation">Hotel / hostel / guesthouse</option>
                    <option value="other">Other</option>
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
                    <div><label htmlFor="estimated_tourists" className="text-sm font-medium text-gray-700">Estimated travelers per year</label><input id="estimated_tourists" name="estimated_tourists" className={inputClass} placeholder="For example, 50–100" /></div>
                    <div><label htmlFor="main_markets" className="text-sm font-medium text-gray-700">Main markets and countries</label><input id="main_markets" name="main_markets" className={inputClass} placeholder="For example, Germany, France" /></div>
                  </div>
                )}

                {partnerType === "accommodation" && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div><label htmlFor="property_name" className="text-sm font-medium text-gray-700">Property name *</label><input id="property_name" name="property_name" required className={inputClass} /></div>
                    <div><label htmlFor="property_location" className="text-sm font-medium text-gray-700">Location *</label><input id="property_location" name="property_location" required className={inputClass} placeholder="City or region" /></div>
                    <div className="sm:col-span-2"><label htmlFor="accommodation_type" className="text-sm font-medium text-gray-700">Accommodation type *</label><select id="accommodation_type" name="accommodation_type" required className={inputClass}><option value="">Select a type</option><option>Hotel</option><option>Hostel</option><option>Guesthouse</option><option>Yurt camp</option><option>Other</option></select></div>
                  </div>
                )}

                <div className="mt-5"><label htmlFor="partner-message" className="text-sm font-medium text-gray-700">Message</label><textarea id="partner-message" name="message" rows={4} maxLength={5000} className={inputClass} placeholder="Tell us what kind of partnership you have in mind" /></div>

                {feedback && <div role={feedback.type === "success" ? "status" : "alert"} className={`mt-5 rounded-xl p-4 text-sm leading-6 ${feedback.type === "success" ? "bg-[#edf3e5] text-[#35451a]" : "bg-red-50 text-red-700"}`}>{feedback.text}</div>}

                <button type="submit" disabled={sending} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4A5C23] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#35451a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                  {sending ? <><LoaderCircle size={17} className="animate-spin" />Sending inquiry…</> : <>Send partnership inquiry <ArrowRight size={17} /></>}
                </button>
                <p className="mt-3 text-xs leading-5 text-gray-500">By submitting this form, you agree that we may use your contact details to respond to your inquiry.</p>
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
