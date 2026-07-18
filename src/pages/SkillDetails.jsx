import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSkillById } from '../api/skillApi';
import { createBooking, getAvailability } from '../api/bookingApi';
import { createPaymentOrder, verifyPaymentStatus } from '../api/paymentApi';
import { loadRazorpay } from '../utils/loadRazorpay';
import AvailabilityCalendar from '../components/booking/AvailabilityCalendar';
import BookingForm from '../components/booking/BookingForm';
import ReviewSection from '../components/ReviewSection';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Heart, MessageSquare, MapPin, ShieldCheck, Info, CameraOff } from 'lucide-react';

const SkillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [skill, setSkill] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const skillData = await getSkillById(id);
        setSkill(skillData);
        
        const availabilityData = await getAvailability(id, true);
        setUnavailableDates(availabilityData);
        
        if (user) {
          const { data } = await api.get('/api/users/profile');
          if (data.wishlist && data.wishlist.some(wId => wId === id || wId._id === id)) {
             setIsWishlisted(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch skill details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [id, user]);

  const handleBookingSubmit = async (bookingData) => {
    if (!user) {
      alert("Please login to book this skill");
      navigate('/login');
      return;
    }
    
    if (user.isBlocked) {
      alert("Your account is restricted due to multiple reports. You cannot make new bookings.");
      return;
    }
    
    setBookingLoading(true);
    try {
      bookingData.skillId = id; // Add skillId
      delete bookingData.toolId; // Remove toolId
      
      // 1. Create booking (Pending)
      const bookingRes = await createBooking(bookingData);
      
      // 2. Create Razorpay Payment Order
      const totalAmount = bookingData.totalPrice;
      const paymentOrderData = {
        amount: totalAmount,
        bookingId: bookingRes._id,
        userId: user._id
      };
      const paymentOrderRes = await createPaymentOrder(paymentOrderData);
      
      if (!paymentOrderRes.success) {
        throw new Error(paymentOrderRes.message || "Could not create payment order");
      }

      // 3. Load Razorpay script
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setBookingLoading(false);
        return;
      }

      // 4. Initialize Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentOrderRes.order.amount,
        currency: paymentOrderRes.order.currency,
        name: "Neighbor-hood SkillTool Exchange",
        description: `Booking for ${skill.title}`,
        order_id: paymentOrderRes.order.id,
        handler: async function (response) {
          try {
            // 5. Verify payment on success
            const verifyRes = await verifyPaymentStatus({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              alert('Payment successful and skill booked!');
              navigate('/rental-history');
            } else {
              alert('Payment verification failed!');
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert('Payment verification error!');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ""
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function (response){
        alert(`Payment failed: ${response.error.description}`);
      });
      
    } catch (error) {
      console.error('Booking/Payment failed:', error);
      alert('Failed to book skill.');
    } finally {
      setBookingLoading(false);
    }
  };

  const toggleWishlist = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await api.post('/api/wishlist', { toolId: id }); // Uses same wishlist endpoint for now
      setIsWishlisted(data.message.includes('Added'));
    } catch (err) {
      console.error(err);
    }
  };


  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!skill) return <div className="text-center py-20">Skill not found</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl lg:text-5xl font-black text-on-surface font-headline mb-4 tracking-tight">{skill.title}</h1>
        <div className="flex flex-wrap items-center gap-5 text-on-surface-variant font-medium text-sm">
          <span className="flex items-center gap-1.5 bg-surface-container px-3.5 py-1.5 rounded-full border border-outline-variant/50 text-on-surface font-semibold">
            {skill.category?.name || 'General Skill'}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="text-xs font-bold text-primary">{skill.provider?.name?.charAt(0) || 'U'}</span>
            </div>
            <span className="font-semibold">Instructor: {skill.provider?.name || 'Unknown'}</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[400px] sm:h-[500px] bg-gradient-to-br from-surface-container-low to-surface-container rounded-3xl overflow-hidden relative mb-12 shadow-sm border border-outline-variant/50">
        {skill.images && skill.images.length > 0 ? (
          <img src={skill.images[0]} alt={skill.title} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 ease-out" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        <div className="lg:col-span-2 space-y-12">
          
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Info className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Hourly Rate</span>
                <span className="font-semibold text-lg text-on-surface">₹{skill.hourlyRate}</span>
              </div>
            </div>
          </div>
          
          <div className="px-2">
            <h3 className="text-2xl font-black font-headline text-on-surface mb-6">About this skill</h3>
            <p className="text-on-surface-variant leading-relaxed text-lg whitespace-pre-line">{skill.description}</p>
          </div>

          <div className="border-t border-outline-variant/50 pt-12 px-2">
             <AvailabilityCalendar unavailableDates={unavailableDates} />
          </div>

          <div className="border-t border-outline-variant/50 pt-12 px-2">
             <ReviewSection toolId={skill._id} />
          </div>

        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <BookingForm 
              tool={{...skill, pricePerDay: skill.hourlyRate}} 
              onSubmit={handleBookingSubmit} 
              isSubmitting={bookingLoading} 
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SkillDetails;
