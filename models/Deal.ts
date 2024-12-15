import mongoose, { Schema, Document } from 'mongoose';

interface IDeal extends Document {
  providerId: mongoose.Types.ObjectId;
  seekerId: mongoose.Types.ObjectId;
  timeFrame: string;
  skillOffered: string;
  numberOfSessions: number;
  selectedAvailabilities: string[];
  status?: string; // Optional status field
}

const dealSchema: Schema<IDeal> = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timeFrame: {
      type: String,
      required: true,
    },
    skillOffered: {
      type: String,
      required: true,
    },
    numberOfSessions: {
      type: Number,
      required: true,
    },
    selectedAvailabilities: {
      type: [String], 
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Deal = mongoose.models.Deal || mongoose.model<IDeal>('Deal', dealSchema);

export default Deal;