// src/pages/EventSponsors.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const EventSponsors = () => {
  const { eventId } = useParams();
  const { currentUser } = useAuth();
  const [sponsors, setSponsors] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchEventAndSponsors = async () => {
      try {
        // Fetch event details
        const eventResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/${eventId}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event details');
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);

        // Fetch sponsors
        const sponsorsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/${eventId}/sponsors`);
        if (!sponsorsResponse.ok) {
          throw new Error('Failed to fetch sponsors');
        }
        const sponsorsData = await sponsorsResponse.json();
        setSponsors(sponsorsData);

        // Calculate total amount
        const total = sponsorsData.reduce((sum, sponsor) => sum + (sponsor.amount || 0), 0);
        setTotalAmount(total);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndSponsors();
  }, [eventId]);

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Sponsor Name', 'Email', 'Amount', 'Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...sponsors.map(sponsor => [
        sponsor.name,
        sponsor.email,
        sponsor.amount,
        new Date(sponsor.date).toLocaleDateString(),
        sponsor.status
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${event?.title || 'event'}-sponsors.csv`);
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
          <h1 className="text-2xl font-bold">{event?.title} - Sponsors</h1>
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

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Total Sponsors: {sponsors.length}</h2>
            <div className="text-lg font-semibold text-green-600">
              Total Amount: ₹{totalAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {sponsors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No sponsors have contributed to this event yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sponsor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                {sponsors.map((sponsor) => (
                  <tr key={sponsor._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {sponsor.logo ? (
                          <img 
                            className="h-10 w-10 rounded-full mr-3 object-contain" 
                            src={sponsor.logo} 
                            alt={sponsor.name} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <span className="text-purple-800 font-semibold">
                              {sponsor.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {sponsor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {sponsor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        ₹{sponsor.amount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sponsor.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${sponsor.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          sponsor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {sponsor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => window.location.href = `/profile/${sponsor.userId}`}
                      >
                        View Profile
                      </button>
                      {sponsor.status === 'pending' && (
                        <div className="flex space-x-2 mt-1">
                          <button 
                            className="text-green-600 hover:text-green-900"
                            onClick={async () => {
                              try {
                                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/${eventId}/sponsors/${sponsor._id}/confirm`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                });
                                
                                if (response.ok) {
                                  // Update the sponsor status locally
                                  setSponsors(sponsors.map(s => 
                                    s._id === sponsor._id ? {...s, status: 'confirmed'} : s
                                  ));
                                }
                              } catch (error) {
                                console.error('Error confirming sponsor:', error);
                              }
                            }}
                          >
                            Confirm
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={async () => {
                              try {
                                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events/${eventId}/sponsors/${sponsor._id}/reject`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                });
                                
                                if (response.ok) {
                                  // Update the sponsor status locally
                                  setSponsors(sponsors.map(s => 
                                    s._id === sponsor._id ? {...s, status: 'rejected'} : s
                                  ));
                                }
                              } catch (error) {
                                console.error('Error rejecting sponsor:', error);
                              }
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sponsorship Tiers Summary */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Sponsorship Summary</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Platinum Sponsors</h3>
              <p className="text-2xl font-bold mt-2">
                {sponsors.filter(s => s.amount >= 10000).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                ₹{sponsors
                  .filter(s => s.amount >= 10000)
                  .reduce((sum, s) => sum + (s.amount || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800">Gold Sponsors</h3>
              <p className="text-2xl font-bold mt-2">
                {sponsors.filter(s => s.amount >= 5000 && s.amount < 10000).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                ₹{sponsors
                  .filter(s => s.amount >= 5000 && s.amount < 10000)
                  .reduce((sum, s) => sum + (s.amount || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800">Silver Sponsors</h3>
              <p className="text-2xl font-bold mt-2">
                {sponsors.filter(s => s.amount < 5000).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                ₹{sponsors
                  .filter(s => s.amount < 5000)
                  .reduce((sum, s) => sum + (s.amount || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSponsors;
