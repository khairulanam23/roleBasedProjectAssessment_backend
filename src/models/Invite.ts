import { Schema, model, Document } from 'mongoose';

export interface IInvite extends Document {
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
}

const inviteSchema = new Schema<IInvite>({
  email: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'MANAGER', 'STAFF'], required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  acceptedAt: { type: Date },
});

export default model<IInvite>('Invite', inviteSchema);