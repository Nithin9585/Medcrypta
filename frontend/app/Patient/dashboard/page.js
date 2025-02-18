
'use client';

import { patientData } from '@/components/config/Patient.config'; 
import PrescriptionList from '@/app/Doctor/Appointments/page';
export default function PatientDashboard() {



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
         

          <PrescriptionList/>

        </div>
      </div>
    </>
  );
}

