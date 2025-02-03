'use client';

import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import { patientData, appointmentHistory, patientReviews, Last7daysData } from '@/components/config/Patient.config'; // Importing data
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

export default function PatientDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    const data = Last7daysData[0] ? Object.values(Last7daysData[0]) : []; // Extract values from Last7daysData
  
    setChartData({
      labels,
      datasets: [
        {
          label: 'Patients Visited',
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
    } else if (session?.user.role !== 'patient') {
      router.push('/unauthorized');
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session?.user.role !== 'patient') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 m-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 rounded-lg">
      <div className="md:col-span-1 lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-semibold">{patientData.name}'s Dashboard</h1>
        <div className="border p-4 rounded-md shadow">
          <img
            src={patientData.image}
            alt="Patient Profile"
            className="w-full h-50 object-cover rounded-md"
          />
          <h2 className="text-lg font-bold mt-2">{patientData.name}</h2>
          <p className="text-sm">{patientData.age} years old</p>
          <p className="text-sm">Email: {patientData.email}</p>
          <p className="text-sm">Phone: {patientData.phone}</p>
          <p className="text-sm">Address: {patientData.address}</p>
          <p className="text-sm">Emergency Contact: {patientData.emergencyContact}</p>
        </div>
        <div className="border p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <div className="h-64 bg-gray-200 flex items-center justify-center rounded">
            {chartData && <Line data={chartData} />}
          </div>
        </div>
      </div>

      <div className="md:col-span-3 lg:col-span-3 space-y-6">
        <Link href="/Patient/BookAppointment">
          <Button className="m-2">Book Appointment</Button>
        </Link>

        <Button onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
          Sign Out
        </Button>

        <div className="border p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Appointment History</h2>
          <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Doctor</th>
                <th className="border px-4 py-2">Reason</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointmentHistory.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="border px-4 py-2">{appointment.date}</td>
                  <td className="border px-4 py-2">{appointment.doctor}</td>
                  <td className="border px-4 py-2">{appointment.reason}</td>
                  <td className="border px-4 py-2">{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          {patientReviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <h3 className="font-semibold">{review.name}</h3>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {Array(review.rating).fill(0).map((_, idx) => (
                    <span key={idx} className="text-yellow-500 text-xl">★</span>
                  ))}
                  {Array(5 - review.rating).fill(0).map((_, idx) => (
                    <span key={idx} className="text-gray-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-sm">({review.rating}/5)</p>
              </div>
              <p className="text-sm mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
