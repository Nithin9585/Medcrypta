'use client';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DoctorDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [medicineHistory, setMedicineHistory] = useState([]);

  // Form state for adding a prescription
  const [patientName, setPatientName] = useState('');
  const [medicines, setMedicines] = useState([
    { medicineName: '', tabletQuantity: '', dosage: '', price: '' },
  ]);
  const [errors, setErrors] = useState({ patientName: '', medicines: [] });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      sessionStorage.setItem('redirectPath', window.location.pathname);
      router.push('/auth/signin');
    } else if (session?.user.role !== 'doctor') {
      router.push('/unauthorized');
    }

    // Fetch medicine history
    fetch('/api/medicine-history')
      .then((res) => res.json())
      .then((data) => setMedicineHistory(data));
  }, [session, status, router]);

  const handleAddPrescription = async () => {
    let valid = true;
    const newErrors = { patientName: '', medicines: [] };

    // Validate patient name
    if (!patientName) {
      newErrors.patientName = 'Patient name is required';
      valid = false;
    }

    // Validate medicines
    const updatedMedicines = medicines.map((medicine, index) => {
      const medicineErrors = [];
      if (!medicine.medicineName) medicineErrors.push('Medicine name is required');
      if (!medicine.tabletQuantity || medicine.tabletQuantity <= 0)
        medicineErrors.push('Tablet quantity must be a positive number');
      if (!medicine.dosage) medicineErrors.push('Dosage is required');
      if (!medicine.price || medicine.price <= 0) medicineErrors.push('Price must be a positive number');

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
        diagnosis: 'Diagnosis details', // Optional: You can include this from the form if necessary
        timestamp: new Date().toISOString(), // Automatically set timestamp
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
          alert('Prescription added successfully');
          setPatientName('');
          setMedicines([{ medicineName: '', tabletQuantity: '', dosage: '', price: '' }]);
        } else {
          alert(`Error: ${result.message || 'Failed to add prescription'}`);
        }
      } catch (error) {
        console.error('Error submitting prescription:', error);
        alert('Error: Failed to add prescription');
      }
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { medicineName: '', tabletQuantity: '', dosage: '', price: '' }]);
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
            src="https://via.placeholder.com/300"
            alt="Doctor Profile"
            className="w-full h-56 object-cover rounded-md"
          />
          <h2 className="text-lg font-bold mt-2">{session?.user?.name || 'Dr. John Doe'}</h2>
          <p className="text-sm">Specialty: General Medicine</p>
          <p className="text-sm">Clinic: City Health Clinic</p>
        </div>
      </div>

      <div className="space-y-6 md:col-span-1 lg:col-span-2">
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Add Prescription</h2>

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
              <input
                type="number"
                value={medicine.price}
                onChange={(e) => handleMedicineChange(index, 'price', e.target.value)}
                placeholder="Price"
                className={`w-full p-3 border border-gray-300 rounded-md ${errors.medicines[index]?.includes('Price must be a positive number') ? 'border-red-500' : ''}`}
              />

              {errors.medicines[index] && errors.medicines[index].length > 0 && (
                <div className="text-red-500 text-sm">
                  {errors.medicines[index].map((error, i) => (
                    <div key={i}>{error}</div>
                  ))}
                </div>
              )}
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
        </div>

        <div className="space-y-6">
          <Link href="/Doctor/PrescriptionSearch" className="mr-4">
            <Button>Search Prescription</Button>
          </Link>
          <Button onClick={() => signOut({ callbackUrl: '/auth/signin' })} className="mt-4">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
