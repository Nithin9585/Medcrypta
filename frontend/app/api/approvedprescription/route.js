import connectDB from '@/lib/mongodb';
import Prescription from '@/models/PrescriptionSchema';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB(); 

  try {
    const approvedPrescriptions = await Prescription.find({ approved: true });

    if (approvedPrescriptions.length === 0) {
      return NextResponse.json({ message: 'No approved prescriptions found' }, { status: 404 });
    }

    return NextResponse.json(approvedPrescriptions, { status: 200 });
  } catch (error) {
    console.error('Error fetching approved prescriptions:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
