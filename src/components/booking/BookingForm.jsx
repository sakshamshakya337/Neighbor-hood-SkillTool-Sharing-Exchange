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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Book this Tool</h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <div className="relative">
            <input
              type="date"
              required
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <div className="relative">
            <input
              type="date"
              required
              min={startDate || today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {totalPrice > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>${tool.pricePerDay} x {totalPrice / tool.pricePerDay} days</span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Security Deposit (Refundable)</span>
            <span>${tool.depositAmount}</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-bold text-gray-800">
            <span>Total to pay now</span>
            <span>${totalPrice + tool.depositAmount}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!startDate || !endDate || isSubmitting}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </form>
  );
};

export default BookingForm;
