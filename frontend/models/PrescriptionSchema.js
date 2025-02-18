import mongoose from 'mongoose';

const { Schema } = mongoose;

const MedicineSchema = new Schema({
  medicineName: { type: String, required: true },
  tabletQuantity: { type: Number, required: true, min: 1 },
  dosage: { type: String, required: true },
});

const PrescriptionSchema = new Schema(
  {
    prescriptionId: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Automatically generate an ID
    patientName: { type: String, required: true },
    medicines: [MedicineSchema], 
    diagnosis: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    approved:{type:Boolean,default:false},
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema);
