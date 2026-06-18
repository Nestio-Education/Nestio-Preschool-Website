import bcrypt from 'bcryptjs';
import Teacher from '../models/Teacher.js';
import TeacherProfile from '../models/TeacherProfile.js';

// GET all teachers
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ active: true }).select('-password');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select('-password');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    const profile = await TeacherProfile.findOne({ teacherEmail: teacher.email });
    const merged = {
      ...teacher.toObject(),
      id: teacher._id
    };
    if (profile) {
      merged.name = profile.name || merged.name;
      merged.phone = profile.phone || merged.phone;
      merged.workingCenter = profile.workingCenter || merged.workingCenter;
      merged.subject = profile.subject || merged.subject;
      merged.batch = profile.batch || merged.batch;
      merged.joined = profile.joined || merged.joined;
      merged.attendance = profile.attendance || merged.attendance;
      merged.portfolio = { ...merged.portfolio, ...profile.portfolio };
      merged.address = profile.address;
      merged.socialLinks = profile.socialLinks;
      merged.settings = profile.settings;
    }
    res.json(merged);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST login
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, teacher.password);
    if (!match && password !== teacher.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!teacher.active) {
      return res.status(403).json({ message: 'Teacher account is inactive' });
    }

    const profile = await TeacherProfile.findOne({ teacherEmail: teacher.email });

    res.json({
      id:            teacher._id,
      name:          profile && profile.name ? profile.name : `${teacher.firstName} ${teacher.lastName}`,
      email:         teacher.email,
      phone:         profile && profile.phone ? profile.phone : teacher.phone,
      subject:       profile && profile.subject ? profile.subject : teacher.subject,
      workingCenter: profile && profile.workingCenter ? profile.workingCenter : teacher.workingCenter,
      attendance:    profile && profile.attendance ? profile.attendance : teacher.attendance,
      classes:       teacher.classes,
      students:      teacher.students,
      batch:         profile && profile.batch ? profile.batch : teacher.batch,
      status:        teacher.status,
      joined:        profile && profile.joined ? profile.joined : teacher.joined,
      schedule:      teacher.schedule,
      grades:        teacher.grades,
      assignments:   teacher.assignments,
      courses:       teacher.courses,
      certificates:  teacher.certificates,
      notifications: teacher.notifications,
      portfolio:     profile && profile.portfolio ? { ...teacher.portfolio, ...profile.portfolio } : teacher.portfolio,
      address:       profile ? profile.address : '',
      socialLinks:   profile ? profile.socialLinks : {},
      settings:      profile ? profile.settings : {},
      role:          'teacher'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create teacher
export const createTeacher = async (req, res) => {
  try {
    const {
      firstName, lastName, email, password,
      phone, subject, grade, center,
      workingCenter, qualifications,
      experienceYears, bio, batch
    } = req.body;

    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Teacher with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      firstName, lastName, email,
      password:        hashedPassword,
      phone,           subject,
      grade,           center,
      workingCenter,   qualifications,
      experienceYears, bio, batch,
      status:     'approved',
      joined:     Date.now(),
      attendance: 0,
      classes:    0,
      students:   0
    });

    res.status(201).json({
      id:            teacher._id,
      name:          `${teacher.firstName} ${teacher.lastName}`,
      email:         teacher.email,
      subject:       teacher.subject,
      workingCenter: teacher.workingCenter,
      attendance:    teacher.attendance,
      classes:       teacher.classes,
      students:      teacher.students,
      batch:         teacher.batch,
      status:        teacher.status,
      joined:        teacher.joined,
      role:          'teacher'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update teacher
export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    if (updates.name) {
      const nameParts = updates.name.trim().split(" ");
      teacher.firstName = nameParts[0];
      teacher.lastName = nameParts.slice(1).join(" ") || nameParts[0];
    }

    Object.assign(teacher, updates);
    const updatedTeacher = await teacher.save();

    const profile = await TeacherProfile.findOne({ teacherEmail: teacher.email });
    if (profile) {
      if (updates.name) profile.name = updates.name;
      if (updates.phone) profile.phone = updates.phone;
      if (updates.address) profile.address = updates.address;
      if (updates.workingCenter) profile.workingCenter = updates.workingCenter;
      if (updates.subject) profile.subject = updates.subject;
      if (updates.portfolio) {
        profile.portfolio = { ...profile.portfolio, ...updates.portfolio };
      }
      await profile.save();
    }

    res.json({
      id:            updatedTeacher._id,
      name:          profile && profile.name ? profile.name : `${updatedTeacher.firstName} ${updatedTeacher.lastName}`,
      email:         updatedTeacher.email,
      phone:         profile && profile.phone ? profile.phone : updatedTeacher.phone,
      subject:       profile && profile.subject ? profile.subject : updatedTeacher.subject,
      workingCenter: profile && profile.workingCenter ? profile.workingCenter : updatedTeacher.workingCenter,
      attendance:    profile && profile.attendance ? profile.attendance : updatedTeacher.attendance,
      classes:       updatedTeacher.classes,
      students:      updatedTeacher.students,
      batch:         profile && profile.batch ? profile.batch : updatedTeacher.batch,
      status:        updatedTeacher.status,
      joined:        profile && profile.joined ? profile.joined : updatedTeacher.joined,
      portfolio:     profile && profile.portfolio ? { ...updatedTeacher.portfolio, ...profile.portfolio } : updatedTeacher.portfolio,
      address:       profile ? profile.address : '',
      socialLinks:   profile ? profile.socialLinks : {},
      settings:      profile ? profile.settings : {},
      role:          'teacher'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE teacher (soft delete)
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    teacher.active = false;
    await teacher.save();
    res.json({ message: 'Teacher marked inactive' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};