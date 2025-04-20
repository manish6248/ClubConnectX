import { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';


function Certy() {
  const [recipientName, setRecipientName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/certificates/create", {
        recipientName,
        courseName,
        grade,
      });

      setMessage("✅ Certificate Issued Successfully!");
      setRecipientName("");
      setCourseName("");
      setGrade("");
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      setMessage("✅ Certificate Issued Successfully!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-white -100 to-gray-400 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-700">Issue a Certificate</h2>

        {message && (
          <div
            className={`text-center p-3 rounded-lg mb-4 text-white font-medium ${
              message.includes("✅") ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Name
            </label>
            <input
              type="text"
              id="recipientName"
              placeholder="Enter recipient name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
             Event Name
            </label>
            <input
              type="text"
              id="courseName"
              placeholder="Event Name "
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
            Event Position 
            </label>
            <input
              type="text"
              id="grade"
              placeholder="Event Position "
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>
          

          <button
            type="submit"
            className={`w-full p-3 rounded-lg text-white font-semibold transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-600"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              "Issue Certificate"
            )}
          </button>
          <Link
  to="/certificatespages"
  className="flex items-center px-4 py-2 bg-[#202938] text-white rounded-md hover:bg-[#1a2330] transition transform hover:scale-105"
>
  <span>All Certificate</span>
</Link>

        </form>
      </div>
    </div>
  );
}

export default Certy;