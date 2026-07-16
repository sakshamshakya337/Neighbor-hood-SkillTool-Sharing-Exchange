import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToolById } from '../api/toolApi';
import { createBooking, getAvailability } from '../api/bookingApi';
import AvailabilityCalendar from '../components/booking/AvailabilityCalendar';
import BookingForm from '../components/booking/BookingForm';
import ReviewSection from '../components/ReviewSection';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Heart, MessageSquare, MapPin, ShieldCheck, Info, User as UserIcon, CameraOff } from 'lucide-react';

const ToolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tool, setTool] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const toolData = await getToolById(id);
        setTool(toolData);
        
        const availabilityData = await getAvailability(id);
        setUnavailableDates(availabilityData);
        
        if (user) {
          const { data } = await api.get('/api/users/profile');
          if (data.wishlist && data.wishlist.some(wId => wId === id || wId._id === id)) {
             setIsWishlisted(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch tool details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [id, user]);

  const handleBookingSubmit = async (bookingData) => {
    setBookingLoading(true);
    try {
      await createBooking(bookingData);
      alert('Booking created successfully! Redirecting to rental history...');
      navigate('/rental-history');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to create booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const toggleWishlist = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await api.post('/api/wishlist', { toolId: id });
      setIsWishlisted(data.message.includes('Added'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMessageOwner = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await api.post('/api/chat', { userId: tool.owner._id });
      navigate('/chat', { state: { chatId: data._id } });
    } catch (err) {
      console.error('Failed to start chat:', err);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!tool) return <div className="text-center py-20">Tool not found</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl lg:text-5xl font-black text-on-surface font-headline mb-4 tracking-tight">{tool.name}</h1>
        <div className="flex flex-wrap items-center gap-5 text-on-surface-variant font-medium text-sm">
          <span className="flex items-center gap-1.5 bg-surface-container px-3.5 py-1.5 rounded-full border border-outline-variant/50 text-on-surface font-semibold">
            {tool.category?.name || 'General'}
          </span>
          <span className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            {tool.location?.address || 'Location not specified'}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="text-xs font-bold text-primary">{tool.owner?.name?.charAt(0) || 'U'}</span>
            </div>
            <span className="font-semibold">Hosted by {tool.owner?.name || 'Unknown'}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[400px] sm:h-[500px] bg-gradient-to-br from-surface-container-low to-surface-container rounded-3xl overflow-hidden relative mb-12 shadow-sm border border-outline-variant/50">
        {tool.images && tool.images.length > 0 ? (
          <img src={tool.images[0]} alt={tool.name} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 ease-out" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant/60">
            <CameraOff className="w-16 h-16 mb-4 opacity-50" />
            <span className="text-lg font-medium">No Image Available</span>
          </div>
        )}
        <button 
          onClick={toggleWishlist}
          className="absolute top-6 right-6 bg-surface/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all border border-outline-variant/30"
        >
          <Heart className={`w-6 h-6 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-on-surface'}`} />
        </button>
      </div>

      {/* Main Content & Booking Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Highlights */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Info className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Condition</span>
                <span className="font-semibold text-lg text-on-surface">{tool.condition}</span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Security Deposit</span>
                <span className="font-semibold text-lg text-on-surface">${tool.depositAmount}</span>
              </div>
            </div>
            {tool.owner?._id !== user?._id && (
              <div className="flex items-center md:justify-end flex-1">
                <button 
                  onClick={handleMessageOwner}
                  className="flex items-center justify-center w-full md:w-auto gap-2 bg-surface-container-high border border-outline-variant text-on-surface px-6 py-3 rounded-xl hover:bg-surface-container transition-all font-bold shadow-sm active:scale-95"
                >
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Message Host
                </button>
              </div>
            )}
          </div>
          
          {/* Description */}
          <div className="px-2">
            <h3 className="text-2xl font-black font-headline text-on-surface mb-6">About this tool</h3>
            <p className="text-on-surface-variant leading-relaxed text-lg whitespace-pre-line">{tool.description}</p>
          </div>

          <div className="border-t border-outline-variant/50 pt-12 px-2">
             <AvailabilityCalendar unavailableDates={unavailableDates} />
          </div>

          <div className="border-t border-outline-variant/50 pt-12 px-2">
             <ReviewSection toolId={tool._id} />
          </div>

        </div>
        
        {/* Right Column: Sticky Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <BookingForm 
              tool={tool} 
              onSubmit={handleBookingSubmit} 
              isSubmitting={bookingLoading} 
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ToolDetails;
