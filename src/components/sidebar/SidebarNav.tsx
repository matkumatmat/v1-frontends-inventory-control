import React from "react";
import {cn} from '@/lib/utils'

interface NavItemProps {
  item: NavItemConfig;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const NavItem: FC<NavItemProps> = ({ item, currentPage, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isActive = currentPage === item.href || (hasSubmenu && item.submenu.some(sub => sub.href === currentPage));

  if (hasSubmenu) {
    return (
      <div className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-slate-200 text-slate-900"
              : "hover:bg-slate-100/80 text-slate-500 hover:text-slate-900"
          )}
        >
          <span className="flex items-center">
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>
        {isOpen && (
          <div className="pl-7 mt-2 space-y-1 border-l-2 border-slate-200 ml-3">
            {item.submenu?.map(subItem => (
              <NavItem key={subItem.href || subItem.label} item={subItem} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => item.href && setCurrentPage(item.href)}
      className={cn(
        "w-full flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        currentPage === item.href
          ? "bg-slate-900 text-white"
          : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
      )}
    >
      <item.icon className="mr-3 h-5 w-5" />
      {item.label}
    </button>
  );
}

interface SidebarNavProps {
  role: string;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  className?: string;
}

const SidebarNav: FC<SidebarNavProps> = ({ role, currentPage, setCurrentPage, className }) => {
  const links = navConfig[role] || [];
  return (
    <nav className={cn("flex flex-col space-y-1 p-2", className)}>
      {links.map((link, index) => (
        <NavItem key={index} item={link} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      ))}
    </nav>
  );
}