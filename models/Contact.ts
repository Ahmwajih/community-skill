
import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  fullName: string;
  email: string;
  message: string;
}

const ContactSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);