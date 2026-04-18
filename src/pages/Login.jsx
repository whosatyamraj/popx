import { motion, useAnimation } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "../components/FloatingInput.jsx";
import { loginSchema } from "../lib/schemas.js";
import { tryLogin } from "../lib/auth.js";
import { useToast } from "../context/toast.jsx";
import { shakeForm } from "../lib/shake.js";

export default function Login() {
  const navigate = useNavigate();
  const { push } = useToast();
  const shake = useAnimation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  return (
    <div className="min-h-dvh bg-surface px-5 py-10">
      <div className="mx-auto max-w-md">
        <Link to="/" className="text-sm font-semibold text-neutral-500 hover:text-neutral-800">
          Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h1 className="text-[26px] font-bold text-neutral-900">Signin to your PopX account</h1>
          <p className="mt-3 text-sm text-neutral-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>

          <motion.form
            animate={shake}
            className="mt-8 space-y-4"
            onSubmit={handleSubmit(
              async (vals) => {
                const r = tryLogin(vals.email, vals.password);
                if (!r.ok) {
                  push(r.message, "error");
                  await shakeForm(shake);
                  return;
                }
                push("Logged in.");
                navigate("/account");
              },
              () => shakeForm(shake),
            )}
          >
            <FloatingInput label="Email Address" placeholder="Enter email address" error={errors.email?.message} {...register("email")} />
            <FloatingInput label="Password" type="password" placeholder="Enter password" error={errors.password?.message} {...register("password")} />
            <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-lg bg-neutral-400 py-3.5 text-[15px] font-bold text-white hover:bg-neutral-500 disabled:opacity-60">
              Login
            </button>
          </motion.form>

          <p className="mt-5 text-center text-sm text-neutral-500">
            New here?{" "}
            <Link className="font-semibold text-popx-label hover:underline" to="/signup">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
