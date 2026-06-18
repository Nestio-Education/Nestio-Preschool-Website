import Attendance from '../models/Attendance.js';
import Teacher from '../models/Teacher.js';

// GET all attendance records
export const getAttendanceRecords = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate('teacher', 'firstName lastName email')
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET attendance by teacher ID
export const getTeacherAttendance = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    const records = await Attendance.find({ teacher: teacher._id })
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET attendance by month & year
export const getAttendanceByMonth = async (req, res) => {
  try {
    const { teacherId, month, year } = req.params;
    const records = await Attendance.find({
      teacher: teacherId,
      month:   month,
      year:    parseInt(year)
    }).sort({ date: 1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST mark attendance
export const addAttendanceRecord = async (req, res) => {
  try {
    const {
      teacherId, date, status,
      checkIn, checkOut, note,
      geotagged, latitude, longitude, address,
      month, year
    } = req.body;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Check if already marked for this date
    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate(), 23, 59, 59, 999);

    let existing = await Attendance.findOne({
      teacher: teacherId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    if (existing) {
      if (checkOut) {
        existing.checkOut = checkOut;
        await existing.save();
        return res.json(existing);
      }
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    const record = await Attendance.create({
      teacher:   teacherId,
      date:      new Date(date),
      status,
      checkIn:   checkIn   || null,
      checkOut:  checkOut  || null,
      note:      note      || '',
      geotagged: geotagged || false,
      location: {
        latitude:  latitude  || null,
        longitude: longitude || null,
        address:   address   || null
      },
      month: month || new Date(date).toLocaleString('default', { month: 'short' }),
      year:  year  || new Date(date).getFullYear()
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update attendance
export const updateAttendanceRecord = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    Object.assign(record, req.body);
    const updated = await record.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE attendance record
export const deleteAttendanceRecord = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    await record.deleteOne();
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET attendance summary
export const getAttendanceSummary = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const records = await Attendance.find({ teacher: teacherId });

    const summary = {
      total:             records.length,
      present:           records.filter(r => r.status === 'present').length,
      absent:            records.filter(r => r.status === 'absent').length,
      late:              records.filter(r => r.status === 'late').length,
      excused:           records.filter(r => r.status === 'excused').length,
      attendancePercent: records.length > 0
        ? Math.round(
            (records.filter(r => r.status === 'present').length / records.length) * 100
          )
        : 0
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET student roster
export const getStudentRoster = async (req, res) => {
  try {
    const { subject } = req.query;
    if (!subject) {
      return res.status(400).json({ message: 'Subject is required' });
    }

    const roster = await Attendance.findOne({ isStudentRoster: true, subject });
    if (!roster) {
      return res.json([]);
    }
    res.json(roster.students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST update student roster
export const updateStudentRoster = async (req, res) => {
  try {
    const { teacherId, subject, students } = req.body;
    if (!teacherId || !subject || !students) {
      return res.status(400).json({ message: 'Teacher ID, subject, and students are required' });
    }

    let roster = await Attendance.findOne({ isStudentRoster: true, subject });
    if (roster) {
      roster.students = students;
      roster.teacher = teacherId;
      await roster.save();
    } else {
      roster = await Attendance.create({
        isStudentRoster: true,
        teacher: teacherId,
        subject,
        students,
        date: new Date()
      });
    }

    res.json(roster.students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET student attendance sheet
export const getStudentAttendance = async (req, res) => {
  try {
    const { subject, date } = req.query;
    if (!subject || !date) {
      return res.status(400).json({ message: 'Subject and date are required' });
    }

    const sheet = await Attendance.findOne({
      isStudentAttendance: true,
      subject,
      date: {
        $gte: new Date(date + 'T00:00:00.000Z'),
        $lte: new Date(date + 'T23:59:59.999Z')
      }
    });

    if (!sheet) {
      return res.json(null);
    }
    res.json(sheet.studentAttendanceMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST save student attendance sheet
export const saveStudentAttendance = async (req, res) => {
  try {
    const { teacherId, subject, date, attendance } = req.body;
    if (!teacherId || !subject || !date || !attendance) {
      return res.status(400).json({ message: 'Teacher ID, subject, date, and attendance are required' });
    }

    const queryDate = new Date(date + 'T00:00:00.000Z');

    let sheet = await Attendance.findOne({
      isStudentAttendance: true,
      subject,
      date: {
        $gte: new Date(date + 'T00:00:00.000Z'),
        $lte: new Date(date + 'T23:59:59.999Z')
      }
    });

    if (sheet) {
      sheet.studentAttendanceMap = attendance;
      sheet.teacher = teacherId;
      await sheet.save();
    } else {
      sheet = await Attendance.create({
        isStudentAttendance: true,
        teacher: teacherId,
        subject,
        date: queryDate,
        studentAttendanceMap: attendance
      });
    }

    res.json(sheet.studentAttendanceMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE student attendance sheet
export const deleteStudentAttendance = async (req, res) => {
  try {
    const { subject, date } = req.query;
    if (!subject || !date) {
      return res.status(400).json({ message: 'Subject and date are required' });
    }

    const result = await Attendance.findOneAndDelete({
      isStudentAttendance: true,
      subject,
      date: {
        $gte: new Date(date + 'T00:00:00.000Z'),
        $lte: new Date(date + 'T23:59:59.999Z')
      }
    });

    if (!result) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};