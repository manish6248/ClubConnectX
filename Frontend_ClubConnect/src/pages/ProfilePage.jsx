import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const { id } = useParams(); // Get the profile ID from the URL
  const [profile, setProfile] = useState(null);

  // Mock data for profiles (replace with API call)
  const profiles = [
    {
      id: 1,
      name: 'John Doe',
      role: 'President, Tech Club',
      tenure: 'January 2023 – Present',
      about: 'John is the driving force behind the Tech Innovators Club, leading a team of 50+ members to explore cutting-edge technologies and organize hackathons, workshops, and coding competitions. Under his leadership, the club hosted its largest annual hackathon, attracting 300+ participants and securing sponsorships from leading tech companies. John is passionate about fostering innovation and helping students develop practical skills for the tech industry.',
      contact: 'john.doe@university.edu',
      profileImage: 'https://images.pexels.com/photos/30763767/pexels-photo-30763767/free-photo-of-thoughtful-young-man-in-dramatic-lighting.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load',
      socialMedia: {
        twitter: 'https://twitter.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        instagram: 'https://instagram.com/johndoe',
      },
      achievements: [
        'Organized the largest annual hackathon with 300+ participants.',
        'Secured sponsorships from top tech companies.',
        'Increased club membership by 40% in one year.',
      ],
      upcomingEvents: [
        {
          title: 'Tech Workshop 2024',
          date: '2024-04-10',
          description: 'Learn the latest in AI and machine learning.',
        },
        {
          title: 'Coding Bootcamp',
          date: '2024-05-15',
          description: 'A 2-week intensive coding bootcamp for beginners.',
        },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'President, Cultural Society',
      tenure: 'August 2022 – Present',
      about: 'Jane is a visionary leader who has transformed the Creative Arts Society into a thriving community for artists and enthusiasts. She has organized multiple exhibitions, open mic nights, and collaborative projects, showcasing the talents of over 100 students. Jane is committed to creating a platform where creativity flourishes and students can express themselves freely.',
      contact: '@jane.smith (Instagram)',
      profileImage: 'https://images.pexels.com/photos/30246594/pexels-photo-30246594/free-photo-of-elegant-woman-in-red-dress-by-ornate-doorway.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load',
      socialMedia: {
        twitter: 'https://twitter.com/janesmith',
        linkedin: 'https://linkedin.com/in/janesmith',
        instagram: 'https://instagram.com/janesmith',
      },
      achievements: [
        'Organized 10+ exhibitions showcasing student art.',
        'Increased club participation by 50%.',
        'Collaborated with local artists for workshops.',
      ],
      upcomingEvents: [
        {
          title: 'Art Exhibition 2024',
          date: '2024-04-20',
          description: 'Showcasing the best student artwork.',
        },
        {
          title: 'Open Mic Night',
          date: '2024-05-05',
          description: 'A night of music, poetry, and performances.',
        },
      ],
    },
  ];

  // Fetch profile data based on ID
  useEffect(() => {
    const selectedProfile = profiles.find((p) => p.id === parseInt(id));
    if (selectedProfile) {
      setProfile(selectedProfile);
    } else {
      toast.error('Profile not found!');
    }
  }, [id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Back Button */}
      <Link to="/" className="text-indigo-600 hover:text-indigo-800">
        &larr; Back to Home
      </Link>

      {/* Grid Layout for Cards */}
      <div className="h-[calc(100vh-4rem)] grid grid-cols-2 grid-rows-2 gap-6 mt-4">
        {/* Card 1: Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-6">
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-gray-600">{profile.role}</p>
              <p className="text-gray-500 text-sm">{profile.tenure}</p>
            </div>
          </div>
        </div>

        {/* Card 2: About Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-gray-700">{profile.about}</p>
        </div>

        {/* Card 3: Achievements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Achievements</h2>
          <ul className="list-disc list-inside text-gray-700">
            {profile.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </div>

        {/* Card 4: Upcoming Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {profile.upcomingEvents.map((event, index) => (
              <div key={index} className="border-l-4 border-indigo-600 pl-4">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;