import React, { useState } from 'react';
import { Search, Filter, Hammer, Wrench, Scissors, PaintBucket, Truck, Plug, ChevronDown, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_TOOLS = [
  { id: 1, title: 'Power Drill (DeWalt 20V)', owner: 'Mike Davis', category: 'Power Tools', rating: 5.0, location: 'West End', icon: Plug, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&q=80', available: true },
  { id: 2, title: 'Lawn Mower (Honda)', owner: 'Sarah Chen', category: 'Gardening', rating: 4.8, location: 'Northside', icon: Scissors, image: 'https://images.unsplash.com/photo-1592424006596-f94639739bbd?w=500&q=80', available: false },
  { id: 3, title: 'Socket Wrench Set', owner: 'Alex Johnson', category: 'Hand Tools', rating: 4.9, location: 'Downtown', icon: Wrench, image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500&q=80', available: true },
  { id: 4, title: 'Heavy Duty Ladder (8ft)', owner: 'Emily White', category: 'General', rating: 4.7, location: 'Southside', icon: Hammer, image: 'https://images.unsplash.com/photo-1590211516082-f56f3f01908b?w=500&q=80', available: true },
  { id: 5, title: 'Pressure Washer', owner: 'David Kim', category: 'Cleaning', rating: 4.6, location: 'University District', icon: PaintBucket, image: 'https://images.unsplash.com/photo-1616172605389-eb39e946a482?w=500&q=80', available: true },
  { id: 6, title: 'Pickup Truck', owner: 'Lisa Wong', category: 'Vehicles', rating: 4.9, location: 'Eastside', icon: Truck, image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=500&q=80', available: false },
];

const CATEGORIES = ['All', 'Power Tools', 'Hand Tools', 'Gardening', 'Cleaning', 'Vehicles', 'General'];

const BrowseTools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTools = MOCK_TOOLS.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black font-headline text-primary mb-6">
            Borrow Tools from Your Neighbors
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
            Need a tool for a one-time project? Save money and connect with your community by borrowing what you need right here.
          </p>
          
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-on-surface-variant" />
              </div>
              <input
                type="text"
                placeholder="Search for tools (e.g., Drill, Ladder...)"
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

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-on-surface">Available Tools</h2>
          <p className="text-sm font-medium text-on-surface-variant">{filteredTools.length} results</p>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map(tool => (
              <div key={tool.id} className="group bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={tool.image} 
                    alt={tool.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1.5">
                    <tool.icon className="w-3.5 h-3.5" />
                    {tool.category}
                  </div>
                  <div className={`absolute top-4 right-4 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${tool.available ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                    {tool.available ? 'Available' : 'In Use'}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-on-surface line-clamp-1">{tool.title}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {tool.rating}
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium text-on-surface-variant mb-4 flex-grow">Owner: {tool.owner}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-6 font-medium">
                    <MapPin className="w-4 h-4" />
                    {tool.location}
                  </div>
                  
                  <button 
                    disabled={!tool.available}
                    className={`w-full py-2.5 px-4 font-bold rounded-xl transition-colors duration-200 ${
                      tool.available 
                        ? 'bg-primary/10 text-primary hover:bg-primary hover:text-on-primary' 
                        : 'bg-surface-variant text-on-surface-variant opacity-70 cursor-not-allowed'
                    }`}
                  >
                    {tool.available ? 'Request to Borrow' : 'Currently Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
            <Search className="w-12 h-12 text-outline-variant mx-auto mb-4" />
            <h3 className="text-xl font-bold text-on-surface mb-2">No tools found</h3>
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

export default BrowseTools;
