import { Bell, Search, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white rounded-2xl shadow-md px-8 py-5 flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h2>
        <p className="text-slate-500">
          Welcome back, Admin 👋
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2">
          <Search size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-2"
          />
        </div>

        <Bell className="cursor-pointer text-slate-700" size={22} />

        <UserCircle size={42} className="text-blue-600 cursor-pointer" />
      </div>
    </header>
  );
}