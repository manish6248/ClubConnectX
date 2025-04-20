// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/authContext';
// import { useState } from 'react';
// import { HeartIcon, ChatBubbleOvalLeftIcon, ShareIcon, CurrencyDollarIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
// import SearchEvents from '../components/SearchEvents';

// const LandingPage = () => {
//   const { currentUser, logout } = useAuth();

//   // Mock data for posts
//   const [allPosts, setAllPosts] = useState([
//     {
//       id: 1,
//       title: 'Tech Symposium 2024',
//       description: 'Join us for the biggest tech event of the year! 🚀',
//       image: 'https://d2rvgzn8c26h0v.cloudfront.net/new-year-eve-kochi-ignite-241703145773518.webp',
//       club: 'Tech Club',
//       profileImage: 'https://images.pexels.com/photos/30763767/pexels-photo-30763767/free-photo-of-thoughtful-young-man-in-dramatic-lighting.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load',
//       likes: 234,
//       comments: [],
//       shares: 12,
//       sponsors: 8,
//       location: 'University Auditorium',
//       entry: 'paid',
//       performer: 'John Doe',
//     },
//     {
//       id: 2,
//       title: 'Cultural Fest',
//       description: 'Experience a vibrant celebration of diversity with food, music, and performances from around the world! 🌍🎉',
//       image: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=300',
//       club: 'Cultural Society',
//       profileImage: 'https://images.pexels.com/photos/30246594/pexels-photo-30246594/free-photo-of-elegant-woman-in-red-dress-by-ornate-doorway.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load',
//       likes: 189,
//       comments: [],
//       shares: 9,
//       sponsors: 5,
//       location: 'Main Campus Grounds',
//       entry: 'free',
//       performer: 'Jane Smith',
//     },
//   ]);

//   const [filteredPosts, setFilteredPosts] = useState(allPosts);

//   // Function to handle reactions
//   const handleReaction = (postId, type) => {
//     setFilteredPosts((prevPosts) =>
//       prevPosts.map((post) => {
//         if (post.id === postId) {
//           if (type === "comments") return post;
//           return { ...post, [type]: post[type] + 1 };
//         }
//         return post;
//       })
//     );
//   };

//   // Function to handle search
//   const handleSearch = (query) => {
//     const filtered = allPosts.filter((post) => {
//       const matchesVenue = post.location.toLowerCase().includes(query.toLowerCase());
//       const matchesEntryType = post.entry.toLowerCase().includes(query.toLowerCase());
//       return matchesVenue || matchesEntryType;
//     });
//     setFilteredPosts(filtered);
//   };

//   // Function to add a comment
//   const handleAddComment = (postId, comment) => {
//     setFilteredPosts((prevPosts) =>
//       prevPosts.map((post) =>
//         post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
//       )
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation Bar */}
//       <nav className="bg-white shadow-sm sticky top-0 z-50">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             <Link to="/" className="text-2xl font-bold text-gray-900">
//               CampusConnect
//             </Link>
//             <SearchEvents onSearch={handleSearch} />
//             <div className="flex items-center space-x-4">
//               {currentUser ? (
//                 <button onClick={logout} className="px-4 py-2 text-gray-700 hover:text-indigo-600">
//                   Logout
//                 </button>
//               ) : (
//                 <>
//                   <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-indigo-600">
//                     Sign In
//                   </Link>
//                   <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
//                     Sign Up
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="space-y-6">
//           {filteredPosts.map((post) => (
//             <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//               {/* Post Header */}
//               <div className="flex items-center justify-between p-4 border-b">
//                 <div className="flex items-center space-x-3">
//                   <Link to={`/profile/${post.id}`}>
//                     <img src={post.profileImage} alt={post.club} className="w-10 h-10 rounded-full object-cover" />
//                   </Link>
//                   <div>
//                     <h3 className="font-semibold">{post.club}</h3>
//                     <p className="text-gray-500 text-sm">{post.location}</p>
//                   </div>
//                 </div>
//                 <button className="text-gray-500 hover:text-gray-700">
//                   <EllipsisHorizontalIcon className="h-6 w-6" />
//                 </button>
//               </div>

//               {/* Event Image */}
//               <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />

//               {/* Interaction Buttons */}
//               <div className="p-4 space-y-2">
//                 <div className="flex items-center justify-between">
//                   <button onClick={() => handleReaction(post.id, 'likes')} className="flex items-center space-x-2 text-gray-700 hover:text-red-500">
//                     <HeartIcon className="h-6 w-6" />
//                     <span>{post.likes}</span>
//                   </button>

//                   <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
//                     <ChatBubbleOvalLeftIcon className="h-6 w-6" />
//                     <span>{post.comments.length}</span>
//                   </button>

//                   <button onClick={() => handleReaction(post.id, 'shares')} className="flex items-center space-x-2 text-gray-700 hover:text-green-500">
//                     <ShareIcon className="h-6 w-6" />
//                     <span>{post.shares}</span>
//                   </button>

//                   <Link to={`/profile/${post.id}`} className="flex items-center space-x-2 text-gray-700 hover:text-purple-500">
//                     <CurrencyDollarIcon className="h-6 w-6" />
//                     <span>{post.sponsors}</span>
//                   </Link>
//                 </div>

//                 {/* Comment Section */}
//                 <div className="mt-4">
//                   <h3 className="font-semibold mb-2">Comments</h3>
//                   <div className="space-y-2">
//                     {post.comments.map((comment, index) => (
//                       <div key={index} className="flex items-start space-x-2">
//                         <img src={post.profileImage} alt="User" className="w-6 h-6 rounded-full object-cover" />
//                         <div className="bg-gray-100 p-2 rounded-lg">
//                           <p className="text-sm">{comment}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <input type="text" placeholder="Add a comment..." className="w-full px-3 py-2 border rounded-md"
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter' && e.target.value.trim()) {
//                         handleAddComment(post.id, e.target.value.trim());
//                         e.target.value = '';
//                       }
//                     }} />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default LandingPage;
