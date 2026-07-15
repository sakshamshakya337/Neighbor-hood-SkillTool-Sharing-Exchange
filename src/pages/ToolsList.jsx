import React, { useState, useEffect } from 'react';
import { getTools, getCategories, searchTools } from '../api/toolApi';
import ToolCard from '../components/tools/ToolCard';
import CategoryFilter from '../components/tools/CategoryFilter';
import SearchBar from '../components/tools/SearchBar';

const ToolsList = () => {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTools();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTools = async () => {
    setLoading(true);
    try {
      if (searchQuery || selectedCategory) {
        const data = await searchTools(searchQuery, selectedCategory);
        setTools(data);
      } else {
        const data = await getTools();
        setTools(data);
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Browse Tools</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {loading ? (
        <div className="text-center py-10">Loading tools...</div>
      ) : tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool._id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg">No tools found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ToolsList;
