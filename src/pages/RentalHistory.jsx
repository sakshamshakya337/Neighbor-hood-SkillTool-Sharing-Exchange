import React, { useState, useEffect } from 'react';
import { getRentalHistory } from '../api/bookingApi';
import { Link } from 'react-router-dom';

const RentalHistory = () => {
  const [history, setHistory] = useState({ rentedByMe: [], rentedToOthers: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rentedByMe');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getRentalHistory();
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch rental history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  const displayList = activeTab === 'rentedByMe' ? history.rentedByMe : history.rentedToOthers;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Rental History</h1>
      
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'rentedByMe'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('rentedByMe')}
        >
          Tools I Rented
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'rentedToOthers'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('rentedToOthers')}
        >
          Tools Lent Out
        </button>
      </div>
      
      {displayList.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500 border border-gray-200">
          No records found in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {displayList.map(booking => (
            <div key={booking._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  <Link to={`/tools/${booking.tool?._id}`} className="hover:text-blue-600 hover:underline">
                    {booking.tool?.name || 'Unknown Tool'}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="font-medium text-gray-700">Total: ${booking.totalPrice}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link
                  to={`/tools/${booking.tool?._id}`}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  View Tool
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalHistory;
