'use client';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { buttonData } from '@/components/config/Homecomponent.config';
export default function PharmacistDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [medicineHistory, setMedicineHistory] = useState([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      sessionStorage.setItem('redirectPath', window.location.pathname);
      router.push('/auth/signin');
    } else if (session?.user.role !== 'pharmasist') {
      router.push('/unauthorized');
    }

    fetch('/api/medicine-history')
      .then((res) => res.json())
      .then((data) => setMedicineHistory(data));
  }, [session, status, router]);

  return (
    <div className="p-6 m-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-lg">
      {/* Left Side: Pharmacist Profile */}
      <div className="space-y-6 md:col-span-1">
        <h1 className="text-2xl font-semibold">Welcome, {session?.user?.name || 'Pharmacist'}</h1>
        
        <div className="border p-4 rounded-md shadow">
          <img
            src={buttonData[0].imgsrc}
            alt="Pharmacist Profile"
            className="w-full h-56 object-cover rounded-md"
          />
          <h2 className="text-lg font-bold mt-2">{session?.user?.name || 'John Doe'}</h2>
          <p className="text-sm">Age: 40</p>
          <p className="text-sm">Pharmacy: City Pharmacy</p>
        </div>
      </div>

      {/* Right Side: Medicine History & Buttons */}
      <div className="space-y-6 md:col-span-1 lg:col-span-2">
        {/* Buttons moved here */}
        <div className="space-y-6 mb-4">
          <Link href="/Pharmasist/PrescriptionSearch" className="m-4">
            <Button>Search Prescription</Button>
          </Link>
          <Button onClick={() => signOut({ callbackUrl: '/auth/signin' })} className="mt-4">
            Sign Out
          </Button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Medicine History</h2>
        <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Patient Name</th>
              <th className="border px-4 py-2">Medicine Name</th>
              <th className="border px-4 py-2">Prescribed By</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {medicineHistory.length > 0 ? (
              medicineHistory.map((history, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{history.patientName}</td>
                  <td className="border px-4 py-2">{history.medicineName}</td>
                  <td className="border px-4 py-2">{history.prescribedBy}</td>
                  <td className="border px-4 py-2">{history.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border px-4 py-2 text-center">No medicine history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
