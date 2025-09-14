import React from 'react';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const StoreCard = ({ store, userRating, onRateStore, onEditRating }) => {
  const { id, name, address, overallRating } = store;
  
  // Store image placeholder, in a real app this would be dynamic
  const storeLogo = name.split(' ').map(n => n[0]).join('').slice(0, 2);

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIconSolid key={star} className="w-5 h-5 text-yellow-400" />
          ) : (
            <StarIconOutline key={star} className="w-5 h-5 text-gray-300" />
          )
        ))}
        <span className="text-sm font-medium text-gray-700 ml-1">{rating?.toFixed(1) || 'N/A'}</span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {/* Placeholder for store image */}
        <div className="w-full h-40 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-white text-4xl font-bold">{storeLogo}</span>
        </div>
        
        {/* Overall Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 flex items-center">
          <StarIconSolid className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="font-medium text-sm">{overallRating?.toFixed(1) || 'N/A'}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-600 text-sm mb-3">{address}</p>
        
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Your Rating:</p>
              {userRating ? (
                <div className="flex items-center">
                  {renderStars(userRating)}
                </div>
              ) : (
                <span className="text-sm text-gray-500">Not rated yet</span>
              )}
            </div>
            
            <button
              onClick={() => userRating ? onEditRating(id, userRating) : onRateStore(id)}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {userRating ? 'Edit' : 'Rate Store'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;