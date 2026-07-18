import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BrowseSkills from "./pages/BrowseSkills";
import ToolsList from "./pages/ToolsList";
import ToolDetails from "./pages/ToolDetails";
import SkillDetails from "./pages/SkillDetails";
import AddEditTool from "./pages/AddEditTool";
import AddEditSkill from "./pages/AddEditSkill";
import RentalHistory from "./pages/RentalHistory";
import AdminDashboard from "./pages/AdminDashboard";
import Chat from "./pages/Chat";
import Wishlist from "./pages/Wishlist";
import AdminLogin from "./pages/AdminLogin";
import AdminSupportButton from "./components/AdminSupportButton";

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isChatPage = location.pathname.startsWith("/chat");

  return (
    <div className="min-h-screen flex flex-col font-body bg-surface text-on-surface">
      {!isAdminPage && <Navbar />}

      <main className={`flex-1 ${isAdminPage ? "" : "w-full max-w-[100vw] overflow-x-hidden"} flex flex-col`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/skills" element={<BrowseSkills />} />
          <Route path="/skills/:id" element={<SkillDetails />} />
          <Route path="/tools" element={<ToolsList />} />
          <Route path="/tools/:id" element={<ToolDetails />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/tools/add" element={<AddEditTool />} />
            <Route path="/tools/edit/:id" element={<AddEditTool />} />

            <Route path="/skills/add" element={<AddEditSkill />} />
            <Route path="/skills/edit/:id" element={<AddEditSkill />} />

            <Route path="/rental-history" element={<RentalHistory />} />

            <Route path="/chat" element={<Chat />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>

      {!isAdminPage && !isChatPage && <Footer />}
      {!isAdminPage && <AdminSupportButton />}
    </div>
  );
}

export default App;
