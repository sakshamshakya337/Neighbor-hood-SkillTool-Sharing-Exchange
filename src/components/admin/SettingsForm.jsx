import { useState } from "react";
import { Save, Settings as SettingsIcon, Mail, Globe, Shield } from "lucide-react";

export default function SettingsForm() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    platformName: "NeighborShare",
    contactEmail: "admin@skills.com",
    supportPhone: "+91 9876543210",
    maintenanceMode: false,
    registrationEnabled: true,
    platformFee: "5",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call for saving settings
    setTimeout(() => {
      setLoading(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl min-h-[500px]">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
        <div className="bg-slate-100 p-3 rounded-xl">
          <SettingsIcon size={24} className="text-slate-700" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Platform Settings</h2>
          <p className="text-slate-500 text-sm">Manage core configuration for the platform</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <section>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Globe size={18} className="text-blue-600" /> General
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Platform Name</label>
              <input
                type="text"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Platform Fee (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.platformFee}
                onChange={(e) => setSettings({ ...settings, platformFee: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Contact Settings */}
        <section>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Mail size={18} className="text-blue-600" /> Contact Details
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Support Email</label>
              <input
                type="email"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Support Phone</label>
              <input
                type="tel"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Security & Access */}
        <section>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Shield size={18} className="text-blue-600" /> Security & Access
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={settings.registrationEnabled}
                  onChange={(e) => setSettings({ ...settings, registrationEnabled: e.target.checked })}
                />
                <div className={`block w-14 h-8 rounded-full transition ${settings.registrationEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${settings.registrationEnabled ? 'translate-x-6' : ''}`}></div>
              </div>
              <div>
                <div className="font-medium">Enable New Registrations</div>
                <div className="text-sm text-slate-500">Allow new users to sign up on the platform</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                />
                <div className={`block w-14 h-8 rounded-full transition ${settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${settings.maintenanceMode ? 'translate-x-6' : ''}`}></div>
              </div>
              <div>
                <div className="font-medium text-slate-900">Maintenance Mode</div>
                <div className="text-sm text-slate-500">Temporarily disable access to the platform for all non-admin users</div>
              </div>
            </label>
          </div>
        </section>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition disabled:opacity-70"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
