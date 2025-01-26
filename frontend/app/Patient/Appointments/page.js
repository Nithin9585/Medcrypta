// Upcoming Appointments Page
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UpcomingAppointments() {
  const { data: session, status } = useSession();

  const upcomingAppointments = [
    { id: 1, date: '2025-02-10', doctor: 'Dr. John Doe', reason: 'Routine Checkup', time: '10:00 AM' },
    { id: 2, date: '2025-02-15', doctor: 'Dr. Emily Smith', reason: 'Dental Cleaning', time: '2:00 PM' },
  ];

  if (status === 'loading') return <div>Loading...</div>;

  if (!session) return <div>Please sign in to view your appointments.</div>;

  return (
    <div className="p-6 m-6">
      <h1 className="text-2xl font-semibold mb-6">Upcoming Appointments</h1>
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
      <Link href="/Patient/BookAppointment">
        <Button>Book a New Appointment</Button>
      </Link>
    </div>
  );
}