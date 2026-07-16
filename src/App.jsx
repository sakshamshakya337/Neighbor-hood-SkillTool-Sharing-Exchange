import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import BrowseSkills from './pages/BrowseSkills';
// Overriding BrowseTools with the new ToolsList we built
import ToolsList from './pages/ToolsList';
import ToolDetails from './pages/ToolDetails';
import AddEditTool from './pages/AddEditTool';
import AddEditSkill from './pages/AddEditSkill';
import RentalHistory from './pages/RentalHistory';
import Chat from './pages/Chat';
import Wishlist from './pages/Wishlist';

function App() {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat');

  return (
    <div className="min-h-screen flex flex-col font-body bg-surface text-on-surface">
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          <Route path="/skills" element={<BrowseSkills />} />
          <Route path="/tools" element={<ToolsList />} />
          <Route path="/tools/:id" element={<ToolDetails />} />
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
        </Routes>
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
}

export default App;
