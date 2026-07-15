import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToolById } from '../api/toolApi';
import { createBooking, getAvailability } from '../api/bookingApi';
import AvailabilityCalendar from '../components/booking/AvailabilityCalendar';
import BookingForm from '../components/booking/BookingForm';

const ToolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const toolData = await getToolById(id);
        setTool(toolData);
        
        const availabilityData = await getAvailability(id);
        setUnavailableDates(availabilityData);
      } catch (error) {
        console.error('Failed to fetch tool details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [id]);

  const handleBookingSubmit = async (bookingData) => {
    setBookingLoading(true);
    try {
      // Simulate booking process
      const result = await createBooking(bookingData);
      alert('Booking created successfully! Redirecting to rental history...');
      navigate('/rental-history');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to create booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!tool) return <div className="text-center py-20">Tool not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
             <div className="h-96 bg-gray-200">
              {tool.images && tool.images.length > 0 ? (
                <img src={tool.images[0]} alt={tool.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{tool.name}</h1>
                  <p className="text-gray-500 mt-1">{tool.category?.name || 'General'}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">${tool.pricePerDay}<span className="text-sm text-gray-500 font-normal">/day</span></p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 mb-6">{tool.description}</p>
              
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <ul className="text-gray-600 space-y-1">
                <li><span className="font-medium">Condition:</span> {tool.condition}</li>
                <li><span className="font-medium">Security Deposit:</span> ${tool.depositAmount}</li>
                <li><span className="font-medium">Location:</span> {tool.location?.address || 'Not specified'}</li>
                <li><span className="font-medium">Owner:</span> {tool.owner?.name || 'Unknown'}</li>
              </ul>
            </div>
          </div>
          
          <AvailabilityCalendar unavailableDates={unavailableDates} />
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-4">
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
