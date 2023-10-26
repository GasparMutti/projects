handleTheme();

function handleTheme() {
  const deviceTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const storageTheme = localStorage.getItem("data-theme");
  const pageTheme = storageTheme ?? deviceTheme;
  setTheme(pageTheme);
}

export function setTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  localStorage.setItem("data-theme", theme);
}

export function getTheme() {
  return localStorage.getItem("data-theme");
}

export function toggleTheme() {
  const theme = getTheme();
  const newTheme = theme === "light" ? "dark" : "light";
  setTheme(newTheme);
}
