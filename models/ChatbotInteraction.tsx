import mongoose, { Document, Schema } from 'mongoose';

export interface IChatbotInteraction extends Document {
  session: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  message: string;
  timestamp: Date;
}

const chatbotInteractionSchema: Schema<IChatbotInteraction> = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatbotSession',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.ChatbotInteraction || mongoose.model<IChatbotInteraction>('ChatbotInteraction', chatbotInteractionSchema);
