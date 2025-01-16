'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
export default function PatientDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {    
    if (status === 'loading') return; 

    if (!session) {
      sessionStorage.setItem("redirectPath", window.location.pathname);
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session?.user.role !== 'pharmasist') {
    return null; 
  }

  return (
    <div className="p-6 m-6">
    <h1 className="text-2xl font-bold">Pharmasist Dashboard</h1>
    <p className="mt-2 text-lg">Welcome to Pharmasist dashboard!</p>
    <Button onClick={signOut} className="mt-4 px-4 py-2  text-white rounded">
      Signout
    </Button>
  </div>
  );
}
