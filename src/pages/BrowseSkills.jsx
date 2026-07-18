import React, { useState, useEffect } from 'react';
import { Search, Filter, Wrench, Code, BookOpen, Music, Camera, Paintbrush, ChevronDown, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['All', 'Handyman', 'Tech', 'Music', 'Arts', 'Education', 'General'];

const BrowseSkills = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/api/skill');
      setSkills(data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = skills.filter(skill => {
    const titleMatch = skill.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const providerMatch = skill.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || providerMatch;
    
    const catName = skill.category?.name || 'General';
    const matchesCategory = selectedCategory === 'All' || catName === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black font-headline text-primary mb-6">
            Learn a New Skill from Your Neighbors
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
            Discover talented people in your community offering to teach what they know best. From carpentry to coding, find your next passion here.
          </p>
          
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-on-surface-variant" />
              </div>
              <input
                type="text"
                placeholder="Search for skills (e.g., Guitar, React...)"
                className="block w-full pl-11 pr-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-on-surface-variant" />
              </div>
              <select
                className="block w-full pl-11 pr-10 py-4 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none appearance-none font-medium"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-on-surface-variant" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-on-surface">Available Skills</h2>
          <p className="text-sm font-medium text-on-surface-variant">{filteredSkills.length} results</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-200 h-[350px] rounded-3xl"></div>
            ))}
          </div>
        ) : filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSkills.map(skill => (
              <div key={skill._id} className="group bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  <img 
                    src={skill.images && skill.images.length > 0 ? skill.images[0] : "https://images.unsplash.com/photo-1502021680532-838cfc650323?auto=format&fit=crop&w=600&q=80"} 
                    alt={skill.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {skill.category?.name || 'General'}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-on-surface line-clamp-1">{skill.title}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      5.0
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium text-on-surface-variant mb-4 flex-grow line-clamp-2">{skill.description}</p>
                  <p className="text-xs font-medium text-on-surface-variant mb-4">Instructor: {skill.provider?.name || 'Unknown'}</p>
                  
                  <Link to={`/skills/${skill._id}`} className="block text-center w-full py-2.5 px-4 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary font-bold rounded-xl transition-colors duration-200">
                    Learn More (₹{skill.hourlyRate}/hr)
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
            <Search className="w-12 h-12 text-outline-variant mx-auto mb-4" />
            <h3 className="text-xl font-bold text-on-surface mb-2">No skills found</h3>
            <p className="text-on-surface-variant">Try adjusting your search or filter to find what you're looking for.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default BrowseSkills;
