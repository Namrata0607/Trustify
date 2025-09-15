import React from 'react';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { PencilSquareIcon, StarIcon } from '@heroicons/react/24/outline';

const StoreCard = ({ store, userRating, onRateStore, onEditRating }) => {
  const { id, name, address, overallRating } = store;
  
  // Store image placeholder, in a real app this would be dynamic
  const storeLogo = name.split(' ').map(n => n[0]).join('').slice(0, 2);

  // Render star rating display (not interactive)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <tr className="hover:bg-gray-50">
      {/* Store Name Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
            {storeLogo}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{name}</div>
            <div className="text-sm text-gray-500">Store ID: {id}</div>
          </div>
        </div>
      </td>
      
      {/* Address Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{address}</div>
      </td>
      
      {/* Overall Rating Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex space-x-1 mr-2">
            {renderStars(overallRating)}
          </div>
          <span className="text-sm text-gray-600">
            {overallRating ? overallRating.toFixed(1) : 'N/A'}
          </span>
        </div>
      </td>
      
      {/* Your Rating Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {userRating ? (
            <>
              <div className="flex space-x-1 mr-2">
                {renderStars(userRating)}
              </div>
              <span className="text-sm text-gray-600">{userRating.toFixed(1)}</span>
            </>
          ) : (
            <span className="text-sm text-gray-500">Not rated yet</span>
          )}
        </div>
      </td>
      
      {/* Actions Column */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-3">
          {userRating ? (
            <button
              onClick={() => onEditRating(id, userRating)}
              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
              title="Edit rating"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => onRateStore(id)}
              className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
              title="Rate store"
            >
              <StarIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default StoreCard;