import { useEffect, useState } from "react";
import { Search, Wrench, CircleCheck, Plus, X, Power, Edit2, Trash2 } from "lucide-react";
import { getTools, createTool, getCategories, updateTool, deleteTool } from "../../services/adminService";

export default function ToolsTable() {
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerDay: "",
    pricePerDay: "",
    category: "",
    condition: "Good",
    image: "", // Use image state
  });
  const [editingToolId, setEditingToolId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTools();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTools = async () => {
    try {
      const res = await getTools();

      if (res.data.success) {
        setTools(res.data.tools);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrUpdateTool = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Prepare data
    const payload = { 
      ...formData, 
      pricePerDay: Number(formData.pricePerDay),
    };

    if (formData.image) {
      payload.images = [formData.image];
    } else {
      payload.images = [];
    }

    try {
      if (editingToolId) {
        await updateTool(editingToolId, payload);
      } else {
        await createTool(payload);
      }
      setIsModalOpen(false);
      setEditingToolId(null);
      setFormData({ name: "", description: "", pricePerDay: "", category: "", condition: "Good", image: "" });
      loadTools();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || `Failed to ${editingToolId ? "update" : "create"} tool`);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (tool) => {
    setEditingToolId(tool._id);
    setFormData({
      name: tool.name || "",
      description: tool.description || "",
      pricePerDay: tool.pricePerDay || "",
      category: tool.category?._id || tool.category || "",
      condition: tool.condition || "Good",
      image: (tool.images && tool.images.length > 0) ? tool.images[0] : "",
    });
    setIsModalOpen(true);
  };

  const handleToggleAvailability = async (toolId, currentStatus) => {
    try {
      await updateTool(toolId, { isAvailable: !currentStatus });
      loadTools();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update tool availability");
    }
  };

  const handleDeleteTool = async (toolId) => {
    if (window.confirm("Are you sure you want to delete this tool?")) {
      try {
        await deleteTool(toolId);
        loadTools();
      } catch (err) {
        console.error(err);
        alert("Failed to delete tool");
      }
    }
  };

  const filtered = tools.filter(
    (tool) =>
      tool.name?.toLowerCase().includes(search.toLowerCase()) ||
      tool.owner?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tools</h2>

        <div className="flex gap-4">
          <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search tools..."
              className="ml-2 bg-transparent outline-none w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => {
              setEditingToolId(null);
              setFormData({ name: "", description: "", pricePerDay: "", category: "", condition: "Good", image: "" });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition font-medium"
          >
            <Plus size={18} />
            Add Tool
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4 text-left">Tool</th>
              <th className="text-left">Owner</th>
              <th className="text-left">Price/Day</th>
              <th className="text-left">Condition</th>
              <th className="text-left">Availability</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((tool) => (
              <tr
                key={tool._id}
                className="border-b hover:bg-slate-50 transition"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Wrench size={18} className="text-blue-600" />
                    </div>

                    <span className="font-medium">
                      {tool.name}
                    </span>
                  </div>
                </td>

                <td>{tool.owner?.name}</td>

                <td>₹{tool.pricePerDay}</td>

                <td>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm">
                    {tool.condition}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => handleToggleAvailability(tool._id, tool.isAvailable)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition hover:shadow-sm ${
                      tool.isAvailable
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    <Power size={14} />
                    {tool.isAvailable ? "Available" : "Unavailable"}
                  </button>
                </td>

                <td className="text-right">
                  <button
                    onClick={() => openEditModal(tool)}
                    className="p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition"
                    title="Edit Tool"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteTool(tool._id)}
                    className="p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600 rounded-lg transition"
                    title="Delete Tool"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-slate-500"
                >
                  No tools found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingToolId ? "Edit Tool" : "Add New Tool"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrUpdateTool} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tool Name</label>
                <input required type="text" className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required rows="3" className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                <input type="url" placeholder="https://..." className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price per Day (₹)</label>
                  <input required type="number" min="0" className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Condition</label>
                  <select required className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select required className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <button disabled={submitting} type="submit" className="w-full bg-blue-600 text-white font-bold rounded-xl py-3 mt-2 hover:bg-blue-700 transition disabled:opacity-70">
                {submitting ? (editingToolId ? "Updating..." : "Adding...") : (editingToolId ? "Update Tool" : "Add Tool")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}