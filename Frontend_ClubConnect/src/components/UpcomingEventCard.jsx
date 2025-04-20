
import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const UpcomingEventCard = ({ event, onJoin }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return 'No description available';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="flex bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 animate-fade-in">
      <div className="relative w-28 sm:w-36 md:w-48 overflow-hidden">
        <img
          src={event.images?.[0]?.url || 'https://via.placeholder.com/100x100?text=Club+Connect'}
          alt={event.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/100x100?text=Club+Connect';
          }}
        />
      </div>
      
      <div className="p-4 flex-1">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h2 className="font-bold text-lg text-club-dark hover:text-club-primary transition-colors duration-300">{event.name || 'Event Title'}</h2>
            
            <div className="flex flex-wrap gap-3 mt-1 mb-2">
              <div className="flex items-center text-gray-500 text-xs">
                <Calendar className="h-3 w-3 mr-1 text-club-primary" />
                <span>{formattedDate}</span>
              </div>
              
              {event.location && (
                <div className="flex items-center text-gray-500 text-xs">
                  <MapPin className="h-3 w-3 mr-1 text-club-primary" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-600 text-sm">
              {truncateDescription(event.description, 80)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex items-center">
        <button
          onClick={() => onJoin(event._id)}
          className="btn-primary whitespace-nowrap"
        >
          <span>Join</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default UpcomingEventCard;