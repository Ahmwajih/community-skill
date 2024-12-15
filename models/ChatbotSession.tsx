import mongoose, { Document, Schema } from 'mongoose';

export interface IChatbotSession extends Document {
  user: mongoose.Types.ObjectId;
  start_time: Date;
  end_time: Date;
  status: 'active' | 'completed' | 'failed';
}

const chatbotSessionSchema: Schema<IChatbotSession> = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    start_time: {
      type: Date,
      default: Date.now,
    },
    end_time: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'failed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.ChatbotSession || mongoose.model<IChatbotSession>('ChatbotSession', chatbotSessionSchema);
