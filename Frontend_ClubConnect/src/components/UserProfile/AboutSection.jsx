// src/components/UserProfile/AboutSection.jsx
const AboutSection = ({ user }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">About</h2>
        <p className="text-gray-600 mb-4">{user.bio}</p>
        <div className="space-y-2">
          <h3 className="font-semibold">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
              <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <h3 className="font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutSection;