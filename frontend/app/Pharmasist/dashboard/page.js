'use client';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PharmacistDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [medicineHistory, setMedicineHistory] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const labels = [];
    const data = [];
    for (let i = 1; i <= 7; i++) {
      labels.push(`Day ${i}`);
      data.push(Math.floor(Math.random() * 50) + 10); // Random number between 10 and 60
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Medicines Dispensed',
          data,
          borderColor: 'rgb(45, 211, 131)',
          backgroundColor: 'rgba(16, 101, 50, 0.56)',
          fill: true,
          tension: 0.1,
        },
      ],
    });
  }, []);

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

  if (status === 'loading' || !session || session?.user.role !== 'pharmasist') {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 m-6 grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Welcome, {session.user.name || 'Pharmacist'}</h1>
        <div className="border p-4 rounded-md shadow">
        <img
        src="https://via.placeholder.com/300"
        alt="Pharmacist Profile"
        className="w-full h-56 object-cover rounded-md"
        />

          <h2 className="text-lg font-bold mt-2">{session.user.name || 'John Doe'}</h2>
          <p className="text-sm">Age: 40</p>
          <p className="text-sm">Pharmacy: City Pharmacy</p>
        </div>

        <div className="border p-4 rounded-md shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Medicines Dispensed Analytics</h2>
          <div className="h-64 bg-gray-200 flex items-center justify-center rounded">
            {chartData && <Line data={chartData} />}
          </div>
        </div>
      </div>

      <div className="space-y-6 ">
        <Link href="/Pharmasist/PrescriptionSearch" className='m-4'>
          <Button>Search Prescription</Button>
        </Link>
        <Button onClick={() => signOut({ callbackUrl: '/auth/signin' })} className="mt-4">
          Sign Out
        </Button>

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
            {medicineHistory.map((history, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{history.patientName}</td>
                <td className="border px-4 py-2">{history.medicineName}</td>
                <td className="border px-4 py-2">{history.prescribedBy}</td>
                <td className="border px-4 py-2">{history.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
