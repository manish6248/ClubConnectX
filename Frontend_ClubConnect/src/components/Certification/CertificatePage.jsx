import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CertificatePage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/certificates/getcert");
        setCertificates(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleCertificateClick = (id) => {
    navigate(`/certificate/view/${id}`);
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">Certificates</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">Issued Certificates</h2>
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert._id}
                onClick={() => handleCertificateClick(cert._id)}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 cursor-pointer"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">{cert.recipientName}</h3>
                <p className="text-sm text-gray-600 mb-1">Event: {cert.courseName}</p>
                <p className="text-sm text-gray-600 mb-1">Position: {cert.grade}</p>
                <p className="text-xs text-gray-500">
                  Blockchain: {cert.certificateHash ? cert.certificateHash.slice(0, 8) + "..." : "Not verified"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No certificates issued yet.</p>
        )}
      </div>
    </div>
  );
};

export default CertificatePage;