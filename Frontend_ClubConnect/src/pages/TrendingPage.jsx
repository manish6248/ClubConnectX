// src/pages/TrendingPage.jsx
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useState, useEffect } from 'react';
import FeedbackModal from '../components/Feedback';

import {
  HeartIcon,

  UserIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import SearchEvents from '../components/SearchEvents';

const TrendingPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [topPosts, setTopPosts] = useState([]);
  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('likedPosts');
    return saved ? JSON.parse(saved) : {};
  });

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        setLoading(true);
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/events/all/getEvent`;
        console.log('Fetching from:', apiUrl);

        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        console.log('Fetched data:', data.data);

        if (Array.isArray(data.data)) {
          setTopPosts(data.data.slice(3, 6)); // Limit to 3 for trending
          setUpcomingPosts(data.data.slice(3)); // Remaining for upcoming
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, []);

  const handleLike = async (postId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      setTopPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, likeCount: (post.likeCount || 0) + (likedPosts[postId] ? -1 : 1) }
            : post
        )
      );

      setLikedPosts(prev => {
        const newLikes = {
          ...prev,
          [postId]: !prev[postId]
        };
        localStorage.setItem('likedPosts', JSON.stringify(newLikes));
        return newLikes;
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      const updatedResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/all/getEvent`);
      const updatedData = await updatedResponse.json();
      if (Array.isArray(updatedData.data)) {
        setTopPosts(updatedData.data.slice(0, 3));
        setUpcomingPosts(updatedData.data.slice(3));
      }
    } catch (error) {
      console.error('Error updating like:', error);
      setTopPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, likeCount: post.likeCount - (likedPosts[postId] ? -1 : 1) }
            : post
        )
      );
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

const handleFeedbackSubmit = async (message) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/feedback/Getfeedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (response.ok) {
      alert("Thank you for your feedback!");
    } else {
      alert("Failed to submit feedback.");
    }
  } catch (err) {
    console.error("Feedback error:", err);
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}

      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              <img src="club connect.png" alt="Club Connect Logo" className="h-30 w-auto" />
              {/* Club Connect */}
            </Link>
            <SearchEvents onSearch={() => { }} />
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <Link
                    to="/event"
                    className="flex items-center px-4 py-2 bg-[#202938] text-white rounded-md hover:bg-[#1a2330] transition transform hover:scale-105"
                  >
                    <span>Create Event</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 text-gray-700 hover:text-indigo-600 transition transform hover:scale-105"
                  >
                    <UserIcon className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-2 bg-[#202938] text-white rounded-md hover:bg-[#1a2330] transition transform hover:scale-105"
                  >
                    <UserIcon className="h-5 w-5 mr-2" />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center px-4 py-2 bg-[#202938] text-white rounded-md hover:bg-[#1a2330] transition transform hover:scale-105"
                  >
                    <UserIcon className="h-5 w-5 mr-2" />
                    Sign Up
                  </Link>
                  <Link
                    to="/chat"
                    className="flex items-center px-4 py-2 bg-[#202938] text-white rounded-md hover:bg-[#1a2330] transition transform hover:scale-105"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                    Ask AI
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs - Only visible when user is logged in */}
        {currentUser && (
          <div className="flex justify-center space-x-4 mb-8">
            <Link to="/all-events">
            <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
              All events
            </button>
            </Link>
            <button className="px-4 py-2 bg-white rounded-md hover:bg-gray-100 transition">
              Campus events
            </button>
            <button className="px-4 py-2 bg-white rounded-md hover:bg-gray-100 transition">
              Near Campus events
            </button>
          </div>
        )}
        
        {/* <img src="bgimage.jpg" alt="" /> */}
        {/* Trending Events Section */}
        <h1 className="text-2xl font-bold mb-4">Trending Events</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <div className="text-center py-10 col-span-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-10 col-span-3">
              {error}
            </div>
          ) : topPosts.length === 0 ? (
            <div className="text-center text-gray-600 py-10 col-span-3">
              No trending events found.
            </div>
          ) : (
            topPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={post.images?.[0]?.url || 'https://via.placeholder.com/300x150?text=Event+Image'}
                  alt={post.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/300x150?text=Event+Image')}
                />
                <div className="p-4">
                  <h2 className="font-bold text-lg uppercase">{post.name || 'Classical Dance'}</h2>
                  <p className="text-gray-600 text-sm">
                    {post.description ? post.description.slice(0, 50) + '...' : 'Small content'}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      {likedPosts[post._id] ? (
                        <HeartSolidIcon
                          className="h-5 w-5 text-red-500 cursor-pointer"
                          onClick={() => handleLike(post._id)}
                        />
                      ) : (
                        <HeartIcon
                          className="h-5 w-5 cursor-pointer"
                          onClick={() => handleLike(post._id)}
                        />
                      )}
                      <span>{post.likeCount || 0}</span>
                    </div>
                    <button
                      onClick={() => handleEventClick(post._id)}
                      className="text-indigo-600 hover:underline"
                    >
                      view more →
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="my-10 text-center">
  <button
    onClick={() => setIsModalOpen(true)}
    className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
  >
    Submit Feedback
  </button>
</div>

<FeedbackModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleFeedbackSubmit}
/>

        <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
        <div className="space-y-4">
          {upcomingPosts.length === 0 ? (
            <div className="text-center text-gray-600 py-10">
              No upcoming events found.
            </div>
          ) : (
            upcomingPosts.map((post) => (
              <div
                key={post._id}
                className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={post.images?.[0]?.url || 'https://via.placeholder.com/100x100?text=Event+Image'}
                  alt={post.name}
                  className="w-24 h-24 object-cover"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/100x100?text=Event+Image')}
                />
                <div className="p-4 flex-1">
                  <h2 className="font-bold text-lg">{post.name || 'Hip Hop Dance'}</h2>
                  <p className="text-gray-600 text-sm">
                    {post.description ? post.description.slice(0, 50) + '...' : 'Content'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4">
                  <button
                    onClick={() => handleEventClick(post._id)}
                    className="px-4 py-2 bg-#202938 text-black rounded-md hover:bg-#202938 transition transform hover:scale-105"
                  >
                    Join Event
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default TrendingPage; 