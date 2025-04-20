// LandingPost.jsx
import { useEffect, useState } from "react";
import axios from 'axios';

const LandingPost = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/events/getEvent`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      // Initialize likeCount if it doesn't exist
      const eventsWithLikes = data.data.map(event => ({
        ...event,
        likeCount: event.likeCount || 0,
        isLiked: event.likes?.includes(localStorage.getItem("userId")) || false
      }));
      setEvents(eventsWithLikes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (eventId, e) => {
    e.preventDefault(); // Prevent default form submission
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to like events");
        return;
      }

      // Optimistic update
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === eventId
            ? {
                ...event,
                likeCount: event.isLiked ? event.likeCount - 1 : event.likeCount + 1,
                isLiked: !event.isLiked
              }
            : event
        )
      );

      // Make API call
      const response = await axios.post(
        `${API_BASE_URL}/events/${eventId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Update with server response
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event._id === eventId
              ? {
                  ...event,
                  likeCount: response.data.data.likeCount,
                  isLiked: response.data.data.isLiked
                }
              : event
          )
        );
      }
    } catch (error) {
      console.error("Error liking event:", error);
      // Revert optimistic update if there's an error
      fetchEvents();
      if (error.response?.status === 401) {
        alert("Please login to like events");
      }
    }
  }
  

  const defaultImage = "https://placehold.co/600x400?text=No+Image";

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Latest Events</h2>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {!loading && events.length === 0 && !error && (
          <div className="text-center text-gray-600 bg-white p-8 rounded-lg shadow-md">
            <p className="text-xl font-semibold">No events available at the moment.</p>
            <p className="mt-2">Check back later for exciting new events!</p>
          </div>
        )}

        {!loading && events.length > 0 && (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
         {events.map((event) => (
           <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
             <div className="relative">
               <img
                 src={event.images?.[0]?.url || defaultImage}
                 alt={event.name || "Event"}
                 className="w-full h-56 object-cover"
                 onError={(e) => (e.target.src = defaultImage)}
               />
               <button
                 onClick={(e) => handleLike(event._id, e)}
                 className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-md"
                 type="button" // Explicitly set button type
               >
                 <svg
                   xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 24 24"
                   fill={event.isLiked ? "red" : "none"}
                   stroke="currentColor"
                   className="w-6 h-6"
                   strokeWidth={event.isLiked ? "0" : "2"}
                 >
                   <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                 </svg>
               </button>
               <span className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                 {event.likeCount || 0} likes
               </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.name || "Untitled Event"}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-semibold">When:</span> {new Date(event.date).toLocaleDateString()} | {event.time || "Time not available"}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-semibold">Location:</span> {event.venue || "Venue not specified"}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className={`font-bold text-lg ${event.isFree ? "text-green-600" : "text-red-600"}`}>
                      {event.isFree ? "FREE" : `$${event.price || "N/A"}`}
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPost;
