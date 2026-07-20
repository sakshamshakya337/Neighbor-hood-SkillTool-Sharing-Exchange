import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Heart, MessageSquare, Menu, X } from 'lucide-react';
import Logo from './Logo';
import NotificationsDropdown from './NotificationsDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`flex justify-between items-center px-4 md:px-6 py-3 w-full sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg bg-white/95 backdrop-blur-sm' : 'bg-surface'} border-b border-outline-variant`}>
      <div className="flex items-center gap-4 md:gap-8">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-lg md:text-xl font-headline font-black text-primary" onClick={closeMobileMenu}>
          <Logo className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          NeighborShare
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-body text-sm font-medium">
          <Link to="/" className="text-primary hover:text-primary/80 transition-colors">Home</Link>
          <Link to="/skills" className="text-on-surface-variant hover:text-primary transition-colors">Browse Skills</Link>
          <Link to="/tools" className="text-on-surface-variant hover:text-primary transition-colors">Browse Tools</Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative hidden lg:block">
          <input className="pl-10 pr-4 py-2 rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-sm w-64" placeholder="Search resources..." type="text"/>
          <Search className="absolute left-3 top-2.5 text-on-surface-variant w-4 h-4" />
        </div>
        {user ? (
          <div className="flex items-center gap-1 md:gap-5">
            {/* Quick Actions */}
            <div className="flex items-center gap-1 md:gap-2 pr-1 md:pr-2">
              <Link to="/wishlist" className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-200" title="Wishlist">
                <Heart className="w-5 h-5" />
              </Link>
              <Link to="/chat" className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-200" title="Messages">
                <MessageSquare className="w-5 h-5" />
              </Link>
              <NotificationsDropdown />
            </div>
            
            <div className="hidden md:flex items-center gap-2 border-l border-outline-variant/50 pl-5">
              <Link to="/dashboard" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/profile" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors mx-2">Profile</Link>
              <button 
                onClick={handleLogout} 
                className="ml-2 bg-primary/10 text-primary font-bold px-5 py-2 rounded-full hover:bg-primary hover:text-on-primary transition-all duration-200 active:scale-95 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login" className="text-on-surface-variant font-medium hover:bg-surface-container-low px-4 py-2 rounded transition-all active:scale-95 duration-150 ease-in-out">
              Login
            </Link>
            <Link to="/register" className="bg-primary text-on-primary font-medium px-6 py-2 rounded-lg hover:brightness-110 shadow-sm transition-all active:scale-95 duration-150 ease-in-out">
              Signup
            </Link>
          </div>
        )}

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-on-surface-variant hover:text-primary focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface shadow-xl border-b border-outline-variant px-6 py-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-3 font-medium text-lg border-b border-outline-variant/50 pb-4">
            <Link to="/" className="text-on-surface hover:text-primary" onClick={closeMobileMenu}>Home</Link>
            <Link to="/skills" className="text-on-surface hover:text-primary" onClick={closeMobileMenu}>Browse Skills</Link>
            <Link to="/tools" className="text-on-surface hover:text-primary" onClick={closeMobileMenu}>Browse Tools</Link>
          </div>
          
          {user ? (
            <div className="flex flex-col gap-3 font-medium text-lg pt-2">
              <Link to="/dashboard" className="text-on-surface hover:text-primary" onClick={closeMobileMenu}>Dashboard</Link>
              <Link to="/profile" className="text-on-surface hover:text-primary" onClick={closeMobileMenu}>Profile</Link>
              <button 
                onClick={handleLogout} 
                className="mt-2 w-full text-center bg-primary/10 text-primary font-bold px-5 py-3 rounded-xl active:scale-95 transition-transform"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 font-medium text-lg pt-2">
              <Link to="/login" className="text-center border border-outline-variant text-on-surface px-4 py-3 rounded-xl active:scale-95" onClick={closeMobileMenu}>
                Login
              </Link>
              <Link to="/register" className="text-center bg-primary text-on-primary px-4 py-3 rounded-xl active:scale-95" onClick={closeMobileMenu}>
                Signup
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
