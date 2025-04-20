// src/components/UserProfile/UserProfile.jsx
import { useAuth } from "../context/authContext";
import Header from "../components/UserProfile/Header";
import BasicInfo from "../components/UserProfile/BasicInfo";
import AboutSection from "../components/UserProfile/AboutSection";
import ActivityStats from "../components/UserProfile/ActivityStatus";
import StudentEvents from "../components/UserProfile/StudentEvents";
import ClubAdminEvents from "../components/UserProfile/ClubAdminEvents";
import SponsorshipHistory from "../components/UserProfile/SponsorshipHistory";

const UserProfile = ({ user }) => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.role || "student";

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Header user={user} />
      <BasicInfo user={user} />
      <AboutSection user={user} />
      <ActivityStats user={user} />
      
      {/* Role-specific sections */}
      {userRole === "student" && <StudentEvents userId={user.id} />}
      {userRole === "club-admin" && <ClubAdminEvents userId={user.id} />}
      {userRole === "sponsor" && <SponsorshipHistory userId={user.id} />}
    </div>
  );
};

export default UserProfile;
