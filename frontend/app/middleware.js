import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Secret key for JWT verification (ensure this is defined in your environment variables)
const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(req) {
  // Extract the token from the Authorization header
  const authHeader = req.headers.get('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token after "Bearer"

  // If no token is found, redirect to the sign-in page
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Retrieve the user's role from the decoded JWT
    const userRole = decoded.role;
    
    // Protected paths based on user roles
    const protectedPaths = ['/Doctor', '/Patient', '/Pharmacist', '/Admin'];

    // Check if the requested path is protected
    if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
      // Role-based access control
      if (req.nextUrl.pathname.startsWith('/Doctor') && userRole !== 'doctor') {
        return NextResponse.redirect(new URL('/', req.url)); // Redirect if not doctor
      }

      if (req.nextUrl.pathname.startsWith('/Patient') && userRole !== 'patient') {
        return NextResponse.redirect(new URL('/', req.url)); // Redirect if not patient
      }

      if (req.nextUrl.pathname.startsWith('/Pharmacist') && userRole !== 'pharmacist') {
        return NextResponse.redirect(new URL('/', req.url)); // Redirect if not pharmacist
      }

      if (req.nextUrl.pathname.startsWith('/Admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url)); // Redirect if not admin
      }
    }

    // If everything is fine, continue to the requested page
    return NextResponse.next();
  } catch (err) {
    // If the token is invalid or expired, redirect to the sign-in page
    console.error('JWT verification error:', err);
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
}

// Config: Set up the matcher to apply middleware to paths starting with these routes
export const config = {
  matcher: ['/Doctor/*', '/Patient/*', '/Pharmacist/*', '/Admin/*'],  // Apply to these protected routes
};
