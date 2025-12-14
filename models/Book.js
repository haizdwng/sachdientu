import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  author: String,
  category: String,
  pages: Number,
  image: String,
  url: String,
  price: {
    type: Number,
    required: true,
  },
  rating: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  }],
  sold: {
    type: Number,
    default: 0,
  },
  bought: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

BookSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

export default mongoose.models.Book || mongoose.model('Book', BookSchema);