import { Schema, Document, model, models } from 'mongoose';

export interface INavigation extends Document {
  label: string;
  path: string;
  displayOrder: number;
}

const NavigationSchema = new Schema<INavigation>({
  label: { type: String, required: true },
  path: { type: String, required: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default models.Navigation || model<INavigation>('Navigation', NavigationSchema);
