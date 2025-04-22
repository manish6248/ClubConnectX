import { useState, useEffect } from 'react';

const CertificateList = () => {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/certificates/getcet');
      const data = await response.json();
      setCertificates(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Issued Certificates
        </h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {certificates.map((certificate) => (
              <li key={certificate._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {certificate.studentName}
                    </h3>
                    <p className="text-sm text-gray-500">{certificate.courseName}</p>
                    <p className="text-sm text-gray-500">
                      Completed: {new Date(certificate.completionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Transaction Hash:</p>
                    <p className="font-mono">{certificate.transactionHash}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CertificateList;
