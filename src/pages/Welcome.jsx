import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function HeroGraphic() {
  return (
    <div className="mb-6 flex justify-center" aria-hidden>
      <svg width="168" height="130" viewBox="0 0 168 130" className="drop-shadow-sm">
        <rect x="44" y="8" width="80" height="114" rx="14" fill="white" stroke="#e5e7eb" strokeWidth="2" />
        <rect x="52" y="18" width="64" height="10" rx="3" fill="#6c25ff" />
        <rect x="56" y="36" width="56" height="6" rx="2" fill="#e5e7eb" />
        <rect x="56" y="48" width="44" height="6" rx="2" fill="#e5e7eb" />
        <rect x="56" y="68" width="56" height="28" rx="6" fill="#e8dcff" />
        <circle cx="132" cy="28" r="18" fill="#6c25ff" opacity="0.15" />
        <circle cx="36" cy="96" r="22" fill="#6c25ff" opacity="0.12" />
      </svg>
    </div>
  );
}

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-surface px-6">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-end pb-10 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <HeroGraphic />
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Welcome to PopX</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
            Create an account to continue or login if you already joined.
          </p>
        </motion.div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="w-full rounded-lg bg-popx py-3.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-popx-hover active:scale-[0.99]"
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full rounded-lg bg-popx-muted py-3.5 text-[15px] font-semibold text-neutral-900 shadow-sm transition hover:bg-[#dfd2ff] active:scale-[0.99]"
          >
            Already Registered? Login
          </button>
        </div>
      </div>
    </div>
  );
}
