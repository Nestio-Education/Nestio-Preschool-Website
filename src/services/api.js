const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const request = async (url, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, options);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
    error.status = response.status;
    throw error;
  }

  return data;
};

export const loginTeacher = (email, password) => request('/api/teachers/login', 'POST', { email, password });
export const registerTeacher = (payload) => request('/api/teachers', 'POST', payload);
export const getTeacherById = (id) => request(`/api/teachers/${id}`);
export const updateTeacher = (id, payload) => request(`/api/teachers/${id}`, 'PUT', payload);
export const getDashboardSummary = () => request('/api/dashboard/summary');
export const getTeacherAttendance = (teacherId) => request(`/api/attendance/teacher/${teacherId}`);
export const addAttendanceRecord = (payload) => request('/api/attendance', 'POST', payload);
export const getAttendanceRecords = () => request('/api/attendance');

export const getStudentRoster = (subject) => request(`/api/attendance/student/roster?subject=${encodeURIComponent(subject)}`);
export const updateStudentRoster = (teacherId, subject, students) => request('/api/attendance/student/roster', 'POST', { teacherId, subject, students });
export const getStudentAttendance = (subject, date) => request(`/api/attendance/student/sheet?subject=${encodeURIComponent(subject)}&date=${encodeURIComponent(date)}`);
export const saveStudentAttendance = (teacherId, subject, date, attendance) => request('/api/attendance/student/sheet', 'POST', { teacherId, subject, date, attendance });
export const deleteStudentAttendance = (subject, date) => request(`/api/attendance/student/sheet?subject=${encodeURIComponent(subject)}&date=${encodeURIComponent(date)}`, 'DELETE');
