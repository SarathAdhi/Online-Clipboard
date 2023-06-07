import { Moon, Sun } from "lucide-react";
import { theme as _theme } from "@utils/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

const ThemeButtonIcon = ({ theme = "" }) => {
  const $theme = useStore(_theme);

  useEffect(() => {
    _theme.set(theme);
  }, []);

  return <>{$theme === "dark" ? <Moon /> : <Sun />}</>;
};

export default ThemeButtonIcon;
