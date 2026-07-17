import mongoose from 'mongoose';

const confirmationSchema = new mongoose.Schema(
  {
    agreementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agreement',
      required: [true, 'Agreement reference is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required to confirm identity'],
      lowercase: true,
      trim: true,
    },
    ipAddress: {
      type: String,
    },
    signatureText: {
      type: String,
      required: [true, 'Signature representation is required'],
    },
    confirmedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Confirmation = mongoose.model('Confirmation', confirmationSchema);

export default Confirmation;
export { Confirmation };
