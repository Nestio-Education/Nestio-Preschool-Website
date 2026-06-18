import {
  loginUser,
  getChildren,
  createChild,
  updateChild,
  deleteChild,
  getCenters,
  getCourses,
  getActivities,
  getAdminTeachers,
} from "../services/api";

export const loginAdmin = (data) => loginUser({ ...data, role: "admin" });
export const loginTeacher = (data) => loginUser({ ...data, role: "teacher" });

export const fetchChildren = async (params) => {
  const response = await getChildren(params);
  return response.children || response;
};

export const fetchCenters = async () => {
  const response = await getCenters();
  return response.centers || response;
};

export const fetchCourses = async () => {
  const response = await getCourses();
  return response.courses || response;
};

export const fetchActivities = async () => {
  const response = await getActivities();
  return response.activities || response;
};

export const fetchTeachers = async () => {
  const response = await getAdminTeachers();
  return response.teachers || response;
};

export const fetchChildById = async (id) => {
  const children = await fetchChildren();
  return children.find((child) => (child._id || child.id) === id);
};

export { createChild, updateChild, deleteChild };

export const fetchTrainings = fetchCourses;
export const fetchAssessments = async () => [];
export const fetchAnnouncements = async () => [];
