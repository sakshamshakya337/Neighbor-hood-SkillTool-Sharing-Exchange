import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const BookingForm = ({ tool, onSubmit, isSubmitting }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive of start day
      if (diffDays > 0) {
        setTotalPrice(diffDays * tool.pricePerDay);
      }
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate, tool.pricePerDay]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      toolId: tool._id,
      startDate,
      endDate,
      totalPrice
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-outline-variant">
      <div className="mb-6">
        <span className="text-3xl font-black font-headline text-on-surface">₹{tool.pricePerDay}</span>
        <span className="text-on-surface-variant font-medium"> / day</span>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="bg-surface-container-low rounded-xl border border-outline-variant p-1">
          <div className="relative border-b border-outline-variant p-2">
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">Check-in</label>
            <input
              type="date"
              required
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 outline-none text-on-surface font-medium cursor-pointer"
            />
          </div>
          
          <div className="relative p-2">
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">Check-out</label>
            <input
              type="date"
              required
              min={startDate || today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 outline-none text-on-surface font-medium cursor-pointer"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!startDate || !endDate || isSubmitting}
        className="w-full bg-primary text-on-primary font-bold py-3.5 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:bg-surface-container-high disabled:text-on-surface-variant disabled:cursor-not-allowed text-lg shadow-md"
      >
        {isSubmitting ? 'Processing...' : 'Reserve'}
      </button>

      <p className="text-center text-on-surface-variant text-sm mt-4 font-medium">You won't be charged yet</p>

      {totalPrice > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-on-surface">
            <span className="underline decoration-outline-variant underline-offset-4">₹{tool.pricePerDay} x {totalPrice / tool.pricePerDay} days</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span className="underline decoration-outline-variant underline-offset-4">Security Deposit</span>
            <span>₹{tool.depositAmount || 0}</span>
          </div>
          <div className="border-t border-outline-variant pt-4 mt-4 flex justify-between font-black text-lg text-on-surface">
            <span>Total</span>
            <span>₹{totalPrice + (tool.depositAmount || 0)}</span>
          </div>
        </div>
      )}
    </form>
  );
};

export default BookingForm;
