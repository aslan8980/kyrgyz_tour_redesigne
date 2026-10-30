import { FormEvent, useCallback, useEffect, useState } from "react";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { uploadImage } from "../lib/uploadImage";

type GalleryPhoto = { id: string; title: string; category: string; image_url: string };
type Review = { id: string; name: string; country: string; rating: number; title: string; text: string };
type Props = { section: "gallery" | "reviews" };
const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#4A5C23]";

export default function AdminSiteContent({ section }: Props) {
  const isGallery = section === "gallery";
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const result = isGallery
      ? await supabase.from("gallery_photos").select("id,title,category,image_url").order("sort_order").order("created_at")
      : await supabase.from("testimonials").select("id,name,country,rating,title,text").order("sort_order").order("created_at");
    if (result.error) setError(`Не удалось загрузить данные: ${result.error.message}`);
    else if (isGallery) setPhotos((result.data ?? []) as GalleryPhoto[]);
    else setReviews((result.data ?? []) as Review[]);
    setLoading(false);
  }, [isGallery]);

  useEffect(() => { void load(); }, [load]);

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try { setImageUrl(await uploadImage(file, "gallery")); }
    catch (e) { setError(e instanceof Error ? e.message : "Не удалось загрузить фото."); }
    finally { setUploading(false); }
  };

  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    setSaving(true);
    setError("");
    try {
      if (isGallery) {
        const url = imageUrl || String(data.get("image_url") || "").trim();
        if (!url) throw new Error("Загрузите изображение или укажите его URL.");
        const { error: insertError } = await supabase.from("gallery_photos").insert({
          title: String(data.get("title") || "").trim(),
          category: String(data.get("category") || "Kyrgyzstan").trim(),
          image_url: url,
          sort_order: photos.length + 1,
        });
        if (insertError) throw insertError;
      } else {
        const { error: insertError } = await supabase.from("testimonials").insert({
          name: String(data.get("name") || "").trim(),
          country: String(data.get("country") || "").trim(),
          rating: Number(data.get("rating") || 5),
          title: String(data.get("title") || "").trim(),
          text: String(data.get("text") || "").trim(),
          sort_order: reviews.length + 1,
        });
        if (insertError) throw insertError;
      }
      formElement.reset();
      setImageUrl("");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Не удалось сохранить запись."); }
    finally { setSaving(false); }
  };

  const remove = async (id: string, label: string) => {
    if (!window.confirm(`Удалить «${label}»?`)) return;
    const imageUrl = isGallery ? photos.find((photo) => photo.id === id)?.image_url : undefined;
    const { error: deleteError } = await supabase.from(isGallery ? "gallery_photos" : "testimonials").delete().eq("id", id);
    if (deleteError) setError(`Не удалось удалить запись: ${deleteError.message}`);
    else {
      let storageMessage = "";
      const storageMarker = "/storage/v1/object/public/site-media/";
      if (imageUrl?.includes(storageMarker)) {
        const storagePath = imageUrl.split(storageMarker)[1];
        if (storagePath) {
          const { error: storageError } = await supabase.storage.from("site-media").remove([storagePath]);
          if (storageError) storageMessage = `Фото удалено из галереи, но файл в хранилище удалить не удалось: ${storageError.message}`;
        }
      }
      await load();
      if (storageMessage) setError(storageMessage);
    }
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(320px,0.8fr)_1.2fr]">
      <form onSubmit={add} className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#17200f]">{isGallery ? "Добавить фото" : "Добавить отзыв"}</h3>
        {isGallery ? <>
          <label className="block text-sm font-medium">Название<input name="title" required className={`${inputClass} mt-2`} /></label>
          <label className="block text-sm font-medium">Категория<input name="category" className={`${inputClass} mt-2`} placeholder="Mountains" /></label>
          <label className="block text-sm font-medium">Ссылка на фото<input name="image_url" type="url" className={`${inputClass} mt-2`} placeholder="https://…" /></label>
          <label className="block text-sm font-medium">Или загрузить фото<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-2 block w-full text-sm" onChange={(e) => void handleUpload(e.target.files?.[0])} /></label>
          {uploading && <p className="text-sm text-[#4A5C23]">Загружаем фото…</p>}
          {imageUrl && <img src={imageUrl} alt="Предпросмотр" className="h-40 w-full rounded-xl object-cover" />}
        </> : <>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">Имя<input name="name" required className={`${inputClass} mt-2`} /></label>
            <label className="block text-sm font-medium">Страна<input name="country" required className={`${inputClass} mt-2`} /></label>
          </div>
          <label className="block text-sm font-medium">Заголовок<input name="title" className={`${inputClass} mt-2`} /></label>
          <label className="block text-sm font-medium">Оценка<select name="rating" className={`${inputClass} mt-2`}>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} / 5</option>)}</select></label>
          <label className="block text-sm font-medium">Текст отзыва<textarea name="text" required rows={5} className={`${inputClass} mt-2`} /></label>
        </>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-full bg-[#4A5C23] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />}{isGallery ? "Добавить фото" : "Добавить отзыв"}
        </button>
      </form>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-xl font-bold text-[#17200f]">{isGallery ? `Фотографии (${photos.length})` : `Отзывы (${reviews.length})`}</h3>
        {loading ? <div className="flex items-center gap-2 py-8 text-gray-500"><LoaderCircle size={18} className="animate-spin" />Загружаем…</div> : isGallery ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {photos.map((photo) => <article key={photo.id} className="overflow-hidden rounded-2xl border border-gray-100">
              <img src={photo.image_url} alt={photo.title} className="h-40 w-full object-cover" />
              <div className="flex items-start justify-between gap-3 p-4"><div><p className="font-semibold">{photo.title}</p><p className="mt-1 text-sm text-gray-500">{photo.category}</p></div><button type="button" onClick={() => void remove(photo.id, photo.title)} aria-label={`Удалить ${photo.title}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button></div>
            </article>)}
            {!photos.length && <p className="text-sm text-gray-500">Фотографий пока нет.</p>}
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => <article key={review.id} className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 p-4">
              <div><p className="font-semibold">{review.name} <span className="font-normal text-gray-500">· {review.country}</span></p><p className="my-1 text-sm text-amber-500">{"★".repeat(review.rating)}</p>{review.title && <p className="font-medium">{review.title}</p>}<p className="mt-1 text-sm leading-relaxed text-gray-600">{review.text}</p></div>
              <button type="button" onClick={() => void remove(review.id, review.name)} aria-label={`Удалить отзыв ${review.name}`} className="shrink-0 rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>
            </article>)}
            {!reviews.length && <p className="text-sm text-gray-500">Отзывов пока нет.</p>}
          </div>
        )}
      </section>
    </div>
  );
}
