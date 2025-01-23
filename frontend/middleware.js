// middleware.js

import { NextResponse } from 'next/server';

export async function middleware(req) {
  // Retrieve session information from cookies (adjust this to fit your session handling)
  const session = req.cookies.get('next-auth.session-token'); // Adjust this based on your authentication system

  // The route that is being accessed
  const url = req.nextUrl.clone();

  // Check if the requested URL is '/doctor-dashboard'
  if (url.pathname.startsWith('/doctor-dashboard')) {
    
    if (!session) {
      // If no session, redirect to signin page
      url.pathname = '/auth/signin';
      return NextResponse.redirect(url);
    }

    // Assuming the session contains user data with a `role` field
    const userRole = session.user?.role;  // Adjust this to match your session structure

    // If the role is not 'doctor', redirect to unauthorized page
    if (userRole !== 'doctor') {
      url.pathname = '/unauthorized';  // Redirect unauthorized users
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/doctor-dashboard',  
};
