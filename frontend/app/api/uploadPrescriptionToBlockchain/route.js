// app/api/uploadPrescriptionToBlockchain/route.js

import connectDB from '@/lib/mongodb'; // DB connection utility
import { uploadPrescriptionToBlockchain } from '@/utils/blockchain'; // Your blockchain interaction code

export async function POST(req, res) {
  const { prescriptionId } = req.query;

  try {
    await connectDB();
    await uploadPrescriptionToBlockchain(prescriptionId); // Upload prescription to the blockchain
    return res.status(200).json({ message: 'Prescription uploaded to blockchain successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error uploading prescription to blockchain', error: error.message });
  }
}
