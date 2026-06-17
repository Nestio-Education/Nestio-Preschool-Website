import express from 'express';
import {
  getAttendanceRecords,
  getTeacherAttendance,
  getAttendanceByMonth,
  addAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  getAttendanceSummary,
  getStudentRoster,
  updateStudentRoster,
  getStudentAttendance,
  saveStudentAttendance,
  deleteStudentAttendance
} from '../controllers/attendanceController.js';

const router = express.Router();

router.route('/student/roster')
  .get(getStudentRoster)
  .post(updateStudentRoster);

router.route('/student/sheet')
  .get(getStudentAttendance)
  .post(saveStudentAttendance)
  .delete(deleteStudentAttendance);

router.route('/').get(getAttendanceRecords).post(addAttendanceRecord);
router.route('/teacher/:teacherId').get(getTeacherAttendance);
router.route('/teacher/:teacherId/summary').get(getAttendanceSummary);
router.route('/teacher/:teacherId/month/:month/year/:year').get(getAttendanceByMonth);
router.route('/:id').put(updateAttendanceRecord).delete(deleteAttendanceRecord);

export default router;