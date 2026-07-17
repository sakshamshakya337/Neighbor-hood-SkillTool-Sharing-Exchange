import { useEffect, useState } from "react";

import { getDashboard } from "../services/adminService";

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import StatCards from "../components/admin/StatCards";
import UsersTable from "../components/admin/UsersTable";
import ToolsTable from "../components/admin/ToolsTable";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalTools: 0,
    totalBookings: 0,
    totalPayments: 0,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getDashboard();

      if (res.data.success) {
        setDashboard(res.data.dashboard);
      } else {
        setError("Unable to load dashboard.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="flex bg-slate-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 overflow-y-auto p-8">

        <section id="Dashboard">

          <Header />

          <StatCards dashboard={dashboard} />

        </section>

        <section id="Users" className="mt-8">

          <div className="bg-white rounded-2xl shadow-md p-6">

            <UsersTable />

          </div>

        </section>

        <section id="Tools" className="mt-8">

          <div className="bg-white rounded-2xl shadow-md p-6">

            <ToolsTable />

          </div>

        </section>

        <section id="Reports" className="mt-8">

          <div className="bg-white rounded-2xl shadow-md p-6 h-72">

            <h2 className="text-3xl font-bold mb-4">
              Reports
            </h2>

            <p className="text-slate-500">
              Reports management will appear here.
            </p>

          </div>

        </section>

        <section id="Payments" className="mt-8">

          <div className="bg-white rounded-2xl shadow-md p-6 h-72">

            <h2 className="text-3xl font-bold mb-4">
              Payments
            </h2>

            <p className="text-slate-500">
              Payment history will appear here.
            </p>

          </div>

        </section>

        <section id="Settings" className="mt-8 mb-10">

          <div className="bg-white rounded-2xl shadow-md p-6 h-72">

            <h2 className="text-3xl font-bold mb-4">
              Settings
            </h2>

            <p className="text-slate-500">
              Admin settings will appear here.
            </p>

          </div>

        </section>

      </div>

    </div>
  );
}