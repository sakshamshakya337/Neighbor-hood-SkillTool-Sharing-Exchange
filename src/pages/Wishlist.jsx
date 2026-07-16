import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { HeartCrack } from 'lucide-react';
import ToolCard from '../components/tools/ToolCard';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlistTools, setWishlistTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, [user?.wishlist]);

  const fetchWishlist = async () => {
    try {
      if (user?.wishlist && user.wishlist.length > 0) {
        // Fetch all tools concurrently based on IDs in user context
        const toolPromises = user.wishlist.map((id) => {
          const toolId = typeof id === 'object' ? id._id : id;
          return api.get(`/api/tool/${toolId}`).catch(() => null);
        });
        
        const toolResponses = await Promise.all(toolPromises);
        const validTools = toolResponses
          .filter(res => res && res.data)
          .map(res => res.data.data?.tool || res.data)
          // Double mapping removed, just clean up data extraction:
          .map(t => t.data?.tool || t);
        
        setWishlistTools(validTools);
      } else {
        setWishlistTools([]);
      }
    } catch (err) {
      console.error("Failed to load wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && user?.wishlist?.length > 0) return <div className="text-center py-20 font-medium text-on-surface-variant">Loading wishlist...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-headline text-primary mb-8">My Wishlist</h1>
      
      {wishlistTools.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low rounded-xl border border-outline-variant">
          <HeartCrack className="w-16 h-16 mx-auto text-outline-variant mb-4" />
          <h2 className="text-xl font-medium text-on-surface mb-2">Your wishlist is empty</h2>
          <p className="text-on-surface-variant mb-6">Find tools you love and save them for later.</p>
          <Link to="/tools" className="bg-primary text-on-primary px-6 py-2 rounded-lg font-medium hover:brightness-110 transition-all">
            Browse Tools
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistTools.map((tool) => (
            <ToolCard key={tool._id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
