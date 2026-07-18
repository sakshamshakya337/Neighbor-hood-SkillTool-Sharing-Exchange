import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSkill, updateSkill, getSkillById } from '../api/skillApi';
import { getCategories } from '../api/toolApi'; // Assuming categories are shared or similar API

const AddEditSkill = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    hourlyRate: '',
    address: ''
  });

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        
        if (isEditing) {
          const skill = await getSkillById(id);
          setFormData({
            title: skill.title,
            description: skill.description,
            category: skill.category?._id || skill.category,
            hourlyRate: skill.hourlyRate,
            address: skill.location?.address || ''
          });
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user && user.isBlocked) {
      alert("Your account is restricted. You cannot list new skills.");
      return;
    }
    setSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        hourlyRate: Number(formData.hourlyRate),
        location: {
          type: 'Point',
          coordinates: [0, 0],
          address: formData.address
        }
      };

      if (isEditing) {
        await updateSkill(id, payload);
        alert('Skill updated successfully!');
      } else {
        await createSkill(payload);
        alert('Skill listed successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to save skill.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {isEditing ? 'Edit Skill' : 'Offer a Skill'}
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skill Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., Expert Plumbing"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            required
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Describe what you can do..."
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹) *</label>
            <input
              type="number"
              name="hourlyRate"
              required
              min="0"
              step="0.01"
              value={formData.hourlyRate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Area / Location</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. Springfield Area"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div className="pt-4 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {submitting ? 'Saving...' : 'List Skill'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditSkill;
