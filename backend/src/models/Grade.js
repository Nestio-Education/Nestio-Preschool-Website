import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    child: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true, index: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: String, required: true },
    assignmentName: { type: String, required: true },
    score: { type: Number, required: true, min: 0 },
    maxScore: { type: Number, required: true, default: 100 },
    grade: { type: String },
    remarks: { type: String },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Grade = mongoose.model("Grade", gradeSchema);
