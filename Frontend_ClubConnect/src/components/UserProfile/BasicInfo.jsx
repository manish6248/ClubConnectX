// src/components/UserProfile/BasicInfo.jsx
import { FaEnvelope, FaMapMarkerAlt, FaCalendar, FaUser } from "react-icons/fa";

const BasicInfo = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <FaEnvelope className="text-gray-500" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center space-x-4">
          <FaMapMarkerAlt className="text-gray-500" />
          <span>{user.location}</span>
        </div>
        <div className="flex items-center space-x-4">
          <FaCalendar className="text-gray-500" />
          <span>Member since {user.joinedDate}</span>
        </div>
        <div className="flex items-center space-x-4">
          <FaUser className="text-gray-500" />
          <span>{user.role}</span>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;