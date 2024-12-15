import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillExchange extends Document {
  skill: mongoose.Types.ObjectId;
  // seeker: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  exchange_date: Date;
}

const skillExchangeSchema: Schema<ISkillExchange> = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    // seeker: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed', 'rejected'],
      default: 'pending',
    },
    exchange_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.SkillExchange || mongoose.model<ISkillExchange>('SkillExchange', skillExchangeSchema);
