// src/pages/SponsorForm.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const SponsorForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/sponsorships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          sponsorId: currentUser.id,
          amount: parseFloat(amount),
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit sponsorship');
      }

      // Success
      navigate(`/event/${eventId}?sponsored=true`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Sponsor This Event</h1>
      
      {/* {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )} */}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Sponsorship Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            min="1"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Message (Optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows="4"
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-purple-300"
        >
          {loading ? 'Processing...' : 'Submit Sponsorship'}
        </button>
      </form>
    </div>
  );
};

export default SponsorForm;
