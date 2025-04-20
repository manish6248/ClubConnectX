import FeedbackModal from '../components/Feedback';
import { useState } from 'react';

const SomePage = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleFeedbackSubmit = async (message) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/feedback/Getfeedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (response.ok) {
      alert("Thanks for your feedback!");
    }
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Give Feedback</button>
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  );
};
