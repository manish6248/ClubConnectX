// src/pages/ParticipantsList.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ParticipantsList = () => {
  const { eventId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ParticipantsReg/participantsStud`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setParticipants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [eventId]);

  if (loading) return <div className="p-6 text-center">Loading participants...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Registered Participants</h1>

      {participants.length === 0 ? (
        <p className="text-gray-600">No participants found for this event.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-purple-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Team Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Leader Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">College</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Team Members</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {participants.map((p, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{p.teamName}</td>
                  <td className="px-4 py-3 text-sm">{p.leader.name}</td>
                  <td className="px-4 py-3 text-sm">{p.leader.email}</td>
                  <td className="px-4 py-3 text-sm">{p.leader.phone}</td>
                  <td className="px-4 py-3 text-sm">{p.leader.college}</td>
                  <td className="px-4 py-3 text-sm">
                    {p.teamMembers && p.teamMembers.length > 0
                      ? p.teamMembers.map((m, i) => (
                          <div key={i} className="text-gray-700">• {m.name}</div>
                        ))
                      : <span className="text-gray-400 italic">None</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;
