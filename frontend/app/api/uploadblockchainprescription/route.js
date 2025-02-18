// // app/api/approvePrescription/route.js

// import connectDB from '@/lib/mongodb';
// import { approvePrescription } from '@/utils/blockchain'; // Your blockchain interaction code

// export async function POST(req, res) {
//   const { prescriptionId, providedHash } = req.body; // Prescription ID and provided hash for approval
  
//   try {
//     await connectDB();
//     const approvalStatus = await approvePrescription(prescriptionId, providedHash);
    
//     if (approvalStatus) {
//       return res.status(200).json({ message: 'Prescription approved successfully' });
//     }
//     return res.status(400).json({ message: 'Hash mismatch, approval failed' });
//   } catch (error) {
//     return res.status(500).json({ message: 'Error approving prescription', error: error.message });
//   }
// }
