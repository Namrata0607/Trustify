import React, { useState, useEffect } from 'react';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

const RateStoreModal = ({ store, existingRating, onClose, onSubmit, isOpen }) => {
  const [rating, setRating] = useState(existingRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset rating when modal opens with a new store or rating
    setRating(existingRating || 0);
  }, [existingRating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(store.id, rating);
    } finally {
      setLoading(false);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {existingRating ? 'Update Your Rating' : 'Rate This Store'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
              {store?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'ST'}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{store?.name}</h4>
              <p className="text-sm text-gray-600">{store?.address}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  {star <= (hoveredRating || rating) ? (
                    <StarIconSolid className="w-8 h-8 text-yellow-400" />
                  ) : (
                    <StarIconOutline className="w-8 h-8 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-center mt-2 text-sm text-gray-600">
              {rating === 0 
                ? 'Select a rating' 
                : `You're giving ${store?.name} ${rating} star${rating !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0}
              className={`px-4 py-2 rounded-lg ${
                rating === 0
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {existingRating ? 'Update Rating' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default RateStoreModal;