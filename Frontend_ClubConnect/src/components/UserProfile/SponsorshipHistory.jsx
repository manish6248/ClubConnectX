// src/components/UserProfile/SponsorshipHistory.jsx
import { useState, useEffect } from 'react';

const SponsorshipHistory = ({ userId }) => {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsorships = async () => {
      try {
        const response = await fetch(`/api/v1/sponsors/${userId}/sponsorships`);
        if (response.ok) {
          const data = await response.json();
          setSponsorships(data);
        }
      } catch (error) {
        console.error("Error fetching sponsorships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorships();
  }, [userId]);

  if (loading) return <div>Loading your sponsorships...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Your Sponsorships</h2>
      {sponsorships.length === 0 ? (
        <p className="text-gray-500">You haven't sponsored any events yet.</p>
      ) : (
        <div className="space-y-4">
          {sponsorships.map(sponsorship => (
            <div key={sponsorship._id} className="border-b pb-3">
              <h3 className="font-semibold">{sponsorship.eventName}</h3>
              <p className="text-sm text-gray-600">
                Date: {new Date(sponsorship.date).toLocaleDateString()}
              </p>
              <p className="font-medium">Amount: ₹{sponsorship.amount}</p>
              <p className="text-sm">Status: {sponsorship.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SponsorshipHistory;
