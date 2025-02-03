'use client';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Line } from 'react-chartjs-2';
import { Doctordata, reviews, appointments, Last7daysdata } from '@/components/config/Doctor.config'; // Importing data
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

export default function Doctor() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    const data = Last7daysdata[0] ? Object.values(Last7daysdata[0]) : []; 

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
    } else if (session?.user.role !== 'doctor') {
      router.push('/unauthorized');
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session?.user.role !== 'doctor') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const doctor = Doctordata[0]; 

  return (
    <div className="p-6 m-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 rounded-lg ">
      <div className="md:col-span-1 lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-semibold">{doctor.name}</h1>
        <div className="border p-4 rounded-md shadow">
          <img
            src={doctor.image}
            alt="Doctor Profile"
            className="w-full h-50 object-cover rounded-md"
          />
          <h2 className="text-lg font-bold mt-2">{doctor.name}</h2>
          <p className="text-sm">{doctor.age} years old</p>
          <p className="text-sm">{doctor.experience}</p>
          <p className="text-sm">{doctor.speciality}</p>
        </div>

        <div className="border p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <div className="h-64 bg-gray-200 flex items-center justify-center rounded">
            {chartData && <Line data={chartData} />}
          </div>
        </div>
      </div>

      <div className="md:col-span-3 lg:col-span-3 space-y-6">
        <Link href="/Doctor/Appointments">
          <Button className="relative m-2">
            Appointments
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
          </Button>
        </Link>
        <Button onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
          Sign Out
        </Button>

        <div className="border p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">{doctor.rating}</h2>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {Array(4).fill(0).map((_, idx) => (
                <span key={idx} className="text-yellow-500 text-2xl">★</span>
              ))}
              <span className="text-gray-400 text-2xl">★</span>
            </div>
            <p className="text-sm">(4.0/5 based on {doctor.reviews} reviews)</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Appointment History</h2>
        <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Patient Name</th>
              <th className="border px-4 py-2">Reason</th>
              <th className="border px-4 py-2">Prescription Time</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td className="border px-4 py-2">{appt.time}</td>
                <td className="border px-4 py-2">{appt.name}</td>
                <td className="border px-4 py-2">Reason</td>
                <td className="border px-4 py-2">Time</td>
                <td className="border px-4 py-2">
                  <span className="text-gray-500">Completed</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>

        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
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
