import { Schema, Document, model, models } from 'mongoose';

export interface IFeedback extends Document {
  clientName: string;
  clientCompany?: string;
  comment: string;
  rating: number;
  isApproved: boolean;
}

const FeedbackSchema = new Schema<IFeedback>({
  clientName: { type: String, required: true },
  clientCompany: { type: String },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

export default models.Feedback || model<IFeedback>('Feedback', FeedbackSchema);
