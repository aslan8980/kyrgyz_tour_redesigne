import { useCallback, useEffect, useState } from "react";
import { LoaderCircle, RefreshCw, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";

type PartnerInquiry = {
  id: string;
  partner_type: string;
  company_name: string;
  contact_person: string;
  country: string;
  email: string;
  website: string | null;
  estimated_tourists: string | null;
  main_markets: string | null;
  property_name: string | null;
  property_location: string | null;
  accommodation_type: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

const typeLabels: Record<string, string> = {
  travel_agency: "Турагентство / туроператор",
  accommodation: "Объект размещения",
  other: "Другое",
};

export default function AdminPartners() {
  const [inquiries, setInquiries] = useState<PartnerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: loadError } = await supabase
      .from("partner_inquiries")
      .select("id,partner_type,company_name,contact_person,country,email,website,estimated_tourists,main_markets,property_name,property_location,accommodation_type,message,status,created_at")
      .order("created_at", { ascending: false });

    if (loadError) setError(`Не удалось загрузить заявки. Проверьте, применена ли миграция partner_inquiries: ${loadError.message}`);
    else setInquiries((data ?? []) as PartnerInquiry[]);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    setBusyId(id);
    setError("");
    const { error: updateError } = await supabase.from("partner_inquiries").update({ status }).eq("id", id);
    if (updateError) setError(`Не удалось обновить статус заявки: ${updateError.message}`);
    else setInquiries((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    setBusyId(null);
  };

  const deleteInquiry = async (inquiry: PartnerInquiry) => {
    if (!window.confirm(`Удалить заявку компании «${inquiry.company_name}»?`)) return;
    setBusyId(inquiry.id);
    setError("");
    const { error: deleteError } = await supabase.from("partner_inquiries").delete().eq("id", inquiry.id);
    if (deleteError) setError(`Не удалось удалить заявку: ${deleteError.message}`);
    else setInquiries((items) => items.filter((item) => item.id !== inquiry.id));
    setBusyId(null);
  };

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Управление контентом</p>
          <h2 className="mt-1 text-3xl font-bold text-[#17200f]">Заявки партнёров</h2>
          <p className="mt-2 text-gray-600">Всего заявок: {inquiries.length}</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />Обновить
        </button>
      </div>

      {error && <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-16 text-gray-500"><LoaderCircle size={22} className="animate-spin text-[#4A5C23]" />Загружаем заявки…</div>
      ) : inquiries.length === 0 && !error ? (
        <div className="rounded-2xl bg-[#f7f8f4] px-6 py-14 text-center"><p className="font-semibold text-[#17200f]">Заявок пока нет</p><p className="mt-2 text-sm text-gray-500">Новые обращения появятся здесь.</p></div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <article key={inquiry.id} className="rounded-2xl border border-gray-100 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#71805a]">{typeLabels[inquiry.partner_type] ?? inquiry.partner_type}</p>
                  <h3 className="mt-1 text-lg font-semibold text-[#17200f]">{inquiry.company_name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{inquiry.contact_person} · {inquiry.country} · {new Date(inquiry.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    Статус
                    <select value={inquiry.status} disabled={busyId === inquiry.id} onChange={(event) => void updateStatus(inquiry.id, event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-medium text-[#17200f] disabled:opacity-60">
                      <option value="new">Новая</option><option value="contacted">Связались</option><option value="in_progress">В работе</option><option value="closed">Закрыта</option>
                    </select>
                  </label>
                  <button type="button" disabled={busyId === inquiry.id} onClick={() => void deleteInquiry(inquiry)} aria-label={`Удалить заявку ${inquiry.company_name}`} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-red-600 transition hover:bg-red-50 disabled:opacity-50"><Trash2 size={17} /></button>
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                <p><span className="font-medium text-gray-800">Email:</span> <a href={`mailto:${inquiry.email}`} className="text-[#4A5C23] underline underline-offset-2">{inquiry.email}</a></p>
                {inquiry.website && <p><span className="font-medium text-gray-800">Сайт:</span> <a href={inquiry.website} target="_blank" rel="noreferrer" className="text-[#4A5C23] underline underline-offset-2">{inquiry.website}</a></p>}
                {inquiry.estimated_tourists && <p><span className="font-medium text-gray-800">Туристы в год:</span> {inquiry.estimated_tourists}</p>}
                {inquiry.main_markets && <p><span className="font-medium text-gray-800">Рынки:</span> {inquiry.main_markets}</p>}
                {inquiry.property_name && <p><span className="font-medium text-gray-800">Объект:</span> {inquiry.property_name}</p>}
                {inquiry.property_location && <p><span className="font-medium text-gray-800">Локация:</span> {inquiry.property_location}</p>}
                {inquiry.accommodation_type && <p><span className="font-medium text-gray-800">Размещение:</span> {inquiry.accommodation_type}</p>}
              </div>
              {inquiry.message && <p className="mt-4 whitespace-pre-wrap border-t border-gray-100 pt-4 text-sm leading-6 text-gray-600">{inquiry.message}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
