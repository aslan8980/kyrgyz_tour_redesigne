import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, CreditCard, Users } from "lucide-react";
import Navigation from "../components/Navigation";
import PageHero from "../components/PageHero";
import ContactHero from "../assets/images/site/hero/hero-contact.jpg";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const tour = searchParams.get("tour") ?? "Your selected tour";
  const date = searchParams.get("date") ?? "To be confirmed";
  const travelers = searchParams.get("travelers") ?? "2";
  const pricePerPerson = Number(searchParams.get("price") ?? 0);
  const currency = searchParams.get("currency") ?? "EUR";
  const total = pricePerPerson > 0 ? pricePerPerson * Math.max(1, Number(travelers) || 1) : null;
  const formatMoney = (amount: number) => `${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency}`;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <PageHero
        image={ContactHero}
        imageAlt="Kyrgyzstan landscape"
        eyebrow="Booking request received"
        title="Payment"
        description="Your tour request is saved. Online payment is not available yet, so no charge has been made. The organizer will confirm the details and payment options."
      />
      <main className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
        <section className="rounded-3xl border border-[#e6e9df] bg-[#f7f8f4] p-6 sm:p-9" aria-labelledby="payment-summary-title">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9eddf] text-[#4A5C23]"><CreditCard size={23} /></span>
            <div>
              <h2 id="payment-summary-title" className="text-xl font-bold text-[#17200f]">Booking summary</h2>
              <p className="text-sm text-gray-500">Payment will be arranged after confirmation.</p>
            </div>
          </div>
          <dl className="mt-7 divide-y divide-[#e2e7d8] rounded-2xl border border-[#e2e7d8] bg-white px-5">
            <div className="flex flex-wrap justify-between gap-2 py-4"><dt className="font-medium text-gray-500">Tour</dt><dd className="font-semibold text-[#17200f]">{tour}</dd></div>
            <div className="flex flex-wrap items-center justify-between gap-2 py-4"><dt className="inline-flex items-center gap-2 text-gray-500"><CalendarDays size={16} />Requested date</dt><dd className="font-semibold text-[#17200f]">{date}</dd></div>
            <div className="flex flex-wrap items-center justify-between gap-2 py-4"><dt className="inline-flex items-center gap-2 text-gray-500"><Users size={16} />Travelers</dt><dd className="font-semibold text-[#17200f]">{travelers}</dd></div>
            <div className="flex flex-wrap justify-between gap-2 py-4"><dt className="font-medium text-gray-500">Price per person</dt><dd className="font-semibold text-[#17200f]">{pricePerPerson > 0 ? formatMoney(pricePerPerson) : "To be confirmed"}</dd></div>
            <div className="flex flex-wrap justify-between gap-2 py-4"><dt className="font-medium text-gray-500">Total</dt><dd className="text-lg font-bold text-[#17200f]">{total !== null ? formatMoney(total) : "To be confirmed"}</dd></div>
          </dl>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            <p className="font-semibold">Online payment is coming soon</p>
            <p className="mt-1">Please wait for the organizer to confirm availability and send payment instructions. Do not send card details by email or WhatsApp.</p>
          </div>
          <Link to="/itineraries" className="mt-7 inline-flex items-center gap-2 font-semibold text-[#4A5C23] hover:text-[#35451a]"><ArrowLeft size={17} />Back to tours</Link>
        </section>
      </main>
    </div>
  );
};

export default Payment;
