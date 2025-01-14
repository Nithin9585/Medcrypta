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
    <div>
      <h1>pharmasist Dashboard</h1>
      <p>Welcome to pharmasist dashboard!</p>
      <Button
      onClick=
      {
        signOut
      }>
        Signout

      </Button>
    </div>
  );
}
