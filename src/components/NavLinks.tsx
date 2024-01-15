import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@ui/menubar";
import { cn } from "@utils/cn";
import { pages } from "./pages";

const NavLinks = ({ pathname = "" }) => {
  return (
    <>
      <Menubar className="md:hidden">
        <MenubarMenu>
          <MenubarTrigger>Tools</MenubarTrigger>
          <MenubarContent align="center" className="space-y-1">
            {pages.map(({ name, href }) => (
              <MenubarItem key={name} asChild>
                <a
                  className={cn(
                    "py-2 px-4 hover:bg-slate-200 hover:dark:bg-gray-900 rounded-md font-medium",
                    pathname === href &&
                      "dark:text-white dark:!bg-gray-900  !bg-slate-200"
                  )}
                  href={href}
                >
                  {name}
                </a>
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </>
  );
};

export default NavLinks;
