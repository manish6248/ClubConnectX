// src/components/UserProfile/Header.jsx
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Header = ({ user }) => {
  return (
    <div className="relative bg-gray-200 rounded-lg overflow-hidden">
      {/* Cover Photo */}
      <img
        src={user.coverPhoto}
        alt="Cover"
        className="w-full h-48 object-cover"
      />

      {/* Profile Picture */}
      <div className="absolute -bottom-16 left-6">
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-white"
        />
      </div>

      {/* Name and Tagline */}
      <div className="p-6 pt-20">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-600">{user.tagline}</p>
      </div>

      {/* Social Media Links */}
      <div className="absolute top-4 right-4 flex space-x-4">
        <a href={user.socialMedia.twitter} className="text-gray-700 hover:text-blue-500">
          <FaTwitter size={24} />
        </a>
        <a href={user.socialMedia.linkedin} className="text-gray-700 hover:text-blue-700">
          <FaLinkedin size={24} />
        </a>
        <a href={user.socialMedia.instagram} className="text-gray-700 hover:text-pink-500">
          <FaInstagram size={24} />
        </a>
      </div>
    </div>
  );
};

export default Header;