import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
  const [tools, setTools] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [toolsRes, skillsRes] = await Promise.all([
          api.get('/api/tool'),
          api.get('/api/skill')
        ]);
        
        // Limit to 4 tools and 3 skills for the landing page layout
        setTools(toolsRes.data.tools ? toolsRes.data.tools.slice(0, 4) : toolsRes.data.slice(0, 4));
        setSkills(skillsRes.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoadingTools(false);
        setLoadingSkills(false);
      }
    };
    
    fetchHomeData();
  }, []);
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden -mt-8 mx-[-1rem] lg:mx-[-10vw]">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=1920&q=80" 
            alt="Community"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16">
          <h1 className="text-5xl md:text-7xl font-black text-white font-headline mb-6 tracking-tight">Your Neighborhood, Shared.</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 font-light max-w-2xl mx-auto leading-relaxed">Borrow a ladder, learn to garden, or share your own skills. Building a stronger community, one tool at a time.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all active:scale-95 text-center">Join the Neighborhood</Link>
            <button className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all active:scale-95">How it Works</button>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="bg-surface-container py-12 relative z-20 -mt-10 mx-6 rounded-2xl shadow-xl max-w-7xl lg:mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-outline-variant">
          <div className="px-6">
            <p className="text-4xl font-black text-primary mb-1">500+</p>
            <p className="text-on-surface-variant font-label uppercase tracking-widest text-xs">Neighbors Joined</p>
          </div>
          <div className="px-6">
            <p className="text-4xl font-black text-primary mb-1">200+</p>
            <p className="text-on-surface-variant font-label uppercase tracking-widest text-xs">Tools Shared</p>
          </div>
          <div className="px-6">
            <p className="text-4xl font-black text-primary mb-1">50</p>
            <p className="text-on-surface-variant font-label uppercase tracking-widest text-xs">Skills Taught</p>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-on-surface font-headline mb-2">Featured Tools</h2>
            <p className="text-on-surface-variant">Available for borrow in your area right now.</p>
          </div>
          <Link className="text-primary font-bold hover:underline hidden sm:block" to="#">View All Tools →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingTools ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-container-low rounded-2xl h-[350px]"></div>
            ))
          ) : tools.length > 0 ? (
            tools.map(tool => (
              <div key={tool._id} className="group bg-surface-container-low rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-outline-variant flex flex-col">
                <div className="h-48 overflow-hidden bg-slate-200">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={tool.name} 
                    src={tool.images && tool.images.length > 0 ? tool.images[0] : "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"}
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg line-clamp-1">{tool.name}</h3>
                    {tool.condition === "New" && <span className="text-xs bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded font-bold">New</span>}
                  </div>
                  <p className="text-sm text-on-surface-variant mb-4 line-clamp-2 flex-1">{tool.description}</p>
                  <Link to={`/tools/${tool._id}`} className="block text-center w-full py-2 bg-primary text-on-primary rounded font-bold active:scale-95 transition-transform">Borrow</Link>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-4 text-center text-on-surface-variant py-10">No tools available at the moment.</p>
          )}
        </div>
      </section>

      {/* Browse Skills Section */}
      <section className="bg-surface-container-lowest py-24 mx-[-1rem] lg:mx-[-10vw] px-4 lg:px-[10vw]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-on-surface font-headline mb-4">Learn From Your Neighbors</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">Skip the expensive classes. Real expertise is just around the corner.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loadingSkills ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-slate-200 h-[400px] rounded-3xl overflow-hidden"></div>
              ))
            ) : skills.length > 0 ? (
              skills.map(skill => (
                <div key={skill._id} className="relative group h-[400px] rounded-3xl overflow-hidden cursor-pointer">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 bg-slate-200" 
                    alt={skill.title} 
                    src={skill.images && skill.images.length > 0 ? skill.images[0] : "https://images.unsplash.com/photo-1502021680532-838cfc650323?auto=format&fit=crop&w=600&q=80"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-white text-2xl font-black mb-2 line-clamp-1">{skill.title}</h3>
                    <p className="text-white/80 text-sm mb-6 line-clamp-2">{skill.description}</p>
                    <Link to={`/skills/${skill._id}`} className="self-start px-6 py-2 bg-white text-on-surface rounded-full font-bold hover:bg-primary hover:text-white transition-colors">Learn More</Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-on-surface-variant py-10">No skills available at the moment.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
