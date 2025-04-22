import { useState } from 'react';

const CertificateForm = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    courseName: '',
    completionDate: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/certificates/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert('Certificate created successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating certificate');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Generate Certificate
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">
              Student Name
            </label>
            <input
              type="text"
              id="studentName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700">
              Completion Date
            </label>
            <input
              type="date"
              id="completionDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.completionDate}
              onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Certificate
          </button>
        </form>
      </div>
    </div>
  );
};

export default CertificateForm;
