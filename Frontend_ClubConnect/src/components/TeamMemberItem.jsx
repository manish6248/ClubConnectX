import React from 'react';

const TeamMemberItem = ({ member, index, onChangeMember, onRemoveMember }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-purple-300">Member {index + 1}</span>
        <button 
          type="button" 
          className="text-red-400 hover:text-red-300 transition duration-200"
          onClick={() => onRemoveMember(index)}
        >
          Remove
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white" 
            value={member.name} 
            onChange={(e) => onChangeMember(index, 'name', e.target.value)} 
            required 
          />
        </div>
        {/* <div>
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white" 
            value={member.email} 
            onChange={(e) => onChangeMember(index, 'email', e.target.value)} 
            required 
          />
        </div>
        <div>
          <input 
            type="text" 
            placeholder="Phone Number" 
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white" 
            value={member.phone} 
            onChange={(e) => onChangeMember(index, 'phone', e.target.value)} 
            required 
          />
        </div> */}
      </div>
    </div>
  );
};

export default TeamMemberItem;