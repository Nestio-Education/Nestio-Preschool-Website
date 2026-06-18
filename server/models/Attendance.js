import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: false
    },
    isStudentAttendance: {
      type: Boolean,
      default: false
    },
    isStudentRoster: {
      type: Boolean,
      default: false
    },
    subject: {
      type: String,
      trim: true
    },
    students: [
      {
        rollNo: { type: Number },
        name: { type: String }
      }
    ],
    studentAttendanceMap: {
      type: Map,
      of: String
    },
    checkIn: {
      type: String,
      default: null
    },
    checkOut: {
      type: String,
      default: null
    },
    note: {
      type: String,
      trim: true,
      default: ''
    },
    geotagged: {
      type: Boolean,
      default: false
    },
    location: {
      latitude:  { type: Number, default: null },
      longitude: { type: Number, default: null },
      address:   { type: String, default: null }
    },
    month: {
      type: String,
      trim: true
    },
    year: {
      type: Number
    },
    day: {
      type: String,
      trim: true
    }
  },
  {
    collection: 'attendances',
    timestamps: true
  }
);

// Index for faster queries
attendanceSchema.index({ teacher: 1, date: -1 });
attendanceSchema.index({ teacher: 1, month: 1, year: 1 });
attendanceSchema.index({ status: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema, 'attendances');
export default Attendance;