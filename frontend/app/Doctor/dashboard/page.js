'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; 

export default function DoctorDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const reviews = [
    { id: 1, username: 'John Doe', comment: 'Great doctor, very helpful', rating: 4 },
    { id: 3, username: 'Jane Doe', comment: 'Not so helpful', rating: 2 },
    { id: 2, username: 'Sam Smith', comment: 'Needs improvement', rating: 1 }
  ];

  const [historyAppointments, setHistoryAppointments] = useState([
    { id: 1, time: '9:00 AM', patientName: 'Emily Davis', reason: 'Fever', prescriptionTime: '10:00 AM' },
    { id: 2, time: '11:00 AM', patientName: 'John Doe', reason: 'General Checkup', prescriptionTime: '12:00 PM' },
  ]);

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
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 m-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
      
      <div className="md:col-span-1 lg:col-span-2 space-y-6">
      <h1 className="text-2xl font-semibold">Hi Dr Bald !</h1>
      <div className="border p-4 rounded-md shadow">
  <img 
    src="https://media.istockphoto.com/id/1293642425/photo/caucasian-young-doctor-man-sits-down-on-the-stairs-near-the-clinic-building-tired-and-unhappy.webp?a=1&s=612x612&w=0&k=20&c=op0A_zk9BvmdYXvhIaY6HfxZwgW58xF59xL9E-F7IYg=" 
    alt="Doctor Profile" 
    className="w-full h-50  object-cover rounded-md" 
  />
  <h2 className="text-lg font-bold mt-2">{session.user.name || 'Dr. John Doe'}</h2>
  <p className="text-sm">Age: 45</p>
  <p className="text-sm">Hospital: City Medical Center</p>
  <p className="text-sm">Qualification: MD (General Medicine)</p>
</div>


        <div className="border p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <div className="h-64 bg-gray-200 flex items-center justify-center rounded">
            <p>Graph Placeholder</p>
          </div>
        </div>
      </div>
      

      <div className="md:col-span-3 lg:col-span-3 space-y-6">
      <Link href="/Doctor/Appointments">
          <Button>Appointments</Button>
        </Link>
        <div className="border p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Ratings</h2>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {Array(4).fill(0).map((_, idx) => (
                <span key={idx} className="text-yellow-500 text-2xl">★</span>
              ))}
              <span className="text-gray-400 text-2xl">★</span>
            </div>
            <p className="text-sm">(4.0/5 based on 25 reviews)</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Appointment History</h2>
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
            {historyAppointments.map((appt) => (
              <tr key={appt.id}>
                <td className="border px-4 py-2">{appt.time}</td>
                <td className="border px-4 py-2">{appt.patientName}</td>
                <td className="border px-4 py-2">{appt.reason}</td>
                <td className="border px-4 py-2">{appt.prescriptionTime}</td>
                <td className="border px-4 py-2">
                  <span className="text-gray-500">Completed</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <h3 className="font-semibold">{review.username}</h3>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {Array(review.rating)
                    .fill(0)
                    .map((_, idx) => (
                      <span key={idx} className="text-yellow-500 text-xl">★</span>
                    ))}
                  {Array(5 - review.rating)
                    .fill(0)
                    .map((_, idx) => (
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
