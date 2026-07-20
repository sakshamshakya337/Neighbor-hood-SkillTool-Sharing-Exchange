import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTool, updateTool, getToolById, getCategories } from '../api/toolApi';
import { useAuth } from '../context/AuthContext';

const AddEditTool = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    pricePerDay: '',
    depositAmount: '',
    condition: 'Good',
    address: ''
  });

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        
        if (isEditing) {
          const tool = await getToolById(id);
          setFormData({
            name: tool.name,
            description: tool.description,
            category: tool.category?._id || tool.category,
            pricePerDay: tool.pricePerDay,
            depositAmount: tool.depositAmount,
            condition: tool.condition,
            address: tool.location?.address || ''
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
      alert("Your account is restricted. You cannot list new tools.");
      return;
    }
    setSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        pricePerDay: Number(formData.pricePerDay),
        depositAmount: Number(formData.depositAmount),
        location: {
          type: 'Point',
          coordinates: [0, 0], // In a real app, geocode the address
          address: formData.address
        }
      };

      if (isEditing) {
        await updateTool(id, payload);
        alert('Tool updated successfully!');
      } else {
        await createTool(payload);
        alert('Tool created successfully!');
      }
      navigate('/dashboard'); // Or to the user's dashboard
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to save tool.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {isEditing ? 'Edit Tool' : 'Add New Tool'}
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tool Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Day (₹) *</label>
            <input
              type="number"
              name="pricePerDay"
              required
              min="0"
              step="0.01"
              value={formData.pricePerDay}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹) *</label>
            <input
              type="number"
              name="depositAmount"
              required
              min="0"
              step="0.01"
              value={formData.depositAmount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. 123 Main St, Springfield"
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
            {submitting ? 'Saving...' : 'Save Tool'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditTool;
