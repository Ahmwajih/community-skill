import mongoose, { Schema, Document } from 'mongoose';

interface IConversation extends Document {
  providerId: mongoose.Types.ObjectId;
  seekerId: mongoose.Types.ObjectId;
  messages: {
    senderId: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
  }[];
}

const conversationSchema: Schema<IConversation> = new Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, 
    },
    seekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, 
    },
    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
          index: true, 
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
          index: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
