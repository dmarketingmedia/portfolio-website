import { Schema, Document, model, models } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
  sectionsStatus: {
    sectionName: string;
    isActive: boolean;
  }[];
}

const SettingsSchema = new Schema<ISettings>({
  siteName: { type: String, required: true, default: 'Portfolio' },
  socialLinks: [{
    platform: { type: String, required: true },
    url: { type: String, required: true }
  }],
  sectionsStatus: [{
    sectionName: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  }]
}, { timestamps: true });

export default models.Settings || model<ISettings>('Settings', SettingsSchema);
