import { forwardRef } from "react";

const FloatingInput = forwardRef(function FloatingInput({ label, error, className = "", type = "text", ...rest }, ref) {
  const err = !!error;
  const ac =
    type === "password" ? (rest.name === "password" ? "current-password" : "new-password") : rest.name === "email" ? "email" : "on";
  return (
    <div className={className}>
      <div className="relative rounded-lg bg-white">
        <label className={`absolute left-3 top-0 z-[1] -translate-y-1/2 bg-white px-1 text-xs font-semibold ${err ? "text-red-600" : "text-popx-label"}`}>
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          placeholder={rest.placeholder ?? " "}
          autoComplete={ac}
          className={`w-full rounded-lg border bg-transparent px-3 py-3 text-[15px] text-neutral-800 outline-none transition ${err ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-neutral-200 focus:border-popx-label focus:ring-2 focus:ring-violet-100"}`}
          {...rest}
        />
      </div>
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default FloatingInput;
