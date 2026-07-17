import {
  LayoutDashboard,
  Users,
  Wrench,
  Flag,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    icon: Users,
  },
  {
    title: "Tools",
    icon: Wrench,
  },
  {
    title: "Reports",
    icon: Flag,
  },
  {
    title: "Payments",
    icon: CreditCard,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }

    setActive(id);
  };

  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white shadow-2xl sticky top-0">
      <div className="px-8 py-8 border-b border-slate-700">
        <h1 className="text-4xl font-bold">NeighborShare</h1>

        <p className="text-slate-400 mt-2">
          Admin Panel
        </p>
      </div>

      <nav className="mt-5 px-4 space-y-2">

        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => scrollToSection(item.title)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300

              ${
                active === item.title
                  ? "bg-blue-600 shadow-lg"
                  : "hover:bg-slate-800"
              }`}
            >
              <Icon size={22} />

              <span className="font-medium">
                {item.title}
              </span>
            </button>
          );
        })}

      </nav>

      <div className="absolute bottom-8 left-4 right-4">

        <button className="w-full bg-red-500 hover:bg-red-600 rounded-xl py-4 flex justify-center items-center gap-3 transition">

          <LogOut size={20} />

          Logout

        </button>

      </div>
    </aside>
  );
}