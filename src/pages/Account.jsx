import { useEffect, useMemo, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "../components/FloatingInput.jsx";
import { accountSchema } from "../lib/schemas.js";
import { clearUser, loadUser, saveUser } from "../lib/auth.js";
import { useToast } from "../context/toast.jsx";
import { shakeForm } from "../lib/shake.js";

const defaultBio =
  "I'm a frontend developer student passionate about building fast, responsive, and user focused web interfaces, with a strong focus on mobile usability and real-world performance.";

function initials(name) {
  const p = String(name || "").trim().split(/\s+/);
  return ((p[0]?.[0] ?? "?") + (p[1]?.[0] ?? "")).toUpperCase();
}
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function Account() {
  const navigate = useNavigate();
  const { push } = useToast();
  const shake = useAnimation();
  const [user, setUser] = useState(() => loadUser());
  const defaults = useMemo(
    () => ({ fullName: user?.fullName ?? "", email: user?.email ?? "", newPassword: "", bio: user?.bio ?? "" }),
    [user],
  );
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    reset({ fullName: user.fullName ?? "", email: user.email ?? "", newPassword: "", bio: user.bio ?? "" });
  }, [user, navigate, reset]);

  if (!user) return null;

  const rows = [
    ["EMAIL", user.email],
    ["PHONE", user.phone?.trim() || "Not provided"],
    ["AGENCY", user.isAgency === "yes" ? "Yes" : "No"],
    ["COMPANY", user.company?.trim() || "Not provided"],
    ["MEMBER SINCE", fmtDate(user.joinedAt)],
    ["LAST UPDATED", fmtDate(user.updatedAt || user.joinedAt)],
  ];

  return (
    <div className="min-h-dvh bg-neutral-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-xl">
        <div className="mb-5 flex flex-wrap justify-between gap-3 text-sm text-neutral-600">
          <span>
            <b className="text-neutral-900">devtask</b> <span className="text-neutral-400">&gt;</span> <span className="font-semibold">Profile</span>
          </span>
          <Link to="/" className="font-semibold text-neutral-500 hover:text-neutral-900">
            Home
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-neutral-200/90 bg-card-tint p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-3 border-b border-neutral-200/80 pb-4">
            <h1 className="text-lg font-bold sm:text-xl">Account Settings</h1>
            <button
              type="button"
              className="text-xs font-bold tracking-wide text-red-600 hover:text-red-700"
              onClick={() => {
                clearUser();
                push("Signed out.");
                navigate("/", { replace: true });
              }}
            >
              SIGN OUT
            </button>
          </div>

          <div className="mt-5 flex gap-4 sm:items-start">
            <div className="relative shrink-0">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-lg font-bold text-neutral-700 ring ring-black/10 sm:h-[72px] sm:w-[72px] sm:text-xl">
                {initials(user.fullName)}
              </div>
              <button type="button" title="Photo not wired" className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-popx text-sm text-white shadow ring-2 ring-white transition hover:scale-105 active:scale-95">
                📷
              </button>
            </div>
            <div className="min-w-0 pt-1">
              <p className="truncate text-base font-bold sm:text-lg">{user.fullName}</p>
              <p className="truncate text-sm text-neutral-600">{user.email}</p>
              <p className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-white/80 px-2 py-1 font-medium text-neutral-700 ring ring-black/5">Active</span>
                <span className="rounded bg-white/80 px-2 py-1 font-medium text-neutral-700 ring ring-black/5">Free plan</span>
              </p>
            </div>
          </div>

          <section className="mt-5 rounded-xl border border-neutral-200/70 bg-white/60 p-4">
            <h2 className="text-sm font-bold">About me</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">{user.bio?.trim() || defaultBio}</p>
          </section>

          <div className="mt-5 border-b border-neutral-200/80 pb-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Details</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {rows.map(([label, val]) => (
                <div key={label}>
                  <p className="text-[11px] font-semibold tracking-wide text-neutral-400">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-neutral-900">{val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-dashed border-neutral-300 pt-5">
            <p className="text-sm font-semibold">Edit profile</p>
            <p className="mt-1 text-xs text-neutral-500">Optional new password: 8+ chars, number, symbol.</p>
            <motion.form
              animate={shake}
              className="mt-4 space-y-3"
              onSubmit={handleSubmit(
                (v) => {
                  const now = new Date().toISOString();
                  const next = { ...user, fullName: v.fullName.trim(), email: v.email.trim(), bio: (v.bio ?? "").trim(), updatedAt: now, joinedAt: user.joinedAt || now };
                  if (v.newPassword?.trim()) next.password = v.newPassword.trim();
                  saveUser(next);
                  setUser(next);
                  push("Changes saved.");
                  reset({ ...v, newPassword: "" });
                },
                async () => {
                  await shakeForm(shake);
                  push("Fix the highlighted fields.", "error");
                },
              )}
            >
              <FloatingInput label="Full name" error={errors.fullName?.message} {...register("fullName")} />
              <FloatingInput label="Email" error={errors.email?.message} {...register("email")} />
              <FloatingInput label="New password (optional)" type="password" error={errors.newPassword?.message} {...register("newPassword")} />
              <div>
                <label className="mb-1 block text-xs font-semibold text-popx-label">Bio (optional)</label>
                <textarea rows={3} className="w-full resize-y rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-popx-label focus:ring-2 focus:ring-violet-100" placeholder="About you…" {...register("bio")} />
                {errors.bio && <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-popx py-3 text-sm font-bold text-white hover:bg-popx-hover disabled:opacity-60">
                Save changes
              </button>
            </motion.form>
          </div>

          <p className="mt-6 text-center text-[10px] font-semibold tracking-[0.3em] text-neutral-300">POPX ACCOUNT DASHBOARD</p>
        </motion.div>
      </div>
    </div>
  );
}
