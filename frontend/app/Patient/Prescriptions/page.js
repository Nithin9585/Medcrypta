'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function PrescriptionPreview() {
  const [showPrescription, setShowPrescription] = useState(false);

  const patient = {
    name: "John Doe",
    age: 35,
    phone: "+1 234 567 890",
  };

  const appointment = {
    doctor: "Dr. Emily Smith",
    date: "2025-02-20",
    time: "10:30 AM",
    reason: "Routine Check-up",
  };

  return (
    <div className="border p-6 rounded-md shadow-lg w-full max-w-lg mx-auto bg-white">
      <h2 className="text-xl font-semibold text-center">Prescription Preview</h2>
      <div className="border-b mb-4 pb-4">
        <p><strong>Patient Name:</strong> {patient.name}</p>
        <p><strong>Age:</strong> {patient.age} years</p>
        <p><strong>Contact:</strong> {patient.phone}</p>
      </div>
      <div className="border-b mb-4 pb-4">
        <p><strong>Doctor:</strong> {appointment.doctor}</p>
        <p><strong>Date:</strong> {appointment.date}</p>
        <p><strong>Time:</strong> {appointment.time}</p>
        <p><strong>Reason:</strong> {appointment.reason}</p>
      </div>
      
        <div className="mb-4">
          <h3 className="font-semibold">Diagnosis</h3>
          <p>General Check-up - No serious issues detected.</p>
          <h3 className="font-semibold mt-2">Prescribed Medications</h3>
          <ul className="list-disc pl-4">
            <li>Paracetamol 500mg - Twice daily after meals</li>
            <li>Vitamin C Tablets - Once daily in the morning</li>
          </ul>
        </div>
      
    </div>
  );
}
