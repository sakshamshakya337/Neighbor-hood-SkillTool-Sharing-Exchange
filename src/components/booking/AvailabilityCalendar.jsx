import React from 'react';

const AvailabilityCalendar = ({ unavailableDates }) => {
  // A simple placeholder for availability calendar
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Availability</h3>
      {unavailableDates && unavailableDates.length > 0 ? (
        <ul className="text-sm text-gray-600 space-y-2">
          {unavailableDates.map((booking, idx) => (
            <li key={idx} className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              Booked: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-green-600 font-medium flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          Currently available for all upcoming dates.
        </p>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
