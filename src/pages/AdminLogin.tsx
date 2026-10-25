
import { FormEvent, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { LockKeyhole, Mail, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) throw signInError;

      if (!data.user) {
        throw new Error("Не удалось определить пользователя.");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile || !["owner", "staff"].includes(profile.role)) {
        await supabase.auth.signOut();
        throw new Error("У этого аккаунта нет доступа к админ-панели.");
      }

      setLoggedIn(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось выполнить вход. Проверь данные и попробуй снова."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className="min-h-screen bg-[#f4f5f0] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#4A5C23] mb-8"
        >
          <ArrowLeft size={16} />
          Вернуться на сайт
        </Link>

        <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-[#e9eddf] text-[#4A5C23] flex items-center justify-center mb-6">
            <LockKeyhole size={26} />
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-[#4A5C23]">
            Kyrgyz Tours
          </p>

          <h1 className="text-3xl font-bold text-[#17200f] mt-2">
            Вход администратора
          </h1>

          <p className="text-gray-500 mt-3 mb-8">
            Войди в аккаунт с правами владельца или сотрудника.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#4A5C23] focus:ring-2 focus:ring-[#4A5C23]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Пароль
              </label>

              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Введи пароль"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#4A5C23] focus:ring-2 focus:ring-[#4A5C23]/10"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#4A5C23] text-white font-semibold py-3.5 hover:bg-[#39481b] disabled:opacity-60 transition"
            >
              {loading ? "Выполняется вход..." : "Войти в панель"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
