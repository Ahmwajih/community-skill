import mongoose, { Schema, Document } from 'mongoose';
import User from './User';

interface ISkill extends Document {
  title: string;
  description: string;
  category: string;
  photo: string;
  user: mongoose.Types.ObjectId;
}

const skillSchema: Schema<ISkill> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      maxlength: 50,
      enum: [
        "Machine Learning",
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Cybersecurity",
        "DevOps",
        "AI Development",
        "Graphic Design",
      ]
      
    },
    photo: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      validate: {
        validator: function (v) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: (props) => `${props.value} is not a valid user ID!`,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Skill = mongoose.models.Skill || mongoose.model<ISkill>('Skill', skillSchema);

export default Skill;