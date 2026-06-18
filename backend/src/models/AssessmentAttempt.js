import mongoose from "mongoose";

const assessmentAttemptSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: String, required: true, index: true },
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
    performance: { type: String },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    recommendation: { type: String },
    answers: { type: mongoose.Schema.Types.Mixed },
    forced: { type: Boolean, default: false },
    warnings: { type: Number, default: 0 },
    date: { type: String }
  },
  { timestamps: true }
);

// Allow only one attempt per teacher per courseId
assessmentAttemptSchema.index({ teacher: 1, courseId: 1 }, { unique: true });

export const AssessmentAttempt = mongoose.model("AssessmentAttempt", assessmentAttemptSchema);
