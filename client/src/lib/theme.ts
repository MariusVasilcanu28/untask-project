export const THEME_KEY = "untask-theme";
export type Theme = "light" | "dark";

export function getDocumentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}
