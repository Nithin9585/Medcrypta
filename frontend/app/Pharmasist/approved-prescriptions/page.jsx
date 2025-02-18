'use client';
import React, { useEffect, useState } from 'react';

const ApprovedPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovedPrescriptions = async () => {
      try {
        const response = await fetch('/api/approvedprescription');
        if (!response.ok) {
          throw new Error('Failed to fetch approved prescriptions');
        }
        const data = await response.json();
        setPrescriptions(data); 
      } catch (err) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedPrescriptions();
  }, []);

  if (loading) {
    return <div>Loading approved prescriptions...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Approved Prescriptions</h1>
      {prescriptions.length === 0 ? (
        <p className="text-center text-gray-500">No approved prescriptions available.</p>
      ) : (
        <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
          {prescriptions.map((prescription) => (
            <div key={prescription._id} className="rounded-lg shadow-md p-6 mb-4 w-full">
              <h3 className="text-lg font-semibold mb-2">Prescription ID: {prescription._id}</h3>
              <p className="text-sm text-gray-500 mb-2">
                <strong>Issued on:</strong> {new Date(prescription.timestamp).toLocaleString()}
              </p>
              <div className="mb-2">
                <strong>Patient:</strong> {prescription.patientName}
              </div>
              <div className="mb-2">
                <strong>Diagnosis:</strong> {prescription.diagnosis}
              </div>
              <div>
                <strong>Medicines:</strong>
                <ul className="list-disc pl-5 mt-1">
                  {prescription.medicines.map((medicine, index) => (
                    <li key={index}>
                      {medicine.medicineName} - {medicine.dosage} ({medicine.tabletQuantity} tablets)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedPrescriptions;
