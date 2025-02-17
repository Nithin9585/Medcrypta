'use client';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Doctordata, reviews, appointments, Last7daysdata } from '@/components/config/Doctor.config'; // Importing data


export default function Doctor() {
  const router = useRouter();
  const { data: session, status } = useSession();


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

  // Upload prescription
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    patient: '',
    prescription: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Appointment booked with Dr. ${formData.doctor} on ${formData.date} at ${formData.time}.`);
  };

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


      </div>

      <div className="md:col-span-3 lg:col-span-3 space-y-6">
        <Link href="/Doctor/Appointments">
        </Link>
        <Button onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
          Sign Out
        </Button>

        <div className="p-6 m-6">
          <h1 className="text-2xl font-semibold mb-6">Upload prescription</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="date" name="date" onChange={handleChange} className="border p-2 w-full" required />
            <input type="time" name="time" onChange={handleChange} className="border p-2 w-full" required />
            <input
              type="text"
              name="patient"
              list="patient"
              placeholder="Patient's Name"
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
            
            <input type="text" name="prescription" placeholder="List of prescriptions" onChange={handleChange} className="border p-2 w-full" required />
            <Button type="submit">Upload</Button>
          </form>
        </div>


      </div>
    </div>
  );
}
