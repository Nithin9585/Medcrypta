'use client';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {  useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { buttonData } from '@/components/config/Homecomponent.config';
import ApprovedPrescriptions from '../approved-prescriptions/page';
export default function PharmacistDashboard() {
  const { data: session } = useSession();

  
  return (
    <div className="p-6 m-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-lg">
      <div className="space-y-6 md:col-span-1">
        <h1 className="text-2xl font-semibold">Welcome, {session?.user?.name || 'Pharmacist'}</h1>
        
        <div className="border p-4 rounded-md shadow">
          <img
            src={buttonData[2].imgsrc}
            alt="Pharmacist Profile"
            className="w-full h-56 object-cover rounded-md"
          />
          <h2 className="text-lg font-bold mt-2">{session?.user?.name || 'John Doe'}</h2>
          <p className="text-sm">Age: 40</p>
          <p className="text-sm">Pharmacy: City Pharmacy</p>
        </div>
      </div>

      <div className="space-y-6 md:col-span-1 lg:col-span-2">
        <div className="space-y-6 mb-4">
          <Link href="/Pharmasist/PrescriptionSearch" className="m-4">
            <Button>Search Prescription</Button>
          </Link>
         
        </div>

        <h2 className="text-xl font-semibold mb-4">Medicine History</h2>
       <ApprovedPrescriptions/>
      </div>
    </div>
  );
}
