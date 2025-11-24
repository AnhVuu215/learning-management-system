const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
    title: { type: String, required: true },
    summary: { type: String },
    videoUrl: { type: String },
    textContent: { type: String },
    resources: [{ label: String, url: String }],
    order: { type: Number, default: 0 },
    isPreview: { type: Boolean, default: false },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);

