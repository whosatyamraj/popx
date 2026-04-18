const STORAGE_KEY = "popx_user_v1";

export function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function saveUser(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}

export function tryLogin(email, password) {
  const user = loadUser();
  if (!user) {
    return { ok: false, message: "No account on this browser yet. Create one on Sign up." };
  }
  const sameEmail =
    String(user.email).trim().toLowerCase() === String(email).trim().toLowerCase();
  if (!sameEmail) {
    return { ok: false, message: "That email is not registered here." };
  }
  if (user.password !== password) {
    return { ok: false, message: "Incorrect password." };
  }
  return { ok: true };
}
