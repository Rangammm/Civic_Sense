import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Pothole', 'Garbage', 'Streetlight', 'Water', 'Traffic', 'Construction', 'Noise', 'Other']
  },
  status: { 
    type: String, 
    enum: ['submitted', 'review', 'progress', 'resolved'], 
    default: 'submitted' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'low' 
  },
  location: {
    address: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  photos: [{ type: String }],
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  aiCategory: { type: String },
  aiPriority: { type: String },
  aiSuggestion: { type: String },
  resolvedAt: { type: Date }
}, { timestamps: true });

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
