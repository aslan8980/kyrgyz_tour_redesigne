
import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  LogOut,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import TourEditor from "./TourEditor";



type Tour = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  duration: number;
  duration_label: string | null;
  location: string | null;
  difficulty: string | null;
  price: number | null;
  currency: string | null;
  main_image: string | null;
  highlights: string[];
  itinerary: { day: number; title: string; description: string }[];
  included_services: string[];
  excluded_services: string[];
  status: string;
};


export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [pageError, setPageError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const checkAccess = useCallback(async () => {
    setAuthChecked(false);
    setPageError("");

    try {
      const {
        data: { user: currentUser },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError || !currentUser) {
        setUser(null);
        setAuthorized(false);
        return;
      }

      setUser(currentUser);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (profileError) throw profileError;

      const hasAccess =
        !!profile && ["owner", "staff"].includes(profile.role);

      setAuthorized(hasAccess);

      if (!hasAccess) {
        await supabase.auth.signOut();
        setUser(null);
      }
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Не удалось проверить права доступа."
      );
      setAuthorized(false);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  const loadTours = useCallback(async () => {
    setLoadingTours(true);
    setPageError("");

    try {
      const { data, error } = await supabase
        .from("tours")
        
        .select(
            "id, slug, title, short_description, description, duration, duration_label, location, difficulty, price, currency, main_image, highlights, itinerary, included_services, excluded_services, status"
                )

        .order("duration", { ascending: true });

      if (error) throw error;

      setTours((data ?? []) as Tour[]);
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Не удалось загрузить туры."
      );
    } finally {
      setLoadingTours(false);
    }
  }, []);

  useEffect(() => {
    void checkAccess();
  }, [checkAccess]);

  useEffect(() => {
    if (authChecked && authorized) {
      void loadTours();
    }
  }, [authChecked, authorized, loadTours]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAuthorized(false);
  };

  const toggleStatus = async (tour: Tour) => {
    const nextStatus = tour.status === "published" ? "draft" : "published";

    const confirmed = window.confirm(
      nextStatus === "published"
        ? `Опубликовать тур «${tour.title}»?`
        : `Снять тур «${tour.title}» с публикации?`
    );

    if (!confirmed) return;

    setBusyId(tour.id);
    setPageError("");

    try {
      const { error } = await supabase
        .from("tours")
        .update({ status: nextStatus })
        .eq("id", tour.id);

      if (error) throw error;

      await loadTours();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Не удалось изменить статус тура."
      );
    } finally {
      setBusyId(null);
    }
  };

  const deleteTour = async (tour: Tour) => {
    const confirmed = window.confirm(
      `Точно удалить тур «${tour.title}»? Это действие нельзя отменить.`
    );

    if (!confirmed) return;

    setBusyId(tour.id);
    setPageError("");

    try {
      const { error } = await supabase
        .from("tours")
        .delete()
        .eq("id", tour.id);

      if (error) throw error;

      await loadTours();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Не удалось удалить тур."
      );
    } finally {
      setBusyId(null);
    }
  };

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-[#f4f5f0] flex items-center justify-center">
        <LoaderCircle className="animate-spin text-[#4A5C23]" size={32} />
      </main>
    );
  }

  if (!user || !authorized) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <main className="min-h-screen bg-[#f4f5f0]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#e9eddf] text-[#4A5C23] flex items-center justify-center">
              <ShieldCheck size={23} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#4A5C23] font-semibold">
                Kyrgyz Tours
              </p>
              <h1 className="text-xl font-bold text-[#17200f]">
                Админ-панель
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/itineraries"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#4A5C23]"
            >
              <ExternalLink size={16} />
              Сайт
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <LogOut size={16} />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Управление контентом
            </p>
            <h2 className="text-3xl font-bold text-[#17200f]">
              Туры
            </h2>
            <p className="text-gray-600 mt-2">
              Всего туров: {tours.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => void loadTours()}
              disabled={loadingTours}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loadingTours ? "animate-spin" : ""}
              />
              Обновить
            </button>

            <button
              
onClick={() => {
  setEditingTour(null);
  setEditorOpen(true);
}}

              className="inline-flex items-center gap-2 rounded-full bg-[#4A5C23] text-white px-5 py-3 text-sm font-semibold hover:bg-[#39481b]"
            >
              <Plus size={17} />
              Добавить тур
            </button>
          </div>
        </div>

        {pageError && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {pageError}
          </div>
        )}

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {loadingTours ? (
            <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
              <LoaderCircle
                size={22}
                className="animate-spin text-[#4A5C23]"
              />
              Загружаем туры...
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-16 px-6">
              <p className="text-lg font-semibold text-[#17200f]">
                Туры не найдены
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Проверь доступ к таблице tours в Supabase.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Тур
                    </th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Длительность
                    </th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Цена
                    </th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Статус
                    </th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wide text-gray-500">
                      Действия
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {tours.map((tour) => {
                    const isPublished = tour.status === "published";
                    const isBusy = busyId === tour.id;

                    return (
                      <tr key={tour.id} className="hover:bg-gray-50/70">
                        <td className="px-5 py-5 min-w-[230px]">
                          <p className="font-semibold text-[#17200f]">
                            {tour.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {tour.location || "Локация не указана"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            /{tour.slug}
                          </p>
                        </td>

                        <td className="px-5 py-5 text-sm text-gray-600 whitespace-nowrap">
                          {tour.duration_label || `${tour.duration} дней`}
                        </td>

                        <td className="px-5 py-5 text-sm text-gray-600 whitespace-nowrap">
                          {tour.price && tour.price > 0
                            ? `${tour.price} ${tour.currency || "EUR"}`
                            : "По запросу"}
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              isPublished
                                ? "bg-green-50 text-green-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {isPublished ? "Опубликован" : tour.status}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              to={`/itineraries/${tour.slug}`}
                              title="Открыть страницу тура"
                              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-[#4A5C23]"
                            >
                              <ExternalLink size={16} />
                            </Link>

                            <button
                              type="button"
                              title={
                                isPublished
                                  ? "Снять с публикации"
                                  : "Опубликовать"
                              }
                              disabled={isBusy}
                              onClick={() => void toggleStatus(tour)}
                              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-[#4A5C23] disabled:opacity-50"
                            >
                              {isPublished ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>

                            <button
                              type="button"
                              title="Редактирование будет добавлено позже"
                              
onClick={() => {
  setEditingTour(tour);
  setEditorOpen(true);
}}

                              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-[#4A5C23]"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              title="Удалить тур"
                              disabled={isBusy}
                              onClick={() => void deleteTour(tour)}
                              className="p-2 rounded-lg border border-gray-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              {isBusy ? (
                                <LoaderCircle
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#4A5C23]"
          >
            <ArrowLeft size={16} />
            На главную
          </Link>
        </div>
      </div>

{editorOpen && (
  <TourEditor
    tour={editingTour}
    onClose={() => {
      setEditorOpen(false);
      setEditingTour(null);
    }}
    onSaved={() => {
      void loadTours();
    }}
  />
)}

    </main>
  );
}
