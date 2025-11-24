const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    price: { type: Number, default: 0 },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'locked'],
      default: 'draft',
    },
    isPublished: { type: Boolean, default: false },
    thumbnail: {
      url: String,
      publicId: String,
    },
    tags: [{ type: String }],
    requirements: [{ type: String }],
    learningOutcomes: [{ type: String }],
    totalChapters: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);

