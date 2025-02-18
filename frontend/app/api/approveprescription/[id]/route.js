import connectDB from '@/lib/mongodb';
import Prescription from '@/models/PrescriptionSchema';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  const { id } = params; 
  
  await connectDB(); 
  try {
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      id, 
      { approved: true }, 
      { new: true }
    );

    if (!updatedPrescription) {
      return NextResponse.json({ message: 'Prescription not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPrescription, { status: 200 });
  } catch (error) {
    console.error('Error updating prescription:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

