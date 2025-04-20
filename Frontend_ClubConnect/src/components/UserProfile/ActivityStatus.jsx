// src/components/UserProfile/ActivityStats.jsx
const ActivityStats = ({ user }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Activity</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Events Attended</h3>
            <p className="text-2xl">{user.eventsAttended}</p>
          </div>
          <div>
            <h3 className="font-semibold">Posts</h3>
            <p className="text-2xl">{user.posts}</p>
          </div>
          <div>
            <h3 className="font-semibold">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge, index) => (
                <span key={index} className="bg-yellow-100 px-3 py-1 rounded-full text-sm">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ActivityStats;