import { supabase } from "./supabase";

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Выберите файл изображения.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Размер изображения должен быть не больше 10 МБ.");

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;

  return supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}
