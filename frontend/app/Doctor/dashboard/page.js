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
      const currentPath = window.location.pathname;
      // Redirect to the sign-in page with the current route as callbackUrl
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(currentPath)}`);    } else if (session?.user?.role !== 'doctor') {
      console.log(session)
      router.push('/unauthorized');
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session?.user.role !== 'doctor') {
    return null; 
  }

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <p>Welcome to Doctor dashboard!</p>
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
