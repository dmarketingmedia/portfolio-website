import { Schema, Document, model, models } from 'mongoose';

export interface IMeeting extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  meetingDate?: Date;
}

const MeetingSchema = new Schema<IMeeting>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'scheduled', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  meetingDate: { type: Date }
}, { timestamps: true });

export default models.Meeting || model<IMeeting>('Meeting', MeetingSchema);
