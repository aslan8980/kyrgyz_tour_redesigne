
import { FormEvent, useEffect, useState } from "react";
import { X, Plus, Trash2, LoaderCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { uploadImage } from "../lib/uploadImage";

type TourRecord = {
  id?: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  duration: number;
  duration_label: string;
  location: string;
  difficulty: string;
  price: number;
  currency: string;
  main_image: string;
  detail_image: string;
  show_on_home: boolean;
  highlights: string[];
  itinerary: { day: number; title: string; description: string }[];
  included_services: string[];
  excluded_services: string[];
  status: string;
};

type TourEditorProps = {
  tour: TourRecord | null;
  onClose: () => void;
  onSaved: () => void;
};

const emptyTour: TourRecord = {
  slug: "",
  title: "",
  short_description: "",
  description: "",
  duration: 3,
  duration_label: "3 Days / 2 Nights",
  location: "",
  difficulty: "moderate",
  price: 0,
  currency: "EUR",
  main_image: "",
  detail_image: "",
  show_on_home: false,
  highlights: [],
  itinerary: [{ day: 1, title: "", description: "" }],
  included_services: [],
  excluded_services: [],
  status: "draft",
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#4A5C23] focus:ring-2 focus:ring-[#4A5C23]/10";

const labelClass = "mb-2 block text-sm font-medium text-gray-700";

function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) =>
      typeof item === "string" ? item : JSON.stringify(item)
    )
    .join("\n");
}

function makeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

export default function TourEditor({
  tour,
  onClose,
  onSaved,
}: TourEditorProps) {
  const [form, setForm] = useState<TourRecord>(emptyTour);
  const [highlightsText, setHighlightsText] = useState("");
  const [includedText, setIncludedText] = useState("");
  const [excludedText, setExcludedText] = useState("");
  const [itineraryText, setItineraryText] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<"main_image" | "detail_image" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tour) {
      setForm(emptyTour);
      setHighlightsText("");
      setIncludedText("");
      setExcludedText("");
      setItineraryText("");
      return;
    }

    setForm({
      ...emptyTour,
      ...tour,
      duration: Number(tour.duration) || 1,
      price: Number(tour.price) || 0,
      main_image: tour.main_image || "",
      itinerary:
        Array.isArray(tour.itinerary) && tour.itinerary.length
          ? tour.itinerary
          : [{ day: 1, title: "", description: "" }],
      highlights: Array.isArray(tour.highlights) ? tour.highlights : [],
      included_services: Array.isArray(tour.included_services)
        ? tour.included_services
        : [],
      excluded_services: Array.isArray(tour.excluded_services)
        ? tour.excluded_services
        : [],
    });

    setHighlightsText(arrayToLines(tour.highlights));
    setIncludedText(arrayToLines(tour.included_services));
    setExcludedText(arrayToLines(tour.excluded_services));
    setItineraryText(
      Array.isArray(tour.itinerary)
        ? tour.itinerary
            .map((day) => `${day.title || ""} | ${day.description || ""}`)
            .join("\n")
        : ""
    );
  }, [tour]);

  const update = <K extends keyof TourRecord>(
    key: K,
    value: TourRecord[K]
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleImageUpload = async (key: "main_image" | "detail_image", file?: File) => {
    if (!file) return;
    setUploadingImage(key);
    setError("");
    try {
      update(key, await uploadImage(file, "tours"));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Не удалось загрузить фото.");
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const slug = form.slug.trim() || makeSlug(form.title);

      if (!slug) {
        throw new Error("Укажи название тура или его slug.");
      }

      const itinerary = itineraryText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => {
          const separator = line.indexOf("|");

          const title =
            separator === -1
              ? line
              : line.slice(0, separator).trim();

          const description =
            separator === -1
              ? ""
              : line.slice(separator + 1).trim();

          return {
            day: index + 1,
            title,
            description,
          };
        });

      const payload = {
        slug,
        title: form.title.trim(),
        short_description: form.short_description.trim(),
        description: form.description.trim(),
        duration: Number(form.duration),
        duration_label:
          form.duration_label.trim() ||
          `${form.duration} Days`,
        location: form.location.trim(),
        difficulty: form.difficulty,
        price: Number(form.price) || 0,
        currency: form.currency,
        main_image: form.main_image.trim() || null,
        detail_image: form.detail_image.trim() || null,
        show_on_home: form.show_on_home,
        highlights: linesToArray(highlightsText),
        itinerary,
        included_services: linesToArray(includedText),
        excluded_services: linesToArray(excludedText),
        status: form.status,
      };

      if (!payload.title) {
        throw new Error("Укажи название тура.");
      }

      if (!Number.isFinite(payload.duration) || payload.duration < 1) {
        throw new Error("Длительность должна быть не меньше 1 дня.");
      }

      if (!Number.isFinite(payload.price) || payload.price < 0) {
        throw new Error("Цена не может быть отрицательной.");
      }

      let result;

      if (tour?.id) {
        result = await supabase
          .from("tours")
          .update(payload)
          .eq("id", tour.id);
      } else {
        result = await supabase.from("tours").insert(payload);
      }

      if (result.error) throw result.error;

      onSaved();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось сохранить тур."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 px-3 py-5 sm:p-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-[#f8f9f6] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4A5C23]">
              Kyrgyz Tours
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#17200f]">
              {tour ? "Редактировать тур" : "Новый тур"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-full border border-gray-200 p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7 p-5 sm:p-8">
          <section>
            <h3 className="mb-4 text-lg font-bold text-[#17200f]">
              Основная информация
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Название тура *</label>
                <input
                  required
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((previous) => ({
                      ...previous,
                      title,
                      slug:
                        previous.slug === "" ||
                        previous.slug === makeSlug(previous.title)
                          ? makeSlug(title)
                          : previous.slug,
                    }));
                  }}
                  placeholder="Например, Discover Kyrgyzstan"
                />
              </div>

              <div>
                <label className={labelClass}>Slug — адрес тура</label>
                <input
                  className={inputClass}
                  value={form.slug}
                  onChange={(e) => update("slug", makeSlug(e.target.value))}
                  placeholder="discover-kyrgyzstan"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Используется в адресе страницы тура.
                </p>
              </div>

              <div>
                <label className={labelClass}>Локация</label>
                <input
                  className={inputClass}
                  value={form.location || ""}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="Bishkek & Ala-Archa"
                />
              </div>

              <div>
                <label className={labelClass}>Количество дней *</label>
                <input
                  required
                  type="number"
                  min="1"
                  className={inputClass}
                  value={form.duration}
                  onChange={(e) =>
                    update("duration", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <label className={labelClass}>
                  Подпись длительности
                </label>
                <input
                  className={inputClass}
                  value={form.duration_label || ""}
                  onChange={(e) =>
                    update("duration_label", e.target.value)
                  }
                  placeholder="3 Days / 2 Nights"
                />
              </div>

              <div>
                <label className={labelClass}>Уровень сложности</label>
                <select
                  className={inputClass}
                  value={form.difficulty}
                  onChange={(e) => update("difficulty", e.target.value)}
                >
                  <option value="easy">Лёгкий</option>
                  <option value="moderate">Средний</option>
                  <option value="challenging">Сложный</option>
                  <option value="expert">Для опытных</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Статус</label>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => update("status", e.target.value)}
                >
                  <option value="draft">Черновик</option>
                  <option value="published">Опубликован</option>
                </select>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-bold text-[#17200f]">
              Описание
            </h3>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Краткое описание</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={form.short_description || ""}
                  onChange={(e) =>
                    update("short_description", e.target.value)
                  }
                  placeholder="Короткий текст для карточки тура"
                />
              </div>

              <div>
                <label className={labelClass}>Полное описание</label>
                <textarea
                  rows={5}
                  className={inputClass}
                  value={form.description || ""}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Расскажи, что ждёт путешественников"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-bold text-[#17200f]">
              Цена и фотографии
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Цена</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.price}
                  onChange={(e) => update("price", Number(e.target.value))}
                />
              </div>

              <div>
                <label className={labelClass}>Валюта</label>
                <select
                  className={inputClass}
                  value={form.currency}
                  onChange={(e) => update("currency", e.target.value)}
                >
                  <option value="EUR">EUR — евро</option>
                  <option value="USD">USD — доллар</option>
                  <option value="KGS">KGS — сом</option>
                </select>
              </div>

              {([[
                "main_image", "Фото карточки тура", "Показывается в списках туров и на главной.",
              ], ["detail_image", "Фото внутри страницы тура", "Показывается в верхней части страницы после открытия тура."]] as const).map(([key, title, hint]) => (
                <div key={key}>
                  <label className={labelClass}>{title}</label>
                  <input
                    type="url"
                    className={inputClass}
                    value={form[key] || ""}
                    onChange={(e) => update(key, e.target.value)}
                    placeholder="URL изображения или загрузите файл ниже"
                  />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="mt-3 block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#e9eddf] file:px-4 file:py-2 file:font-medium file:text-[#39481b]"
                    onChange={(e) => void handleImageUpload(key, e.target.files?.[0])}
                  />
                  {uploadingImage === key && <p className="mt-2 text-xs text-[#4A5C23]">Загружаем фото…</p>}
                  {form[key] && <img src={form[key]} alt="Предпросмотр" className="mt-3 h-32 w-full rounded-xl object-cover" />}
                  <p className="mt-1 text-xs text-gray-500">{hint}</p>
                </div>
              ))}
              <label className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
                <input
                  type="checkbox"
                  checked={form.show_on_home}
                  onChange={(e) => update("show_on_home", e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#4A5C23]"
                />
                <span><span className="block text-sm font-semibold text-gray-800">Показывать в сезонных турах на главной</span><span className="mt-1 block text-xs text-gray-500">Этот тур появится под заголовком Explore Kyrgyzstan with Expert-Planned Journeys.</span></span>
              </label>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-bold text-[#17200f]">
              Программа по дням
            </h3>
            <p className="mb-3 text-sm text-gray-500">
              Одна строка — один день. Разделяй заголовок и описание символом
              |.
            </p>
            <textarea
              rows={6}
              className={inputClass}
              value={itineraryText}
              onChange={(e) => setItineraryText(e.target.value)}
              placeholder={
                "День 1: Прибытие | Встреча в аэропорту и трансфер\nДень 2: Горные маршруты | Поездка в национальный парк"
              }
            />
          </section>

          <section>
            <h3 className="mb-4 text-lg font-bold text-[#17200f]">
              Преимущества и услуги
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Основные преимущества
                </label>
                <textarea
                  rows={5}
                  className={inputClass}
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  placeholder={"Горные пейзажи\nМестная кухня\nОпытный гид"}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Каждый пункт с новой строки.
                </p>
              </div>

              <div>
                <label className={labelClass}>Включено в стоимость</label>
                <textarea
                  rows={5}
                  className={inputClass}
                  value={includedText}
                  onChange={(e) => setIncludedText(e.target.value)}
                  placeholder={"Трансфер\nПроживание\nУслуги гида"}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Не включено в стоимость</label>
                <textarea
                  rows={4}
                  className={inputClass}
                  value={excludedText}
                  onChange={(e) => setExcludedText(e.target.value)}
                  placeholder={"Международные авиабилеты\nЛичные расходы"}
                />
              </div>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-gray-50"
            >
              Отмена
            </button>

            <button
              type="submit"
              disabled={saving || uploadingImage !== null}
              className="inline-flex items-center gap-2 rounded-full bg-[#4A5C23] px-6 py-3 text-sm font-semibold text-white hover:bg-[#39481b] disabled:opacity-60"
            >
              {saving ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Сохраняем...
                </>
              ) : (
                "Сохранить тур"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
