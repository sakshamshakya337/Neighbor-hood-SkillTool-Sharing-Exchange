import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Wrench,
  BookOpen,
  Flag,
  CreditCard,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";

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
    title: "Skills",
    icon: BookOpen,
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
  {
    title: "Chat",
    icon: MessageSquare,
  },
];

export default function Sidebar({ active, setActive }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <aside className="w-72 h-screen bg-slate-900 text-white shadow-2xl sticky top-0 flex flex-col">
      <div className="px-8 py-8 border-b border-slate-700 shrink-0">
        <h1 className="text-4xl font-bold">NeighborShare</h1>

        <p className="text-slate-400 mt-2">
          Admin Panel
        </p>
      </div>

      <nav className="mt-5 px-4 space-y-2 flex-1 overflow-y-auto">

        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => setActive(item.title)}
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

      <div className="p-4 mt-auto shrink-0">

        <button 
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 rounded-xl py-4 flex justify-center items-center gap-3 transition"
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>
    </aside>
  );
}