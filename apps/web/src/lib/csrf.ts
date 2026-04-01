export function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function ensureCsrfCookie(apiBase: string) {
  await fetch(`${apiBase}/auth/csrf`, { credentials: "include" });
}

export function csrfHeader() {
  const csrf = getCookie("pippy_csrf") ?? "";
  return { "X-CSRF-Token": csrf };
}