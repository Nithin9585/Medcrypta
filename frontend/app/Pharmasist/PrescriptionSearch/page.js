'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import * as Toast from '@radix-ui/react-toast';  // Import Radix Toast components

export default function PharmacistPrescriptionPage() {
  const [searchId, setSearchId] = useState('');
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);  // Manage the toast open state
  const router = useRouter();

  const handleSearchClick = async () => {
    if (!searchId) {
      setOpen(true); // Show toast for missing prescription ID
      return;
    }

    try {
      const response = await fetch(`/api/fetchprescriptionbyid/${searchId}`);
      if (!response.ok) {
        throw new Error('Prescription not found');
      }
      const data = await response.json();
      setPrescription(data);
      setError(null);
      setOpen(true);  // Show success toast
    } catch (err) {
      setPrescription(null);
      setError(err.message);
      setOpen(true);  // Show error toast
    }
  };

  const handleApproveClick = async () => {
    if (!searchId) {
      setOpen(true); // Show toast for missing prescription ID
      return;
    }

    try {
      const response = await fetch(`/api/approveprescription/${searchId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to approve prescription');
      }

      const updatedPrescription = await response.json();
      setPrescription(updatedPrescription);
      setError(null);
      setOpen(true);  // Show success toast

      router.push('/Pharmasist/approved-prescriptions');
    } catch (err) {
      setError(err.message);
      setOpen(true);  // Show error toast
    }
  };

  return (
    <div className="p-6 m-6 space-y-6 rounded-lg">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Welcome, Pharmacist</h1>

        <div className="relative">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Prescription ID"
            className="w-full p-4 text-lg border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <Button
            onClick={handleSearchClick}
            className="absolute top-1/2 right-4 transform -translate-y-1/2"
          >
            <FaSearch size={20} />
          </Button>
        </div>

        {error && <div className="text-red-500 text-center">{error}</div>}

        {prescription && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Prescription Details</h2>
            <div>
              <p><strong>Prescription ID:</strong> {prescription._id}</p>
              <p><strong>Patient Name:</strong> {prescription.patientName}</p>
              <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
              <p><strong>Timestamp:</strong> {new Date(prescription.timestamp).toLocaleString()}</p>
              <p><strong>Approved:</strong> {prescription.approved ? 'Yes' : 'No'}</p>

              {!prescription.approved && (
                <Button onClick={handleApproveClick} className="bg-blue-500 text-white mt-4">
                  Approve Prescription
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <Toast.Provider>
        <Toast.Root open={open} onOpenChange={setOpen} duration={3000}>
          <Toast.Title>{error ? 'Error' : 'Success'}</Toast.Title>
          <Toast.Description>{error || 'Action was successful!'}</Toast.Description>
        </Toast.Root>
      </Toast.Provider>
    </div>
  );
}
