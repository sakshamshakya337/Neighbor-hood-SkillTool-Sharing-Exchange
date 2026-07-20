import { useEffect, useState } from "react";
import { Search, BookOpen, CircleCheck, Plus, X, Power, Edit2, Trash2 } from "lucide-react";
import { getSkills, createSkill, getCategories, updateSkill, deleteSkill } from "../../services/adminService";

export default function SkillsTable() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hourlyRate: "",
    category: "",
    image: "",
  });
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSkills();
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

  const loadSkills = async () => {
    try {
      const res = await getSkills();
      if (res.data) {
        setSkills(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrUpdateSkill = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Prepare data
    const payload = { 
      ...formData, 
      hourlyRate: Number(formData.hourlyRate),
    };

    if (formData.image) {
      payload.images = [formData.image];
    } else {
      payload.images = [];
    }

    try {
      if (editingSkillId) {
        await updateSkill(editingSkillId, payload);
      } else {
        await createSkill(payload);
      }
      setIsModalOpen(false);
      setEditingSkillId(null);
      setFormData({ title: "", description: "", hourlyRate: "", category: "", image: "" });
      loadSkills();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || `Failed to ${editingSkillId ? "update" : "create"} skill`);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (skill) => {
    setEditingSkillId(skill._id);
    setFormData({
      title: skill.title || "",
      description: skill.description || "",
      hourlyRate: skill.hourlyRate || "",
      category: skill.category?._id || skill.category || "",
      image: (skill.images && skill.images.length > 0) ? skill.images[0] : "",
    });
    setIsModalOpen(true);
  };

  const handleToggleAvailability = async (skillId, currentStatus) => {
    try {
      await updateSkill(skillId, { isAvailable: !currentStatus });
      loadSkills();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update skill availability");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteSkill(skillId);
        loadSkills();
      } catch (err) {
        console.error(err);
        alert("Failed to delete skill");
      }
    }
  };

  const filtered = skills.filter(
    (skill) =>
      skill.title?.toLowerCase().includes(search.toLowerCase()) ||
      skill.provider?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Skills</h2>

        <div className="flex gap-4">
          <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search skills..."
              className="ml-2 bg-transparent outline-none w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => {
              setEditingSkillId(null);
              setFormData({ title: "", description: "", hourlyRate: "", category: "", image: "" });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition font-medium"
          >
            <Plus size={18} />
            Add Skill
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4 text-left">Skill</th>
              <th className="text-left">Provider</th>
              <th className="text-left">Rate/Hour</th>
              <th className="text-left">Availability</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((skill) => (
              <tr
                key={skill._id}
                className="border-b hover:bg-slate-50 transition"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <BookOpen size={18} className="text-purple-600" />
                    </div>

                    <span className="font-medium">
                      {skill.title}
                    </span>
                  </div>
                </td>

                <td>{skill.provider?.name}</td>

                <td>₹{skill.hourlyRate}</td>

                <td>
                  <button
                    onClick={() => handleToggleAvailability(skill._id, skill.isAvailable)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition hover:shadow-sm ${
                      skill.isAvailable
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    <Power size={14} />
                    {skill.isAvailable ? "Available" : "Unavailable"}
                  </button>
                </td>

                <td className="text-right p-4">
                  <button
                    onClick={() => openEditModal(skill)}
                    className="p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition"
                    title="Edit Skill"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(skill._id)}
                    className="p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600 rounded-lg transition"
                    title="Delete Skill"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-slate-500"
                >
                  No skills found.
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
              <h3 className="text-xl font-bold">{editingSkillId ? "Edit Skill" : "Add New Skill"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrUpdateSkill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Skill Title</label>
                <input required type="text" className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
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
                  <label className="block text-sm font-medium mb-1">Hourly Rate (₹)</label>
                  <input required type="number" min="0" className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} />
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
              </div>
              <button disabled={submitting} type="submit" className="w-full bg-blue-600 text-white font-bold rounded-xl py-3 mt-2 hover:bg-blue-700 transition disabled:opacity-70">
                {submitting ? (editingSkillId ? "Updating..." : "Adding...") : (editingSkillId ? "Update Skill" : "Add Skill")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}