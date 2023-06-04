import { Moon, Sun } from "lucide-react";
import { theme } from "@utils/store";
import { useStore } from "@nanostores/react";

const ThemeButtonIcon = () => {
  const $theme = useStore(theme);

  return <>{$theme === "dark" ? <Moon /> : <Sun />}</>;
};

export default ThemeButtonIcon;
