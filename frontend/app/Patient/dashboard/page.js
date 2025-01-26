'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
  Legend
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

  const upcomingAppointments = [
    { id: 1, date: '2025-02-10', doctor: 'Dr. John Doe', reason: 'Routine Checkup', time: '10:00 AM' },
    { id: 2, date: '2025-02-15', doctor: 'Dr. Emily Smith', reason: 'Dental Cleaning', time: '2:00 PM' },
  ];

  const [chartData, setChartData] = useState(null);
  const [ratings, setRatings] = useState({});

  const generateRandomData = () => {
    const labels = [];
    const data = [];
    for (let i = 1; i <= 7; i++) {
      labels.push(`Day ${i}`);
      data.push(Math.floor(Math.random() * 100) + 50);
    }
    return { labels, data };
  };

  useEffect(() => {
    const { labels, data } = generateRandomData();
    setChartData({
      labels,
      datasets: [
        {
          label: 'Health Score',
          data,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
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

  const handleRatingChange = (doctor, rating) => {
    setRatings((prevRatings) => ({ ...prevRatings, [doctor]: rating }));
  };

  if (status === 'loading' || !session || session?.user.role !== 'patient') {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 m-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div className="md:col-span-1 lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-semibold">Welcome, {session.user.name || 'Patient'}</h1>
        <div className="border p-4 rounded-md shadow flex flex-col items-center">
          <img 
          src="https://static.vecteezy.com/system/resources/previews/031/670/134/non_2x/patient-icon-vector.jpg" 
          alt="Patient Profile" 
          className="w-72 h-72 object-cover rounded-md" 
        />
          <h2 className="text-lg font-bold mt-2">{session.user.name || 'John Doe'}</h2>
          <p className="text-sm">Age: 30</p>
          <p className="text-sm">Contact: john.doe@example.com</p>
        </div>

        <div className="border p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Health Trends</h2>
          <div className="h-64 bg-gray-200 flex items-center justify-center rounded">
            {chartData && <Line data={chartData} />}
          </div>
        </div>
      </div>

      <div className="md:col-span-3 lg:col-span-3 space-y-6">
        <Link href="/Patient/Appointments">
          <Button>Upcoming Appointments</Button>
        </Link>

        <Link href="/Patient/BookAppointment">
          <Button className="ml-4">Book Appointment</Button>
        </Link>

        <h2 className="text-xl font-semibold mb-4">Appointment Schedule</h2>
        <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Doctor</th>
              <th className="border px-4 py-2">Reason</th>
              <th className="border px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {upcomingAppointments.map((appt) => (
              <tr key={appt.id}>
                <td className="border px-4 py-2">{appt.date}</td>
                <td className="border px-4 py-2">{appt.doctor}</td>
                <td className="border px-4 py-2">{appt.reason}</td>
                <td className="border px-4 py-2">{appt.time}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-xl font-semibold mb-4">Rate Your Doctor</h2>
        {upcomingAppointments.map((appt) => (
          <div key={appt.id} className="border p-4 rounded-md shadow mb-4">
            <p className="text-lg font-bold">{appt.doctor}</p>
            <select
              className="mt-2 border rounded p-2 w-full"
              value={ratings[appt.doctor] || ''}
              onChange={(e) => handleRatingChange(appt.doctor, e.target.value)}
            >
              <option value="">Rate the doctor</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
