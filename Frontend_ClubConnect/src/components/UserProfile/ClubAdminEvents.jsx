// src/components/UserProfile/ClubAdminEvents.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClubAdminEvents = ({ userId }) => {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreatedEvents = async () => {
      try {
        const response = await fetch(`/api/v1/club-admin/${userId}/events`);
        if (response.ok) {
          const data = await response.json();
          setCreatedEvents(data);
        }
      } catch (error) {
        console.error("Error fetching created events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedEvents();
  }, [userId]);

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleViewAttendees = (eventId) => {
    navigate(`/event/${eventId}/attendees`);
  };

  const handleViewSponsors = (eventId) => {
    navigate(`/event/${eventId}/sponsors`);
  };

  if (loading) return <div>Loading your events...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Events You've Created</h2>
        <button 
          onClick={handleCreateEvent}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Event
        </button>
      </div>
      
      {createdEvents.length === 0 ? (
        <p className="text-gray-500">You haven't created any events yet.</p>
      ) : (
        <div className="space-y-4">
          {createdEvents.map(event => (
            <div key={event._id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{event.name}</h3>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </p>
              <p className="text-sm mb-3">Attendees: {event.attendeeCount || 0}</p>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => navigate(`/edit-event/${event._id}`)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleViewAttendees(event._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  View Attendees
                </button>
                <button 
                  onClick={() => handleViewSponsors(event._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  View Sponsors
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubAdminEvents;
