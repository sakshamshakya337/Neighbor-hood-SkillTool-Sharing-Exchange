import { useEffect, useState } from "react";

import { getDashboard } from "../services/adminService";

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import StatCards from "../components/admin/StatCards";
import UsersTable from "../components/admin/UsersTable";
import ToolsTable from "../components/admin/ToolsTable";
import SkillsTable from "../components/admin/SkillsTable";
import PaymentsTable from "../components/admin/PaymentsTable";
import ReportsTable from "../components/admin/ReportsTable";
import SettingsForm from "../components/admin/SettingsForm";
import Chat from "./Chat";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
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
      <Sidebar active={activeTab} setActive={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-8">

        {activeTab === "Dashboard" && (
          <section id="Dashboard">
            <Header />
            <StatCards dashboard={dashboard} />
          </section>
        )}

        {activeTab === "Users" && (
          <section id="Users">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <UsersTable />
            </div>
          </section>
        )}

        {activeTab === "Tools" && (
          <section id="Tools">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <ToolsTable />
            </div>
          </section>
        )}

        {activeTab === "Skills" && (
          <section id="Skills">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <SkillsTable />
            </div>
          </section>
        )}

        {activeTab === "Reports" && (
          <section id="Reports">
            <ReportsTable />
          </section>
        )}

        {activeTab === "Payments" && (
          <section id="Payments">
            <PaymentsTable />
          </section>
        )}

        {activeTab === "Settings" && (
          <section id="Settings">
            <SettingsForm />
          </section>
        )}

        {activeTab === "Chat" && (
          <section id="Chat" className="h-full bg-white rounded-2xl shadow-md overflow-hidden">
            <Chat />
          </section>
        )}

      </div>

    </div>
  );
}