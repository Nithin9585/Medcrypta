import { NextResponse } from 'next/server';
import connectDB from "@/lib/mongodb";
import Prescription from "@/models/PrescriptionSchema";

export async function GET(req) {
  await connectDB();

  try {
    const prescriptions = await Prescription.find().exec();

    return NextResponse.json(prescriptions, { status: 200 });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch prescriptions', details: error.message }, { status: 500 });
  }
}
