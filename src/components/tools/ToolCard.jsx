import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const ToolCard = ({ tool }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200">
        {tool.images && tool.images.length > 0 ? (
          <img src={tool.images[0]} alt={tool.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{tool.name}</h3>
          <span className="text-blue-600 font-bold">${tool.pricePerDay}/day</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tool.description}</p>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={16} className="mr-1" />
          <span className="line-clamp-1">{tool.location?.address || 'Location not specified'}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded text-xs font-medium ${tool.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {tool.isAvailable ? 'Available' : 'Unavailable'}
          </span>
          <Link
            to={`/tools/${tool._id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
