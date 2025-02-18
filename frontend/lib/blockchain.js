// // utils/blockchain.js

// import Web3 from 'web3';
// import Prescription from '@/models/PrescriptionSchema'; // Your Prescription model

// const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // Blockchain provider URL

// // Contract ABI and Address (from your smart contract deployment)
// const contractABI = [...]; // Replace with your contract's ABI
// const contractAddress = "0x..."; // Your contract's address

// const prescriptionContract = new web3.eth.Contract(contractABI, contractAddress);

// // Generate the hash for the prescription
// export const generatePrescriptionHash = (prescription) => {
//   return web3.utils.sha3(
//     JSON.stringify({
//       patientName: prescription.patientName,
//       diagnosis: prescription.diagnosis,
//       timestamp: prescription.timestamp,
//     })
//   );
// };

// // Upload prescription data to the blockchain
// export const uploadPrescriptionToBlockchain = async (prescriptionId) => {
//   const prescription = await Prescription.findById(prescriptionId);

//   if (!prescription) {
//     throw new Error('Prescription not found');
//   }

//   const prescriptionHash = generatePrescriptionHash(prescription);

//   const accounts = await web3.eth.getAccounts();
  
//   await prescriptionContract.methods.addPrescription(
//     prescription.patientName,
//     prescription.diagnosis,
//     prescriptionHash
//   ).send({ from: accounts[0] });

//   prescription.prescriptionHash = prescriptionHash;
//   await prescription.save();
// };

// // Approve prescription based on hash comparison
// export const approvePrescription = async (prescriptionId, providedHash) => {
//   const prescription = await Prescription.findById(prescriptionId);

//   if (!prescription) {
//     throw new Error('Prescription not found');
//   }

//   const approvalSuccess = await prescriptionContract.methods
//     .approvePrescription(prescriptionId, providedHash)
//     .call();

//   if (approvalSuccess) {
//     prescription.approved = true;
//     await prescription.save();
//     return true;
//   }

//   return false;
// };
