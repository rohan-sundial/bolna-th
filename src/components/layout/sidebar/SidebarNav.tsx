import cx from "classnames";
import { LucideIcon, Workflow } from "lucide-react";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface INavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const NAV_ITEMS: INavItem[] = [
  {
    label: "Workflows",
    path: "/flows",
    icon: Workflow,
  },
];

export function SidebarNav() {
  return (
    <nav className="flex-1 p-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            twMerge(
              cx(
                "flex items-center gap-3",
                "px-3 py-2",
                "rounded-lg transition-colors",
                "text-sm font-medium text-charcoal-700",
                "hover:bg-cream-200",
                {
                  "bg-cream-300 text-charcoal-900": isActive,
                },
              ),
            )
          }
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
