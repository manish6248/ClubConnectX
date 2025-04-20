import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CertificateView = () => {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef();

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/certificates/getcert/${id}`);
        setCertificate(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  if (loading) return <div className="text-center py-10 text-gray-600 animate-pulse">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  if (!certificate) return <div className="text-center py-10 text-gray-600">Certificate not found</div>;

  // Function to download certificate as PDF
  const handleDownloadPDF = async () => {
    const element = certificateRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true }); // Added useCORS for cross-origin images
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${certificate.recipientName || "certificate"}-completion.pdf`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #F9FAFB, #E0E7FF, #E9D5FF)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        overflow: "hidden",
      }}
    >
      <div
        ref={certificateRef}
        className="bg-white relative w-full max-w-3xl p-8 rounded-2xl shadow-2xl border border-gray-200 transform transition-all duration-300 hover:shadow-3xl"
      >
        {/* Decorative Borders with Animation */}
        <div className="absolute top-0 left-0 w-20 h-20" style={{ background: "#4B5EFC1A", clipPath: "polygon(0 0, 100% 0, 0 100%)" }}></div>
        <div className="absolute bottom-0 right-0 w-20 h-20" style={{ background: "#6B46C11A", clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}></div>
        <div className="absolute top-0 right-0 w-6 h-full" style={{ background: "#4B5EFC0A" }}></div>
        <div className="absolute bottom-0 left-0 w-6 h-full" style={{ background: "#6B46C10A" }}></div>

        {/* Certificate Content */}
        <div className="relative z-10 text-center">
          {/* Logo Placeholder */}
          <div className="flex justify-center mb-6">
            <svg
              className="w-16 h-16 text-indigo-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 2-2 2-2-.9-2-2zm0 0V8m0 6v2m-6-6h12m-6 6v2"
              />
            </svg>
          </div>

          {/* Header */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-2 tracking-wide">ClubConnectX</h2>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8" style={{ background: "linear-gradient(to right, #4B5EFC, #A084E8)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            Certificate of Completion
          </h1>

          {/* Certification Statement */}
          <p className="text-gray-600 mb-6 text-lg">This is to certify that</p>
          <h3 className="text-5xl font-extrabold text-gray-900 mb-6 animate-fade-in">
            {certificate.recipientName || "N/A"}
          </h3>
          

          {/* Details */}
          <div className="bg-gray-50 p-6 rounded-xl mb-8 shadow-inner">
            <p className="mb-4 text-gray-800"><span className="font-semibold">Event:</span> {certificate.courseName || "N/A"}</p>
            <p className="mb-4 text-gray-800"><span className="font-semibold">Position :</span> {certificate.grade || "N/A"}</p>
            {certificate.certificateHash && (
              <p className="text-gray-600 text-sm"><span className="font-semibold">Blockchain Hash:</span> {certificate.certificateHash.slice(0, 10) + "..." + certificate.certificateHash.slice(-10)}</p>
            )}
          </div>

          {/* Signature Section */}
          <div className="flex justify-between items-center mt-10 border-t border-gray-200 pt-6">
            <div className="text-left">
              <p className="text-gray-800 font-medium">Samantha J.</p>
              <p className="text-gray-600 text-sm">Head of Event Management</p>
            </div>
            <div className="flex items-center">
              <svg
                className="w-16 h-16 text-gray-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l2 2"
                />
              </svg>
              <p className="text-gray-600 italic text-lg">Signature</p>
            </div>
          </div>

          {/* Issued Date (Optional, if available) */}
          {certificate.issuedDate && (
            <p className="text-gray-500 text-sm mt-4">Issued on: {new Date(certificate.issuedDate).toLocaleDateString()}</p>
          )}
        </div>

        {/* Download Button */}
        <div className="mt-8 flex justify-center">
          {/* <button
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Download as PDF
          </button> */}
        </div>

        {/* Back Button with Animation */}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          Back to Certificates
        </button>
      </div>
    </div>
  );
};

// Animation Keyframes
const styles = `
  @keyframes pulse-slow {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-pulse-slow {
    animation: pulse-slow 4s infinite;
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default CertificateView;