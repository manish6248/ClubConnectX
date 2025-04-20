// src/components/UserProfile/StudentEvents.jsx
import { useState, useEffect } from 'react';

const StudentEvents = ({ userId }) => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await fetch(`/api/v1/students/${userId}/events`);
        if (response.ok) {
          const data = await response.json();
          setRegisteredEvents(data);
        }
      } catch (error) {
        console.error("Error fetching registered events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [userId]);

  if (loading) return <div>Loading your events...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Your Registered Events</h2>
      {registeredEvents.length === 0 ? (
        <p className="text-gray-500">You haven't registered for any events yet.</p>
      ) : (
        <div className="space-y-4">
          {registeredEvents.map(event => (
            <div key={event._id} className="border-b pb-3">
              <h3 className="font-semibold">{event.name}</h3>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </p>
              <p className="text-sm">Status: {event.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentEvents;
