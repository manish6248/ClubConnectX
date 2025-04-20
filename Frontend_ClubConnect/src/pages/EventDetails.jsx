// src/pages/EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${apiUrl}/events/${id}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEventDetails();
  }, [id]);

  const nextImage = () => {
    if (event?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === event.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (event?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? event.images.length - 1 : prevIndex - 1
      );
    }
  };

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!event) return <div className="p-4 text-center">Loading...</div>;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1D1D35]">{event.name}</h1>
        <div className="flex gap-2">
          <Link to={'/all-events'}>
          <button className="border border-[#1D1D35] rounded-full px-4 py-1 text-sm hover:bg-[#1D1D35] hover:text-white transition">All event</button>
          </Link>
          <button className="border border-[#1D1D35] rounded-full px-4 py-1 text-sm hover:bg-[#1D1D35] hover:text-white transition">Campus event</button>
          <button className="bg-[#1D1D35] text-white rounded-full px-4 py-1 text-sm">Near Campus event</button>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative w-full h-60 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
        {event.images?.length > 0 ? (
          <>
            <img
              src={event.images[currentImageIndex].url}
              alt={`Event Image ${currentImageIndex + 1}`}
              className="object-cover w-full h-full"
            />
            {event.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70">&#10094;</button>
                <button onClick={nextImage} className="absolute right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70">&#10095;</button>
              </>
            )}
          </>
        ) : (
          <p className="text-gray-500">No images available</p>
        )}
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-1 rounded-md bg-[#1D1D35] text-white">Share</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* About Event Section */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-[#1D1D35] mb-2">About Event</h2>
          <p className="text-sm text-gray-500 mb-4">{event.description || "No description available."}</p>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-gray-700">
              <p><strong>Date:</strong> {formattedDate}</p>
              <p><strong>Time:</strong> {event.time || 'N/A'}</p>
              <p><strong>Institution:</strong> {event.institution || 'N/A'}</p>
              <p><strong>Price:</strong> {event.isFree ? 'Free' : `₹${event.price}`}</p>
            </div>
            <div className="text-sm text-gray-700">
              <p><strong>Club:</strong> {event.clubName || 'N/A'}</p>
              <p><strong>Performer:</strong> {event.performer || 'N/A'}</p>
              <p><strong>Likes:</strong> {event.likeCount || 0}</p>
              <p><strong>Created:</strong> {new Date(event.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Contact Organizers */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="text-sm font-medium text-[#1D1D35]">Contact Organizers</h2>
          <div className="flex items-center gap-3">
            <img src="https://static.vecteezy.com/system/resources/thumbnails/005/747/617/small/phone-call-icon-symbol-in-trendy-flat-style-call-icon-sign-for-app-logo-web-call-icon-flat-illustration-telephone-symbol-vector.jpg" alt="Organizer" className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-sm text-gray-700">{event.phone || "+91 926425663"}</p>
              <p className="text-sm text-gray-500">{event.organizer || "itz_user"}</p>
            </div>
          </div>
          <button className="w-full py-2 text-white bg-[#1D1D35] rounded-md">Contact Us</button>
        </div>
      </div>

      {/* Schedule & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow">
          <Calendar className="text-gray-500" />
          <p className="text-sm text-gray-700">{event.time || "10:00 PM"}</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow">
          <MapPin className="text-gray-500" />
          <p className="text-sm text-gray-700">{event.institution || "Location not available"}</p>
        </div>
      </div>

      {/* Sponsors */}
      <div className="bg-white p-4 rounded-lg shadow space-y-2">
        <h3 className="text-md font-semibold text-[#1D1D35]">Event Sponsors</h3>
        <div className="flex flex-wrap gap-2">
          {event.sponsors?.length > 0 ? (
            event.sponsors.map((s, i) => (
              <span key={i} className="bg-[#1D1D35] text-white text-sm rounded-full px-4 py-1">{s}</span>
            ))
          ) : (
            <>
              <span className="bg-[#1D1D35] text-white text-sm rounded-full px-4 py-1">sponsor 01</span>
              <span className="bg-[#1D1D35] text-white text-sm rounded-full px-4 py-1">sponsor 02</span>
            </>
          )}
        </div>
      </div>

      {/* Attendees */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-md font-semibold mb-2 text-[#1D1D35]">Attendees</h3>
        <div className="flex items-center">
          {[...Array(4)].map((_, i) => (
            <img key={i} src="https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg" alt="attendee" className="-ml-2 w-8 h-8 rounded-full border-2 border-white" />
          ))}
          <span className="ml-4 text-sm text-gray-600">+15 people</span>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;