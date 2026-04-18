import { motion, useAnimation } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "../components/FloatingInput.jsx";
import { signupSchema } from "../lib/schemas.js";
import { saveUser } from "../lib/auth.js";
import { shakeForm } from "../lib/shake.js";

const radios = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
];

export default function Signup() {
  const navigate = useNavigate();
  const shake = useAnimation();
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", phone: "", email: "", password: "", company: "", isAgency: "yes" },
    mode: "onTouched",
  });

  return (
    <div className="min-h-dvh bg-white px-5 py-10">
      <div className="mx-auto max-w-md">
        <Link to="/" className="text-sm font-semibold text-neutral-500 hover:text-neutral-800">
          Back
        </Link>
        <h1 className="mt-6 text-[28px] font-bold text-neutral-900">Create your PopX account</h1>

        <motion.form
          animate={shake}
          onSubmit={handleSubmit(
            (v) => {
              const now = new Date().toISOString();
              saveUser({
                fullName: v.fullName.trim(),
                phone: v.phone.trim(),
                email: v.email.trim(),
                password: v.password,
                company: (v.company ?? "").trim(),
                isAgency: v.isAgency,
                bio: "",
                joinedAt: now,
                updatedAt: now,
              });
              navigate("/account");
            },
            () => shakeForm(shake),
          )}
          className="mt-8 space-y-4"
        >
          <FloatingInput label="Full Name*" error={errors.fullName?.message} {...register("fullName")} />
          <FloatingInput label="Phone number*" error={errors.phone?.message} {...register("phone")} />
          <FloatingInput label="Email address*" error={errors.email?.message} {...register("email")} />
          <FloatingInput label="Password*" type="password" error={errors.password?.message} {...register("password")} />
          <FloatingInput label="Company name" error={errors.company?.message} {...register("company")} />

          <div className="pt-1">
            <p className="text-[15px] font-semibold text-neutral-900">Are you an Agency?*</p>
            <Controller
              name="isAgency"
              control={control}
              render={({ field }) => (
                <div className="mt-3 flex gap-6">
                  {radios.map((o) => (
                    <label key={o.id} className="flex cursor-pointer items-center gap-2 text-[15px]">
                      <span className={`grid h-5 w-5 place-items-center rounded-full border ${field.value === o.id ? "border-popx-label" : "border-neutral-300"}`}>
                        <span className={`h-2.5 w-2.5 rounded-full ${field.value === o.id ? "bg-popx-label" : "bg-transparent"}`} />
                      </span>
                      <input type="radio" className="sr-only" value={o.id} checked={field.value === o.id} onChange={() => field.onChange(o.id)} />
                      {o.label}
                    </label>
                  ))}
                </div>
              )}
            />
            {errors.isAgency && <p className="mt-2 text-xs text-red-600">{errors.isAgency.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-lg bg-popx py-3.5 text-[15px] font-bold text-white shadow-sm hover:bg-popx-hover disabled:opacity-60"
          >
            Create Account
          </button>
        </motion.form>
      </div>
    </div>
  );
}
