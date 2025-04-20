// src/pages/AllEvents.jsx
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState, useEffect } from "react";

const AllEvents = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const userRole = currentUser?.role || "student";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem("likedPosts");
    return saved ? JSON.parse(saved) : {};
  });

 
  

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };
  const handleCertificate = () => {
    navigate("/certificate");
  };
  const handleDashboard = () => {
    navigate("/Dashboard");
  };

  const handleRegisterClick = (eventId) => {
    navigate(`/register-event/${eventId}`);
  };

  const handleCreateEventClick = () => {
    navigate("/create-event");
  };

  const handleSponsorClick = (eventId) => {
    navigate(`/sponsor-event/${eventId}`);
  };

  const handleViewAttendees = (eventId) => {
    navigate(`/event/${eventId}/attendees`);
  };

  const handlePayment = async (event) => {
    try {
    
  
      
      window.location.href = 'http://localhost:5174/';
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewSponsors = (eventId) => {
    navigate(`/event/${eventId}/sponsors`);
  };

  const handleDeleteEvent = (eventId) => {
    // Implement delete logic here if needed
    console.log("Delete event:", eventId);
    // Add API call to delete event if required
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchAllEvents = async () => {
      try {
        setLoading(true);
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/events/all/getEvent`;
        console.log("Fetching from:", apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        if (Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, [currentUser, navigate]);

  const handleLike = async (postId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === postId
            ? { ...event, likeCount: (event.likeCount || 0) + (likedPosts[postId] ? -1 : 1) }
            : event
        )
      );

      setLikedPosts((prev) => {
        const newLikes = {
          ...prev,
          [postId]: !prev[postId],
        };
        localStorage.setItem("likedPosts", JSON.stringify(newLikes));
        return newLikes;
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/events/${postId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const updatedResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/events/all/getEvent`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      const updatedData = await updatedResponse.json();
      if (Array.isArray(updatedData.data)) {
        setEvents(updatedData.data);
      }
    } catch (error) {
      console.error("Error updating like:", error);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === postId
            ? { ...event, likeCount: event.likeCount - (likedPosts[postId] ? -1 : 1) }
            : event
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900">
        {/* <img src="club connect.png" alt="Club Connect Logo" className="h-15 w-auto" /> */}
        ClubConnectX
        </Link>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <button
              onClick={logout}
              className="px-4 py-2 text-gray-700 hover:text-indigo-800"
            >
              Logout
            </button>
          ) : null}
          {userRole === "club-admin" && (
            <>
              <button
                onClick={handleCreateEventClick}
                className="flex items-center px-4 py-2 bg-[#202938] text-white rounded-md hover:bg-[#1a2330] transition transform hover:scale-105">
                Create Event
              </button>
              <Link
                to="/certificate"
                className="flex items-center px-4 py-2 bg-[#202938] text-white rounded-md hover:bg-[#1a2330] transition transform hover:scale-105"
              >
                Create Certificate
              </Link>
              <button
                onClick={handleDashboard}
                className="flex items-center px-4 py-2 bg-[#202938] text-white rounded-md hover:bg-[#1a2330] transition transform hover:scale-105"
              >
                Dashboard
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Events</h1>
        {loading && <div className="text-center py-10">Loading...</div>}
        {error && <div className="text-center text-red-600 py-10">{error}</div>}
        {!loading &&
          !error &&
          events.length === 0 && (
            <div className="text-center text-gray-600 py-10">No events found.</div>
          )}

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Event Image */}
              <div className="relative group cursor-pointer">
                <img
                  src={event.images?.[0]?.url || "default-event-image.jpg"}
                  alt={event.name}
                  className="w-full h-48 object-cover group-hover:opacity-90 transition"
                  onClick={() => handleEventClick(event._id)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(event._id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  {likedPosts[event._id] ? "❤️" : "🤍"}
                </button>
              </div>

              {/* Event Details */}
              <div className="p-4">
                <h2
                  className="font-bold text-lg text-gray-900 cursor-pointer hover:text-purple-600"
                  onClick={() => handleEventClick(event._id)}
                >
                  {event.name}
                </h2>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {event.description}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </p>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  {userRole === "student" && (
                    <button
                      onClick={() => handleRegisterClick(event._id)}
                      className="w-full sm:w-auto bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition"
                    >
                      Register
                    </button>
                  )}
                  {event.price > 0 && userRole !== "sponsor" &&  (
                    <button
                      onClick={() => handlePayment(event)}
                      className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg--700 transition"
                    >
                      Pay Now
                    </button>
                  )}
                  {userRole === "club-admin" && (
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleViewAttendees(event._id)}
                        className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Attendees
                      </button>
                    </div>
                  )}
                  {userRole === "sponsor" && (
                    <button onClick={() => handleSponsorClick(event._id)} className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">Sponsor</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllEvents;