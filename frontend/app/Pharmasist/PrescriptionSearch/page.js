'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaSearch } from 'react-icons/fa';

export default function PharmacistPrescriptionPage() {
  const { data: session } = useSession();
  const [searchId, setSearchId] = useState('');
  const [prescriptionHistory, setPrescriptionHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    const mockHistory = [
      { id: 1, patientName: 'John Doe', medicineName: 'Aspirin', prescribedBy: 'Dr. Smith', date: '2025-01-01' },
      { id: 2, patientName: 'Jane Doe', medicineName: 'Paracetamol', prescribedBy: 'Dr. Brown', date: '2025-01-05' },
      { id: 3, patientName: 'Mark Smith', medicineName: 'Ibuprofen', prescribedBy: 'Dr. Clark', date: '2025-01-10' },
    ];
    setPrescriptionHistory(mockHistory);
    setFilteredHistory(mockHistory);
  }, []);

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchId === '') {
      setFilteredHistory(prescriptionHistory); 
    } else {
      const filtered = prescriptionHistory.filter(
        (history) => history.id.toString().includes(searchId)
      );
      setFilteredHistory(filtered);
    }
  };

  return (
    <div className="p-6 m-6 space-y-6 rounded-lg">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Welcome, {session?.user?.name || 'Pharmacist'}</h1>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchId}
              onChange={handleSearchChange}
              placeholder="Search Prescription ID..."
              className="w-full p-4 text-lg border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <Button
              onClick={handleSearchClick}
              className="absolute top-1/2 right-4 transform -translate-y-1/2"
            >
              <FaSearch size={20} />
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-6">Prescription Details</h2>
        <div className="overflow-x-auto">
          <table className="table-auto min-w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr>
                <th className="border px-4 py-2">Prescription ID</th>
                <th className="border px-4 py-2">Patient Name</th>
                <th className="border px-4 py-2">Medicine Name</th>
                <th className="border px-4 py-2">Prescribed By</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((history) => (
                  <tr key={history.id}>
                    <td className="border px-4 py-2">{history.id}</td>
                    <td className="border px-4 py-2">{history.patientName}</td>
                    <td className="border px-4 py-2">{history.medicineName}</td>
                    <td className="border px-4 py-2">{history.prescribedBy}</td>
                    <td className="border px-4 py-2">{history.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border px-4 py-2 text-center">No prescriptions found for this ID.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
