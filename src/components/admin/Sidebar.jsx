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
    title: "Bookings",
    icon: BookOpen, // or another icon like Calendar, but BookOpen is already imported
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
    <aside className="w-72 h-screen bg-white text-slate-700 shadow-sm border-r border-slate-200 sticky top-0 flex flex-col">
      <div className="px-8 py-8 border-b border-slate-200 shrink-0">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">NeighborShare</h1>

        <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-wider">
          Admin Panel
        </p>
      </div>

      <nav className="mt-6 px-4 space-y-1.5 flex-1 overflow-y-auto">

        {menus.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.title;

          return (
            <button
              key={item.title}
              onClick={() => setActive(item.title)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-lg transition-all duration-200 border-l-4
              ${
                isActive
                  ? "bg-blue-50/70 border-blue-600 text-blue-700 font-semibold shadow-[0_1px_3px_rgba(37,99,235,0.05)]"
                  : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Icon size={20} className={isActive ? "text-blue-600" : "text-slate-400"} />

              <span className={isActive ? "font-semibold" : "font-medium"}>
                {item.title}
              </span>
            </button>
          );
        })}

      </nav>

      <div className="p-6 mt-auto shrink-0 border-t border-slate-100">

        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200 rounded-xl py-3.5 flex justify-center items-center gap-3 transition-colors font-medium shadow-sm"
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>
    </aside>
  );
}