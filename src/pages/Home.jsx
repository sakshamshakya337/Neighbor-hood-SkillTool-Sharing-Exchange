import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
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
          <div className="group bg-surface-container-low rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-outline-variant">
            <div className="h-48 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Power Drill" src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"/>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">Power Drill</h3>
                <span className="text-xs bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded font-bold">New</span>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">18V Brushless with multiple bits. Great for home assembly.</p>
              <button className="w-full py-2 bg-primary text-on-primary rounded font-bold active:scale-95 transition-transform">Borrow</button>
            </div>
          </div>

          <div className="group bg-surface-container-low rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-outline-variant">
            <div className="h-48 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Lawn Mower" src="https://images.unsplash.com/photo-1592424097491-9e7987913382?auto=format&fit=crop&w=600&q=80"/>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-2">Lawn Mower</h3>
              <p className="text-sm text-on-surface-variant mb-4">Electric, self-propelled mower. Includes bag and charger.</p>
              <button className="w-full py-2 bg-primary text-on-primary rounded font-bold active:scale-95 transition-transform">Borrow</button>
            </div>
          </div>

          <div className="group bg-surface-container-low rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-outline-variant">
            <div className="h-48 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Extension Ladder" src="https://images.unsplash.com/photo-1505051508008-923feaf90263?auto=format&fit=crop&w=600&q=80"/>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-2">Extension Ladder</h3>
              <p className="text-sm text-on-surface-variant mb-4">16ft telescopic ladder. Lightweight and very sturdy.</p>
              <button className="w-full py-2 bg-primary text-on-primary rounded font-bold active:scale-95 transition-transform">Borrow</button>
            </div>
          </div>

          <div className="group bg-surface-container-low rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-outline-variant">
            <div className="h-48 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Sewing Machine" src="https://images.unsplash.com/photo-1605280803522-83216c52a0ea?auto=format&fit=crop&w=600&q=80"/>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-2">Sewing Machine</h3>
              <p className="text-sm text-on-surface-variant mb-4">Heavy-duty singer machine for all fabric types.</p>
              <button className="w-full py-2 bg-primary text-on-primary rounded font-bold active:scale-95 transition-transform">Borrow</button>
            </div>
          </div>
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
            <div className="relative group h-[400px] rounded-3xl overflow-hidden cursor-pointer">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Intro to Carpentry" src="https://images.unsplash.com/photo-1502021680532-838cfc650323?auto=format&fit=crop&w=600&q=80"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white text-2xl font-black mb-2">Intro to Carpentry</h3>
                <p className="text-white/80 text-sm mb-6">Learn the basics of furniture making with Master Carpenter Dave.</p>
                <button className="self-start px-6 py-2 bg-white text-on-surface rounded-full font-bold hover:bg-primary hover:text-white transition-colors">Learn More</button>
              </div>
            </div>

            <div className="relative group h-[400px] rounded-3xl overflow-hidden cursor-pointer">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Organic Gardening" src="https://images.unsplash.com/photo-1416879598555-220b8f3e5898?auto=format&fit=crop&w=600&q=80"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white text-2xl font-black mb-2">Organic Gardening</h3>
                <p className="text-white/80 text-sm mb-6">Start your own vegetable patch with Sarah's soil-to-table workshop.</p>
                <button className="self-start px-6 py-2 bg-white text-on-surface rounded-full font-bold hover:bg-primary hover:text-white transition-colors">Learn More</button>
              </div>
            </div>

            <div className="relative group h-[400px] rounded-3xl overflow-hidden cursor-pointer">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Bicycle Repair" src="https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=600&q=80"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white text-2xl font-black mb-2">Bicycle Repair</h3>
                <p className="text-white/80 text-sm mb-6">Fix flats, adjust gears, and maintain your ride with Mike.</p>
                <button className="self-start px-6 py-2 bg-white text-on-surface rounded-full font-bold hover:bg-primary hover:text-white transition-colors">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
