import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  country: string;
  role: "provider" | "admin";
  isAdmin: boolean;
  isActive: boolean;
  bio: string;
  languages: [];
  Github: string;
  LinkedIn: string;
  photo: string;
  skillsLookingFor: [];  
  reviewedBy: mongoose.Types.String[];
  skills: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];
  followers : mongoose.Types.ObjectId[];
  following : mongoose.Types.ObjectId[];
  password?: string; 
  availability: { date: string; times: string[] }[];
  provider?: 'email' | 'firebase'; 
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.provider === 'email';
      },
      minlength: 6,
    },
    country: {
      type: String,
      required: false,
      maxlength: 50,
    },
    role: {
      type: String,
      enum: ["provider", "admin"],
      default: "provider",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: ['email', 'firebase'],
      default: 'email', 
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.String,
      ref: "User",
    },
    photo: {
      type: String,
      required: false,
    },
    availability: { type: [{ date: String, times: [String] }], default: [] },
    skillsLookingFor: { type: [], required: false },
    languages: { type: [], required: false },
    Github: { type: String, required: false },
    LinkedIn: { type: String, required: false },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    reviewedBy: [{ type: mongoose.Schema.Types.String, ref: "User" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    isVacationMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);