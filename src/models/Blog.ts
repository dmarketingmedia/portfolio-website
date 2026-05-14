import { Schema, Document, model, models, Types } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  category: Types.ObjectId;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

export default models.Blog || model<IBlog>('Blog', BlogSchema);
