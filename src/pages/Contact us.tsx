import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  MessageCircle,
} from "lucide-react";
import Navigation from "../components/Navigation";
import { supabase } from "../lib/supabase";

type TourOption = {
  id: string;
  slug: string;
  title: string;
};

type ContactMethod = "whatsapp" | "email";

const today = new Date();
const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const Contact = () => {
  const [searchParams] = useSearchParams();
  const queryTour = searchParams.get("tour")?.slice(0, 200) ?? "";
  const queryDate = searchParams.get("date") ?? "";
  const queryTravelers = Number(searchParams.get("travelers") ?? 2);

  const [tours, setTours] = useState<TourOption[]>([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [selectedTourId, setSelectedTourId] = useState("");
  const [preferredDate, setPreferredDate] = useState(
    /^\d{4}-\d{2}-\d{2}$/.test(queryDate) && queryDate >= todayKey ? queryDate : ""
  );
  const [travelers, setTravelers] = useState(
    Number.isInteger(queryTravelers) && queryTravelers >= 1 && queryTravelers <= 20
      ? queryTravelers
      : 2
  );
  const [contactMethod, setContactMethod] = useState<ContactMethod>("email");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTours() {
      const { data, error } = await supabase
        .from("tours")
        .select("id, slug, title")
        .eq("status", "published")
        .order("title", { ascending: true });

      if (!active) return;

      if (error) {
        console.error("Failed to load tours for contact form:", error.message);
        setStatus({
          type: "error",
          message: "We couldn't load the tour list. You can still try again by refreshing this page.",
        });
      } else {
        const availableTours = (data ?? []) as TourOption[];
        setTours(availableTours);

        const match = availableTours.find(
          (tour) =>
            (queryTour && (tour.title.toLowerCase() === queryTour.toLowerCase() ||
              tour.slug.toLowerCase() === queryTour.toLowerCase()))
        );
        if (match) setSelectedTourId(match.id);
      }

      setLoadingTours(false);
    }

    void loadTours();
    return () => {
      active = false;
    };
  }, [queryTour]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const selectedTour = tours.find((tour) => tour.id === selectedTourId);

    if (!name) {
      setStatus({ type: "error", message: "Please enter your name." });
      return;
    }
    if (!selectedTour) {
      setStatus({ type: "error", message: "Please select a tour." });
      return;
    }
    if (!preferredDate || preferredDate < todayKey) {
      setStatus({ type: "error", message: "Please choose today or a future date." });
      return;
    }
    if (!Number.isInteger(travelers) || travelers < 1 || travelers > 20) {
      setStatus({ type: "error", message: "Please select between 1 and 20 travelers." });
      return;
    }
    if (contactMethod === "email" && !email) {
      setStatus({ type: "error", message: "Please enter your email address." });
      return;
    }
    if (contactMethod === "whatsapp" && !whatsapp) {
      setStatus({ type: "error", message: "Please enter your WhatsApp number, including country code." });
      return;
    }
    if (name.length > 100 || email.length > 254 || whatsapp.length > 40 || message.length > 5000) {
      setStatus({ type: "error", message: "One or more fields are too long. Please shorten them and try again." });
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      const { error } = await supabase.from("contact_messages").insert({
        name,
        email: contactMethod === "email" ? email : null,
        whatsapp: contactMethod === "whatsapp" ? whatsapp : null,
        preferred_contact_method: contactMethod,
        tour_id: selectedTour.id,
        tour_title: selectedTour.title,
        preferred_date: preferredDate,
        travelers,
        message: message || null,
      });

      if (error) {
        console.error("Contact/booking request submission failed:", error.message);
        setStatus({
          type: "error",
          message: "We couldn't send your request. Please check the database setup and try again.",
        });
        return;
      }

      form.reset();
      setSelectedTourId("");
      setPreferredDate("");
      setTravelers(2);
      setContactMethod("email");
      setStatus({
        type: "success",
        message: "Thank you! Your tour request has been sent. We'll contact you using your preferred method.",
      });
    } catch (error) {
      console.error("Unexpected contact submission error:", error);
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="px-4 pb-12 pt-36 md:px-8 md:pt-40">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#c9cebd] px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#4a5c23]" />
            <span className="text-sm font-medium">Plan Your Trip</span>
          </div>
          <h1 className="mt-5 text-4xl font-bold text-gray-900 md:text-6xl">Request a Tour</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Choose your tour, preferred date and the easiest way for us to contact you.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="rounded-2xl bg-[#f7f8f5] p-8 md:p-10">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">Contact Information</h2>
            <div className="space-y-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4A5C23]">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div><h3 className="font-semibold text-gray-900">Location</h3><p className="mt-1 text-gray-600">Bishkek, Kyrgyzstan</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4A5C23]">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div><h3 className="font-semibold text-gray-900">WhatsApp</h3><p className="mt-1 text-gray-600">Share your number in the form and we'll contact you.</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4A5C23]">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div><h3 className="font-semibold text-gray-900">Email</h3><p className="mt-1 text-gray-600">Choose email if you prefer written communication.</p></div>
              </div>
            </div>
            <div className="mt-10 rounded-xl border border-[#e2e7d8] bg-white p-5 text-sm leading-6 text-gray-600">
              Your request does not confirm a booking. We'll check availability and contact you to confirm the details.
            </div>
          </div>

          <div>
            <h2 className="mb-7 text-2xl font-bold text-gray-900">Tour Request</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-gray-700">Your Name *</label>
                <input id="contact-name" name="name" type="text" autoComplete="name" required maxLength={100}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#4A5C23] focus:ring-1 focus:ring-[#4A5C23]" />
              </div>

              <div>
                <label htmlFor="tour-select" className="mb-2 block text-sm font-medium text-gray-700">Choose a Tour *</label>
                <select id="tour-select" name="tour" required value={selectedTourId}
                  onChange={(event) => setSelectedTourId(event.target.value)} disabled={loadingTours}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#4A5C23] focus:ring-1 focus:ring-[#4A5C23] disabled:bg-gray-100">
                  <option value="">{loadingTours ? "Loading tours..." : "Select a tour"}</option>
                  {tours.map((tour) => <option key={tour.id} value={tour.id}>{tour.title}</option>)}
                </select>
                {!loadingTours && tours.length === 0 && (
                  <p className="mt-2 text-sm text-amber-700">No published tours were found. Please check the tours table and its read permissions.</p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="preferred-date" className="mb-2 block text-sm font-medium text-gray-700">Preferred Date *</label>
                  <input id="preferred-date" name="preferred_date" type="date" required min={todayKey}
                    value={preferredDate} onChange={(event) => setPreferredDate(event.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#4A5C23] focus:ring-1 focus:ring-[#4A5C23]" />
                </div>
                <div>
                  <label htmlFor="travelers" className="mb-2 block text-sm font-medium text-gray-700">Number of Travelers *</label>
                  <select id="travelers" name="travelers" required value={travelers}
                    onChange={(event) => setTravelers(Number(event.target.value))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#4A5C23] focus:ring-1 focus:ring-[#4A5C23]">
                    {Array.from({ length: 20 }, (_, index) => index + 1).map((count) => (
                      <option key={count} value={count}>{count} {count === 1 ? "traveler" : "travelers"}</option>
                    ))}
                  </select>
                </div>
              </div>

              <fieldset>
                <legend className="mb-3 block text-sm font-medium text-gray-700">Preferred Contact Method *</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${contactMethod === "whatsapp" ? "border-[#4A5C23] bg-[#f3f6ed]" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="contact_method" value="whatsapp" checked={contactMethod === "whatsapp"}
                      onChange={() => setContactMethod("whatsapp")} className="accent-[#4A5C23]" />
                    <MessageCircle className="h-5 w-5 text-[#4A5C23]" />
                    <span className="font-medium text-gray-800">WhatsApp</span>
                  </label>
                  <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${contactMethod === "email" ? "border-[#4A5C23] bg-[#f3f6ed]" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="contact_method" value="email" checked={contactMethod === "email"}
                      onChange={() => setContactMethod("email")} className="accent-[#4A5C23]" />
                    <Mail className="h-5 w-5 text-[#4A5C23]" />
                    <span className="font-medium text-gray-800">Email</span>
                  </label>
                </div>
              </fieldset>

              {contactMethod === "whatsapp" ? (
                <div>
                  <label htmlFor="contact-whatsapp" className="mb-2 block text-sm font-medium text-gray-700">WhatsApp Number *</label>
                  <input id="contact-whatsapp" name="whatsapp" type="tel" autoComplete="tel" required maxLength={40}
                    placeholder="e.g. +996 555 123 456"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#4A5C23] focus:ring-1 focus:ring-[#4A5C23]" />
                  <p className="mt-2 text-xs text-gray-500">Include your country code so we can reach you internationally.</p>
                </div>
              ) : (
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-gray-700">Email Address *</label>
                  <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#4A5C23] focus:ring-1 focus:ring-[#4A5C23]" />
                </div>
              )}

              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-gray-700">Additional Questions or Requests (optional)</label>
                <textarea id="contact-message" name="message" rows={4} maxLength={5000}
                  placeholder="Tell us about any questions, preferences or special requirements..."
                  className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#4A5C23] focus:ring-1 focus:ring-[#4A5C23]" />
              </div>

              {status && (
                <div role={status.type === "success" ? "status" : "alert"}
                  className={`flex items-start gap-3 rounded-xl p-4 text-sm leading-6 ${status.type === "success" ? "bg-[#edf3e5] text-[#35451a]" : "bg-red-50 text-red-700"}`}>
                  {status.type === "success" ? <CheckCircle2 size={20} className="mt-0.5 shrink-0" /> : <AlertCircle size={20} className="mt-0.5 shrink-0" />}
                  <span>{status.message}</span>
                </div>
              )}

              <button type="submit" disabled={sending || loadingTours || tours.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#4A5C23] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#35451a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                {sending && <LoaderCircle size={18} className="animate-spin" />}
                {sending ? "Sending request..." : "Send Tour Request"}
              </button>
              <p className="text-xs leading-5 text-gray-500">
                Your details will be stored so our team can follow up. Please do not include payment details or other sensitive information.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
