import { Link } from 'react-router-dom';
import { HeartIcon, ChatBubbleOvalLeftIcon, BookmarkIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

const PostCard = ({ post, onAddToCalendar }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          {/* Profile Picture */}
          <Link to={`/profile/${post.id}`}>
            <img
              src={post.profileImage}
              alt={post.club}
              className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80"
            />
          </Link>
          <div>
            <h3 className="font-semibold">{post.club}</h3>
            <p className="text-gray-500 text-sm">{post.location}</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <EllipsisHorizontalIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Rest of the PostCard code remains the same */}
    </div>
  );
};

export default PostCard;