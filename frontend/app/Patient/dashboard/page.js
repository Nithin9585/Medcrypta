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

  // Book Appointment

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    doctor: '',
    reason: '',
  });
  const doctorsList = ['Dr. John Doe', 'Dr. Emily Smith', 'Dr. Alice Brown', 'Dr. Robert White'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Appointment booked with Dr. ${formData.doctor} on ${formData.date} at ${formData.time}.`);
  };

  if (status === 'loading') return <div>Loading...</div>;

  if (!session) return <div>Please sign in to book an appointment.</div>;

  return (
    <>
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

        </div>

        <div className="md:col-span-3 lg:col-span-3 space-y-6">

          <Button onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
            Sign Out
          </Button>

          <Link href="/Patient/Prescriptions">
          <Button className="m-2">Prescriptions</Button>
        </Link>

          <div className="p-6 m-6">
            <h1 className="text-2xl font-semibold mb-6">Book an Appointment</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="date" name="date" onChange={handleChange} className="border p-2 w-full" required />
              <input type="time" name="time" onChange={handleChange} className="border p-2 w-full" required />
              <input
                type="text"
                name="doctor"
                list="doctors"
                placeholder="Doctor's Name"
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
              <datalist id="doctors">
                {doctorsList.map((doctor, index) => (
                  <option key={index} value={doctor} />
                ))}
              </datalist>
              <input type="text" name="reason" placeholder="Reason for Visit" onChange={handleChange} className="border p-2 w-full" required />
              <Button type="submit">Book Appointment</Button>
            </form>
          </div>


        </div>
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
    </>
  );
}
