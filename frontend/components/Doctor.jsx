'use client';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { buttonData } from '@/components/config/Homecomponent.config';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Toast, useToast } from '@shadcn/toast';

export default function DoctorDashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [patientName, setPatientName] = useState('');
  const [medicines, setMedicines] = useState([
    { medicineName: '', tabletQuantity: '', dosage: '' },
  ]);
  const [errors, setErrors] = useState({ patientName: '', medicines: [] });

  const validateMedicine = (medicine, index) => {
    const errorsList = [];
    if (!medicine.medicineName) errorsList.push('Medicine name is required');
    if (!medicine.tabletQuantity || medicine.tabletQuantity <= 0)
      errorsList.push('Tablet quantity must be a positive number');
    if (!medicine.dosage) errorsList.push('Dosage is required');
    return errorsList;
  };

  const handleAddPrescription = async () => {
    let valid = true;
    const newErrors = { patientName: '', medicines: [] };

    if (!patientName) {
      newErrors.patientName = 'Patient name is required';
      valid = false;
    }

    const updatedMedicines = medicines.map((medicine, index) => {
      const medicineErrors = validateMedicine(medicine, index);
      if (medicineErrors.length > 0) {
        newErrors.medicines[index] = medicineErrors;
        valid = false;
      } else {
        newErrors.medicines[index] = [];
      }
      return { ...medicine, errors: medicineErrors };
    });

    setErrors(newErrors);

    if (valid) {
      const newPrescription = {
        patientName,
        medicines,
        diagnosis: 'Diagnosis details',
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await fetch('/api/prescriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPrescription),
        });

        const result = await response.json();
        if (response.ok) {
          toast({ title: 'Success', description: 'Prescription added successfully!', type: 'success' });
          setPatientName('');
          setMedicines([{ medicineName: '', tabletQuantity: '', dosage: '' }]);
        } else {
          toast({ title: 'Error', description: 'Failed to add prescription', type: 'error' });
        }
      } catch (error) {
        console.error('Error submitting prescription:', error);
        toast({ title: 'Error', description: 'Failed to add prescription', type: 'error' });
      }
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { medicineName: '', tabletQuantity: '', dosage: '' }]);
  };

  const removeMedicine = (index) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  return (
    <div className="p-6 m-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-lg">
      <div className="space-y-6 md:col-span-1">
        <h1 className="text-2xl font-semibold">Welcome, {session?.user?.name || 'Doctor'}</h1>

        <div className="border p-4 rounded-md shadow">
          <img
            src={buttonData[0].imgsrc}
            alt="Doctor Profile"
            className="w-full h-56 object-cover rounded-md"
          />
          <h2 className="text-lg font-bold mt-2">{session?.user?.name || 'Dr. John Doe'}</h2>
          <p className="text-sm">Specialty: General Medicine</p>
          <p className="text-sm">Clinic: City Health Clinic</p>
        </div>
      </div>

      <div className="space-y-6 md:col-span-1 lg:col-span-2">
        <h2 className="text-xl font-semibold">Add Prescription</h2>

        <Link href="/Doctor/Appointments">
          <Button className="mt-2 bg-red-500 text-white p-4 rounded-sm text-lg">
            Prescription History
          </Button>
        </Link>

        <div className="space-y-4">
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Patient Name"
            className={`w-full p-3 border border-gray-300 rounded-md ${errors.patientName ? 'border-red-500' : ''}`}
          />
          {errors.patientName && <span className="text-red-500 text-sm">{errors.patientName}</span>}
        </div>

        {medicines.map((medicine, index) => (
          <div key={index} className="space-y-4">
            <input
              type="text"
              value={medicine.medicineName}
              onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
              placeholder="Medicine Name"
              className={`w-full p-3 border border-gray-300 rounded-md ${errors.medicines[index]?.includes('Medicine name is required') ? 'border-red-500' : ''}`}
            />
            <input
              type="number"
              value={medicine.tabletQuantity}
              onChange={(e) => handleMedicineChange(index, 'tabletQuantity', e.target.value)}
              placeholder="Tablet Quantity"
              className={`w-full p-3 border border-gray-300 rounded-md ${errors.medicines[index]?.includes('Tablet quantity must be a positive number') ? 'border-red-500' : ''}`}
            />
            <input
              type="text"
              value={medicine.dosage}
              onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
              placeholder="Dosage/Instructions"
              className={`w-full p-3 border border-gray-300 rounded-md ${errors.medicines[index]?.includes('Dosage is required') ? 'border-red-500' : ''}`}
            />

            {medicines.length > 1 && (
              <Button onClick={() => removeMedicine(index)} className="mt-2 bg-red-600">
                Remove Medicine
              </Button>
            )}
          </div>
        ))}

        <Button onClick={addMedicine}>Add Another Medicine</Button>

        <Button onClick={handleAddPrescription} className="m-4">
          Add Prescription
        </Button>

        <div className="space-y-6">
          <Toast />
        </div>
      </div>
    </div>
  );
}
