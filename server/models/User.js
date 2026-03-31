import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String, default: 'https://res.cloudinary.com/demo/image/upload/v1/default_avatar.png' },
  phone: { type: String },
  address: { type: String },
  role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
  civicPoints: { type: Number, default: 0 },
  badges: [{ type: String }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
