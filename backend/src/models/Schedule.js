import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    time: { type: String, required: true }, // e.g. "08:00 AM"
    className: { type: String, required: true }, // e.g. "Grade 5A"
    topic: { type: String, required: true }, // e.g. "Number Patterns"
    room: { type: String, required: true }, // e.g. "101"
    status: { type: String, enum: ["completed", "ongoing", "upcoming"], default: "upcoming" }
  },
  { timestamps: true }
);

export const Schedule = mongoose.model("Schedule", scheduleSchema);
