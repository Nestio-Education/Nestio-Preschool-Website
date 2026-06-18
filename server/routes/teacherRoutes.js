import express from 'express';
import {
  getTeachers,
  getTeacherById,
  loginTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from '../controllers/teacherController.js';

const router = express.Router();

router.post('/login',  loginTeacher);
router.route('/').get(getTeachers).post(createTeacher);
router.route('/:id').get(getTeacherById).put(updateTeacher).delete(deleteTeacher);

export default router;