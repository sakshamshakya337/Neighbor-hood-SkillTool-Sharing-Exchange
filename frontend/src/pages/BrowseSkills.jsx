import React, { useState } from 'react';
import { Search, Filter, Wrench, Code, BookOpen, Music, Camera, Paintbrush, ChevronDown, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_SKILLS = [
  { id: 1, title: 'Carpentry Basics', provider: 'Alex Johnson', category: 'Handyman', rating: 4.8, location: 'Downtown', icon: Wrench, image: 'https://images.unsplash.com/photo-1532009877282-3340270e0529?w=500&q=80' },
  { id: 2, title: 'React Web Development', provider: 'Sarah Chen', category: 'Tech', rating: 5.0, location: 'Northside', icon: Code, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80' },
  { id: 3, title: 'Guitar Lessons', provider: 'Mike Davis', category: 'Music', rating: 4.9, location: 'West End', icon: Music, image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80' },
  { id: 4, title: 'Portrait Photography', provider: 'Emily White', category: 'Arts', rating: 4.7, location: 'Southside', icon: Camera, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80' },
  { id: 5, title: 'Math Tutoring', provider: 'David Kim', category: 'Education', rating: 4.9, location: 'University District', icon: BookOpen, image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80' },
  { id: 6, title: 'Interior Painting', provider: 'Lisa Wong', category: 'Handyman', rating: 4.6, location: 'Eastside', icon: Paintbrush, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80' },
];

const CATEGORIES = ['All', 'Handyman', 'Tech', 'Music', 'Arts', 'Education'];

const BrowseSkills = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSkills = MOCK_SKILLS.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          skill.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
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

        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSkills.map(skill => (
              <div key={skill.id} className="group bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={skill.image} 
                    alt={skill.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1.5">
                    <skill.icon className="w-3.5 h-3.5" />
                    {skill.category}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-on-surface line-clamp-1">{skill.title}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {skill.rating}
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium text-on-surface-variant mb-4 flex-grow">By {skill.provider}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-6 font-medium">
                    <MapPin className="w-4 h-4" />
                    {skill.location}
                  </div>
                  
                  <button className="w-full py-2.5 px-4 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary font-bold rounded-xl transition-colors duration-200">
                    Request Skill
                  </button>
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
