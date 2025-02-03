'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { upcomingAppointments } from '@/components/config/Patient.config';
export default function UpcomingAppointments() {
  const { data: session, status } = useSession();


  if (status === 'loading') return <div>Loading...</div>;

  // If no session (not signed in)
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
