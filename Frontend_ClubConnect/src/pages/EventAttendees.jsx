// src/pages/EventAttendees.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const EventAttendees = () => {
  const { eventId } = useParams();
  const { currentUser } = useAuth();
  const [attendees, setAttendees] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventAndAttendees = async () => {
      try {
        // Fetch event details
        const eventResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/${eventId}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event details');
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);

        // Fetch attendees
        const attendeesResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/${eventId}/attendees`);
        if (!attendeesResponse.ok) {
          throw new Error('Failed to fetch attendees');
        }
        const attendeesData = await attendeesResponse.json();
        setAttendees(attendeesData);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndAttendees();
  }, [eventId]);

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Registration Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...attendees.map(attendee => [
        attendee.name,
        attendee.email,
        new Date(attendee.registrationDate).toLocaleDateString(),
        attendee.status
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${event?.title || 'event'}-attendees.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <p>Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{event?.title} - Attendees</h1>
          <p className="text-gray-600">
            {event?.date && new Date(event.date).toLocaleDateString()} at {event?.time}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link 
            to={`/event/${eventId}`}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back to Event
          </Link>
          <button
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Total Attendees: {attendees.length}</h2>
            <div className="text-sm text-gray-500">
              {attendees.filter(a => a.status === 'confirmed').length} Confirmed / 
              {attendees.filter(a => a.status === 'pending').length} Pending
            </div>
          </div>
        </div>

        {attendees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No attendees have registered for this event yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendees.map((attendee) => (
                  <tr key={attendee._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {attendee.profileImage ? (
                          <img 
                            className="h-8 w-8 rounded-full mr-2" 
                            src={attendee.profileImage} 
                            alt={attendee.name} 
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <span className="text-gray-500 text-sm">
                              {attendee.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {attendee.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(attendee.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${attendee.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {attendee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => window.location.href = `/profile/${attendee.userId}`}
                      >
                        View Profile
                      </button>
                      {attendee.status === 'pending' && (
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={async () => {
                            try {
                              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/${eventId}/attendees/${attendee._id}/confirm`, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                              });
                              
                              if (response.ok) {
                                // Update the attendee status locally
                                setAttendees(attendees.map(a => 
                                  a._id === attendee._id ? {...a, status: 'confirmed'} : a
                                ));
                              }
                            } catch (error) {
                              console.error('Error confirming attendee:', error);
                            }
                          }}
                        >
                          Confirm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventAttendees;
