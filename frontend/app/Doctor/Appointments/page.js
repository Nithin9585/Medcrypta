'use client';  

import React, { useState } from 'react'; 
import { Button } from '@/components/ui/button'; 
import AnalogClock from '@/lib/analogclock';
function Appointments() {
  const [pendingAppointments, setPendingAppointments] = useState([
    { id: 1, time: '10:00 AM', patientName: 'John Doe', reason: 'General Checkup' },
    { id: 2, time: '11:30 AM', patientName: 'Jane Smith', reason: 'Follow-up' },
  ]);

  const [acceptedAppointments, setAcceptedAppointments] = useState([
    { id: 3, time: '9:00 AM', patientName: 'Emily Davis', reason: 'Fever', prescriptionTime: '' },
  ]);

  const [historyAppointments, setHistoryAppointments] = useState([]);
  const [selectedPrescriptionTime, setSelectedPrescriptionTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [acceptingAppointmentId, setAcceptingAppointmentId] = useState(null);

  const handleAcceptAppointment = (appointmentId) => {
    setAcceptingAppointmentId(appointmentId);
    setErrorMessage('');
  };

  const handleConfirmAcceptance = () => {
    const isTimeTaken = acceptedAppointments.some(
      (appt) => appt.time === selectedPrescriptionTime
    );
    if (isTimeTaken) {
      setErrorMessage('This time slot is already taken. Please choose another time.');
      return;
    }

    const appointment = pendingAppointments.find((appt) => appt.id === acceptingAppointmentId);
    if (appointment) {
      const updatedAppointment = {
        ...appointment,
        prescriptionTime: selectedPrescriptionTime,
      };

      setAcceptedAppointments([...acceptedAppointments, updatedAppointment]);
      setPendingAppointments(pendingAppointments.filter((appt) => appt.id !== acceptingAppointmentId));
      setAcceptingAppointmentId(null);
      setSelectedPrescriptionTime('');
    }
  };

  const handleRejectAppointment = (appointmentId) => {
    setPendingAppointments(pendingAppointments.filter((appt) => appt.id !== appointmentId));
  };

  const handleTimeSelected = (time) => {
    setSelectedPrescriptionTime(time);
  };

  return (
    <div className="border p-4 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">Appointments</h2>

      <h3 className="font-medium mb-2">Pending Appointments</h3>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 mb-4 table-fixed">
          <thead>
            <tr>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Patient Name</th>
              <th className="border px-4 py-2">Reason</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingAppointments.map((appt) => (
              <tr key={appt.id}>
                <td className="border px-4 py-2">{appt.time}</td>
                <td className="border px-4 py-2">{appt.patientName}</td>
                <td className="border px-4 py-2">{appt.reason}</td>
                <td className="border px-4 py-2">
                  {acceptingAppointmentId === appt.id ? (
                    <>
                      <AnalogClock onTimeSelected={handleTimeSelected} />
                      <Button
                        className="mt-2 sm:mt-0 sm:ml-2 bg-blue-500 hover:bg-blue-600"
                        onClick={handleConfirmAcceptance}
                      >
                        Confirm Acceptance
                      </Button>
                      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                    </>
                  ) : (
                    <Button onClick={() => handleAcceptAppointment(appt.id)}>Accept</Button>
                  )}

                  <Button
                    className=" mt-2 sm:mt-2 md:mt-2 lg:m-2 bg-red-500 hover:bg-red-600"
                    onClick={() => handleRejectAppointment(appt.id)}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;
