// Book Appointment Page
'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function BookAppointment() {
  const { data: session, status } = useSession();
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
  );
}