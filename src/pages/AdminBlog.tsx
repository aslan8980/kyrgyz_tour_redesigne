import { useCallback, useEffect, useState, type FormEvent } from "react";
import { LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { uploadImage } from "../lib/uploadImage";
import type { BlogPost } from "../data/blogPosts";

type BlogDraft = { id?: string; slug: string; title: string; excerpt: string; content: string; category: string; image_url: string; sources: string; published: boolean };
const emptyDraft: BlogDraft = { slug: "", title: "", excerpt: "", content: "", category: "Travel tips", image_url: "", sources: "", published: false };
const inputClass = "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#17200f] outline-none focus:border-[#4A5C23] focus:ring-2 focus:ring-[#4A5C23]/10";
const slugify = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [draft, setDraft] = useState<BlogDraft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (loadError) setError(`Не удалось загрузить статьи. Примените миграцию blog_posts: ${loadError.message}`);
    else { setPosts((data ?? []) as BlogPost[]); setError(""); }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const edit = (post: BlogPost) => setDraft({
    id: post.id, slug: post.slug, title: post.title, excerpt: post.excerpt,
    content: Array.isArray(post.content) ? post.content.join("\n\n") : String(post.content ?? ""),
    category: post.category, image_url: post.image_url,
    sources: (post.sources ?? []).map((source) => `${source.label} | ${source.url}`).join("\n"),
    published: post.published,
  });

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setUploading(true); setError("");
    try {
      const imageUrl = await uploadImage(file, "blog");
      setDraft((current) => ({ ...current, image_url: imageUrl }));
    }
    catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : "Не удалось загрузить изображение."); }
    finally { setUploading(false); }
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true); setError("");
    const parsedSources = draft.sources.split("\n").map((line) => {
      const [label, ...urlParts] = line.split("|");
      const url = urlParts.join("|").trim();
      return label?.trim() && url ? { label: label.trim(), url } : null;
    }).filter((source): source is { label: string; url: string } => Boolean(source));
    const payload = {
      slug: slugify(draft.slug || draft.title), title: draft.title.trim(), excerpt: draft.excerpt.trim(),
      content: draft.content.trim(), category: draft.category.trim() || "Travel tips", image_url: draft.image_url.trim(),
      sources: parsedSources, published: draft.published, updated_at: new Date().toISOString(),
    };
    try {
      const query = draft.id
        ? supabase.from("blog_posts").update(payload).eq("id", draft.id)
        : supabase.from("blog_posts").insert(payload);
      const { error: saveError } = await query;
      if (saveError) throw saveError;
      setDraft(emptyDraft);
      await load();
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Не удалось сохранить статью."); }
    finally { setSaving(false); }
  };

  const remove = async (post: BlogPost) => {
    if (!window.confirm(`Удалить статью «${post.title}»?`)) return;
    const { error: deleteError } = await supabase.from("blog_posts").delete().eq("id", post.id);
    if (deleteError) setError(`Не удалось удалить статью: ${deleteError.message}`);
    else { if (draft.id === post.id) setDraft(emptyDraft); await load(); }
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(320px,0.9fr)_1.1fr]">
      <form onSubmit={save} className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-[#17200f]">{draft.id ? "Редактировать статью" : "Новая статья"}</h2>{draft.id && <button type="button" onClick={() => setDraft(emptyDraft)} className="text-sm text-gray-500 hover:text-gray-800">Отмена</button>}</div>
        <label className="block text-sm font-medium">Title *<input value={draft.title} onChange={(e) => setDraft((current) => ({ ...current, title: e.target.value, slug: current.id ? current.slug : slugify(e.target.value) }))} required maxLength={180} className={inputClass} /></label>
        <label className="block text-sm font-medium">URL slug *<input value={draft.slug} onChange={(e) => setDraft((current) => ({ ...current, slug: slugify(e.target.value) }))} required maxLength={180} className={inputClass} /></label>
        <label className="block text-sm font-medium">Category<input value={draft.category} onChange={(e) => setDraft((current) => ({ ...current, category: e.target.value }))} maxLength={80} className={inputClass} /></label>
        <label className="block text-sm font-medium">Short introduction *<textarea value={draft.excerpt} onChange={(e) => setDraft((current) => ({ ...current, excerpt: e.target.value }))} required rows={3} maxLength={500} className={inputClass} /></label>
        <label className="block text-sm font-medium">Article text *<textarea value={draft.content} onChange={(e) => setDraft((current) => ({ ...current, content: e.target.value }))} required rows={10} className={inputClass} placeholder="Separate paragraphs with a blank line." /></label>
        <label className="block text-sm font-medium">Cover image URL<input value={draft.image_url} onChange={(e) => setDraft((current) => ({ ...current, image_url: e.target.value }))} type="url" className={inputClass} placeholder="https://…" /></label>
        <label className="block text-sm font-medium">Or upload a cover image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => void handleUpload(e.target.files?.[0])} className="mt-2 block w-full text-sm" /></label>
        {uploading && <p className="text-sm text-[#4A5C23]">Загружаем изображение…</p>}
        {draft.image_url && <img src={draft.image_url} alt="Article cover preview" className="aspect-video w-full rounded-xl object-cover" />}
        <label className="block text-sm font-medium">References (one per line: label | URL)<textarea value={draft.sources} onChange={(e) => setDraft((current) => ({ ...current, sources: e.target.value }))} rows={3} className={inputClass} /></label>
        <label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={draft.published} onChange={(e) => setDraft((current) => ({ ...current, published: e.target.checked }))} className="h-4 w-4 accent-[#4A5C23]" />Publish article</label>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-full bg-[#4A5C23] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />}{draft.id ? "Save changes" : "Add article"}</button>
      </form>

      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6"><h2 className="text-2xl font-bold text-[#17200f]">Статьи блога</h2><p className="mt-1 text-sm text-gray-500">Всего статей: {posts.length}</p></div>
        {loading ? <div className="flex items-center justify-center gap-3 py-16 text-gray-500"><LoaderCircle size={20} className="animate-spin text-[#4A5C23]" />Загружаем статьи…</div> : !posts.length ? <p className="p-8 text-center text-gray-500">Статей пока нет. Создайте первую форму слева.</p> : <ul className="divide-y divide-gray-100">{posts.map((post) => <li key={post.id} className="flex gap-4 p-5 sm:p-6"><img src={post.image_url} alt="" className="h-20 w-28 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="font-semibold text-[#17200f]">{post.title}</p><p className="mt-1 text-xs text-gray-500">/{post.slug} · {post.published ? "Опубликована" : "Черновик"}</p></div><div className="flex shrink-0 items-start gap-2"><button type="button" onClick={() => edit(post)} title="Редактировать" className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:text-[#4A5C23]"><Pencil size={16} /></button><button type="button" onClick={() => void remove(post)} title="Удалить" className="rounded-lg border border-gray-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div></li>)}</ul>}
      </section>
    </div>
  );
}
