import { NextResponse } from 'next/server';
import connectDB from "@/lib/mongodb";
import Prescription from "@/models/PrescriptionSchema";

export async function POST(req) {
  await connectDB();

  try {
   



    const {  patientName, medicines, diagnosis } = await req.json();
    
    if ( !patientName || !medicines || medicines.length === 0 || !diagnosis) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const newPrescription = new Prescription({
      patientName,
      medicines,
      diagnosis,
    });

    const savedPrescription = await newPrescription.save();

    return NextResponse.json(savedPrescription, { status: 201 });
  } catch (error) {
    console.error('Error saving prescription:', error);
    return NextResponse.json({ error: 'Failed to save prescription', details: error.message }, { status: 500 });
  }
}
