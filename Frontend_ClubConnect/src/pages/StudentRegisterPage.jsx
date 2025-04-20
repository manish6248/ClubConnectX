import { useEffect, useState } from 'react';
import TeamMemberItem from '../components/TeamMemberItem';
import { useParams } from 'react-router-dom';

const StudentRegisterPage = ({ onRegister }) => {
  const [leader, setLeader] = useState({ name: '', email: '', phone: '', college: '' });
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const { eventId } = useParams();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${id}`);
        const data = await res.json();
        setEventDetails(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddMember = () => setTeamMembers([...teamMembers, { name: '' }]);

  const handleRemoveMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleChangeMember = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { eventId, leader, teamName, teamMembers };

    if (eventDetails?.price > 0) {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Try again.");
        return;
      }

      const orderRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: eventDetails.price * 100 }) // in paise
      });

      const { order } = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: 'INR',
        name: 'Event Registration',
        description: eventDetails.name,
        order_id: order.id,
        handler: async function (response) {
          const regRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ParticipantsReg/studentregister`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, paymentInfo: response })
          });
          const regData = await regRes.json();
          if (regData.success) {
            alert('Payment successful & registration completed!');
            onRegister();
          } else {
            alert('Registration failed after payment.');
          }
        },
        prefill: {
          name: leader.name,
          email: leader.email,
          contact: leader.phone
        },
        theme: {
          color: '#1D1D35'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } else {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ParticipantsReg/studentregister`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.success) {
          alert('Registration successful!');
          onRegister();
        }
      } catch (error) {
        console.error('Error registering:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 my-10">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-[#1D1D35]">Event Registration</h2>
        <p className="text-gray-500 mt-2">
          {eventDetails ? `Register your team for ${eventDetails.name}` : 'Loading event...'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Team Leader Info */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-[#1D1D35] border-b pb-2">Team Leader Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" value={leader.name} onChange={(val) => setLeader({ ...leader, name: val })} />
            <Input label="Email Address" type="email" value={leader.email} onChange={(val) => setLeader({ ...leader, email: val })} />
            <Input label="Phone Number" value={leader.phone} onChange={(val) => setLeader({ ...leader, phone: val })} />
            <Input label="College / Institution" value={leader.college} onChange={(val) => setLeader({ ...leader, college: val })} />
          </div>
        </div>

        {/* Team Name */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-[#1D1D35] border-b pb-2">Team Name</h3>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#1D1D35] focus:border-[#1D1D35]"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
        </div>

        {/* Team Members */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-[#1D1D35]">Team Members</h3>
            <button
              type="button"
              onClick={handleAddMember}
              className="px-4 py-2 bg-[#1D1D35] text-white rounded-lg hover:bg-opacity-90 transition"
            >
              + Add Member
            </button>
          </div>

          {teamMembers.length === 0 && (
            <p className="text-gray-500 text-center py-4">No team members added yet.</p>
          )}

          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <TeamMemberItem
                key={index}
                member={member}
                index={index}
                onChangeMember={handleChangeMember}
                onRemoveMember={handleRemoveMember}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full py-4 text-white text-lg font-semibold bg-[#1D1D35] rounded-lg hover:bg-opacity-90 transition"
          >
            {eventDetails?.price > 0 ? `Pay ₹${eventDetails.price} & Register` : 'Complete Registration'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, type = 'text', value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <input
      type={type}
      className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-[#1D1D35] focus:border-[#1D1D35]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

export default StudentRegisterPage;
