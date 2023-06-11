import { Moon, Sun } from "lucide-react";
import { theme as _theme } from "@utils/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

const ThemeButton = ({ theme = "dark" }) => {
  const $theme = useStore(_theme);

  useEffect(() => {
    _theme.set(theme);
  }, []);

  return (
    <button
      className="py-2 px-4 hover:bg-slate-200 hover:dark:bg-[#111] rounded-md font-medium"
      onClick={() => {
        let html = document.querySelector("#html-element")!;

        const newTheme = html.className === "dark" ? "light" : "dark";
        html.className = newTheme;

        document.cookie = `theme=${newTheme}`;

        _theme.set(newTheme);
      }}
    >
      {$theme === "dark" ? <Moon /> : <Sun />}
    </button>
  );
};

export default ThemeButton;
