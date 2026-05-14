import { Schema, Document, model, models } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  headline: string;
  profileImage?: string;
  bioProblem: string;
  bioAgitate: string;
  bioSolution: string;
  skills: {
    name: string;
    percentage: number;
  }[];
}

const ProfileSchema = new Schema<IProfile>({
  name: { type: String, required: true, default: 'SM Fahad Bin Mahbub' },
  headline: { type: String, required: true },
  profileImage: { type: String },
  bioProblem: { type: String, required: true },
  bioAgitate: { type: String, required: true },
  bioSolution: { type: String, required: true },
  skills: [{
    name: { type: String, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 }
  }]
}, { timestamps: true });

export default models.Profile || model<IProfile>('Profile', ProfileSchema);
