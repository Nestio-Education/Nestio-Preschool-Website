import Teacher from '../models/Teacher.js';
import Attendance from '../models/Attendance.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const totalTeachers    = await Teacher.countDocuments({ active: true });
    const attendanceCount  = await Attendance.countDocuments();
    const presentCount     = await Attendance.countDocuments({ status: 'present' });
    const absentCount      = await Attendance.countDocuments({ status: 'absent' });
    const lateCount        = await Attendance.countDocuments({ status: 'late' });

    const recentAttendance = await Attendance.find()
      .sort({ date: -1 })
      .limit(10)
      .populate('teacher', 'firstName lastName email');

    const recentTeachers = await Teacher.find({ active: true })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalTeachers,
      attendanceCount,
      presentCount,
      absentCount,
      lateCount,
      attendancePercent: attendanceCount > 0
        ? Math.round((presentCount / attendanceCount) * 100)
        : 0,
      recentAttendance,
      recentTeachers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};