import connectDB from '@/lib/mongodb';
import Prescription from '@/models/PrescriptionSchema';
import { NextResponse } from 'next/server';  // Import NextResponse for returning responses

// Named export for GET method
export async function GET(req, { params }) {
    console.log('Request Params:', params);  // Log the params to verify it's being passed

    const { id } = params;  // Access `id` from params

    if (!id) {
        return NextResponse.json({ message: 'Prescription ID is required' }, { status: 400 });
    }

    console.log('Prescription ID:', id);

    await connectDB();

    try {
        const prescription = await Prescription.findOne({ _id: id });

        if (!prescription) {
            return NextResponse.json({ message: 'Prescription not found' }, { status: 404 });
        }

        return NextResponse.json(prescription, { status: 200 });
    } catch (error) {
        console.error('Error fetching prescription:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}
