import { useState, useEffect, useRef } from "react";
import { Logo, Toast, StatusBadge, StatCard, SectionCard, Modal, SearchBar, BarChart, AttendanceBar, S, globalCSS } from "../components/Shared";
//import TeacherManagementTab from "./TeacherManagementTab";
/* ═══════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════ */
const LC_OVERLAY = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, backdropFilter: "blur(3px)", padding: 20,
};
const LC_MODAL = {
  background: "white", borderRadius: 20, width: "100%", maxWidth: 560,
  maxHeight: "88vh", display: "flex", flexDirection: "column",
  boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
};
const LC_HDR = {
  padding: "18px 24px", borderBottom: "1px solid #f3f4f6",
  display: "flex", justifyContent: "space-between", alignItems: "center",
  flexShrink: 0,
};
const LC_CLOSE = {
  background: "#f3f4f6", border: "none", width: 30, height: 30,
  borderRadius: 8, cursor: "pointer", fontSize: 15,
};
const LC_BTN_PRIMARY = {
  padding: "9px 18px", borderRadius: 9, border: "none",
  background: "#f59e0b", color: "white", fontSize: 13,
  fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
};
const LC_BTN_GHOST = {
  padding: "7px 13px", borderRadius: 8,
  border: "1.5px solid #e5e7eb", background: "white",
  color: "#6b7280", fontSize: 12, fontWeight: 600,
  cursor: "pointer", fontFamily: "inherit",
};

const AR_OVERLAY = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, backdropFilter: "blur(3px)", padding: 20,
};
const AR_MODAL = {
  background: "white", borderRadius: 20, width: "100%", maxWidth: 440,
  boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
};
const AR_HDR = {
  padding: "18px 24px", borderBottom: "1px solid #f3f4f6",
  display: "flex", justifyContent: "space-between", alignItems: "center",
};
const AR_CLOSE = {
  background: "#f3f4f6", border: "none", width: 30, height: 30,
  borderRadius: 8, cursor: "pointer", fontSize: 15,
};
const AR_BTN_PRIMARY = {
  padding: "8px 16px", borderRadius: 9, border: "none",
  background: "#f59e0b", color: "white", fontSize: 12,
  fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
};
const AR_BTN_GHOST = {
  padding: "7px 13px", borderRadius: 8,
  border: "1.5px solid #e5e7eb", background: "white",
  color: "#6b7280", fontSize: 12, fontWeight: 600,
  cursor: "pointer", fontFamily: "inherit",
};

const MODAL_OVERLAY = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 999, backdropFilter: "blur(3px)", padding: 20,
};
const MODAL_BOX = {
  background: "white", borderRadius: 20, width: "100%", maxWidth: 680,
  maxHeight: "90vh", display: "flex", flexDirection: "column",
  boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
};
const MODAL_HDR = {
  padding: "18px 24px", borderBottom: "1px solid #f3f4f6",
  display: "flex", justifyContent: "space-between", alignItems: "center",
  flexShrink: 0,
};
const CLOSE_BTN = {
  background: "#f3f4f6", border: "none", width: 30, height: 30,
  borderRadius: 8, cursor: "pointer", fontSize: 15, display: "flex",
  alignItems: "center", justifyContent: "center",
};

const NT_OVERLAY = {
  position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
  display:"flex", alignItems:"center", justifyContent:"center",
  zIndex:1000, backdropFilter:"blur(3px)", padding:20,
};
const NT_MODAL = {
  background:"white", borderRadius:20, width:"100%", maxWidth:580,
  maxHeight:"90vh", display:"flex", flexDirection:"column",
  boxShadow:"0 20px 60px rgba(0,0,0,0.2)", overflow:"hidden",
};
const NT_HDR = {
  padding:"18px 24px", borderBottom:"1px solid #f3f4f6",
  display:"flex", justifyContent:"space-between", alignItems:"center",
  flexShrink:0,
};
const NT_CLOSE = {
  background:"#f3f4f6", border:"none", width:30, height:30,
  borderRadius:8, cursor:"pointer", fontSize:15,
};
const NT_BTN_PRIMARY = {
  padding:"8px 16px", borderRadius:9, border:"none",
  background:"#f59e0b", color:"white", fontSize:12,
  fontWeight:700, cursor:"pointer", fontFamily:"inherit",
};
const NT_BTN_GHOST = {
  padding:"7px 13px", borderRadius:8,
  border:"1.5px solid #e5e7eb", background:"white",
  color:"#6b7280", fontSize:12, fontWeight:600,
  cursor:"pointer", fontFamily:"inherit",
};
 

const MOCK_TEACHERS = [
  { id:1, name:"Priya Sharma",   email:"priya@school.edu",  phone:"9876543210", subject:"Mathematics",    address:"Mumbai", qualification:"B.Ed",    experience:"3-5 yrs",  status:"approved", joined:"01/05/2026", attendance:92, classes:6, students:38, batch:"Batch A", course:"Pre-Primary Teacher Training", revenue:4500 },
  { id:2, name:"Rahul Verma",    email:"rahul@school.edu",  phone:"9123456780", subject:"Science",        address:"Pune",   qualification:"Graduate",experience:"1-2 yrs",  status:"approved", joined:"15/04/2026", attendance:87, classes:5, students:42, batch:"Batch B", course:"Montessori Teacher Training",  revenue:5200 },
  { id:3, name:"Anita Joshi",    email:"anita@school.edu",  phone:"9988776655", subject:"History",        address:"Delhi",  qualification:"Post-Graduate",experience:"Fresher",status:"pending",  joined:"28/05/2026", attendance:0,  classes:0, students:0,  batch:"",        course:"Child Psychology & Development",revenue:0 },
  { id:4, name:"Meera Patel",    email:"meera@school.edu",  phone:"9765432100", subject:"English",        address:"Surat",  qualification:"B.Ed",    experience:"5-10 yrs", status:"approved", joined:"10/03/2026", attendance:95, classes:7, students:45, batch:"Batch A", course:"Pre-Primary Teacher Training", revenue:4500 },
  { id:5, name:"Suresh Kumar",   email:"suresh@school.edu", phone:"9654321098", subject:"Hindi",          address:"Jaipur", qualification:"Graduate",experience:"3-5 yrs",  status:"approved", joined:"20/04/2026", attendance:78, classes:6, students:36, batch:"Batch C", course:"NEP 2020 & FLN",               revenue:3800 },
  { id:6, name:"Kavita Singh",   email:"kavita@school.edu", phone:"9543210987", subject:"Art & Craft",    address:"Nagpur", qualification:"Graduate",experience:"1-2 yrs",  status:"pending",  joined:"30/05/2026", attendance:0,  classes:0, students:0,  batch:"",        course:"Curriculum Design",            revenue:0 },
  { id:7, name:"Deepak Nair",    email:"deepak@school.edu", phone:"9432109876", subject:"Physical Ed",    address:"Kochi",  qualification:"B.Ed",    experience:"10+ yrs",  status:"approved", joined:"05/02/2026", attendance:89, classes:8, students:52, batch:"Batch B", course:"Leadership & Administration",  revenue:6200 },
  { id:8, name:"Sunita Reddy",   email:"sunita@school.edu", phone:"9321098765", subject:"Special Ed",     address:"Hyd",    qualification:"Post-Graduate",experience:"5-10 yrs",status:"rejected",joined:"12/05/2026", attendance:0,  classes:0, students:0,  batch:"",        course:"Special Education",            revenue:0 },
];

const MOCK_COURSES = [
  { id:1, title:"Pre-Primary Teacher Training (PPT)", category:"Foundation", enrolled:124, status:"published", completion:78, revenue:558000, duration:"6 Weeks", price:4500, rating:4.8 },
  { id:2, title:"Montessori Teacher Training",        category:"Montessori", enrolled:89,  status:"published", completion:65, revenue:462800, duration:"8 Weeks", price:5200, rating:4.9 },
  { id:3, title:"Child Psychology & Development",     category:"Psychology", enrolled:67,  status:"published", completion:82, revenue:241200, duration:"4 Weeks", price:3600, rating:4.7 },
  { id:4, title:"NEP 2020 Alignment & FLN",           category:"Policy",     enrolled:45,  status:"published", completion:90, revenue:171000, duration:"3 Weeks", price:3800, rating:4.6 },
  { id:5, title:"Curriculum Design & Lesson Planning",category:"Planning",   enrolled:38,  status:"draft",     completion:0,  revenue:0,      duration:"5 Weeks", price:4200, rating:0 },
  { id:6, title:"Leadership & School Administration", category:"Leadership", enrolled:29,  status:"published", completion:71, revenue:179800, duration:"6 Weeks", price:6200, rating:4.5 },
  { id:7, title:"Special Education & Inclusive Ed",   category:"Special Ed", enrolled:52,  status:"published", completion:68, revenue:202800, duration:"7 Weeks", price:3900, rating:4.8 },
  { id:8, title:"Digital Literacy for Modern Teachers",category:"Digital",   enrolled:0,   status:"coming_soon",completion:0, revenue:0,      duration:"4 Weeks", price:3200, rating:0 },
];

const MOCK_BATCHES = [
  {
    id: 1,
    name: "Batch A — May 2026",
    course: "Pre-Primary Teacher Training",
    start: "2026-05-01",
    end: "2026-06-15",
    capacity: 40,
    enrolled: 32,
    mode: "Online",
    platform: "Zoom",
    meetingLink: "https://zoom.us/j/batch-a",
    trainer: "Dr. Rekha Iyer",
    coTrainer: "Prof. Amol Desai",
    status: "active",
    autoEnroll: true,
    schedule: [
      { id:1, title:"Classroom Management Techniques", date:"2026-06-02", time:"10:00 AM", type:"session", duration:90 },
      { id:2, title:"Assignment 1 Due", date:"2026-06-05", time:"11:59 PM", type:"assignment", duration:0 },
      { id:3, title:"Child Development Theories", date:"2026-06-08", time:"10:00 AM", type:"session", duration:60 },
    ],
    teachers: [1, 4],
  },
  {
    id: 2,
    name: "Batch B — Apr 2026",
    course: "Montessori Teacher Training",
    start: "2026-04-15",
    end: "2026-06-15",
    capacity: 35,
    enrolled: 28,
    mode: "Online",
    platform: "Google Meet",
    meetingLink: "https://meet.google.com/batch-b",
    trainer: "Prof. Amol Desai",
    coTrainer: "",
    status: "active",
    autoEnroll: false,
    schedule: [
      { id:1, title:"Montessori Material Demonstration", date:"2026-06-03", time:"11:00 AM", type:"session", duration:60 },
      { id:2, title:"Assignment 2 Due", date:"2026-06-07", time:"11:59 PM", type:"assignment", duration:0 },
    ],
    teachers: [2, 7],
  },
  {
    id: 3,
    name: "Batch C — Jun 2026",
    course: "NEP 2020 & FLN",
    start: "2026-06-01",
    end: "2026-06-30",
    capacity: 50,
    enrolled: 18,
    mode: "Hybrid",
    platform: "Zoom",
    meetingLink: "https://zoom.us/j/batch-c",
    trainer: "Ms. Geeta Rao",
    coTrainer: "",
    status: "upcoming",
    autoEnroll: true,
    schedule: [
      { id:1, title:"NEP 2020 Overview", date:"2026-06-10", time:"09:00 AM", type:"session", duration:120 },
    ],
    teachers: [5],
  },
  {
    id: 4,
    name: "Batch D — Mar 2026",
    course: "Child Psychology",
    start: "2026-03-01",
    end: "2026-04-30",
    capacity: 30,
    enrolled: 30,
    mode: "Online",
    platform: "Google Meet",
    meetingLink: "https://meet.google.com/batch-d",
    trainer: "Dr. Vikram Shah",
    coTrainer: "Dr. Rekha Iyer",
    status: "completed",
    autoEnroll: false,
    schedule: [],
    teachers: [],
  },
  {
    id: 5,
    name: "Batch E — Jun 2026",
    course: "Leadership & Administration",
    start: "2026-06-15",
    end: "2026-07-31",
    capacity: 25,
    enrolled: 12,
    mode: "Offline",
    platform: "In-Person",
    meetingLink: "",
    trainer: "Mr. Sunil Mehta",
    coTrainer: "",
    status: "upcoming",
    autoEnroll: false,
    schedule: [],
    teachers: [],
  },
];

const MOCK_TRAINERS = [
  { id:1, name:"Dr. Rekha Iyer",    subject:"Early Childhood Ed", courses:3, batches:5, rating:4.9, sessions:42, status:"active" },
  { id:2, name:"Prof. Amol Desai",  subject:"Montessori Method",  courses:2, batches:3, rating:4.8, sessions:28, status:"active" },
  { id:3, name:"Ms. Geeta Rao",     subject:"NEP & Curriculum",   courses:2, batches:4, rating:4.7, sessions:35, status:"active" },
  { id:4, name:"Dr. Vikram Shah",   subject:"Child Psychology",   courses:1, batches:2, rating:4.9, sessions:18, status:"active" },
  { id:5, name:"Mr. Sunil Mehta",   subject:"School Leadership",  courses:1, batches:1, rating:4.6, sessions:10, status:"inactive" },
];

const MOCK_SESSIONS = [
  {
    id:1, title:"Classroom Management Techniques", date:"02/06/2026", time:"10:00", batch:"Batch A",
    trainer:"Dr. Rekha Iyer", backupTrainer:"Prof. Amol Desai", platform:"Zoom",
    meetingLink:"https://zoom.us/j/123456789", duration:90, status:"completed",
    attendees:28, maxParticipants:40, recurrence:"none", recurrenceEnd:"",
    recording:"", materials:[], feedbackSent:false, summary:"",
    reminderSent24h:true, reminderSent1h:true,
  },
  {
    id:2, title:"Montessori Material Demonstration", date:"03/06/2026", time:"11:00", batch:"Batch B",
    trainer:"Prof. Amol Desai", backupTrainer:"", platform:"Google Meet",
    meetingLink:"https://meet.google.com/abc-defg-hij", duration:60, status:"upcoming",
    attendees:0, maxParticipants:35, recurrence:"weekly", recurrenceEnd:"2026-07-03",
    recording:"", materials:[], feedbackSent:false, summary:"",
    reminderSent24h:false, reminderSent1h:false,
  },
  {
    id:3, title:"NEP 2020 Overview & FLN Goals", date:"01/06/2026", time:"09:00", batch:"Batch C",
    trainer:"Ms. Geeta Rao", backupTrainer:"Dr. Rekha Iyer", platform:"Zoom",
    meetingLink:"https://zoom.us/j/987654321", duration:120, status:"completed",
    attendees:18, maxParticipants:50, recurrence:"none", recurrenceEnd:"",
    recording:"https://recordings.spaceece.in/session3.mp4", materials:["NEP_Overview_Slides.pdf"],
    feedbackSent:true, summary:"Session covered NEP 2020 foundational goals and FLN framework. 18 attendees, high engagement.",
    reminderSent24h:true, reminderSent1h:true,
  },
  {
    id:4, title:"Child Development Milestones", date:"30/05/2026", time:"15:00", batch:"Batch B",
    trainer:"Dr. Vikram Shah", backupTrainer:"", platform:"Google Meet",
    meetingLink:"https://meet.google.com/xyz-uvwx-yz", duration:75, status:"completed",
    attendees:25, maxParticipants:35, recurrence:"bi-weekly", recurrenceEnd:"2026-06-30",
    recording:"https://recordings.spaceece.in/session4.mp4", materials:["Child_Dev_Notes.pdf","Activity_Sheet.docx"],
    feedbackSent:true, summary:"",
    reminderSent24h:true, reminderSent1h:true,
  },
  {
    id:5, title:"Digital Tools for Preschool", date:"05/06/2026", time:"14:00", batch:"Batch A",
    trainer:"Dr. Rekha Iyer", backupTrainer:"Ms. Geeta Rao", platform:"Zoom",
    meetingLink:"https://zoom.us/j/555444333", duration:60, status:"upcoming",
    attendees:0, maxParticipants:40, recurrence:"none", recurrenceEnd:"",
    recording:"", materials:[], feedbackSent:false, summary:"",
    reminderSent24h:false, reminderSent1h:false,
  },
];

const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    teacher: "Priya Sharma",
    teacherId: 1,
    course: "Pre-Primary Teacher Training",
    batch: "Batch A",
    trainer: "Dr. Rekha Iyer",
    title: "Lesson Plan for 3-4 yr olds",
    submitted: "29/05/2026",
    submittedDate: "2026-05-29",
    status: "pending",
    score: null,
    fileType: "pdf",
    feedback: "",
    annotations: [],
    rubric: [
      { criterion: "Content Accuracy",     maxScore: 25, score: null },
      { criterion: "Creativity",           maxScore: 25, score: null },
      { criterion: "Practical Applicability", maxScore: 25, score: null },
      { criterion: "Presentation",         maxScore: 25, score: null },
    ],
    reviewedBy: null,
    notified: false,
  },
  {
    id: 2,
    teacher: "Rahul Verma",
    teacherId: 2,
    course: "Montessori Teacher Training",
    batch: "Batch B",
    trainer: "Prof. Amol Desai",
    title: "Material Design Report",
    submitted: "28/05/2026",
    submittedDate: "2026-05-28",
    status: "reviewed",
    score: 88,
    fileType: "pdf",
    feedback: "Excellent work on material design. The report demonstrates strong understanding of Montessori principles.",
    annotations: [
      { id: 1, page: 1, x: 30, y: 40, text: "Great introduction!", color: "#10b981" },
      { id: 2, page: 1, x: 50, y: 65, text: "Add more examples here", color: "#f59e0b" },
    ],
    rubric: [
      { criterion: "Content Accuracy",     maxScore: 25, score: 23 },
      { criterion: "Creativity",           maxScore: 25, score: 22 },
      { criterion: "Practical Applicability", maxScore: 25, score: 21 },
      { criterion: "Presentation",         maxScore: 25, score: 22 },
    ],
    reviewedBy: "Prof. Amol Desai",
    notified: true,
  },
  {
    id: 3,
    teacher: "Meera Patel",
    teacherId: 4,
    course: "Pre-Primary Teacher Training",
    batch: "Batch A",
    trainer: "Dr. Rekha Iyer",
    title: "Activity Worksheet Set",
    submitted: "27/05/2026",
    submittedDate: "2026-05-27",
    status: "revision",
    score: null,
    fileType: "pdf",
    feedback: "Good effort but needs more age-appropriate activities. Please revise Module 2 section.",
    annotations: [],
    rubric: [
      { criterion: "Content Accuracy",     maxScore: 25, score: 15 },
      { criterion: "Creativity",           maxScore: 25, score: 18 },
      { criterion: "Practical Applicability", maxScore: 25, score: 12 },
      { criterion: "Presentation",         maxScore: 25, score: 16 },
    ],
    reviewedBy: "Dr. Rekha Iyer",
    notified: true,
  },
  {
    id: 4,
    teacher: "Suresh Kumar",
    teacherId: 5,
    course: "NEP 2020 & FLN",
    batch: "Batch C",
    trainer: "Ms. Geeta Rao",
    title: "FLN Implementation Plan",
    submitted: "26/05/2026",
    submittedDate: "2026-05-26",
    status: "approved",
    score: 92,
    fileType: "pdf",
    feedback: "Outstanding submission. Implementation plan is detailed and practical.",
    annotations: [],
    rubric: [
      { criterion: "Content Accuracy",     maxScore: 25, score: 24 },
      { criterion: "Creativity",           maxScore: 25, score: 23 },
      { criterion: "Practical Applicability", maxScore: 25, score: 23 },
      { criterion: "Presentation",         maxScore: 25, score: 22 },
    ],
    reviewedBy: "Ms. Geeta Rao",
    notified: true,
  },
  {
    id: 5,
    teacher: "Deepak Nair",
    teacherId: 7,
    course: "Leadership & Administration",
    batch: "Batch B",
    trainer: "Dr. Rekha Iyer",
    title: "School Vision Document",
    submitted: "25/05/2026",
    submittedDate: "2026-05-25",
    status: "pending",
    score: null,
    fileType: "pdf",
    feedback: "",
    annotations: [],
    rubric: [
      { criterion: "Content Accuracy",     maxScore: 25, score: null },
      { criterion: "Creativity",           maxScore: 25, score: null },
      { criterion: "Practical Applicability", maxScore: 25, score: null },
      { criterion: "Presentation",         maxScore: 25, score: null },
    ],
    reviewedBy: null,
    notified: false,
  },
  {
    id: 6,
    teacher: "Priya Sharma",
    teacherId: 1,
    course: "Pre-Primary Teacher Training",
    batch: "Batch A",
    trainer: "Dr. Rekha Iyer",
    title: "Assessment Tool Design",
    submitted: "24/05/2026",
    submittedDate: "2026-05-24",
    status: "approved",
    score: 95,
    fileType: "pdf",
    feedback: "Excellent assessment tool. Very well structured and age-appropriate.",
    annotations: [],
    rubric: [
      { criterion: "Content Accuracy",     maxScore: 25, score: 24 },
      { criterion: "Creativity",           maxScore: 25, score: 24 },
      { criterion: "Practical Applicability", maxScore: 25, score: 24 },
      { criterion: "Presentation",         maxScore: 25, score: 23 },
    ],
    reviewedBy: "Dr. Rekha Iyer",
    notified: true,
  },
];

const MONTHLY_ENROLLMENT = [
  { month:"Jun 25", val:18 },{ month:"Jul 25", val:24 },{ month:"Aug 25", val:31 },
  { month:"Sep 25", val:28 },{ month:"Oct 25", val:42 },{ month:"Nov 25", val:38 },
  { month:"Dec 25", val:22 },{ month:"Jan 26", val:45 },{ month:"Feb 26", val:52 },
  { month:"Mar 26", val:48 },{ month:"Apr 26", val:61 },{ month:"May 26", val:57 },
];

const MONTHLY_REVENUE = [
  { month:"Jun", val:82000 },{ month:"Jul", val:114000 },{ month:"Aug", val:148000 },
  { month:"Sep", val:133000 },{ month:"Oct", val:201000 },{ month:"Nov", val:181000 },
  { month:"Dec", val:105000 },{ month:"Jan", val:215000 },{ month:"Feb", val:248000 },
  { month:"Mar", val:229000 },{ month:"Apr", val:291000 },{ month:"May", val:272000 },
];

/* ============================================
   ADD THESE MOCK DATA SETS AFTER EXISTING DATA
============================================ */

const MOCK_CONTENT_ITEMS = [
  {
    id: 1,
    title: "Introduction to ECCE",
    type: "video",
    course: "Pre-Primary Teacher Training",
    module: "Module 1",
    lesson: "Lesson 1",
    format: "MP4",
    size: "84 MB",
    sizeBytes: 88080384,
    duration: "12 min",
    status: "published",
    ai: "Captions",
    updated: "02/06/2026",
    thumbnail: "",
    transcript: "Welcome to the Introduction to ECCE course. In this lesson we will cover the fundamentals of early childhood care and education...",
    prerequisite: null,
    releaseDate: "",
    dripWeek: 1,
    duplicate: false,
    uploadProgress: 100,
  },
  {
    id: 2,
    title: "Montessori Classroom Setup",
    type: "pdf",
    course: "Montessori Teacher Training",
    module: "Module 1",
    lesson: "Lesson 1",
    format: "PDF",
    size: "6 MB",
    sizeBytes: 6291456,
    duration: "—",
    status: "published",
    ai: "Summary",
    updated: "01/06/2026",
    thumbnail: "",
    transcript: "",
    prerequisite: null,
    releaseDate: "2026-06-01",
    dripWeek: 1,
    duplicate: false,
    uploadProgress: 100,
  },
  {
    id: 3,
    title: "Child Development Milestones",
    type: "slide",
    course: "Child Psychology & Development",
    module: "Module 2",
    lesson: "Lesson 1",
    format: "PPTX",
    size: "12 MB",
    sizeBytes: 12582912,
    duration: "—",
    status: "draft",
    ai: "Auto Tags",
    updated: "30/05/2026",
    thumbnail: "",
    transcript: "",
    prerequisite: 2,
    releaseDate: "",
    dripWeek: 2,
    duplicate: false,
    uploadProgress: 100,
  },
  {
    id: 4,
    title: "FLN Activity Demonstration",
    type: "video",
    course: "NEP 2020 Alignment & FLN",
    module: "Module 2",
    lesson: "Lesson 2",
    format: "MP4",
    size: "102 MB",
    sizeBytes: 106954752,
    duration: "18 min",
    status: "published",
    ai: "Transcript",
    updated: "29/05/2026",
    thumbnail: "",
    transcript: "In this demonstration we show how Foundational Literacy and Numeracy activities can be implemented in a classroom setting...",
    prerequisite: 3,
    releaseDate: "2026-06-05",
    dripWeek: 2,
    duplicate: false,
    uploadProgress: 100,
  },
  {
    id: 5,
    title: "Lesson Plan Template Pack",
    type: "document",
    course: "Curriculum Design & Lesson Planning",
    module: "Module 3",
    lesson: "Lesson 1",
    format: "DOCX",
    size: "2 MB",
    sizeBytes: 2097152,
    duration: "—",
    status: "draft",
    ai: "Translation",
    updated: "28/05/2026",
    thumbnail: "",
    transcript: "",
    prerequisite: null,
    releaseDate: "",
    dripWeek: 3,
    duplicate: false,
    uploadProgress: 100,
  },
  {
    id: 6,
    title: "Inclusive Classroom Toolkit",
    type: "pdf",
    course: "Special Education & Inclusive Ed",
    module: "Module 1",
    lesson: "Lesson 2",
    format: "PDF",
    size: "9 MB",
    sizeBytes: 9437184,
    duration: "—",
    status: "published",
    ai: "Summary",
    updated: "27/05/2026",
    thumbnail: "",
    transcript: "",
    prerequisite: null,
    releaseDate: "",
    dripWeek: 1,
    duplicate: true,
    uploadProgress: 100,
  },
  {
    id: 7,
    title: "Early Childhood Audio Guide",
    type: "audio",
    course: "Pre-Primary Teacher Training",
    module: "Module 1",
    lesson: "Lesson 2",
    format: "MP3",
    size: "18 MB",
    sizeBytes: 18874368,
    duration: "22 min",
    status: "published",
    ai: "Transcript",
    updated: "26/05/2026",
    thumbnail: "",
    transcript: "",
    prerequisite: 1,
    releaseDate: "",
    dripWeek: 1,
    duplicate: false,
    uploadProgress: 100,
  },
];

const MOCK_ASSESSMENTS = [
  { id:1, title:"ECCE Foundations Quiz",              course:"Pre-Primary Teacher Training", questions:20, attempts:96, avgScore:82, passMark:60, status:"published", dueDate:"15/06/2026" },
  { id:2, title:"Montessori Materials Assessment",    course:"Montessori Teacher Training",  questions:15, attempts:74, avgScore:79, passMark:65, status:"published", dueDate:"18/06/2026" },
  { id:3, title:"Child Psychology Module Test",       course:"Child Psychology & Development", questions:25, attempts:58, avgScore:85, passMark:60, status:"published", dueDate:"20/06/2026" },
  { id:4, title:"FLN Readiness Quiz",                 course:"NEP 2020 Alignment & FLN",     questions:10, attempts:31, avgScore:76, passMark:50, status:"draft",     dueDate:"25/06/2026" },
];

const MOCK_QUESTION_BANK = [
  { id:1, question:"What is the main purpose of formative assessment?",        type:"MCQ",         difficulty:"Easy",   category:"Assessment" },
  { id:2, question:"Explain Piaget's preoperational stage in early childhood", type:"Short Answer",difficulty:"Medium", category:"Psychology" },
  { id:3, question:"Match the Montessori material to its learning objective",   type:"Match",       difficulty:"Medium", category:"Montessori" },
  { id:4, question:"Which NEP 2020 outcome aligns with foundational literacy?", type:"MCQ",         difficulty:"Easy",   category:"Policy" },
  { id:5, question:"Design a weekly classroom routine for 4-year-olds",         type:"Long Answer", difficulty:"Hard",   category:"Planning" },
  { id:6, question:"Identify inclusive practices for mixed-ability classrooms", type:"Checkbox",    difficulty:"Medium", category:"Special Ed" },
];

const MOCK_CERTIFICATES = [
  { id:1, certificateId:"SPC-2026-001", learner:"Priya Sharma",  course:"Pre-Primary Teacher Training", template:"Gold Standard", issuedOn:"01/06/2026", qrStatus:"verified", status:"issued" },
  { id:2, certificateId:"SPC-2026-002", learner:"Rahul Verma",   course:"Montessori Teacher Training",  template:"Modern Blue",  issuedOn:"30/05/2026", qrStatus:"verified", status:"issued" },
  { id:3, certificateId:"SPC-2026-003", learner:"Meera Patel",   course:"Pre-Primary Teacher Training", template:"Gold Standard", issuedOn:"28/05/2026", qrStatus:"verified", status:"issued" },
  { id:4, certificateId:"SPC-2026-004", learner:"Suresh Kumar",  course:"NEP 2020 Alignment & FLN",    template:"Classic",      issuedOn:"—",          qrStatus:"queued",   status:"queued" },
];

const MOCK_FEEDBACKS = [
  { id:1, learner:"Asha Kulkarni",  course:"Pre-Primary Teacher Training", batch:"Batch A", trainer:"Dr. Rekha Iyer",  rating:5, trainerRating:5, tag:"Content Quality", suggestion:"Add more classroom demonstration videos in Module 2.", status:"pending",  date:"02/06/2026", anonymous:false, adminResponse:"" },
  { id:2, learner:"Neha Joshi",     course:"Montessori Teacher Training",  batch:"Batch B", trainer:"Prof. Amol Desai",rating:4, trainerRating:5, tag:"Platform UX",     suggestion:"Provide printable worksheets after each live session.", status:"approved", date:"01/06/2026", anonymous:false, adminResponse:"Thank you for the suggestion! We will add downloadable worksheets soon." },
  { id:3, learner:"Ritika Menon",   course:"Child Psychology & Development",batch:"Batch A",trainer:"Dr. Vikram Shah", rating:5, trainerRating:4, tag:"Schedule",        suggestion:"Some topics felt fast; slower pacing would help.", status:"pending",  date:"31/05/2026", anonymous:true,  adminResponse:"" },
  { id:4, learner:"Sneha Rao",      course:"NEP 2020 Alignment & FLN",     batch:"Batch C", trainer:"Ms. Geeta Rao",   rating:4, trainerRating:4, tag:"Trainer",         suggestion:"Need more practical examples tied to school classrooms.", status:"approved", date:"30/05/2026", anonymous:false, adminResponse:"" },
  { id:5, learner:"Farah Khan",     course:"Special Education & Inclusive Ed",batch:"Batch B",trainer:"Dr. Rekha Iyer",rating:5, trainerRating:5, tag:"Content Quality", suggestion:"The toolkit resources were very useful and well organised.", status:"approved", date:"29/05/2026", anonymous:false, adminResponse:"" },
  { id:6, learner:"Priya Mehta",    course:"Pre-Primary Teacher Training", batch:"Batch A", trainer:"Dr. Rekha Iyer",  rating:2, trainerRating:3, tag:"Price",           suggestion:"Course fee is too high compared to similar programs online.", status:"pending",  date:"28/05/2026", anonymous:true,  adminResponse:"" },
  { id:7, learner:"Amit Sharma",    course:"Montessori Teacher Training",  batch:"Batch B", trainer:"Prof. Amol Desai",rating:3, trainerRating:4, tag:"Platform UX",     suggestion:"Video player lags on mobile. Please optimise for low bandwidth.", status:"rejected", date:"27/05/2026", anonymous:false, adminResponse:"" },
  { id:8, learner:"Kavya Nair",     course:"Leadership & School Administration",batch:"Batch A",trainer:"Mr. Sunil Mehta",rating:5, trainerRating:5, tag:"Trainer",      suggestion:"Mr. Mehta is an exceptional trainer. Very inspiring sessions!", status:"approved", date:"26/05/2026", anonymous:false, adminResponse:"" },
  { id:9, learner:"Deepa Iyer",     course:"NEP 2020 Alignment & FLN",     batch:"Batch C", trainer:"Ms. Geeta Rao",   rating:1, trainerRating:2, tag:"Content Quality", suggestion:"Content is outdated and does not reflect current NEP guidelines.", status:"pending",  date:"25/05/2026", anonymous:true,  adminResponse:"" },
  { id:10,learner:"Rohit Verma",    course:"Child Psychology & Development",batch:"Batch A",trainer:"Dr. Vikram Shah", rating:4, trainerRating:5, tag:"Schedule",        suggestion:"Would prefer weekend batches instead of weekday sessions.", status:"approved", date:"24/05/2026", anonymous:false, adminResponse:"" },
];

const MOCK_CATEGORIES = [
  { id:1, name:"Foundation", sub:["Pre-Primary","ECCE"],      icon:"🏫", color:"#f59e0b", order:1, count:2 },
  { id:2, name:"Montessori", sub:["Materials","Method"],      icon:"🎨", color:"#10b981", order:2, count:1 },
  { id:3, name:"Psychology", sub:["Child Dev","Behavior"],    icon:"🧠", color:"#8b5cf6", order:3, count:1 },
  { id:4, name:"Policy",     sub:["NEP 2020","FLN"],          icon:"📜", color:"#3b82f6", order:4, count:1 },
  { id:5, name:"Planning",   sub:["Curriculum","Lesson"],     icon:"📋", color:"#06b6d4", order:5, count:1 },
  { id:6, name:"Leadership", sub:["Admin","Management"],      icon:"🏆", color:"#ef4444", order:6, count:1 },
  { id:7, name:"Special Ed", sub:["Inclusive","Support"],     icon:"♿", color:"#ec4899", order:7, count:1 },
  { id:8, name:"Digital",    sub:["EdTech","Tools"],          icon:"💻", color:"#14b8a6", order:8, count:1 },
];

const MOCK_NOTIFICATION_TEMPLATES = [
  { id:1,  type:"Welcome Email",       trigger:"On registration approval",             channel:["email"],              subject:"Welcome to SpacECE! 🎉",                    body:"Dear {{name}}, welcome to SpacECE Teacher Training Portal. Your registration has been approved. Log in to begin your journey.",   active:true,  lastSent:"02/06/2026", sentCount:48  },
  { id:2,  type:"Course Enrolled",     trigger:"On enrollment + payment confirmation", channel:["email","sms"],        subject:"You're enrolled in {{course}}!",             body:"Dear {{name}}, you have been successfully enrolled in {{course}}. Your batch starts on {{startDate}}. Access the course from your dashboard.", active:true,  lastSent:"01/06/2026", sentCount:124 },
  { id:3,  type:"Session Reminder",    trigger:"24 hrs and 1 hr before live session",  channel:["email","in-app","whatsapp"], subject:"Live Session Tomorrow: {{sessionTitle}}", body:"Don't forget! Your live session '{{sessionTitle}}' is scheduled for {{sessionDate}} at {{sessionTime}}. Join via {{platform}}.",    active:true,  lastSent:"01/06/2026", sentCount:89  },
  { id:4,  type:"Assignment Due",      trigger:"72 hrs, 24 hrs, and on deadline",      channel:["email","sms","in-app"], subject:"Assignment Due: {{assignmentTitle}}",      body:"Dear {{name}}, your assignment '{{assignmentTitle}}' is due on {{dueDate}}. Please submit on time to avoid penalties.",               active:true,  lastSent:"30/05/2026", sentCount:67  },
  { id:5,  type:"Quiz Available",      trigger:"When new quiz published",              channel:["in-app","email"],     subject:"New Quiz Available: {{quizTitle}}",         body:"A new quiz '{{quizTitle}}' is now available in your course {{course}}. Complete it before {{dueDate}}.",                             active:true,  lastSent:"29/05/2026", sentCount:52  },
  { id:6,  type:"Feedback Received",   trigger:"When trainer reviews assignment",      channel:["email","in-app"],     subject:"Your Assignment Has Been Reviewed",         body:"Dear {{name}}, your assignment '{{assignmentTitle}}' has been reviewed. Log in to see your score and feedback.",                      active:true,  lastSent:"31/05/2026", sentCount:38  },
  { id:7,  type:"Certificate Issued",  trigger:"Certificate generated",               channel:["email","in-app","whatsapp"], subject:"Your Certificate is Ready! 🎓",      body:"Congratulations {{name}}! Your certificate for {{course}} has been issued. Download it here: {{downloadLink}}",                     active:true,  lastSent:"01/06/2026", sentCount:29  },
  { id:8,  type:"Batch Reminder",      trigger:"Weekly — every Monday 9 AM",          channel:["email","in-app"],     subject:"Weekly Digest: {{batchName}}",              body:"Hi {{name}}, here's your weekly summary for {{batchName}}: {{upcomingSessions}} sessions this week, {{pendingAssignments}} assignments pending.", active:true, lastSent:"27/05/2026", sentCount:156 },
  { id:9,  type:"System Updates",      trigger:"Manual trigger by Admin",             channel:["email","in-app"],     subject:"Important Update from SpacECE",            body:"Dear User, we have an important update regarding {{updateTitle}}. {{updateBody}}",                                                      active:false, lastSent:"20/05/2026", sentCount:210 },
];
 
const MOCK_NOTIFICATION_LOG = [
  { id:1,  type:"Session Reminder",   recipient:"Priya Sharma",  channel:"email",   subject:"Live Session Tomorrow",         sentAt:"01/06/2026 09:00", status:"delivered", opened:true,  clicked:true  },
  { id:2,  type:"Session Reminder",   recipient:"Rahul Verma",   channel:"sms",     subject:"Session at 11 AM tomorrow",     sentAt:"01/06/2026 09:00", status:"delivered", opened:false, clicked:false },
  { id:3,  type:"Assignment Due",     recipient:"Meera Patel",   channel:"email",   subject:"Assignment Due in 24 hours",     sentAt:"30/05/2026 10:00", status:"delivered", opened:true,  clicked:false },
  { id:4,  type:"Welcome Email",      recipient:"Anita Joshi",   channel:"email",   subject:"Welcome to SpacECE!",           sentAt:"28/05/2026 14:00", status:"delivered", opened:true,  clicked:true  },
  { id:5,  type:"Certificate Issued", recipient:"Suresh Kumar",  channel:"whatsapp",subject:"Certificate Ready 🎓",          sentAt:"01/06/2026 11:00", status:"delivered", opened:true,  clicked:true  },
  { id:6,  type:"Batch Reminder",     recipient:"Deepak Nair",   channel:"in-app",  subject:"Weekly Digest: Batch B",        sentAt:"27/05/2026 09:00", status:"delivered", opened:false, clicked:false },
  { id:7,  type:"Feedback Received",  recipient:"Priya Sharma",  channel:"email",   subject:"Assignment Reviewed",           sentAt:"31/05/2026 15:00", status:"bounced",   opened:false, clicked:false },
  { id:8,  type:"Quiz Available",     recipient:"Meera Patel",   channel:"in-app",  subject:"New Quiz: ECCE Foundations",    sentAt:"29/05/2026 10:00", status:"delivered", opened:true,  clicked:false },
];
 
const MOCK_CHANNEL_CONFIG = {
  email:    { provider:"SendGrid", apiKey:"SG.***", fromName:"SpacECE Admin", fromEmail:"admin@spaceece.in", connected:true  },
  sms:      { provider:"MSG91",    apiKey:"MSG91***", senderId:"SPCEDU",       connected:true  },
  inapp:    { provider:"Built-in", connected:true  },
  whatsapp: { provider:"WhatsApp Business API", token:"WABA***", phoneNumberId:"1234567890", connected:false },
};


/* ═══════════════════════════════════════════
   SECTION COMPONENTS
═══════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   ENHANCED OVERVIEW TAB - Full Requirements
═══════════════════════════════════════════ */
function OverviewTab({ teachers, courses, batches, sessions }) {
  const [activePeriod, setActivePeriod] = useState("12m");
  const [activities, setActivities] = useState([
    { id:1, action:"Teacher Approved", target:"Priya Sharma", time:"2 mins ago", icon:"✅", type:"success" },
    { id:2, action:"Course Published", target:"NEP 2020 & FLN", time:"15 mins ago", icon:"📚", type:"info" },
    { id:3, action:"New Registration", target:"Anita Joshi", time:"28 mins ago", icon:"👩‍🏫", type:"warning" },
    { id:4, action:"Assignment Submitted", target:"Rahul Verma", time:"1 hr ago", icon:"📝", type:"info" },
    { id:5, action:"Batch Created", target:"Batch C — Jun 2026", time:"2 hrs ago", icon:"🗂️", type:"success" },
    { id:6, action:"Certificate Issued", target:"Meera Patel", time:"3 hrs ago", icon:"🏅", type:"success" },
    { id:7, action:"Session Completed", target:"Classroom Management", time:"4 hrs ago", icon:"🎥", type:"info" },
    { id:8, action:"Revenue Received", target:"₹45,000", time:"5 hrs ago", icon:"💰", type:"success" },
    { id:9, action:"Feedback Received", target:"Neha Joshi", time:"6 hrs ago", icon:"💬", type:"warning" },
    { id:10, action:"Trainer Added", target:"Dr. Vikram Shah", time:"8 hrs ago", icon:"🎓", type:"info" },
  ]);

  // Calculate metrics
  const approved = teachers.filter(t => t.status === "approved");
  const pending = teachers.filter(t => t.status === "pending");
  const totalRevenue = teachers.reduce((a, t) => a + t.revenue, 0);
  
  // MTD Revenue calculation (simplified - assume May 2026)
  const mtdRevenue = courses.reduce((a, c) => c.status === "published" ? a + (c.revenue / 12 * 5) : a, 0);
  // YTD Revenue (Jan-May 2026)
  const ytdRevenue = courses.reduce((a, c) => c.status === "published" ? a + (c.revenue / 12 * 5) : a, 0);
  
  const avgAttendance = approved.length ? Math.round(approved.reduce((a, t) => a + t.attendance, 0) / approved.length) : 0;
  const completionRate = courses.filter(c => c.status === "published").length
    ? Math.round(courses.filter(c => c.status === "published").reduce((a, c) => a + c.completion, 0) / courses.filter(c => c.status === "published").length)
    : 0;
  
  // Teachers MoM growth (simulated - compare this month vs last month)
  const teacherGrowth = 12; // +12% vs last month
  const learnerGrowth = 8; // +8% vs last month
  const revenueGrowth = 23; // +23% vs last month

  // AI Insights (simulated data)
  const aiAnomaly = {
    enrollmentDrop: false,
    completionDrop: true, // Flag completion rate drop in Batch B
    anomalyDetails: "Completion rate dropped 15% in Montessori Teacher Training batch",
    severity: "medium"
  };
  
  const revenueForecast = {
    day30: 285000,
    day60: 320000,
    day90: 365000,
    confidence: 87
  };
  
  const churnRisks = teachers.filter(t => t.status === "approved" && t.attendance < 60);
  
  // Flagged posts (simulated)
  const flaggedPosts = [
    { id:1, title:" inappropriate content in discussion", author:"User_Anonymous", reported:"2 hrs ago", severity:"high" },
    { id:2, title:"Spam/Advertising detected", author:"External_Bot", reported:"5 hrs ago", severity:"medium" },
  ];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={S.pageTitle}>Good morning, Admin 👋</h1>
        <p style={S.pageSub}>
          Here's your SpacECE platform overview for today — {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* ═══════════════════════════════════
          A1.1 KPI CARDS (ENHANCED)
      ═══════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 16, marginBottom: 24 }}>
        {/* Total Registered Teachers + MoM Growth */}
        <StatCard 
          icon="👩‍🏫" 
          label="Total Teachers" 
          val={teachers.length} 
          sub={`+${teacherGrowth}% from last month`} 
          color="#f59e0b" 
          bg="#fef3c7"
          trend={teacherGrowth}
        />
        
        {/* Active Learners (30-day) */}
        <StatCard 
          icon="✅" 
          label="Active Learners" 
          val={approved.length} 
          sub={`+${learnerGrowth}% vs last 30 days`} 
          color="#10b981" 
          bg="#d1fae5"
          trend={learnerGrowth}
        />
        
        {/* Total Courses - with breakdown */}
        <StatCard 
          icon="📚" 
          label="Courses Published" 
          val={courses.filter(c => c.status === "published").length} 
          sub={`${courses.filter(c => c.status === "draft").length} drafts · ${courses.filter(c => c.status === "archived").length} archived`} 
          color="#3b82f6" 
          bg="#dbeafe"
        />
        
        {/* Revenue - MTD/YTD/All */}
        <StatCard 
          icon="💰" 
          label="Total Revenue" 
          val={`₹${(totalRevenue / 100000).toFixed(1)}L`} 
          sub={`MTD: ₹${(mtdRevenue / 1000).toFixed(0)}k · YTD: ₹${(ytdRevenue / 100000).toFixed(1)}L`} 
          color="#8b5cf6" 
          bg="#ede9fe"
          trend={revenueGrowth}
        />
        
        {/* Completion Rate */}
        <StatCard 
          icon="🎓" 
          label="Completion Rate" 
          val={`${completionRate}%`} 
          sub="Avg across courses" 
          color="#06b6d4" 
          bg="#cffafe"
        />
        
        {/* Pending Actions */}
        <StatCard 
          icon="⏳" 
          label="Pending Actions" 
          val={pending.length + 3} 
          sub={`${pending.length} approvals · 3 reviews`} 
          color="#ef4444" 
          bg="#fee2e2"
        />
      </div>

      {/* ═══════════════════════════════════
          A1.2 CHARTS & WIDGETS
      ═══════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Enrollment trend */}
        <SectionCard title="📈 Enrollment Trend (12 Months)" action={
          <div style={{ display: "flex", gap: 6 }}>
            {["3m","6m","12m"].map(p => (
              <button key={p} onClick={() => setActivePeriod(p)}
                style={{ padding: "4px 10px", borderRadius: 6, border: "1.5px solid", 
                  borderColor: activePeriod === p ? "#f59e0b" : "#e5e7eb",
                  background: activePeriod === p ? "#fef3c7" : "white",
                  color: activePeriod === p ? "#92400e" : "#9ca3af",
                  fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {p}
              </button>
            ))}
          </div>
        }>
          <BarChart data={MONTHLY_ENROLLMENT} color="#f59e0b" height={90} />
        </SectionCard>

        {/* Revenue bar */}
        <SectionCard title="💰 Monthly Revenue (₹)">
          <BarChart data={MONTHLY_REVENUE} color="#10b981" height={90} formatVal={v => `${(v / 1000).toFixed(0)}k`} />
        </SectionCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Top courses */}
        <SectionCard title="🏆 Top Courses by Completion">
          {courses.filter(c => c.status === "published").sort((a, b) => b.completion - a.completion).slice(0, 5).map((c, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{c.title.split("(")[0].trim()}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: c.completion >= 80 ? "#10b981" : c.completion >= 60 ? "#f59e0b" : "#ef4444" }}>
                  {c.completion}%
                </span>
              </div>
              <div style={{ height: 6, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${c.completion}%`, borderRadius: 4,
                  background: c.completion >= 80 ? "#10b981" : c.completion >= 60 ? "#f59e0b" : "#ef4444" }} />
              </div>
            </div>
          ))}
        </SectionCard>

        {/* Batch capacity heat map */}
        <SectionCard title="🗂️ Batch Capacity Utilisation">
          {batches.map((b, i) => {
            const pct = Math.round((b.enrolled / b.capacity) * 100);
            const heatColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981";
            return (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{b.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: heatColor }}>{b.enrolled}/{b.capacity} ({pct}%)</span>
                </div>
                <div style={{ height: 6, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 4, background: heatColor }} />
                </div>
                {/* Heat indicator dots */}
                <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
                  {[...Array(5)].map((_, j) => (
                    <div key={j} style={{ 
                      width: 8, height: 8, borderRadius: "50%", 
                      background: j < Math.ceil(pct / 20) ? heatColor : "#e5e7eb" 
                    }} />
                  ))}
                </div>
              </div>
            );
          })}
        </SectionCard>
      </div>

      {/* Recent Activities Feed */}
      <SectionCard title="📋 Recent Activities Feed" action={
        <span style={{ fontSize: 11, color: "#9ca3af" }}>Last 20 actions</span>
      }>
        <div style={{ maxHeight: 280, overflowY: "auto" }}>
          {activities.map((a) => (
            <div key={a.id} style={{ 
              display: "flex", alignItems: "center", gap: 10, 
              padding: "10px 0", borderBottom: "1px solid #f3f4f6" 
            }}>
              <div style={{ 
                width: 32, height: 32, borderRadius: 8, 
                background: a.type === "success" ? "#d1fae5" : a.type === "warning" ? "#fef3c7" : "#dbeafe",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 
              }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1c1917" }}>{a.action}</div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>{a.target}</div>
              </div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>{a.time}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Upcoming sessions */}
        <SectionCard title="📅 Upcoming Sessions (7 Days)">
          {sessions.filter(s => s.status === "upcoming").map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1917" }}>{s.title}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{s.date} · {s.time} · {s.trainer}</div>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </SectionCard>

        {/* Flagged Forum Posts */}
        <SectionCard title="🚨 Forum Posts Requiring Moderation">
          {flaggedPosts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {flaggedPosts.map((post) => (
                <div key={post.id} style={{ 
                  padding: 12, borderRadius: 10, border: "1px solid",
                  borderColor: post.severity === "high" ? "#fca5a5" : "#fde68a",
                  background: post.severity === "high" ? "#fef2f2" : "#fffbeb"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1c1917" }}>Post #{post.id}</span>
                                        <span style={{
                      padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700,
                      background: post.severity === "high" ? "#fee2e2" : "#fef3c7",
                      color: post.severity === "high" ? "#dc2626" : "#d97706"
                    }}>
                      {post.severity.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                    {post.title}
                  </div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>
                    By {post.author} · Reported {post.reported}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button style={{ ...S.tblBtn, background: "#fee2e2", color: "#991b1b" }}>Remove</button>
                    <button style={{ ...S.tblBtn, background: "#d1fae5", color: "#065f46" }}>Keep</button>
                    <button style={{ ...S.tblBtn }}>Warn User</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 20, color: "#9ca3af" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>No flagged posts</div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ═══════════════════════════════════
          A1.3 AI DASHBOARD INSIGHTS
      ═══════════════════════════════════ */}
      <SectionCard title="🤖 AI Dashboard Insights">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          
          {/* AI Anomaly Detection */}
          <div style={{ 
            padding: 16, borderRadius: 14, border: "1px solid",
            borderColor: aiAnomaly.completionDrop ? "#fca5a5" : "#86efac",
            background: aiAnomaly.completionDrop ? "#fef2f2" : "#ecfdf5"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>🔍</span>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1c1917" }}>AI Anomaly Detection</div>
              <StatusBadge status={aiAnomaly.severity === "high" ? "flagged" : "pending"} />
            </div>
            {aiAnomaly.completionDrop ? (
              <div style={{ fontSize: 12, color: "#991b1b", lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700 }}>⚠️ Alert: Unusual Activity Detected</div>
                <div style={{ marginTop: 4 }}>{aiAnomaly.anomalyDetails}</div>
                <div style={{ fontSize: 11, color: "#dc2626", marginTop: 6 }}>
                  Action: Review batch content and engagement metrics
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#065f46" }}>
                ✅ No anomalies detected. All metrics within normal range.
              </div>
            )}
          </div>

          {/* Revenue Forecast */}
          <div style={{ 
            padding: 16, borderRadius: 14, border: "1px solid #a78bfa",
            background: "#f5f3ff"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>📊</span>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1c1917" }}>Revenue Forecast (ML)</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div style={{ textAlign: "center", padding: 8, background: "white", borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>30 Days</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1c1917" }}>₹{(revenueForecast.day30 / 1000).toFixed(0)}k</div>
              </div>
              <div style={{ textAlign: "center", padding: 8, background: "white", borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>60 Days</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1c1917" }}>₹{(revenueForecast.day60 / 1000).toFixed(0)}k</div>
              </div>
              <div style={{ textAlign: "center", padding: 8, background: "white", borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>90 Days</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1c1917" }}>₹{(revenueForecast.day90 / 1000).toFixed(0)}k</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#8b5cf6", fontWeight: 600 }}>
              🎯 Model Confidence: {revenueForecast.confidence}%
            </div>
          </div>

          {/* Churn Risk Alert */}
          <div style={{ 
            padding: 16, borderRadius: 14, border: "1px solid",
            borderColor: churnRisks.length > 0 ? "#fca5a5" : "#86efac",
            background: churnRisks.length > 0 ? "#fef2f2" : "#ecfdf5"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1c1917" }}>Churn Risk Alert</div>
            </div>
            {churnRisks.length > 0 ? (
              <div>
                <div style={{ fontSize: 11, color: "#991b1b", fontWeight: 700, marginBottom: 6 }}>
                  {churnRisks.length} teacher(s) at risk of dropping out
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {churnRisks.slice(0, 3).map(t => (
                    <div key={t.id} style={{ 
                      display: "flex", justifyContent: "space-between", 
                      fontSize: 11, padding: "4px 8px", background: "white", borderRadius: 6 
                    }}>
                      <span style={{ color: "#374151" }}>{t.name}</span>
                      <span style={{ color: "#dc2626", fontWeight: 600 }}>{t.attendance}%</span>
                    </div>
                  ))}
                </div>
                <button style={{ ...S.primaryBtn, marginTop: 8, width: "100%", fontSize: 11, padding: "8px" }}>
                  📧 Send Re-engagement Emails
                </button>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#065f46" }}>
                ✅ No churn risks detected. All teachers are engaged!
              </div>
            )}
          </div>

        </div>
      </SectionCard>

      {/* Attendance Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <SectionCard title="📊 Teacher Attendance Overview">
          {teachers.filter(t => t.status === "approved").slice(0, 5).map((t, i) => (
            <AttendanceBar key={i} val={t.attendance} name={t.name} />
          ))}
        </SectionCard>
      </div>

    </div>
  );
}

/* ── A2: Teacher Management ── */

/* ── Helper: CSV Export ── */
function exportCSV(data, filename = "teachers.csv") {
  const headers = ["Name", "Email", "Phone", "Subject", "Course", "Batch", "Status", "Qualification", "Experience", "Joined", "Attendance"];
  const rows = data.map(t => [
    t.name, t.email, t.phone, t.subject, t.course || "—", t.batch || "—",
    t.status, t.qualification || "—", t.experience || "—", t.joined, t.attendance + "%"
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ── Reject Modal ── */
function RejectModal({ teacher, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const reasons = ["Incomplete documents", "Invalid qualification", "Duplicate account", "Suspicious activity", "Other"];
  return (
    <Modal title={`✕ Reject — ${teacher.name}`} onClose={onClose}>
      <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:10, padding:"12px 14px", marginBottom:16, fontSize:12, color:"#991b1b" }}>
        ⚠️ Teacher will be notified via email with the rejection reason.
      </div>
      <label style={S.label}>Reason *</label>
      <select style={{ ...S.input, marginBottom:20 }} value={reason} onChange={e=>setReason(e.target.value)}>
        <option value="">Select a reason...</option>
        {reasons.map(r=><option key={r}>{r}</option>)}
      </select>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={()=>{ if(!reason) return; onConfirm(reason); }} style={{ ...S.btnRed, flex:1, padding:"10px", fontSize:13 }}>✕ Reject & Notify</button>
        <button onClick={onClose} style={{ ...S.tblBtn, flex:1, padding:"10px", fontSize:13 }}>Cancel</button>
      </div>
    </Modal>
  );
}

/* ── Block Modal ── */
function BlockModal({ teacher, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const reasons = ["Policy violation", "Misconduct", "Fraudulent activity", "Repeated absence", "Other"];
  return (
    <Modal title={`🚫 Block — ${teacher.name}`} onClose={onClose}>
      <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:10, padding:"12px 14px", marginBottom:16, fontSize:12, color:"#991b1b" }}>
        ⚠️ Blocking suspends access. Teacher can be unblocked later.
      </div>
      <label style={S.label}>Reason *</label>
      <select style={{ ...S.input, marginBottom:20 }} value={reason} onChange={e=>setReason(e.target.value)}>
        <option value="">Select a reason...</option>
        {reasons.map(r=><option key={r}>{r}</option>)}
      </select>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={()=>{ if(!reason) return; onConfirm(reason); }} style={{ ...S.btnRed, flex:1, padding:"10px", fontSize:13 }}>🚫 Block Access</button>
        <button onClick={onClose} style={{ ...S.tblBtn, flex:1, padding:"10px", fontSize:13 }}>Cancel</button>
      </div>
    </Modal>
  );
}

/* ── Direct Message Modal ── */
function DirectMessageModal({ teacher, onClose, setToast }) {
  const [msg, setMsg] = useState("");
  const [channel, setChannel] = useState("in-app");
  const send = () => {
    if (!msg.trim()) { setToast({ msg:"Message cannot be empty.", type:"error" }); return; }
    setToast({ msg:`Message sent to ${teacher.name} via ${channel}!`, type:"success" });
    onClose();
  };
  return (
    <Modal title={`💬 Message — ${teacher.name}`} onClose={onClose}>
      <div style={{ marginBottom:12 }}>
        <label style={S.label}>Channel</label>
        <div style={{ display:"flex", gap:8 }}>
          {["in-app","email","sms"].map(c=>(
            <button key={c} onClick={()=>setChannel(c)}
              style={{ flex:1, padding:"8px", borderRadius:8, border:`1.5px solid ${channel===c?"#f59e0b":"#e5e7eb"}`, background:channel===c?"#fef3c7":"white", color:channel===c?"#92400e":"#6b7280", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              {c==="in-app"?"📱 In-App":c==="email"?"📧 Email":"💬 SMS"}
            </button>
          ))}
        </div>
      </div>
      <label style={S.label}>To</label>
      <input style={{ ...S.input, marginBottom:12, background:"#f3f4f6", color:"#6b7280" }} value={`${teacher.name} (${teacher.email})`} readOnly/>
      <label style={S.label}>Message *</label>
      <textarea style={{ ...S.input, height:120, resize:"none", marginBottom:20 }} value={msg} onChange={e=>setMsg(e.target.value)} placeholder={`Write a message to ${teacher.name.split(" ")[0]}...`}/>
      <button onClick={send} style={{ ...S.primaryBtn, width:"100%" }}>📤 Send Message</button>
    </Modal>
  );
}

/* ── Edit Courses Modal ── */
function EditCoursesModal({ teacher, onSave, onClose }) {
  const ALL_COURSES = [
    "Pre-Primary Teacher Training (PPT)",
    "Montessori Teacher Training",
    "Child Psychology & Development",
    "NEP 2020 Alignment & FLN",
    "Curriculum Design & Lesson Planning",
    "Leadership & School Administration",
    "Special Education & Inclusive Ed",
    "Digital Literacy for Modern Teachers",
  ];
  const [selected, setSelected] = useState(teacher.course ? [teacher.course] : []);
  const toggle = c => setSelected(prev=>prev.includes(c)?prev.filter(x=>x!==c):[...prev,c]);
  return (
    <Modal title={`📚 Edit Courses — ${teacher.name}`} onClose={onClose}>
      <div style={{ fontSize:12, color:"#6b7280", marginBottom:14 }}>Select courses to assign or remove.</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
        {ALL_COURSES.map(c=>(
          <div key={c} onClick={()=>toggle(c)}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, cursor:"pointer", border:`1.5px solid ${selected.includes(c)?"#f59e0b":"#e5e7eb"}`, background:selected.includes(c)?"#fef3c7":"#f9fafb" }}>
            <div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${selected.includes(c)?"#f59e0b":"#d1d5db"}`, background:selected.includes(c)?"#f59e0b":"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"white", flexShrink:0 }}>
              {selected.includes(c)?"✓":""}
            </div>
            <span style={{ fontSize:13, fontWeight:selected.includes(c)?700:500, color:selected.includes(c)?"#92400e":"#374151" }}>{c}</span>
          </div>
        ))}
      </div>
      <button onClick={()=>onSave(selected)} style={{ ...S.primaryBtn, width:"100%" }}>
        Save Assignments ({selected.length} selected)
      </button>
    </Modal>
  );
}

/* ── Progress Report Modal ── */
function ProgressReportModal({ teacher, onClose }) {
  const modules = [
    { name:"Module 1 – Foundations",       done:true,  score:88, sessions:4 },
    { name:"Module 2 – Classroom Methods", done:true,  score:76, sessions:3 },
    { name:"Module 3 – Assessment",        done:false, score:null, sessions:1 },
    { name:"Module 4 – Practicum",         done:false, score:null, sessions:0 },
  ];
  const completed = modules.filter(m=>m.done).length;
  const avgScore = Math.round(modules.filter(m=>m.score).reduce((a,m)=>a+m.score,0)/completed);
  return (
    <Modal title={`📊 Progress Report — ${teacher.name}`} onClose={onClose}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:18 }}>
        {[
          { icon:"📚", label:"Modules Done", val:`${completed}/${modules.length}` },
          { icon:"📊", label:"Attendance",   val:`${teacher.attendance}%` },
          { icon:"🎯", label:"Avg Score",    val:`${avgScore}%` },
        ].map((s,i)=>(
          <div key={i} style={{ background:"#f9fafb", borderRadius:10, padding:"10px 12px", textAlign:"center", border:"1px solid #f1f5f9" }}>
            <div style={{ fontSize:18 }}>{s.icon}</div>
            <div style={{ fontSize:16, fontWeight:800, color:"#1c1917" }}>{s.val}</div>
            <div style={{ fontSize:10, color:"#9ca3af" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:13, fontWeight:700, color:"#374151", marginBottom:10 }}>Module Breakdown</div>
      {modules.map((m,i)=>(
        <div key={i} style={{ marginBottom:10, padding:"10px 14px", background:m.done?"#ecfdf5":"#f9fafb", borderRadius:10, border:`1px solid ${m.done?"#86efac":"#f1f5f9"}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:m.done?6:0 }}>
            <span style={{ fontSize:13, fontWeight:700, color:"#1c1917" }}>{m.name}</span>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {m.score && <span style={{ fontSize:12, fontWeight:700, color:"#10b981" }}>{m.score}%</span>}
              <span style={{ fontSize:10, color:"#9ca3af" }}>{m.sessions} sessions</span>
              <span>{m.done?"✅":"⏳"}</span>
            </div>
          </div>
          {m.done && (
            <div style={{ height:5, background:"#d1fae5", borderRadius:4, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${m.score}%`, background:"#10b981", borderRadius:4 }}/>
            </div>
          )}
        </div>
      ))}
      <div style={{ fontSize:13, fontWeight:700, color:"#374151", marginTop:8, marginBottom:6 }}>Attendance</div>
      <AttendanceBar val={teacher.attendance} name={teacher.name}/>
    </Modal>
  );
}

/* ── Issue Certificate Modal ── */
function IssueCertificateModal({ teacher, onClose, setToast }) {
  const [template, setTemplate] = useState("Gold Standard");
  const [course, setCourse] = useState(teacher.course||"");
  const templates = ["Gold Standard","Modern Blue","Classic"];
  const issue = () => {
    if(!course){ setToast({ msg:"Select a course first.", type:"error" }); return; }
    setToast({ msg:`Certificate issued to ${teacher.name}!`, type:"success" });
    onClose();
  };
  return (
    <Modal title={`🏅 Issue Certificate — ${teacher.name}`} onClose={onClose}>
      <div style={{ background:"#fef3c7", border:"1px solid #fbbf24", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#92400e" }}>
        🛈 Manual override. Use for special cases only.
      </div>
      <label style={S.label}>Course *</label>
      <input style={{ ...S.input, marginBottom:12 }} value={course} onChange={e=>setCourse(e.target.value)} placeholder="Course name"/>
      <label style={S.label}>Template</label>
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {templates.map(t=>(
          <button key={t} onClick={()=>setTemplate(t)}
            style={{ flex:1, padding:"8px", borderRadius:8, border:`1.5px solid ${template===t?"#f59e0b":"#e5e7eb"}`, background:template===t?"#fef3c7":"white", color:template===t?"#92400e":"#6b7280", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            {t}
          </button>
        ))}
      </div>
      <button onClick={issue} style={{ ...S.primaryBtn, width:"100%" }}>🏅 Issue Certificate</button>
    </Modal>
  );
}

/* ── Reset Password Modal ── */
function ResetPasswordModal({ teacher, onClose, setToast }) {
  const [sent, setSent] = useState(false);
  const sendReset = () => {
    setSent(true);
    setTimeout(()=>{ setToast({ msg:`OTP sent to ${teacher.email}!`, type:"success" }); onClose(); }, 1200);
  };
  return (
    <Modal title={`🔒 Reset Password — ${teacher.name}`} onClose={onClose}>
      <div style={{ background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:10, padding:"12px 14px", marginBottom:16, fontSize:12, color:"#0369a1" }}>
        An OTP will be sent to the teacher's registered email and phone.
      </div>
      <div style={{ background:"#f9fafb", borderRadius:10, padding:"12px 14px", marginBottom:20 }}>
        <div style={{ fontSize:11, color:"#9ca3af" }}>Sending OTP to</div>
        <div style={{ fontSize:13, fontWeight:700, color:"#1c1917", marginTop:2 }}>📧 {teacher.email}</div>
        <div style={{ fontSize:13, fontWeight:700, color:"#1c1917", marginTop:4 }}>📱 {teacher.phone}</div>
      </div>
      <button onClick={sendReset} disabled={sent} style={{ ...S.primaryBtn, width:"100%", opacity:sent?0.7:1 }}>
        {sent?"⏳ Sending OTP...":"🔑 Send Password Reset OTP"}
      </button>
    </Modal>
  );
}

/* ── Bulk Notify Modal ── */
function BulkNotifyModal({ count, onClose, setToast }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const send = () => {
    if(!subject||!body){ setToast({ msg:"Fill subject and message.", type:"error" }); return; }
    setToast({ msg:`Notification sent to ${count} teachers!`, type:"success" });
    onClose();
  };
  return (
    <Modal title={`🔔 Bulk Notify (${count} teachers)`} onClose={onClose}>
      <label style={S.label}>Subject *</label>
      <input style={{ ...S.input, marginBottom:12 }} value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Notification subject"/>
      <label style={S.label}>Message *</label>
      <textarea style={{ ...S.input, height:100, resize:"none", marginBottom:20 }} value={body} onChange={e=>setBody(e.target.value)} placeholder="Type your message..."/>
      <button onClick={send} style={{ ...S.primaryBtn, width:"100%" }}>📤 Send to All Selected</button>
    </Modal>
  );
}

/* ── Teacher Full Profile View ── */
function TeacherProfileView({ teacher, onBack, onUpdate, setToast }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [showReject,   setShowReject]   = useState(false);
  const [showBlock,    setShowBlock]    = useState(false);
  const [showMsg,      setShowMsg]      = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showCourses,  setShowCourses]  = useState(false);
  const [showCert,     setShowCert]     = useState(false);
  const [showReset,    setShowReset]    = useState(false);

  const isPending  = teacher.status === "pending";
  const isApproved = teacher.status === "approved";
  const isBlocked  = teacher.status === "rejected";

  const quickActions = [
    { icon:"📊", label:"Progress Report",   onClick:()=>setShowProgress(true), color:"#3b82f6", bg:"#dbeafe" },
    { icon:"💬", label:"Send Message",       onClick:()=>setShowMsg(true),      color:"#8b5cf6", bg:"#ede9fe" },
    { icon:"📚", label:"Edit Courses",       onClick:()=>setShowCourses(true),  color:"#f59e0b", bg:"#fef3c7" },
    { icon:"🏅", label:"Issue Certificate",  onClick:()=>setShowCert(true),     color:"#10b981", bg:"#d1fae5" },
    { icon:"🔒", label:"Reset Password",     onClick:()=>setShowReset(true),    color:"#6b7280", bg:"#f3f4f6" },
  ];

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>

      {/* Modals */}
      {showReject && (
        <RejectModal teacher={teacher} onClose={()=>setShowReject(false)}
          onConfirm={reason=>{ onUpdate({ ...teacher, status:"rejected", rejectReason:reason }); setShowReject(false); setToast({ msg:"Teacher rejected & notified.", type:"error" }); }}/>
      )}
      {showBlock && (
        <BlockModal teacher={teacher} onClose={()=>setShowBlock(false)}
          onConfirm={reason=>{ onUpdate({ ...teacher, status:"rejected", blockReason:reason }); setShowBlock(false); setToast({ msg:"Teacher blocked.", type:"error" }); }}/>
      )}
      {showMsg      && <DirectMessageModal   teacher={teacher} onClose={()=>setShowMsg(false)}      setToast={setToast}/>}
      {showProgress && <ProgressReportModal  teacher={teacher} onClose={()=>setShowProgress(false)}/>}
      {showCert     && <IssueCertificateModal teacher={teacher} onClose={()=>setShowCert(false)}    setToast={setToast}/>}
      {showReset    && <ResetPasswordModal   teacher={teacher} onClose={()=>setShowReset(false)}    setToast={setToast}/>}
      {showCourses  && (
        <EditCoursesModal teacher={teacher} onClose={()=>setShowCourses(false)}
          onSave={selected=>{ onUpdate({ ...teacher, course:selected[0]||"" }); setToast({ msg:"Courses updated!", type:"success" }); setShowCourses(false); }}/>
      )}

      <button onClick={onBack} style={S.backBtn}>← Back to Teachers</button>

      {/* Profile Header */}
      <div style={{ background:"white", borderRadius:20, padding:"28px", border:"1px solid #f1f5f9", boxShadow:"0 4px 20px rgba(0,0,0,0.06)", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:20, marginBottom:24, paddingBottom:20, borderBottom:"1px solid #f3f4f6" }}>
          <div style={{ width:80, height:80, borderRadius:20, background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, fontWeight:800, color:"white", flexShrink:0 }}>
            {teacher.name[0]}
          </div>
          <div style={{ flex:1 }}>
            <h2 style={{ fontSize:22, fontWeight:900, color:"#1c1917", margin:"0 0 6px", letterSpacing:"-0.5px" }}>{teacher.name}</h2>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
              <StatusBadge status={teacher.status}/>
              <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, color:"#d97706", background:"#fef3c7" }}>{teacher.subject}</span>
              {teacher.batch && <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, color:"#7c3aed", background:"#ede9fe" }}>{teacher.batch}</span>}
              <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, color:"#0369a1", background:"#e0f2fe" }}>{teacher.experience||"—"}</span>
            </div>
            <div style={{ fontSize:13, color:"#6b7280" }}>📧 {teacher.email} &nbsp;|&nbsp; 📱 {teacher.phone} &nbsp;|&nbsp; 📍 {teacher.address||"—"}</div>
          </div>
          {/* Status action buttons */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
            {isPending && <>
              <button onClick={()=>{ onUpdate({ ...teacher, status:"approved" }); setToast({ msg:"Teacher approved!", type:"success" }); }} style={S.btnGreen}>✓ Approve</button>
              <button onClick={()=>setShowReject(true)} style={S.btnRed}>✕ Reject</button>
            </>}
            {isApproved && <button onClick={()=>setShowBlock(true)} style={S.btnOrange}>🚫 Block</button>}
            {isBlocked  && <button onClick={()=>{ onUpdate({ ...teacher, status:"approved" }); setToast({ msg:"Teacher unblocked!", type:"success" }); }} style={S.btnGreen}>🔓 Unblock</button>}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
          {quickActions.map((a,i)=>(
            <button key={i} onClick={a.onClick}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"12px 8px", border:`1px solid ${a.color}30`, borderRadius:12, background:a.bg, cursor:"pointer", fontFamily:"inherit" }}>
              <span style={{ fontSize:20 }}>{a.icon}</span>
              <span style={{ fontSize:10, fontWeight:700, color:a.color, textAlign:"center", lineHeight:1.2 }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {["overview","documents","activity"].map(tab=>(
          <button key={tab} onClick={()=>setActiveSection(tab)}
            style={{ padding:"8px 18px", borderRadius:8, border:`1.5px solid ${activeSection===tab?"#f59e0b":"#e5e7eb"}`, background:activeSection===tab?"#fef3c7":"white", color:activeSection===tab?"#92400e":"#6b7280", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            {tab==="overview"?"📋 Overview":tab==="documents"?"📄 Documents":"🕓 Activity Log"}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeSection==="overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          <SectionCard title="👤 Registration Details">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                { icon:"🎓", label:"Qualification", val:teacher.qualification||"—" },
                { icon:"💼", label:"Experience",    val:teacher.experience||"—"    },
                { icon:"📅", label:"Joined",        val:teacher.joined              },
                { icon:"📍", label:"Address",       val:teacher.address||"—"       },
                { icon:"📚", label:"Course",        val:teacher.course||"—"        },
                { icon:"🗂️", label:"Batch",         val:teacher.batch||"—"         },
                { icon:"👥", label:"Students",      val:teacher.students            },
                { icon:"🎓", label:"Classes",       val:teacher.classes             },
              ].map((r,i)=>(
                <div key={i} style={{ background:"#f9fafb", borderRadius:10, padding:"10px 14px", border:"1px solid #f3f4f6" }}>
                  <div style={{ fontSize:10, color:"#9ca3af", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:2 }}>{r.label}</div>
                  <div style={{ fontSize:13, color:"#374151", fontWeight:600 }}>{r.icon} {r.val}</div>
                </div>
              ))}
            </div>
            {teacher.rejectReason && <div style={{ marginTop:12, background:"#fee2e2", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#991b1b" }}>✕ Rejected: {teacher.rejectReason}</div>}
            {teacher.blockReason  && <div style={{ marginTop:12, background:"#fef3c7", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#92400e"  }}>🚫 Blocked: {teacher.blockReason}</div>}
          </SectionCard>

          <SectionCard title="📊 Attendance & Performance">
            {teacher.status==="approved" ? (
              <>
                <AttendanceBar val={teacher.attendance} name="Overall Attendance"/>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:14 }}>
                  <div style={{ background:"#d1fae5", borderRadius:10, padding:"12px", textAlign:"center", border:"1px solid #86efac" }}>
                    <div style={{ fontSize:16 }}>💰</div>
                    <div style={{ fontSize:18, fontWeight:800, color:"#1c1917" }}>₹{(teacher.revenue/1000).toFixed(1)}k</div>
                    <div style={{ fontSize:10, color:"#6b7280" }}>Revenue Generated</div>
                  </div>
                  <div style={{ background:"#dbeafe", borderRadius:10, padding:"12px", textAlign:"center", border:"1px solid #93c5fd" }}>
                    <div style={{ fontSize:16 }}>📹</div>
                    <div style={{ fontSize:18, fontWeight:800, color:"#1c1917" }}>{teacher.classes*3}</div>
                    <div style={{ fontSize:10, color:"#6b7280" }}>Sessions Attended</div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign:"center", padding:"30px", color:"#9ca3af" }}>
                <div style={{ fontSize:28, marginBottom:8 }}>⏳</div>
                <div style={{ fontSize:12 }}>Stats available after approval</div>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* Documents */}
      {activeSection==="documents" && (
        <SectionCard title="📄 Uploaded Documents">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {[
              { name:"Degree Certificate",     status:"verified", icon:"🎓" },
              { name:"B.Ed / D.El.Ed",         status:"verified", icon:"📜" },
              { name:"Identity Proof (Aadhar)",status:"pending",  icon:"🪪" },
              { name:"Address Proof",           status:"verified", icon:"🏠" },
              { name:"Passport Photo",          status:"verified", icon:"📷" },
              { name:"Experience Letter",       status:teacher.experience==="Fresher"?"draft":"pending", icon:"💼" },
            ].map((doc,i)=>(
              <div key={i} style={{ background:"#f9fafb", borderRadius:12, padding:"14px", border:"1px solid #f1f5f9", textAlign:"center" }}>
                <div style={{ fontSize:28, marginBottom:8 }}>{doc.icon}</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#1c1917", marginBottom:6 }}>{doc.name}</div>
                <StatusBadge status={doc.status}/>
                {doc.status!=="draft" && <div style={{ marginTop:8 }}><button style={S.tblBtn}>View</button></div>}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Activity Log */}
      {activeSection==="activity" && (
        <SectionCard title="🕓 Activity Log">
          {[
            { action:"Registered on platform",                        time:teacher.joined, icon:"👤", type:"info"    },
            { action:"Profile reviewed by admin",                     time:"—",            icon:"✅", type:"success"  },
            { action:`Enrolled in ${teacher.course||"course"}`,       time:"—",            icon:"📚", type:"info"    },
            { action:"Attended live session",                         time:"—",            icon:"📹", type:"info"    },
            { action:"Assignment submitted",                          time:"—",            icon:"📝", type:"info"    },
          ].map((a,i)=>(
            <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:"1px solid #f3f4f6" }}>
              <div style={{ width:32, height:32, borderRadius:8, background:a.type==="success"?"#d1fae5":"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{a.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#1c1917" }}>{a.action}</div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </SectionCard>
      )}
    </div>
  );
}

/* ── Main TeacherManagementTab ── */
function TeacherManagementTab({ teachers, setTeachers, setToast }) {
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [batchFilter,  setBatchFilter]  = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [dateFrom,     setDateFrom]     = useState("");
  const [dateTo,       setDateTo]       = useState("");
  const [selected,     setSelected]     = useState(null);
  const [addModal,     setAddModal]     = useState(false);
  const [selectedIds,  setSelectedIds]  = useState([]);
  const [bulkModal,    setBulkModal]    = useState(false);
  const [newT, setNewT] = useState({ name:"",email:"",phone:"",subject:"",address:"",qualification:"Graduate",experience:"Fresher",course:"",password:"" });

  const allBatches = ["all", ...new Set(teachers.filter(t=>t.batch).map(t=>t.batch))];
  const allCourses = ["all", ...new Set(teachers.filter(t=>t.course).map(t=>t.course))];

  const filtered = teachers.filter(t => {
    const q = search.toLowerCase();
    const matchSearch  = t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.phone.includes(q) || (t.subject||"").toLowerCase().includes(q);
    const matchStatus  = statusFilter==="all" || t.status===statusFilter;
    const matchBatch   = batchFilter==="all"  || t.batch===batchFilter;
    const matchCourse  = courseFilter==="all" || t.course===courseFilter;
    return matchSearch && matchStatus && matchBatch && matchCourse;
  });

  const approve      = id => { setTeachers(p=>p.map(t=>t.id===id?{ ...t, status:"approved" }:t)); setToast({ msg:"Teacher approved!", type:"success" }); };
  const updateTeacher= updated => setTeachers(p=>p.map(t=>t.id===updated.id?updated:t));
  const toggleAll    = () => setSelectedIds(selectedIds.length===filtered.length?[]:filtered.map(t=>t.id));
  const toggleOne    = id => setSelectedIds(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const bulkApprove  = () => { setTeachers(p=>p.map(t=>selectedIds.includes(t.id)?{ ...t, status:"approved" }:t)); setToast({ msg:`${selectedIds.length} teachers approved!`, type:"success" }); setSelectedIds([]); };

  const handleAdd = e => {
    e.preventDefault();
    if(!newT.name||!newT.email||!newT.phone||!newT.subject||!newT.password){ setToast({ msg:"Fill all required fields.", type:"error" }); return; }
    const t = { id:Date.now(), ...newT, status:"approved", joined:new Date().toLocaleDateString("en-IN"), attendance:0, classes:0, students:0, batch:"", revenue:0 };
    setTeachers(prev=>[...prev,t]);
    setToast({ msg:"Teacher added successfully!", type:"success" });
    setAddModal(false);
    setNewT({ name:"",email:"",phone:"",subject:"",address:"",qualification:"Graduate",experience:"Fresher",course:"",password:"" });
  };

  if (selected) return (
    <TeacherProfileView
      teacher={selected}
      onBack={()=>setSelected(null)}
      setToast={setToast}
      onUpdate={updated=>{ updateTeacher(updated); setSelected(updated); }}
    />
  );

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      {bulkModal && <BulkNotifyModal count={selectedIds.length} onClose={()=>setBulkModal(false)} setToast={setToast}/>}

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={S.pageTitle}>Teacher Management</h1>
          <p style={S.pageSub}>{teachers.length} total &nbsp;·&nbsp; {teachers.filter(t=>t.status==="approved").length} active &nbsp;·&nbsp; {teachers.filter(t=>t.status==="pending").length} pending</p>
        </div>
        <button onClick={()=>setAddModal(true)} style={S.primaryBtn}>+ Add Teacher</button>
      </div>

      {/* Filters */}
      <div style={{ background:"white", borderRadius:16, padding:"16px 20px", border:"1px solid #f1f5f9", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", marginBottom:16 }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:12 }}>
          <div style={{ flex:1, minWidth:200 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search name, email, mobile, subject..."/>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {["all","approved","pending","rejected"].map(f=>(
              <button key={f} onClick={()=>setStatusFilter(f)}
                style={{ padding:"8px 14px", borderRadius:8, border:`1.5px solid ${statusFilter===f?"#f59e0b":"#e5e7eb"}`, background:statusFilter===f?"#fef3c7":"white", color:statusFilter===f?"#92400e":"#6b7280", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                {f==="all"?"All":f==="approved"?"✅ Active":f==="pending"?"⏳ Pending":"🚫 Blocked"}
                {f==="pending"&&teachers.filter(t=>t.status==="pending").length>0?` (${teachers.filter(t=>t.status==="pending").length})`:""}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ fontSize:12, fontWeight:600, color:"#6b7280" }}>Batch:</span>
            <select value={batchFilter} onChange={e=>setBatchFilter(e.target.value)} style={{ ...S.input, width:150, marginBottom:0 }}>
              {allBatches.map(b=><option key={b} value={b}>{b==="all"?"All Batches":b}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ fontSize:12, fontWeight:600, color:"#6b7280" }}>Course:</span>
            <select value={courseFilter} onChange={e=>setCourseFilter(e.target.value)} style={{ ...S.input, width:210, marginBottom:0 }}>
              {allCourses.map(c=><option key={c} value={c}>{c==="all"?"All Courses":c.substring(0,28)}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ fontSize:12, fontWeight:600, color:"#6b7280" }}>From:</span>
            <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{ ...S.input, width:140, marginBottom:0 }}/>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ fontSize:12, fontWeight:600, color:"#6b7280" }}>To:</span>
            <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{ ...S.input, width:140, marginBottom:0 }}/>
          </div>
          {(statusFilter!=="all"||batchFilter!=="all"||courseFilter!=="all"||search||dateFrom||dateTo) && (
            <button onClick={()=>{ setSearch(""); setStatusFilter("all"); setBatchFilter("all"); setCourseFilter("all"); setDateFrom(""); setDateTo(""); }}
              style={{ ...S.tblBtn, color:"#ef4444", borderColor:"#fca5a5" }}>✕ Clear</button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length>0 && (
        <div style={{ background:"#fef3c7", border:"1px solid #fbbf24", borderRadius:12, padding:"12px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <span style={{ fontSize:13, fontWeight:700, color:"#92400e" }}>{selectedIds.length} teacher{selectedIds.length>1?"s":""} selected</span>
          <button onClick={bulkApprove} style={S.btnGreen}>✓ Bulk Approve</button>
          <button onClick={()=>setBulkModal(true)} style={{ ...S.tblBtn, color:"#3b82f6", borderColor:"#93c5fd" }}>🔔 Notify</button>
          <button onClick={()=>exportCSV(teachers.filter(t=>selectedIds.includes(t.id)),"selected_teachers.csv")} style={S.exportBtn}>⬇ Export CSV</button>
          <button onClick={()=>setSelectedIds([])} style={S.tblBtn}>✕ Deselect</button>
        </div>
      )}

      {/* Export row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ fontSize:12, color:"#9ca3af" }}>Showing {filtered.length} of {teachers.length} teachers</span>
        <button onClick={()=>exportCSV(filtered,"teachers_export.csv")} style={S.exportBtn}>⬇ Export CSV</button>
      </div>

      {/* Table */}
      <div style={{ background:"white", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f9fafb", borderBottom:"1px solid #f1f5f9" }}>
              <th style={{ padding:"12px 14px", width:40 }}>
                <input type="checkbox" checked={selectedIds.length===filtered.length&&filtered.length>0} onChange={toggleAll} style={{ cursor:"pointer" }}/>
              </th>
              {["Teacher","Mobile","Course","Batch","Attendance","Registered","Status","Actions"].map(h=>(
                <th key={h} style={{ padding:"12px 14px", fontSize:11, fontWeight:700, color:"#9ca3af", textAlign:"left", textTransform:"uppercase", letterSpacing:"0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t,i)=>(
              <tr key={t.id} style={{ borderBottom:"1px solid #f9fafb", background:selectedIds.includes(t.id)?"#fffbeb":i%2===0?"white":"#fafafa" }}>
                <td style={{ padding:"12px 14px" }}>
                  <input type="checkbox" checked={selectedIds.includes(t.id)} onChange={()=>toggleOne(t.id)} style={{ cursor:"pointer" }}/>
                </td>
                <td style={{ padding:"12px 14px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, color:"white", flexShrink:0 }}>{t.name[0]}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#1c1917" }}>{t.name}</div>
                      <div style={{ fontSize:11, color:"#9ca3af" }}>{t.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:"12px 14px", fontSize:12, color:"#374151" }}>{t.phone}</td>
                <td style={{ padding:"12px 14px", fontSize:12, color:"#374151", maxWidth:160 }}>
                  <span style={{ display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.course||<span style={{ color:"#d1d5db" }}>—</span>}</span>
                </td>
                <td style={{ padding:"12px 14px", fontSize:12, color:"#374151" }}>{t.batch||<span style={{ color:"#d1d5db" }}>—</span>}</td>
                <td style={{ padding:"12px 14px" }}>
                  {t.status==="approved"?(
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:52, height:5, background:"#f3f4f6", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${t.attendance}%`, background:t.attendance>=85?"#10b981":t.attendance>=70?"#f59e0b":"#ef4444" }}/>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:t.attendance>=85?"#10b981":t.attendance>=70?"#f59e0b":"#ef4444" }}>{t.attendance}%</span>
                    </div>
                  ):<span style={{ fontSize:11, color:"#d1d5db" }}>—</span>}
                </td>
                <td style={{ padding:"12px 14px", fontSize:12, color:"#9ca3af" }}>{t.joined}</td>
                {/* <td style={{ padding:"12px 14px" }}><StatusBadge status={t.status}/></td> */}
                <td style={{ padding:"12px 14px" }}>
  <StatusBadge status={t.status}/>
  {t.blockReason && <div style={{ fontSize:9, color:"#dc2626", marginTop:2 }}>🚫 Blocked</div>}
  {t.rejectReason && !t.blockReason && <div style={{ fontSize:9, color:"#9ca3af", marginTop:2 }}>✕ Rejected</div>}
</td>
                <td style={{ padding:"12px 14px" }}>
                  <div style={{ display:"flex", gap:5 }}>
                    <button onClick={()=>setSelected(t)} style={{ ...S.tblBtn, color:"#3b82f6", borderColor:"#93c5fd" }}>👁 View</button>
                    {t.status==="pending" && <>
                      <button onClick={()=>approve(t.id)} style={{ ...S.tblBtn, color:"#059669", borderColor:"#86efac" }}>✓</button>
                      <button onClick={()=>setSelected(t)} style={{ ...S.tblBtn, color:"#dc2626", borderColor:"#fca5a5" }}>✕</button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && (
          <div style={{ textAlign:"center", padding:"50px", color:"#9ca3af" }}>
            <div style={{ fontSize:40, marginBottom:10 }}>🔍</div>
            <div style={{ fontSize:14, fontWeight:700 }}>No teachers found</div>
            <div style={{ fontSize:12, marginTop:4 }}>Try adjusting your filters</div>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
      {addModal && (
        <Modal title="Add New Teacher" onClose={()=>setAddModal(false)}>
          <form onSubmit={handleAdd}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { key:"name",    label:"Full Name *", icon:"👤", ph:"Dr. Jane Smith"       },
                { key:"subject", label:"Subject *",   icon:"📘", ph:"Mathematics"          },
                { key:"email",   label:"Email *",     icon:"📧", ph:"teacher@school.edu", type:"email" },
                { key:"phone",   label:"Phone *",     icon:"📱", ph:"+91 98765 43210"       },
                { key:"course",  label:"Course",      icon:"📚", ph:"Pre-Primary Training" },
                { key:"address", label:"Address",     icon:"📍", ph:"City"                 },
              ].map(f=>(
                <div key={f.key}>
                  <label style={S.label}>{f.label}</label>
                  <div style={{ position:"relative" }}>
                    <span style={S.fieldIcon}>{f.icon}</span>
                    <input style={{ ...S.input, paddingLeft:32 }} type={f.type||"text"} value={newT[f.key]} onChange={e=>setNewT({ ...newT, [f.key]:e.target.value })} placeholder={f.ph}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:12 }}>
              <div>
                <label style={S.label}>Qualification</label>
                <select style={S.input} value={newT.qualification} onChange={e=>setNewT({ ...newT, qualification:e.target.value })}>
                  {["12th","Graduate","Post-Graduate","B.Ed","D.El.Ed","Other"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Experience</label>
                <select style={S.input} value={newT.experience} onChange={e=>setNewT({ ...newT, experience:e.target.value })}>
                  {["Fresher","1-2 yrs","3-5 yrs","5-10 yrs","10+ yrs"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop:12 }}>
              <label style={S.label}>Password *</label>
              <div style={{ position:"relative" }}>
                <span style={S.fieldIcon}>🔒</span>
                <input style={{ ...S.input, paddingLeft:32 }} type="password" value={newT.password} onChange={e=>setNewT({ ...newT, password:e.target.value })} placeholder="Set a password"/>
              </div>
            </div>
            <button type="submit" style={{ ...S.primaryBtn, width:"100%", marginTop:20 }}>Add Teacher →</button>
          </form>
        </Modal>
      )}
    </div>
  );
}


/* ── A3: Course Management ── */
/* ═══════════════════════════════════════════════════════════
   COURSE MANAGEMENT TAB — A3.1 + A3.2 + A3.3
   Drop-in replacement for CourseManagementTab in AdminDashboard.jsx
═══════════════════════════════════════════════════════════ */

/* ── MOCK CATEGORIES (add near top of AdminDashboard.jsx with other mock data) ── */
// const MOCK_CATEGORIES = [ ... ] — paste the export below into your mock data section

/* ────────────────────────────────────────────────────────
   INITIAL CATEGORY DATA  (paste into AdminDashboard mock section)
   const MOCK_CATEGORIES = [
     { id:1, name:"Foundation",  sub:["Pre-Primary","ECCE"], icon:"🏫", color:"#f59e0b", order:1, count:2 },
     { id:2, name:"Montessori",  sub:["Materials","Method"], icon:"🎨", color:"#10b981", order:2, count:1 },
     { id:3, name:"Psychology",  sub:["Child Dev","Behavior"],icon:"🧠", color:"#8b5cf6", order:3, count:1 },
     { id:4, name:"Policy",      sub:["NEP 2020","FLN"],     icon:"📜", color:"#3b82f6", order:4, count:1 },
     { id:5, name:"Planning",    sub:["Curriculum","Lesson"],icon:"📋", color:"#06b6d4", order:5, count:1 },
     { id:6, name:"Leadership",  sub:["Admin","Management"], icon:"🏆", color:"#ef4444", order:6, count:1 },
     { id:7, name:"Special Ed",  sub:["Inclusive","Support"],icon:"♿", color:"#ec4899", order:7, count:1 },
     { id:8, name:"Digital",     sub:["EdTech","Tools"],     icon:"💻", color:"#14b8a6", order:8, count:1 },
   ];
──────────────────────────────────────────────────────── */

//import { useState } from "react";
//import { StatusBadge, StatCard, SectionCard, Modal, SearchBar, S } from "../components/Shared";

/* ══════════════════════════════════════════
   COURSE FORM — A3.2 (Full Multi-Section)
══════════════════════════════════════════ */
function CourseFormModal({ course, onSave, onClose, categories, setToast }) {
  const isEdit = !!course;

  /* ── State for all sections ── */
  const [activeSection, setActiveSection] = useState("basic");

  /* Basic Info */
  const [title,       setTitle]       = useState(course?.title       || "");
  const [subtitle,    setSubtitle]    = useState(course?.subtitle    || "");
  const [description, setDescription] = useState(course?.description || "");
  const [thumbnail,   setThumbnail]   = useState(course?.thumbnail   || "");
  const [category,    setCategory]    = useState(course?.category    || "Foundation");
  const [tags,        setTags]        = useState(course?.tags        || "");
  const [duration,    setDuration]    = useState(course?.duration    || "");
  const [status,      setStatus]      = useState(course?.status      || "draft");

  /* Curriculum */
  const [modules, setModules] = useState(course?.modules || [
    { id:1, title:"Module 1 – Introduction", lessons:[
      { id:1, title:"Welcome & Overview", type:"video",    duration:"10 min" },
      { id:2, title:"Course Objectives",  type:"reading",  duration:"5 min"  },
    ], quiz:true, assignment:false },
  ]);
  const [dragModuleId, setDragModuleId] = useState(null);

  /* Pricing */
  const [baseFee,    setBaseFee]    = useState(course?.price    || "");
  const [discFee,    setDiscFee]    = useState(course?.discFee  || "");
  const [emiEnabled, setEmiEnabled] = useState(course?.emi      || false);
  const [emiMonths,  setEmiMonths]  = useState(course?.emiMonths|| 3);
  const [coupons,    setCoupons]    = useState(course?.coupons  || [
    { code:"WELCOME20", discount:"20%", expiry:"31/12/2026", active:true },
  ]);
  const [newCoupon,  setNewCoupon]  = useState({ code:"", discount:"", expiry:"" });

  /* Eligibility */
  const [minQual,    setMinQual]    = useState(course?.minQual    || "Graduate");
  const [minExp,     setMinExp]     = useState(course?.minExp     || "Fresher");
  const [batchRestr, setBatchRestr] = useState(course?.batchRestr || "None");

  /* SEO */
  const [metaTitle,  setMetaTitle]  = useState(course?.metaTitle  || "");
  const [metaDesc,   setMetaDesc]   = useState(course?.metaDesc   || "");
  const [keywords,   setKeywords]   = useState(course?.keywords   || "");

  /* Certificate */
  const [passScore,  setPassScore]  = useState(course?.passScore  || 60);
  const [certTpl,    setCertTpl]    = useState(course?.certTpl    || "Gold Standard");
  const [issuerName, setIssuerName] = useState(course?.issuerName || "SpacECE India Foundation");
  const [issuerDes,  setIssuerDes]  = useState(course?.issuerDes  || "Director, Teacher Training");

  /* Notifications */
  const [notifEnroll,   setNotifEnroll]   = useState(course?.notifEnroll   ?? true);
  const [notifComplete, setNotifComplete] = useState(course?.notifComplete ?? true);
  const [notifReminder, setNotifReminder] = useState(course?.notifReminder ?? true);
  const [reminderDays,  setReminderDays]  = useState(course?.reminderDays  || 3);

  /* Curriculum helpers */
  const addModule = () => {
    const id = Date.now();
    setModules(prev => [...prev, { id, title:`Module ${prev.length + 1} – New Module`, lessons:[], quiz:false, assignment:false }]);
  };
  const removeModule = (id) => setModules(prev => prev.filter(m => m.id !== id));
  const updateModuleTitle = (id, val) => setModules(prev => prev.map(m => m.id === id ? { ...m, title:val } : m));
  const addLesson = (moduleId) => {
    setModules(prev => prev.map(m => m.id === moduleId
      ? { ...m, lessons:[...m.lessons, { id:Date.now(), title:"New Lesson", type:"video", duration:"10 min" }] }
      : m
    ));
  };
  const removeLesson = (moduleId, lessonId) => {
    setModules(prev => prev.map(m => m.id === moduleId
      ? { ...m, lessons:m.lessons.filter(l => l.id !== lessonId) }
      : m
    ));
  };
  const updateLesson = (moduleId, lessonId, field, val) => {
    setModules(prev => prev.map(m => m.id === moduleId
      ? { ...m, lessons:m.lessons.map(l => l.id === lessonId ? { ...l, [field]:val } : l) }
      : m
    ));
  };

  /* Coupon helpers */
  const addCoupon = () => {
    if (!newCoupon.code || !newCoupon.discount) { setToast({ msg:"Fill coupon code and discount.", type:"error" }); return; }
    setCoupons(prev => [...prev, { ...newCoupon, active:true }]);
    setNewCoupon({ code:"", discount:"", expiry:"" });
  };
  const removeCoupon = (code) => setCoupons(prev => prev.filter(c => c.code !== code));

  /* Save */
  const handleSave = () => {
    if (!title) { setToast({ msg:"Course title is required.", type:"error" }); setActiveSection("basic"); return; }
    const saved = {
      id: course?.id || Date.now(),
      title, subtitle, description, thumbnail, category, tags,
      duration, status,
      modules,
      price: Number(baseFee) || 0,
      discFee: Number(discFee) || 0,
      emi: emiEnabled, emiMonths, coupons,
      minQual, minExp, batchRestr,
      metaTitle, metaDesc, keywords,
      passScore: Number(passScore), certTpl, issuerName, issuerDes,
      notifEnroll, notifComplete, notifReminder, reminderDays,
      enrolled: course?.enrolled || 0,
      completion: course?.completion || 0,
      revenue: course?.revenue || 0,
      rating: course?.rating || 0,
    };
    onSave(saved);
  };

  const sections = [
    { key:"basic",       label:"📋 Basic Info"       },
    { key:"curriculum",  label:"📚 Curriculum"       },
    { key:"pricing",     label:"💰 Pricing"          },
    { key:"eligibility", label:"🎓 Eligibility"      },
    { key:"seo",         label:"🔍 SEO"              },
    { key:"certificate", label:"🏅 Certificate"      },
    { key:"notifications",label:"🔔 Notifications"  },
  ];

  const Toggle = ({ val, onToggle, label }) => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #f3f4f6" }}>
      <span style={{ fontSize:13, color:"#374151", fontWeight:600 }}>{label}</span>
      <div onClick={onToggle} style={{ width:42, height:24, borderRadius:12, background:val?"#10b981":"#e5e7eb", position:"relative", cursor:"pointer", transition:"background 0.3s", flexShrink:0 }}>
        <div style={{ position:"absolute", top:2, left:val?18:2, width:20, height:20, borderRadius:"50%", background:"white", transition:"left 0.3s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, backdropFilter:"blur(4px)" }}>
      <div style={{ background:"white", borderRadius:20, width:"90%", maxWidth:800, maxHeight:"92vh", display:"flex", flexDirection:"column", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>

        {/* Header */}
        <div style={{ padding:"20px 28px", borderBottom:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div>
            <h3 style={{ fontSize:18, fontWeight:900, color:"#1c1917", margin:0 }}>{isEdit ? "✏️ Edit Course" : "➕ Add New Course"}</h3>
            <p style={{ fontSize:12, color:"#9ca3af", margin:"4px 0 0" }}>Fill all sections for a complete course setup</p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#9ca3af" }}>✕</button>
        </div>

        {/* Section Tabs */}
        <div style={{ display:"flex", gap:0, borderBottom:"1px solid #f1f5f9", overflowX:"auto", flexShrink:0, padding:"0 20px" }}>
          {sections.map(sec => (
            <button key={sec.key} onClick={() => setActiveSection(sec.key)}
              style={{ padding:"12px 14px", border:"none", borderBottom:`2px solid ${activeSection===sec.key?"#f59e0b":"transparent"}`, background:"none", color:activeSection===sec.key?"#92400e":"#9ca3af", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
              {sec.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>

          {/* ── BASIC INFO ── */}
          {activeSection === "basic" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={S.label}>Course Title *</label>
                <input style={S.input} value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Pre-Primary Teacher Training"/>
              </div>
              <div>
                <label style={S.label}>Subtitle</label>
                <input style={S.input} value={subtitle} onChange={e=>setSubtitle(e.target.value)} placeholder="A short tagline for the course"/>
              </div>
              <div>
                <label style={S.label}>Description</label>
                <textarea style={{ ...S.input, height:90, resize:"none" }} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Full course description visible to learners..."/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={S.label}>Category</label>
                  <select style={S.input} value={category} onChange={e=>setCategory(e.target.value)}>
                    {categories.map(c => <option key={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Duration</label>
                  <input style={S.input} value={duration} onChange={e=>setDuration(e.target.value)} placeholder="e.g. 6 Weeks"/>
                </div>
              </div>
              <div>
                <label style={S.label}>Tags (comma separated)</label>
                <input style={S.input} value={tags} onChange={e=>setTags(e.target.value)} placeholder="e.g. ECCE, Pre-Primary, Child Development"/>
              </div>
              <div>
                <label style={S.label}>Thumbnail URL</label>
                <input style={S.input} value={thumbnail} onChange={e=>setThumbnail(e.target.value)} placeholder="https://...image url"/>
                {thumbnail && <img src={thumbnail} alt="thumb" style={{ marginTop:8, width:120, height:80, objectFit:"cover", borderRadius:8, border:"1px solid #f1f5f9" }} onError={e=>e.target.style.display="none"}/>}
              </div>
              <div>
                <label style={S.label}>Initial Status</label>
                <select style={S.input} value={status} onChange={e=>setStatus(e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          )}

          {/* ── CURRICULUM ── */}
          {activeSection === "curriculum" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div style={{ fontSize:13, color:"#6b7280" }}>Drag modules to reorder. Add lessons, quizzes, and assignments inside each module.</div>
                <button onClick={addModule} style={S.primaryBtn}>+ Add Module</button>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {modules.map((mod, mi) => (
                  <div key={mod.id}
                    draggable
                    onDragStart={() => setDragModuleId(mod.id)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => {
                      if (!dragModuleId || dragModuleId === mod.id) return;
                      setModules(prev => {
                        const arr = [...prev];
                        const fromIdx = arr.findIndex(m => m.id === dragModuleId);
                        const toIdx   = arr.findIndex(m => m.id === mod.id);
                        const [moved] = arr.splice(fromIdx, 1);
                        arr.splice(toIdx, 0, moved);
                        return arr;
                      });
                      setDragModuleId(null);
                    }}
                    style={{ background:"#f9fafb", borderRadius:14, border:"1px solid #e5e7eb", overflow:"hidden" }}>

                    {/* Module Header */}
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"white", borderBottom:"1px solid #f3f4f6" }}>
                      <span style={{ cursor:"grab", color:"#d1d5db", fontSize:16 }}>⠿</span>
                      <span style={{ fontSize:13, fontWeight:800, color:"#f59e0b" }}>M{mi + 1}</span>
                      <input
                        style={{ flex:1, border:"none", background:"transparent", fontSize:13, fontWeight:700, color:"#1c1917", outline:"none", fontFamily:"inherit" }}
                        value={mod.title}
                        onChange={e => updateModuleTitle(mod.id, e.target.value)}
                      />
                      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                        <label style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#6b7280", cursor:"pointer" }}>
                          <input type="checkbox" checked={mod.quiz} onChange={e => setModules(prev => prev.map(m => m.id===mod.id?{...m,quiz:e.target.checked}:m))}/> Quiz
                        </label>
                        <label style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#6b7280", cursor:"pointer" }}>
                          <input type="checkbox" checked={mod.assignment} onChange={e => setModules(prev => prev.map(m => m.id===mod.id?{...m,assignment:e.target.checked}:m))}/> Assignment
                        </label>
                        <button onClick={() => removeModule(mod.id)} style={{ ...S.tblBtn, color:"#dc2626", borderColor:"#fca5a5", fontSize:10 }}>✕ Remove</button>
                      </div>
                    </div>

                    {/* Lessons */}
                    <div style={{ padding:"10px 16px" }}>
                      {mod.lessons.map((lesson, li) => (
                        <div key={lesson.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:"white", borderRadius:8, marginBottom:6, border:"1px solid #f1f5f9" }}>
                          <span style={{ fontSize:12, color:"#9ca3af" }}>L{li + 1}</span>
                          <input
                            style={{ flex:1, border:"none", background:"transparent", fontSize:12, color:"#374151", outline:"none", fontFamily:"inherit" }}
                            value={lesson.title}
                            onChange={e => updateLesson(mod.id, lesson.id, "title", e.target.value)}
                          />
                          <select
                            value={lesson.type}
                            onChange={e => updateLesson(mod.id, lesson.id, "type", e.target.value)}
                            style={{ ...S.input, width:90, padding:"4px 8px", fontSize:11, marginBottom:0 }}>
                            {["video","reading","live","quiz","assignment"].map(t => <option key={t}>{t}</option>)}
                          </select>
                          <input
                            style={{ ...S.input, width:70, padding:"4px 8px", fontSize:11, marginBottom:0 }}
                            value={lesson.duration}
                            onChange={e => updateLesson(mod.id, lesson.id, "duration", e.target.value)}
                            placeholder="10 min"
                          />
                          <button onClick={() => removeLesson(mod.id, lesson.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#dc2626", fontSize:14 }}>✕</button>
                        </div>
                      ))}
                      <button onClick={() => addLesson(mod.id)} style={{ ...S.tblBtn, marginTop:4, fontSize:11 }}>+ Add Lesson</button>
                      {mod.quiz && (
                        <div style={{ marginTop:6, padding:"8px 10px", background:"#fef3c7", borderRadius:8, fontSize:11, color:"#92400e", border:"1px solid #fbbf24" }}>
                          📝 Quiz attached to this module
                        </div>
                      )}
                      {mod.assignment && (
                        <div style={{ marginTop:6, padding:"8px 10px", background:"#dbeafe", borderRadius:8, fontSize:11, color:"#1d4ed8", border:"1px solid #93c5fd" }}>
                          📋 Assignment attached to this module
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {modules.length === 0 && (
                <div style={{ textAlign:"center", padding:40, color:"#9ca3af" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>📚</div>
                  <div style={{ fontSize:13 }}>No modules yet. Click "+ Add Module" to start building.</div>
                </div>
              )}
            </div>
          )}

          {/* ── PRICING ── */}
          {activeSection === "pricing" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={S.label}>Base Fee (₹) *</label>
                  <input style={S.input} type="number" value={baseFee} onChange={e=>setBaseFee(e.target.value)} placeholder="4500"/>
                </div>
                <div>
                  <label style={S.label}>Discounted Fee (₹)</label>
                  <input style={S.input} type="number" value={discFee} onChange={e=>setDiscFee(e.target.value)} placeholder="3800"/>
                </div>
              </div>

              {discFee && baseFee && (
                <div style={{ background:"#d1fae5", borderRadius:10, padding:"10px 14px", fontSize:12, color:"#065f46", border:"1px solid #6ee7b7" }}>
                  💰 Savings: ₹{Number(baseFee) - Number(discFee)} ({Math.round(((Number(baseFee)-Number(discFee))/Number(baseFee))*100)}% off)
                </div>
              )}

              <div style={{ background:"#f9fafb", borderRadius:12, padding:"14px 16px", border:"1px solid #f1f5f9" }}>
                <Toggle val={emiEnabled} onToggle={() => setEmiEnabled(!emiEnabled)} label="📅 Enable EMI / Instalment Options"/>
                {emiEnabled && (
                  <div style={{ marginTop:12 }}>
                    <label style={S.label}>EMI Months</label>
                    <div style={{ display:"flex", gap:8 }}>
                      {[2,3,6,12].map(m => (
                        <button key={m} onClick={() => setEmiMonths(m)}
                          style={{ flex:1, padding:"8px", borderRadius:8, border:`1.5px solid ${emiMonths===m?"#f59e0b":"#e5e7eb"}`, background:emiMonths===m?"#fef3c7":"white", color:emiMonths===m?"#92400e":"#6b7280", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                          {m}M
                        </button>
                      ))}
                    </div>
                    {baseFee && (
                      <div style={{ marginTop:8, fontSize:12, color:"#6b7280" }}>
                        Monthly instalment: ₹{Math.ceil((Number(discFee)||Number(baseFee)) / emiMonths).toLocaleString("en-IN")} × {emiMonths} months
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Coupon Codes */}
              <div>
                <label style={{ ...S.label, marginBottom:10 }}>🎟️ Coupon Codes</label>
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
                  {coupons.map((c, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#f9fafb", borderRadius:10, border:"1px solid #f3f4f6" }}>
                      <span style={{ fontSize:12, fontWeight:800, color:"#1c1917", fontFamily:"monospace" }}>{c.code}</span>
                      <span style={{ padding:"2px 8px", borderRadius:6, fontSize:10, fontWeight:700, background:"#d1fae5", color:"#065f46" }}>{c.discount}</span>
                      {c.expiry && <span style={{ fontSize:11, color:"#9ca3af" }}>Expires {c.expiry}</span>}
                      <button onClick={() => removeCoupon(c.code)} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"#dc2626", fontSize:14 }}>✕</button>
                    </div>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:8, alignItems:"end" }}>
                  <div>
                    <label style={S.label}>Code</label>
                    <input style={{ ...S.input, marginBottom:0 }} value={newCoupon.code} onChange={e=>setNewCoupon({...newCoupon,code:e.target.value.toUpperCase()})} placeholder="SUMMER30"/>
                  </div>
                  <div>
                    <label style={S.label}>Discount</label>
                    <input style={{ ...S.input, marginBottom:0 }} value={newCoupon.discount} onChange={e=>setNewCoupon({...newCoupon,discount:e.target.value})} placeholder="30% or ₹500"/>
                  </div>
                  <div>
                    <label style={S.label}>Expiry</label>
                    <input style={{ ...S.input, marginBottom:0 }} type="date" value={newCoupon.expiry} onChange={e=>setNewCoupon({...newCoupon,expiry:e.target.value})}/>
                  </div>
                  <button onClick={addCoupon} style={{ ...S.btnGreen, height:38 }}>+ Add</button>
                </div>
              </div>
            </div>
          )}

          {/* ── ELIGIBILITY ── */}
          {activeSection === "eligibility" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={S.label}>Minimum Qualification</label>
                <select style={S.input} value={minQual} onChange={e=>setMinQual(e.target.value)}>
                  {["12th","Graduate","Post-Graduate","B.Ed","D.El.Ed","Any"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Minimum Experience</label>
                <select style={S.input} value={minExp} onChange={e=>setMinExp(e.target.value)}>
                  {["Fresher","1-2 yrs","3-5 yrs","5+ yrs","Any"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Batch Restrictions</label>
                <select style={S.input} value={batchRestr} onChange={e=>setBatchRestr(e.target.value)}>
                  {["None","Batch A Only","Batch B Only","Batch C Only","All Batches"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ background:"#fef3c7", borderRadius:10, padding:"12px 14px", fontSize:12, color:"#92400e", border:"1px solid #fbbf24" }}>
                ℹ️ Teachers not meeting eligibility criteria will see a locked state on the course listing page.
              </div>
            </div>
          )}

          {/* ── SEO ── */}
          {activeSection === "seo" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ background:"#f0f9ff", borderRadius:10, padding:"12px 14px", fontSize:12, color:"#0369a1", border:"1px solid #bae6fd", marginBottom:4 }}>
                🔍 SEO settings improve discoverability on Google and within the SpacECE search. Keep meta title under 60 characters.
              </div>
              <div>
                <label style={S.label}>Meta Title</label>
                <input style={S.input} value={metaTitle} onChange={e=>setMetaTitle(e.target.value)} placeholder="Pre-Primary Teacher Training | SpacECE"/>
                <div style={{ fontSize:10, color: metaTitle.length > 60 ? "#dc2626" : "#9ca3af", marginTop:2 }}>{metaTitle.length}/60 characters</div>
              </div>
              <div>
                <label style={S.label}>Meta Description</label>
                <textarea style={{ ...S.input, height:80, resize:"none" }} value={metaDesc} onChange={e=>setMetaDesc(e.target.value)} placeholder="A comprehensive teacher training program for early childhood educators covering ECCE principles..."/>
                <div style={{ fontSize:10, color: metaDesc.length > 160 ? "#dc2626" : "#9ca3af", marginTop:2 }}>{metaDesc.length}/160 characters</div>
              </div>
              <div>
                <label style={S.label}>Keywords (comma separated)</label>
                <input style={S.input} value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder="ECCE training, pre-primary teacher, early childhood education"/>
              </div>
              {(metaTitle || metaDesc) && (
                <div style={{ background:"white", borderRadius:10, padding:"14px 16px", border:"1px solid #e5e7eb" }}>
                  <div style={{ fontSize:10, color:"#9ca3af", marginBottom:6 }}>🔍 Google Preview</div>
                  <div style={{ fontSize:14, color:"#1a0dab", fontWeight:600 }}>{metaTitle || title}</div>
                  <div style={{ fontSize:11, color:"#006621" }}>https://spaceece.in/courses/{title.toLowerCase().replace(/\s+/g,"-")}</div>
                  <div style={{ fontSize:12, color:"#545454", marginTop:2 }}>{metaDesc || description}</div>
                </div>
              )}
            </div>
          )}

          {/* ── CERTIFICATE SETTINGS ── */}
          {activeSection === "certificate" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={S.label}>Pass Score (%)</label>
                <div style={{ display:"flex", gap:8 }}>
                  {[50,60,70,80].map(s => (
                    <button key={s} onClick={() => setPassScore(s)}
                      style={{ flex:1, padding:"10px", borderRadius:8, border:`1.5px solid ${passScore===s?"#f59e0b":"#e5e7eb"}`, background:passScore===s?"#fef3c7":"white", color:passScore===s?"#92400e":"#6b7280", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                      {s}%
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={S.label}>Certificate Template</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                  {[
                    { name:"Gold Standard", color:"#f59e0b", desc:"Premium design" },
                    { name:"Modern Blue",   color:"#3b82f6", desc:"Professional look" },
                    { name:"Classic",       color:"#10b981", desc:"Minimal & clean" },
                  ].map(t => (
                    <div key={t.name} onClick={() => setCertTpl(t.name)}
                      style={{ padding:"14px", borderRadius:12, border:`2px solid ${certTpl===t.name?t.color:"#e5e7eb"}`, cursor:"pointer", textAlign:"center", background:certTpl===t.name?`${t.color}10`:"white" }}>
                      <div style={{ fontSize:24, marginBottom:6 }}>🏅</div>
                      <div style={{ fontSize:12, fontWeight:700, color:"#1c1917" }}>{t.name}</div>
                      <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={S.label}>Issuer Name</label>
                  <input style={S.input} value={issuerName} onChange={e=>setIssuerName(e.target.value)} placeholder="Organisation name"/>
                </div>
                <div>
                  <label style={S.label}>Issuer Designation</label>
                  <input style={S.input} value={issuerDes} onChange={e=>setIssuerDes(e.target.value)} placeholder="Director, Teacher Training"/>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeSection === "notifications" && (
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              <div style={{ background:"#f0f9ff", borderRadius:10, padding:"12px 14px", fontSize:12, color:"#0369a1", border:"1px solid #bae6fd", marginBottom:10 }}>
                🔔 Auto-email triggers are sent from the SpacECE notification system. Toggle each event below.
              </div>
              <Toggle val={notifEnroll}   onToggle={() => setNotifEnroll(!notifEnroll)}     label="📧 Enrollment Confirmation Email"/>
              <Toggle val={notifComplete} onToggle={() => setNotifComplete(!notifComplete)} label="🎓 Course Completion Email + Certificate"/>
              <Toggle val={notifReminder} onToggle={() => setNotifReminder(!notifReminder)} label="⏰ Session / Assignment Reminder Email"/>
              {notifReminder && (
                <div style={{ marginLeft:16, marginTop:8 }}>
                  <label style={S.label}>Send reminder (days before due)</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {[1,2,3,5,7].map(d => (
                      <button key={d} onClick={() => setReminderDays(d)}
                        style={{ flex:1, padding:"8px", borderRadius:8, border:`1.5px solid ${reminderDays===d?"#f59e0b":"#e5e7eb"}`, background:reminderDays===d?"#fef3c7":"white", color:reminderDays===d?"#92400e":"#6b7280", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"16px 28px", borderTop:"1px solid #f3f4f6", display:"flex", gap:10, justifyContent:"flex-end", flexShrink:0 }}>
          <button onClick={onClose} style={S.tblBtn}>Cancel</button>
          <button onClick={() => { setStatus("draft"); handleSave(); }} style={S.exportBtn}>💾 Save as Draft</button>
          <button onClick={handleSave} style={S.primaryBtn}>✅ {isEdit?"Update Course":"Publish Course"} →</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CATEGORY MANAGEMENT — A3.3
══════════════════════════════════════════ */
function CategoryManagementModal({ categories, setCategories, setToast, onClose }) {
  const ICONS  = ["🏫","🎨","🧠","📜","📋","🏆","♿","💻","📚","🎓","🌟","🔬","🎯","🌍","🎵"];
  const COLORS = ["#f59e0b","#10b981","#8b5cf6","#3b82f6","#06b6d4","#ef4444","#ec4899","#14b8a6","#f97316","#84cc16"];

  const [editId,    setEditId]    = useState(null);
  const [addMode,   setAddMode]   = useState(false);
  const [newCat,    setNewCat]    = useState({ name:"", sub:"", icon:"📚", color:"#f59e0b" });
  const [dragCatId, setDragCatId] = useState(null);

  const startEdit = (cat) => {
    setEditId(cat.id);
    setNewCat({ name:cat.name, sub:cat.sub.join(", "), icon:cat.icon, color:cat.color });
    setAddMode(false);
  };

  const saveEdit = () => {
    if (!newCat.name) { setToast({ msg:"Category name required.", type:"error" }); return; }
    setCategories(prev => prev.map(c => c.id === editId
      ? { ...c, name:newCat.name, sub:newCat.sub.split(",").map(s=>s.trim()).filter(Boolean), icon:newCat.icon, color:newCat.color }
      : c
    ));
    setToast({ msg:"Category updated!", type:"success" });
    setEditId(null);
  };

  const addCategory = () => {
    if (!newCat.name) { setToast({ msg:"Category name required.", type:"error" }); return; }
    const maxOrder = Math.max(0, ...categories.map(c => c.order));
    setCategories(prev => [...prev, {
      id:    Date.now(),
      name:  newCat.name,
      sub:   newCat.sub.split(",").map(s=>s.trim()).filter(Boolean),
      icon:  newCat.icon,
      color: newCat.color,
      order: maxOrder + 1,
      count: 0,
    }]);
    setToast({ msg:"Category added!", type:"success" });
    setAddMode(false);
    setNewCat({ name:"", sub:"", icon:"📚", color:"#f59e0b" });
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setToast({ msg:"Category deleted.", type:"error" });
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    setCategories(prev => {
      const arr = [...prev];
      [arr[idx-1], arr[idx]] = [arr[idx], arr[idx-1]];
      return arr.map((c, i) => ({ ...c, order:i+1 }));
    });
  };

  const moveDown = (idx) => {
    setCategories(prev => {
      if (idx === prev.length - 1) return prev;
      const arr = [...prev];
      [arr[idx], arr[idx+1]] = [arr[idx+1], arr[idx]];
      return arr.map((c, i) => ({ ...c, order:i+1 }));
    });
  };

  const CatForm = ({ onSave, onCancel }) => (
    <div style={{ background:"#f9fafb", borderRadius:12, padding:"16px", border:"1px solid #e5e7eb", marginBottom:10 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
        <div>
          <label style={S.label}>Category Name *</label>
          <input style={{ ...S.input, marginBottom:0 }} value={newCat.name} onChange={e=>setNewCat({...newCat,name:e.target.value})} placeholder="e.g. Foundation"/>
        </div>
        <div>
          <label style={S.label}>Sub-categories (comma separated)</label>
          <input style={{ ...S.input, marginBottom:0 }} value={newCat.sub} onChange={e=>setNewCat({...newCat,sub:e.target.value})} placeholder="e.g. Pre-Primary, ECCE"/>
        </div>
      </div>
      <div style={{ marginBottom:10 }}>
        <label style={S.label}>Icon</label>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {ICONS.map(ic => (
            <button key={ic} onClick={() => setNewCat({...newCat,icon:ic})}
              style={{ width:36, height:36, borderRadius:8, border:`2px solid ${newCat.icon===ic?"#f59e0b":"#e5e7eb"}`, background:newCat.icon===ic?"#fef3c7":"white", fontSize:18, cursor:"pointer" }}>
              {ic}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom:12 }}>
        <label style={S.label}>Colour</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {COLORS.map(col => (
            <button key={col} onClick={() => setNewCat({...newCat,color:col})}
              style={{ width:28, height:28, borderRadius:"50%", background:col, border:`3px solid ${newCat.color===col?"#1c1917":"transparent"}`, cursor:"pointer" }}/>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={onSave}   style={{ ...S.primaryBtn }}>Save Category</button>
        <button onClick={onCancel} style={S.tblBtn}>Cancel</button>
      </div>
    </div>
  );

  return (
    <Modal title="🗂️ Course Category Management" onClose={onClose}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <span style={{ fontSize:12, color:"#9ca3af" }}>{categories.length} categories · Drag or use arrows to reorder</span>
        <button onClick={() => { setAddMode(true); setEditId(null); setNewCat({ name:"", sub:"", icon:"📚", color:"#f59e0b" }); }}
          style={S.primaryBtn}>+ New Category</button>
      </div>

      {addMode && <CatForm onSave={addCategory} onCancel={() => setAddMode(false)}/>}

      <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:420, overflowY:"auto" }}>
        {categories.sort((a,b) => a.order - b.order).map((cat, idx) => (
          <div key={cat.id}>
            {editId === cat.id ? (
              <CatForm onSave={saveEdit} onCancel={() => setEditId(null)}/>
            ) : (
              <div
                draggable
                onDragStart={() => setDragCatId(cat.id)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => {
                  if (!dragCatId || dragCatId === cat.id) return;
                  setCategories(prev => {
                    const arr = [...prev];
                    const fi = arr.findIndex(c => c.id === dragCatId);
                    const ti = arr.findIndex(c => c.id === cat.id);
                    const [moved] = arr.splice(fi, 1);
                    arr.splice(ti, 0, moved);
                    return arr.map((c, i) => ({ ...c, order:i+1 }));
                  });
                  setDragCatId(null);
                }}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", background:"white", borderRadius:12, border:"1px solid #f1f5f9", cursor:"grab" }}>
                <span style={{ color:"#d1d5db", fontSize:14 }}>⠿</span>
                <div style={{ width:36, height:36, borderRadius:10, background:`${cat.color}20`, border:`1.5px solid ${cat.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                  {cat.icon}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:"#1c1917" }}>{cat.name}</div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>
                    {cat.sub.join(" · ") || "No sub-categories"} &nbsp;·&nbsp; {cat.count} courses
                  </div>
                </div>
                <div style={{ width:12, height:12, borderRadius:"50%", background:cat.color, flexShrink:0 }}/>
                <div style={{ display:"flex", gap:4 }}>
                  <button onClick={() => moveUp(idx)}   style={{ ...S.tblBtn, padding:"4px 8px" }}>↑</button>
                  <button onClick={() => moveDown(idx)} style={{ ...S.tblBtn, padding:"4px 8px" }}>↓</button>
                  <button onClick={() => startEdit(cat)} style={{ ...S.tblBtn }}>Edit</button>
                  <button onClick={() => deleteCategory(cat.id)} style={{ ...S.tblBtn, color:"#dc2626", borderColor:"#fca5a5" }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════
   MAIN COURSE MANAGEMENT TAB — A3.1
══════════════════════════════════════════ */
function CourseManagementTab({ courses, setCourses, categories, setCategories, setToast }) {
  const [search,      setSearch]      = useState("");
  const [statusFilter,setStatusFilter]= useState("all");
  const [catFilter,   setCatFilter]   = useState("all");
  const [formModal,   setFormModal]   = useState(false);
  const [editCourse,  setEditCourse]  = useState(null);
  const [catModal,    setCatModal]    = useState(false);

  /* Filter */
  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchCat    = catFilter    === "all" || c.category === catFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const toggleStatus = (id) => {
    setCourses(prev => prev.map(c => c.id===id
      ? { ...c, status:c.status==="published"?"draft":"published" }
      : c
    ));
    setToast({ msg:"Course status updated!", type:"success" });
  };

  const archiveCourse = (id) => {
    setCourses(prev => prev.map(c => c.id===id ? { ...c, status:"archived" } : c));
    setToast({ msg:"Course archived.", type:"success" });
  };

  const deleteCourse = (id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setToast({ msg:"Course deleted.", type:"error" });
  };

  const handleSave = (saved) => {
    if (editCourse) {
      setCourses(prev => prev.map(c => c.id === saved.id ? saved : c));
      setToast({ msg:"Course updated!", type:"success" });
    } else {
      setCourses(prev => [...prev, saved]);
      setToast({ msg:"Course added!", type:"success" });
    }
    setFormModal(false);
    setEditCourse(null);
  };

  const openEdit = (course) => {
    setEditCourse(course);
    setFormModal(true);
  };

  const openAdd = () => {
    setEditCourse(null);
    setFormModal(true);
  };

  /* Stats */
  const published  = courses.filter(c => c.status === "published").length;
  const drafts     = courses.filter(c => c.status === "draft").length;
  const archived   = courses.filter(c => c.status === "archived").length;
  const comingSoon = courses.filter(c => c.status === "coming_soon").length;
  const totalRev   = courses.reduce((a,c) => a + (c.revenue||0), 0);

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>

      {/* Modals */}
      {formModal && (
        <CourseFormModal
          course={editCourse}
          onSave={handleSave}
          onClose={() => { setFormModal(false); setEditCourse(null); }}
          categories={categories}
          setToast={setToast}
        />
      )}
      {catModal && (
        <CategoryManagementModal
          categories={categories}
          setCategories={setCategories}
          setToast={setToast}
          onClose={() => setCatModal(false)}
        />
      )}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={S.pageTitle}>Course Management</h1>
          <p style={S.pageSub}>{published} published · {drafts} drafts · {comingSoon} coming soon · {archived} archived</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => setCatModal(true)} style={S.exportBtn}>🗂️ Categories</button>
          <button onClick={openAdd} style={S.primaryBtn}>+ Add Course</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:14, marginBottom:20 }}>
        <StatCard icon="📚" label="Total Courses"  val={courses.length}  color="#f59e0b" bg="#fef3c7"/>
        <StatCard icon="✅" label="Published"       val={published}        color="#10b981" bg="#d1fae5"/>
        <StatCard icon="📝" label="Drafts"          val={drafts}           color="#6b7280" bg="#f3f4f6"/>
        <StatCard icon="🚀" label="Coming Soon"     val={comingSoon}       color="#3b82f6" bg="#dbeafe"/>
        <StatCard icon="💰" label="Total Revenue"   val={`₹${(totalRev/100000).toFixed(1)}L`} color="#8b5cf6" bg="#ede9fe"/>
      </div>

      {/* Filters */}
      <div style={{ background:"white", borderRadius:14, padding:"14px 18px", border:"1px solid #f1f5f9", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", marginBottom:16 }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ flex:1, minWidth:200 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search by course name or category..."/>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {["all","published","draft","coming_soon","archived"].map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                style={{ padding:"7px 12px", borderRadius:8, border:`1.5px solid ${statusFilter===f?"#f59e0b":"#e5e7eb"}`, background:statusFilter===f?"#fef3c7":"white", color:statusFilter===f?"#92400e":"#6b7280", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                {f==="all"?"All":f==="published"?"✅ Published":f==="draft"?"📝 Draft":f==="coming_soon"?"🚀 Coming Soon":"🗄️ Archived"}
              </button>
            ))}
          </div>
          <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{ ...S.input, width:160, marginBottom:0 }}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
          </select>
          {(statusFilter!=="all"||catFilter!=="all"||search) && (
            <button onClick={() => { setSearch(""); setStatusFilter("all"); setCatFilter("all"); }} style={{ ...S.tblBtn, color:"#ef4444", borderColor:"#fca5a5" }}>✕ Clear</button>
          )}
        </div>
      </div>

      {/* Result count */}
      <div style={{ fontSize:12, color:"#9ca3af", marginBottom:10 }}>
        Showing {filtered.length} of {courses.length} courses
      </div>

      {/* Table — A3.1 */}
      <div style={{ background:"white", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f9fafb", borderBottom:"1px solid #f1f5f9" }}>
              {["Course","Category","Enrolled","Completion","Revenue","Rating","Status","Actions"].map(h => (
                <th key={h} style={{ padding:"12px 16px", fontSize:11, fontWeight:700, color:"#9ca3af", textAlign:"left", textTransform:"uppercase", letterSpacing:"0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ borderBottom:"1px solid #f9fafb", background:i%2===0?"white":"#fafafa" }}>
                {/* Course */}
                <td style={{ padding:"12px 16px" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1c1917", maxWidth:220 }}>{c.title}</div>
                  {c.subtitle && <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>{c.subtitle}</div>}
                  <div style={{ fontSize:11, color:"#9ca3af" }}>{c.duration}</div>
                </td>
                {/* Category */}
                <td style={{ padding:"12px 16px" }}>
                  <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700,
                    background:`${categories.find(cat=>cat.name===c.category)?.color||"#f59e0b"}20`,
                    color:categories.find(cat=>cat.name===c.category)?.color||"#92400e" }}>
                    {categories.find(cat=>cat.name===c.category)?.icon||"📚"} {c.category}
                  </span>
                </td>
                {/* Enrolled */}
                <td style={{ padding:"12px 16px", fontSize:13, fontWeight:600, color:"#374151" }}>{c.enrolled}</td>
                {/* Completion */}
                <td style={{ padding:"12px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:52, height:5, background:"#f3f4f6", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${c.completion}%`, background:c.completion>=70?"#10b981":"#f59e0b" }}/>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color:c.completion>=70?"#10b981":"#f59e0b" }}>{c.completion}%</span>
                  </div>
                </td>
                {/* Revenue */}
                <td style={{ padding:"12px 16px", fontSize:13, fontWeight:600, color:"#374151" }}>
                  ₹{((c.revenue||0)/1000).toFixed(0)}k
                </td>
                {/* Rating */}
                <td style={{ padding:"12px 16px", fontSize:13, color:"#f59e0b", fontWeight:700 }}>
                  {c.rating > 0 ? `⭐ ${c.rating}` : "—"}
                </td>
                {/* Status */}
                <td style={{ padding:"12px 16px" }}><StatusBadge status={c.status}/></td>
                {/* Actions */}
                <td style={{ padding:"12px 16px" }}>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    <button onClick={() => toggleStatus(c.id)}
                      style={{ ...S.tblBtn, color:c.status==="published"?"#dc2626":"#059669", borderColor:c.status==="published"?"#fca5a5":"#86efac" }}>
                      {c.status==="published" ? "Unpublish" : "Publish"}
                    </button>
                    <button onClick={() => openEdit(c)} style={S.tblBtn}>✏️ Edit</button>
                    {c.status !== "archived" && (
                      <button onClick={() => archiveCourse(c.id)} style={S.tblBtn}>🗄️</button>
                    )}
                    <button onClick={() => deleteCourse(c.id)} style={{ ...S.tblBtn, color:"#dc2626", borderColor:"#fca5a5" }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"50px 20px", color:"#9ca3af" }}>
            <div style={{ fontSize:40, marginBottom:10 }}>📚</div>
            <div style={{ fontSize:14, fontWeight:700 }}>No courses found</div>
            <div style={{ fontSize:12, marginTop:4 }}>Try adjusting filters or add a new course</div>
          </div>
        )}
      </div>

      {/* Category preview strip */}
      <div style={{ marginTop:20 }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#374151", marginBottom:12 }}>🗂️ Active Categories</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {categories.sort((a,b)=>a.order-b.order).map(cat => (
            <div key={cat.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", borderRadius:20, border:`1.5px solid ${cat.color}40`, background:`${cat.color}10` }}>
              <span style={{ fontSize:16 }}>{cat.icon}</span>
              <span style={{ fontSize:12, fontWeight:700, color:cat.color }}>{cat.name}</span>
              <span style={{ fontSize:10, color:"#9ca3af" }}>{cat.count} courses</span>
            </div>
          ))}
          <button onClick={() => setCatModal(true)}
            style={{ padding:"8px 14px", borderRadius:20, border:"1.5px dashed #e5e7eb", background:"white", color:"#9ca3af", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            + Manage
          </button>
        </div>
      </div>
    </div>
  );
}

//export default CourseManagementTab;

/* ── A4: Batch Management ── */
function BatchManagementTab({ batches, setBatches, teachers, setToast }) {
  // ── View state ──
  const [view, setView]           = useState("grid");   // "grid" | "detail" | "calendar"
  const [selected, setSelected]   = useState(null);
  const [addModal, setAddModal]   = useState(false);
  const [cloneTarget, setClone]   = useState(null);
  const [broadcastId, setBcastId] = useState(null);
  const [bcastMsg, setBcastMsg]   = useState("");
  const [statusFilter, setStatusF]= useState("all");
 
  // ── Form state ──
  const emptyForm = {
    name: "", course: "", start: "", end: "", capacity: "",
    mode: "Online", platform: "Zoom", meetingLink: "",
    trainer: "", coTrainer: "", status: "upcoming", autoEnroll: false,
  };
  const [form, setForm] = useState(emptyForm);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
 
  // ── Schedule state (for detail view) ──
  const [schedForm, setSchedForm] = useState({ title: "", date: "", time: "", type: "session", duration: 60 });
 
  const filtered = statusFilter === "all"
    ? batches
    : batches.filter(b => b.status === statusFilter);
 
  const statusColor  = { upcoming: "#2563eb", active: "#059669", completed: "#7c3aed", cancelled: "#dc2626" };
  const statusBg     = { upcoming: "#dbeafe", active: "#d1fae5", completed: "#ede9fe", cancelled: "#fee2e2" };
  const modeIcon     = { Online: "🖥️", Offline: "🏫", Hybrid: "🔀" };
 
  // ── Helpers ──
  const pct = b => b.capacity ? Math.round((b.enrolled / b.capacity) * 100) : 0;
  const heatColor = p => p >= 90 ? "#ef4444" : p >= 70 ? "#f59e0b" : "#10b981";
 
  const enrolledTeachers = b =>
    (teachers || []).filter(t => (b.teachers || []).includes(t.id));
 
  // ── Actions ──
  const handleCreate = e => {
    e.preventDefault();
    if (!form.name || !form.course || !form.start) {
      setToast({ msg: "Fill required fields (Name, Course, Start Date).", type: "error" });
      return;
    }
    const newBatch = {
      id: Date.now(),
      ...form,
      capacity: Number(form.capacity) || 30,
      enrolled: 0,
      schedule: [],
      teachers: [],
    };
    setBatches(p => [...p, newBatch]);
    setToast({ msg: "Batch created!", type: "success" });
    setAddModal(false);
    setForm(emptyForm);
  };
 
  const handleClone = () => {
    if (!cloneTarget) return;
    const clone = {
      ...cloneTarget,
      id: Date.now(),
      name: `${cloneTarget.name} (Copy)`,
      start: "",
      end: "",
      status: "upcoming",
      enrolled: 0,
      teachers: [],
      schedule: [],
    };
    setBatches(p => [...p, clone]);
    setToast({ msg: `"${cloneTarget.name}" cloned! Update dates.`, type: "success" });
    setClone(null);
  };
 
  const changeStatus = (id, status) => {
    setBatches(p => p.map(b => b.id === id ? { ...b, status } : b));
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
    setToast({ msg: `Status updated to ${status}.`, type: "success" });
  };
 
  const addScheduleItem = () => {
    if (!schedForm.title || !schedForm.date) {
      setToast({ msg: "Fill title and date.", type: "error" });
      return;
    }
    const item = { id: Date.now(), ...schedForm };
    setBatches(p => p.map(b =>
      b.id === selected.id ? { ...b, schedule: [...(b.schedule || []), item] } : b
    ));
    setSelected(s => ({ ...s, schedule: [...(s.schedule || []), item] }));
    setSchedForm({ title: "", date: "", time: "", type: "session", duration: 60 });
    setToast({ msg: "Schedule item added!", type: "success" });
  };
 
  const removeScheduleItem = schedId => {
    setBatches(p => p.map(b =>
      b.id === selected.id
        ? { ...b, schedule: b.schedule.filter(s => s.id !== schedId) }
        : b
    ));
    setSelected(s => ({ ...s, schedule: s.schedule.filter(x => x.id !== schedId) }));
  };
 
  const sendBroadcast = () => {
    if (!bcastMsg.trim()) { setToast({ msg: "Message cannot be empty.", type: "error" }); return; }
    setToast({ msg: `Broadcast sent to all teachers in this batch! 📨`, type: "success" });
    setBcastId(null);
    setBcastMsg("");
  };
 
  // ─────────────────────────────────
  //  DETAIL VIEW
  // ─────────────────────────────────
  if (selected && view === "detail") {
    const bt = batches.find(b => b.id === selected.id) || selected;
    const enTeachers = enrolledTeachers(bt);
    const p = pct(bt);
 
    return (
      <div style={{ animation: "fadeIn 0.3s ease" }}>
 
        {/* Broadcast Modal */}
        {broadcastId && (
          <div style={MODAL_OVERLAY}>
            <div style={MODAL_BOX}>
              <div style={MODAL_HDR}>
                <span style={{ fontSize: 15, fontWeight: 800 }}>📢 Broadcast to {bt.name}</span>
                <button onClick={() => setBcastId(null)} style={CLOSE_BTN}>✕</button>
              </div>
              <div style={{ padding: "20px 24px 24px" }}>
                <label style={S.label}>Message *</label>
                <textarea
                  style={{ ...S.input, height: 110, resize: "none", marginBottom: 16 }}
                  value={bcastMsg}
                  onChange={e => setBcastMsg(e.target.value)}
                  placeholder="Write a message to all enrolled teachers..."
                />
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>
                  Will be sent to {enTeachers.length} enrolled teacher(s) via in-app + email.
                </div>
                <button onClick={sendBroadcast} style={{ ...S.primaryBtn, width: "100%" }}>
                  📤 Send Broadcast
                </button>
              </div>
            </div>
          </div>
        )}
 
        {/* Clone Modal */}
        {cloneTarget && (
          <div style={MODAL_OVERLAY}>
            <div style={{ ...MODAL_BOX, maxWidth: 420 }}>
              <div style={MODAL_HDR}>
                <span style={{ fontSize: 15, fontWeight: 800 }}>🔁 Clone Batch</span>
                <button onClick={() => setClone(null)} style={CLOSE_BTN}>✕</button>
              </div>
              <div style={{ padding: "20px 24px 24px" }}>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                  A copy of <b>{cloneTarget.name}</b> will be created with blank dates and 0 enrollments.
                  You can update the dates after cloning.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleClone} style={{ ...S.primaryBtn, flex: 1 }}>🔁 Clone Now</button>
                  <button onClick={() => setClone(null)} style={{ ...S.tblBtn, flex: 1 }}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
 
        {/* Back + Header */}
        <button onClick={() => { setSelected(null); setView("grid"); }} style={S.backBtn}>← Back to Batches</button>
 
        <div style={{ background: "white", borderRadius: 20, padding: 28, border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20, paddingBottom: 18, borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: statusBg[bt.status] || "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
              {modeIcon[bt.mode] || "🗂️"}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", margin: "0 0 6px" }}>{bt.name}</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: statusBg[bt.status], color: statusColor[bt.status] }}>{bt.status.toUpperCase()}</span>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#fef3c7", color: "#92400e" }}>{bt.course}</span>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#f3f4f6", color: "#374151" }}>{bt.mode}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => setBcastId(bt.id)} style={{ ...S.primaryBtn }}>📢 Broadcast</button>
              <button onClick={() => setClone(bt)} style={{ ...S.exportBtn }}>🔁 Clone</button>
            </div>
          </div>
 
          {/* Status control */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 8 }}>Status Control</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["upcoming", "active", "completed", "cancelled"].map(s => (
                <button key={s} onClick={() => changeStatus(bt.id, s)}
                  style={{ padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${bt.status === s ? statusColor[s] : "#e5e7eb"}`, background: bt.status === s ? statusBg[s] : "white", color: bt.status === s ? statusColor[s] : "#6b7280", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
 
          {/* Details grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[
              { icon: "📅", label: "Start Date", val: bt.start },
              { icon: "🏁", label: "End Date", val: bt.end },
              { icon: "🪑", label: "Capacity", val: `${bt.enrolled} / ${bt.capacity} seats` },
              { icon: "🖥️", label: "Platform", val: bt.platform },
              { icon: "👩‍🏫", label: "Trainer", val: bt.trainer || "—" },
              { icon: "👥", label: "Co-Trainer", val: bt.coTrainer || "—" },
            ].map((r, i) => (
              <div key={i} style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 13px", border: "1px solid #f3f4f6" }}>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 2 }}>{r.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{r.icon} {r.val}</div>
              </div>
            ))}
          </div>
 
          {bt.meetingLink && (
            <div style={{ marginTop: 12, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>🔗</span>
              <a href={bt.meetingLink} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>{bt.meetingLink}</a>
            </div>
          )}
 
          {/* Capacity bar */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: "#9ca3af", fontWeight: 600 }}>Capacity Utilisation</span>
              <span style={{ fontWeight: 800, color: heatColor(p) }}>{p}%</span>
            </div>
            <div style={{ height: 8, background: "#f3f4f6", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${p}%`, background: heatColor(p), borderRadius: 6, transition: "width 1s" }} />
            </div>
          </div>
        </div>
 
        {/* Enrolled Teachers */}
        <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #f1f5f9", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 14 }}>👩‍🏫 Enrolled Teachers ({enTeachers.length})</div>
          {enTeachers.length === 0 ? (
            <div style={{ textAlign: "center", padding: 24, color: "#9ca3af" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>👥</div>
              <div style={{ fontSize: 12 }}>No teachers enrolled yet</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {enTeachers.map((t, i) => {
                const progVal = t.attendance || 0;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#f9fafb", borderRadius: 12, border: "1px solid #f3f4f6" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "white", flexShrink: 0 }}>{t.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{t.subject} · {t.email}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <div style={{ width: 60, height: 5, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${progVal}%`, background: progVal >= 80 ? "#10b981" : progVal >= 60 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: progVal >= 80 ? "#10b981" : progVal >= 60 ? "#f59e0b" : "#ef4444" }}>{progVal}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
 
        {/* Schedule / Calendar */}
        <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>📅 Batch Schedule</div>
          </div>
 
          {/* Add schedule item */}
          <div style={{ background: "#f9fafb", borderRadius: 12, padding: 14, border: "1px solid #f3f4f6", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10 }}>+ Add Schedule Item</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 8, alignItems: "end" }}>
              <div>
                <label style={S.label}>Title *</label>
                <input style={{ ...S.input, marginBottom: 0 }} value={schedForm.title} onChange={e => setSchedForm(f => ({ ...f, title: e.target.value }))} placeholder="Session / Assignment title" />
              </div>
              <div>
                <label style={S.label}>Date *</label>
                <input style={{ ...S.input, marginBottom: 0 }} type="date" value={schedForm.date} onChange={e => setSchedForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label style={S.label}>Time</label>
                <input style={{ ...S.input, marginBottom: 0 }} type="time" value={schedForm.time} onChange={e => setSchedForm(f => ({ ...f, time: e.target.value }))} />
              </div>
              <div>
                <label style={S.label}>Type</label>
                <select style={{ ...S.input, marginBottom: 0 }} value={schedForm.type} onChange={e => setSchedForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="session">Session</option>
                  <option value="assignment">Assignment Due</option>
                  <option value="quiz">Quiz</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>
              <button onClick={addScheduleItem} style={{ ...S.primaryBtn, height: 38, whiteSpace: "nowrap" }}>+ Add</button>
            </div>
          </div>
 
          {/* Schedule list */}
          {(bt.schedule || []).length === 0 ? (
            <div style={{ textAlign: "center", padding: 24, color: "#9ca3af" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📭</div>
              <div style={{ fontSize: 12 }}>No schedule items yet. Add sessions and deadlines above.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[...(bt.schedule || [])].sort((a, b) => new Date(a.date) - new Date(b.date)).map((item, i) => {
                const typeColor = { session: "#3b82f6", assignment: "#f59e0b", quiz: "#8b5cf6", holiday: "#10b981" };
                const typeIcon  = { session: "🎥", assignment: "📝", quiz: "🧠", holiday: "🎉" };
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "white", borderRadius: 10, border: `1px solid ${typeColor[item.type] || "#e5e7eb"}20`, borderLeft: `4px solid ${typeColor[item.type] || "#e5e7eb"}` }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{typeIcon[item.type] || "📌"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                        {item.date}{item.time ? ` · ${item.time}` : ""}{item.duration ? ` · ${item.duration} min` : ""}
                      </div>
                    </div>
                    <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${typeColor[item.type]}20`, color: typeColor[item.type] }}>
                      {item.type}
                    </span>
                    <button onClick={() => removeScheduleItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 16, padding: "2px 6px" }}>✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
 
  // ─────────────────────────────────
  //  GRID VIEW (main list)
  // ─────────────────────────────────
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
 
      {/* Clone confirm modal (from grid) */}
      {cloneTarget && (
        <div style={MODAL_OVERLAY}>
          <div style={{ ...MODAL_BOX, maxWidth: 420 }}>
            <div style={MODAL_HDR}>
              <span style={{ fontSize: 15, fontWeight: 800 }}>🔁 Clone Batch</span>
              <button onClick={() => setClone(null)} style={CLOSE_BTN}>✕</button>
            </div>
            <div style={{ padding: "20px 24px 24px" }}>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                A copy of <b>{cloneTarget.name}</b> will be created with blank dates and 0 enrollments.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleClone} style={{ ...S.primaryBtn, flex: 1 }}>🔁 Clone Now</button>
                <button onClick={() => setClone(null)} style={{ ...S.tblBtn, flex: 1 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* Create Batch Modal */}
      {addModal && (
        <div style={MODAL_OVERLAY}>
          <div style={{ ...MODAL_BOX, maxWidth: 680 }}>
            <div style={MODAL_HDR}>
              <span style={{ fontSize: 16, fontWeight: 800 }}>+ Create New Batch</span>
              <button onClick={() => { setAddModal(false); setForm(emptyForm); }} style={CLOSE_BTN}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: "20px 24px 24px", overflowY: "auto", maxHeight: "75vh" }}>
              {/* Row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={S.label}>Batch Name *</label>
                  <input style={S.input} value={form.name} onChange={e => upd("name", e.target.value)} placeholder="Batch A — July 2026" />
                </div>
                <div>
                  <label style={S.label}>Linked Course *</label>
                  <input style={S.input} value={form.course} onChange={e => upd("course", e.target.value)} placeholder="Pre-Primary Teacher Training" />
                </div>
              </div>
              {/* Row 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={S.label}>Start Date *</label>
                  <input style={S.input} type="date" value={form.start} onChange={e => upd("start", e.target.value)} />
                </div>
                <div>
                  <label style={S.label}>End Date</label>
                  <input style={S.input} type="date" value={form.end} onChange={e => upd("end", e.target.value)} />
                </div>
                <div>
                  <label style={S.label}>Max Capacity (Seats)</label>
                  <input style={S.input} type="number" value={form.capacity} onChange={e => upd("capacity", e.target.value)} placeholder="30" />
                </div>
              </div>
              {/* Row 3 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={S.label}>Mode</label>
                  <select style={S.input} value={form.mode} onChange={e => upd("mode", e.target.value)}>
                    {["Online", "Offline", "Hybrid"].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Platform</label>
                  <select style={S.input} value={form.platform} onChange={e => upd("platform", e.target.value)}>
                    {["Zoom", "Google Meet", "Microsoft Teams", "In-Person", "Other"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Initial Status</label>
                  <select style={S.input} value={form.status} onChange={e => upd("status", e.target.value)}>
                    {["upcoming", "active", "completed", "cancelled"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              {/* Meeting Link */}
              <div style={{ marginBottom: 12 }}>
                <label style={S.label}>Meeting Link</label>
                <input style={S.input} value={form.meetingLink} onChange={e => upd("meetingLink", e.target.value)} placeholder="https://zoom.us/j/..." />
              </div>
              {/* Trainers */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={S.label}>Primary Trainer</label>
                  <input style={S.input} value={form.trainer} onChange={e => upd("trainer", e.target.value)} placeholder="Dr. Rekha Iyer" />
                </div>
                <div>
                  <label style={S.label}>Co-Trainer (optional)</label>
                  <input style={S.input} value={form.coTrainer} onChange={e => upd("coTrainer", e.target.value)} placeholder="Prof. Amol Desai" />
                </div>
              </div>
              {/* Auto-enroll */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6", marginBottom: 20 }}>
                <div
                  onClick={() => upd("autoEnroll", !form.autoEnroll)}
                  style={{ width: 42, height: 24, borderRadius: 12, background: form.autoEnroll ? "#10b981" : "#e5e7eb", position: "relative", cursor: "pointer", transition: "background .3s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: 2, left: form.autoEnroll ? 18 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left .3s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Auto-Enroll Waiting Teachers</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>Automatically enroll registered teachers waiting for this course</div>
                </div>
              </div>
              <button type="submit" style={{ ...S.primaryBtn, width: "100%" }}>Create Batch →</button>
            </form>
          </div>
        </div>
      )}
 
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={S.pageTitle}>Batch Management</h1>
          <p style={S.pageSub}>
            {batches.length} batches · {batches.filter(b => b.status === "active").length} active · {batches.filter(b => b.status === "upcoming").length} upcoming
          </p>
        </div>
        <button onClick={() => setAddModal(true)} style={S.primaryBtn}>+ Create Batch</button>
      </div>
 
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { icon: "🗂️", label: "Total Batches", val: batches.length,                                         color: "#f59e0b", bg: "#fef3c7" },
          { icon: "✅", label: "Active",         val: batches.filter(b => b.status === "active").length,     color: "#10b981", bg: "#d1fae5" },
          { icon: "⏳", label: "Upcoming",       val: batches.filter(b => b.status === "upcoming").length,   color: "#3b82f6", bg: "#dbeafe" },
          { icon: "🏁", label: "Completed",      val: batches.filter(b => b.status === "completed").length,  color: "#7c3aed", bg: "#ede9fe" },
          { icon: "🪑", label: "Total Seats",    val: batches.reduce((a, b) => a + (b.capacity || 0), 0),    color: "#06b6d4", bg: "#cffafe" },
        ].map((k, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: `1px solid ${k.color}30`, borderLeft: `3px solid ${k.color}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{k.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{k.val}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".3px" }}>{k.label}</div>
          </div>
        ))}
      </div>
 
      {/* Status filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {["all", "active", "upcoming", "completed", "cancelled"].map(f => (
          <button key={f} onClick={() => setStatusF(f)}
            style={{ padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${statusFilter === f ? "#f59e0b" : "#e5e7eb"}`, background: statusFilter === f ? "#fef3c7" : "white", color: statusFilter === f ? "#92400e" : "#6b7280", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
            {f === "all" ? "All Batches" : f}
            {f !== "all" && <span style={{ marginLeft: 4, fontSize: 10, opacity: .7 }}>({batches.filter(b => b.status === f).length})</span>}
          </button>
        ))}
      </div>
 
      {/* Batch Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 16 }}>
        {filtered.map((b, i) => {
          const p = pct(b);
          return (
            <div key={i} style={{ background: "white", borderRadius: 18, padding: 20, border: "1px solid #f1f5f9", borderTop: `3px solid ${statusColor[b.status] || "#f59e0b"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Card header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{b.course}</div>
                </div>
                <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: statusBg[b.status], color: statusColor[b.status], flexShrink: 0 }}>
                  {b.status.toUpperCase()}
                </span>
              </div>
 
              {/* Meta */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12, color: "#6b7280" }}>
                <span>📅 {b.start} → {b.end}</span>
                <span>{modeIcon[b.mode]} {b.mode}</span>
                <span>👩‍🏫 {b.trainer || "—"}</span>
                <span>🪑 {b.enrolled}/{b.capacity} seats</span>
                {b.coTrainer && <span style={{ gridColumn: "1/-1" }}>👥 Co: {b.coTrainer}</span>}
              </div>
 
              {/* Capacity bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 11 }}>
                  <span style={{ color: "#9ca3af" }}>Capacity</span>
                  <span style={{ fontWeight: 700, color: heatColor(p) }}>{p}%</span>
                </div>
                <div style={{ height: 6, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${p}%`, background: heatColor(p), borderRadius: 4 }} />
                </div>
              </div>
 
              {/* Auto-enroll badge */}
              {b.autoEnroll && (
                <div style={{ fontSize: 10, fontWeight: 700, color: "#059669", background: "#d1fae5", padding: "3px 8px", borderRadius: 6, display: "inline-block", width: "fit-content" }}>
                  ⚡ Auto-Enroll ON
                </div>
              )}
 
              {/* Actions */}
              <div style={{ display: "flex", gap: 6, paddingTop: 4, borderTop: "1px solid #f3f4f6", flexWrap: "wrap" }}>
                <button onClick={() => { setSelected(b); setView("detail"); }}
                  style={{ ...S.tblBtn, color: "#2563eb", borderColor: "#93c5fd" }}>👁 View</button>
                <button onClick={() => setBcastId(b.id)}
                  style={S.tblBtn}>📢 Broadcast</button>
                <button onClick={() => setClone(b)}
                  style={S.tblBtn}>🔁 Clone</button>
                {/* Quick status toggle */}
                {b.status === "upcoming" && (
                  <button onClick={() => changeStatus(b.id, "active")}
                    style={{ ...S.tblBtn, color: "#059669", borderColor: "#86efac" }}>▶ Activate</button>
                )}
                {b.status === "active" && (
                  <button onClick={() => changeStatus(b.id, "completed")}
                    style={{ ...S.tblBtn, color: "#7c3aed", borderColor: "#c4b5fd" }}>✓ Complete</button>
                )}
              </div>
 
              {/* Broadcast panel inline */}
              {broadcastId === b.id && (
                <div style={{ marginTop: 4, background: "#fef3c7", borderRadius: 10, padding: 12, border: "1px solid #fbbf24" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>📢 Broadcast Message</div>
                  <textarea
                    value={bcastMsg}
                    onChange={e => setBcastMsg(e.target.value)}
                    rows={3}
                    style={{ ...S.input, marginBottom: 8, resize: "none" }}
                    placeholder="Write your message..."
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={sendBroadcast} style={{ ...S.primaryBtn, flex: 1, fontSize: 11 }}>📤 Send</button>
                    <button onClick={() => { setBcastId(null); setBcastMsg(""); }} style={{ ...S.tblBtn, flex: 1, fontSize: 11 }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
 
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🗂️</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>No batches found</div>
        </div>
      )}
    </div>
  );
}

/* ── A5: Trainer Management ── */
/* ═══════════════════════════════════════════════════════════
   TRAINER MANAGEMENT TAB — A5.1 + A5.2
   Paste this block into AdminDashboard.jsx
   replacing the old TrainerManagementTab function.
═══════════════════════════════════════════════════════════ */

/* ── Trainer Detail / Profile View ── */
function TrainerProfileView({ trainer, batches, onBack, onUpdate, setToast }) {
  const [activeTab,   setActiveTab]   = useState("overview");
  const [showMsg,     setShowMsg]     = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showPayout,  setShowPayout]  = useState(false);
  const [msgText,     setMsgText]     = useState("");
  const [msgLog,      setMsgLog]      = useState([
    { from:"Admin", text:"Welcome aboard! Please upload your course materials by Friday.", time:"01/06/2026 10:00 AM" },
    { from:"Trainer", text:"Sure, I'll have everything ready by Thursday evening.", time:"01/06/2026 11:30 AM" },
  ]);

  const ALL_COURSES = [
    "Pre-Primary Teacher Training (PPT)",
    "Montessori Teacher Training",
    "Child Psychology & Development",
    "NEP 2020 Alignment & FLN",
    "Curriculum Design & Lesson Planning",
    "Leadership & School Administration",
    "Special Education & Inclusive Ed",
    "Digital Literacy for Modern Teachers",
  ];

  const [assignedCourses, setAssignedCourses] = useState(
    trainer.assignedCourses || [trainer.subject]
  );

  const trainerBatches = batches.filter(b =>
    b.trainer === trainer.name || b.coTrainer === trainer.name
  );

  const sendMsg = () => {
    if (!msgText.trim()) return;
    setMsgLog(prev => [...prev, {
      from: "Admin",
      text: msgText,
      time: new Date().toLocaleString("en-IN")
    }]);
    setMsgText("");
    setToast({ msg: "Message sent to trainer!", type: "success" });
  };

  const savePortalAccess = (perm) => {
    onUpdate({ ...trainer, portalAccess: perm });
    setToast({ msg: "Portal access updated!", type: "success" });
  };

  const portalPerms = [
    { key: "uploadContent",      label: "Upload Learning Content",     icon: "📤" },
    { key: "reviewAssignments",  label: "Review Assignments",          icon: "📝" },
    { key: "hostSessions",       label: "Host Live Sessions",          icon: "📹" },
    { key: "respondForum",       label: "Respond in Forum",            icon: "💬" },
    { key: "viewOwnBatch",       label: "View Own Batch Analytics",    icon: "📊" },
  ];

  const RESTRICTED_PERMS = ["Financial Reports", "Other Teachers' Profiles", "Admin Settings", "Batch Creation"];

  const mockPayouts = [
    { session: "Classroom Management Techniques", date: "02/06/2026", type: "Session", amount: 1500, status: "paid" },
    { session: "Child Development Theories",       date: "08/06/2026", type: "Session", amount: 1500, status: "pending" },
    { session: "Batch A — May 2026 (Full)",        date: "30/06/2026", type: "Batch",   amount: 8000, status: "pending" },
  ];

  const tabs = [
    { key: "overview",   label: "📋 Overview"         },
    { key: "batches",    label: "📅 Batches"           },
    { key: "messages",   label: "💬 Messages"          },
    { key: "payouts",    label: "💰 Payouts"           },
    { key: "access",     label: "🔐 Portal Access"     },
  ];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <button onClick={onBack} style={S.backBtn}>← Back to Trainers</button>

      {/* Profile Header */}
      <div style={{ background: "white", borderRadius: 20, padding: "24px 28px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "white", flexShrink: 0 }}>
            {trainer.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1c1917", margin: "0 0 6px" }}>{trainer.name}</h2>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>{trainer.subject}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <StatusBadge status={trainer.status} />
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#7c3aed", background: "#ede9fe" }}>⭐ {trainer.rating} rating</span>
              {trainer.linkedin && <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#2563eb", background: "#dbeafe" }}>🔗 LinkedIn</span>}
            </div>
            {trainer.bio && <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8, lineHeight: 1.6, maxWidth: 500 }}>{trainer.bio}</p>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setActiveTab("messages")} style={S.btnGreen}>💬 Message</button>
            <button onClick={() => onUpdate({ ...trainer, status: trainer.status === "active" ? "inactive" : "active" })}
              style={trainer.status === "active" ? S.btnOrange : S.btnGreen}>
              {trainer.status === "active" ? "🔕 Deactivate" : "✅ Activate"}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
          {[
            { icon: "📚", label: "Courses",  val: trainer.courses  },
            { icon: "🗂️", label: "Batches",  val: trainerBatches.length },
            { icon: "🎥", label: "Sessions", val: trainer.sessions },
            { icon: "⭐", label: "Rating",   val: trainer.rating   },
            { icon: "👥", label: "Learners", val: trainerBatches.reduce((a,b) => a + b.enrolled, 0) },
          ].map((s, i) => (
            <div key={i} style={{ background: "#f9fafb", borderRadius: 12, padding: "12px 14px", textAlign: "center", border: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1c1917", marginTop: 2 }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${activeTab === t.key ? "#6366f1" : "#e5e7eb"}`, background: activeTab === t.key ? "#ede9fe" : "white", color: activeTab === t.key ? "#4f46e5" : "#6b7280", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <SectionCard title="👤 Trainer Details">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: "🎓", label: "Qualification", val: trainer.qualification || "—" },
                { icon: "💼", label: "Expertise",     val: trainer.subject               },
                { icon: "📅", label: "Joined",        val: trainer.joined || "—"        },
                { icon: "📧", label: "Email",         val: trainer.email  || "—"        },
                { icon: "📱", label: "Phone",         val: trainer.phone  || "—"        },
                { icon: "🔗", label: "LinkedIn",      val: trainer.linkedin || "—"      },
              ].map((r, i) => (
                <div key={i} style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 14px", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{r.icon} {r.val}</div>
                </div>
              ))}
            </div>

            {/* Assigned Courses */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>📚 Assigned Courses</div>
                <button onClick={() => setShowCourses(true)} style={S.tblBtn}>Edit</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {assignedCourses.map((c, i) => (
                  <span key={i} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#ede9fe", color: "#4f46e5", border: "1px solid #c4b5fd" }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="📊 Performance Overview">
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Avg Rating</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b" }}>⭐ {trainer.rating} / 5.0</span>
              </div>
              <div style={{ height: 8, background: "#f3f4f6", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(trainer.rating / 5) * 100}%`, background: "#f59e0b", borderRadius: 6 }} />
              </div>
            </div>

            {[
              { label: "Completion Rate (batches)", val: 87, color: "#10b981" },
              { label: "On-time Session Rate",      val: 94, color: "#3b82f6" },
              { label: "Assignment Review Speed",   val: 78, color: "#8b5cf6" },
            ].map((m, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{m.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.val}%</span>
                </div>
                <div style={{ height: 6, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${m.val}%`, background: m.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}

            {/* Recent reviews */}
            <div style={{ marginTop: 16, fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Recent Reviews</div>
            {[
              { learner: "Asha Kulkarni",  rating: 5, text: "Excellent teaching style, very patient." },
              { learner: "Neha Joshi",     rating: 5, text: "Very knowledgeable and well prepared."   },
              { learner: "Ritika Menon",   rating: 4, text: "Good sessions, could be more interactive." },
            ].map((r, i) => (
              <div key={i} style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: 8, marginBottom: 6, border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1c1917" }}>{r.learner}</span>
                  <span style={{ fontSize: 11, color: "#f59e0b" }}>{"⭐".repeat(r.rating)}</span>
                </div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{r.text}</div>
              </div>
            ))}
          </SectionCard>
        </div>
      )}

      {/* ── BATCHES CALENDAR ── */}
      {activeTab === "batches" && (
        <SectionCard title="📅 Trainer's Batch Schedule">
          {trainerBatches.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "#9ca3af" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
              <div>No batches assigned to this trainer yet.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {trainerBatches.map((b, i) => {
                const pct = Math.round((b.enrolled / b.capacity) * 100);
                const statusColor = { upcoming: "#2563eb", active: "#059669", completed: "#7c3aed", cancelled: "#dc2626" };
                return (
                  <div key={i} style={{ padding: "14px 18px", borderRadius: 14, border: `1px solid ${statusColor[b.status] || "#e5e7eb"}30`, background: `${statusColor[b.status] || "#f59e0b"}08` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#1c1917" }}>{b.name}</div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{b.course} · {b.mode}</div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 12, color: "#6b7280" }}>
                      <span>📅 {b.start} → {b.end}</span>
                      <span>🪑 {b.enrolled}/{b.capacity} seats</span>
                      <span>🖥️ {b.platform || b.mode}</span>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ height: 5, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? "#10b981" : "#f59e0b", borderRadius: 4 }} />
                      </div>
                      <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>{pct}% capacity filled</div>
                    </div>
                    {/* Trainer role badge */}
                    <div style={{ marginTop: 8 }}>
                      <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: b.trainer === trainer.name ? "#dbeafe" : "#f3f4f6", color: b.trainer === trainer.name ? "#1d4ed8" : "#6b7280" }}>
                        {b.trainer === trainer.name ? "👑 Primary Trainer" : "🎓 Co-Trainer"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      )}

      {/* ── MESSAGES ── */}
      {activeTab === "messages" && (
        <SectionCard title="💬 Communication Log — Admin ↔ Trainer">
          <div style={{ background: "#f9fafb", borderRadius: 14, padding: 16, marginBottom: 16, maxHeight: 360, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {msgLog.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "Admin" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: 12, background: m.from === "Admin" ? "#ede9fe" : "white", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{m.text}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>{m.from} · {m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <textarea
              style={{ ...S.input, flex: 1, height: 60, resize: "none", marginBottom: 0 }}
              value={msgText}
              onChange={e => setMsgText(e.target.value)}
              placeholder={`Write a message to ${trainer.name.split(" ")[0]}...`}
            />
            <button onClick={sendMsg} style={{ ...S.primaryBtn, alignSelf: "stretch", minWidth: 90 }}>📤 Send</button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {["Please review pending assignments", "Session reminder for tomorrow", "Please upload course material"].map(t => (
              <button key={t} onClick={() => setMsgText(t)} style={{ ...S.tblBtn, fontSize: 11 }}>{t}</button>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ── PAYOUTS ── */}
      {activeTab === "payouts" && (
        <SectionCard title="💰 Payout Management">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Total Earned",   val: "₹11,000", color: "#10b981", bg: "#d1fae5" },
              { label: "Pending Payout", val: "₹9,500",  color: "#f59e0b", bg: "#fef3c7" },
              { label: "This Month",     val: "₹3,000",  color: "#6366f1", bg: "#ede9fe" },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, borderRadius: 12, padding: "14px", textAlign: "center", border: `1px solid ${s.color}30` }}>
                <div style={{ fontSize: 11, color: s.color, fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#1c1917" }}>{s.val}</div>
              </div>
            ))}
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f1f5f9" }}>
                {["Session / Batch", "Date", "Type", "Amount", "Status", "Action"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textAlign: "left", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockPayouts.map((p, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f9fafb" }}>
                  <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#1c1917" }}>{p.session}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: "#6b7280" }}>{p.date}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: p.type === "Batch" ? "#dbeafe" : "#d1fae5", color: p.type === "Batch" ? "#1d4ed8" : "#059669" }}>{p.type}</span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 800, color: "#1c1917" }}>₹{p.amount.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "12px 14px" }}><StatusBadge status={p.status} /></td>
                  <td style={{ padding: "12px 14px" }}>
                    {p.status === "pending" && (
                      <button onClick={() => setToast({ msg: "Payout marked as paid!", type: "success" })} style={{ ...S.btnGreen, fontSize: 11, padding: "4px 10px" }}>Mark Paid</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}

      {/* ── PORTAL ACCESS ── */}
      {activeTab === "access" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <SectionCard title="🔐 Trainer Portal Permissions">
            <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#0369a1" }}>
              Trainers have a role-restricted dashboard. Toggle permissions below.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {portalPerms.map((perm, i) => {
                const isOn = (trainer.portalAccess || {})[perm.key] !== false;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{perm.icon} {perm.label}</span>
                    <div
                      onClick={() => savePortalAccess({ ...(trainer.portalAccess || {}), [perm.key]: !isOn })}
                      style={{ width: 42, height: 24, borderRadius: 12, background: isOn ? "#10b981" : "#e5e7eb", position: "relative", cursor: "pointer", transition: "background 0.3s", flexShrink: 0 }}>
                      <div style={{ position: "absolute", top: 2, left: isOn ? 18 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="🚫 Restricted Access">
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#991b1b" }}>
              These areas are always restricted for trainer role and cannot be unlocked.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {RESTRICTED_PERMS.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fca5a550" }}>
                  <span style={{ fontSize: 14 }}>🔒</span>
                  <span style={{ fontSize: 13, color: "#991b1b", fontWeight: 600 }}>{p}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>📧 Send Portal Invite</div>
              <button onClick={() => setToast({ msg: `Portal login invite sent to ${trainer.email || trainer.name}!`, type: "success" })}
                style={{ ...S.primaryBtn, width: "100%" }}>
                📧 Send Login Link to Trainer
              </button>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Assign Courses Modal */}
      {showCourses && (
        <Modal title={`📚 Assign Courses — ${trainer.name}`} onClose={() => setShowCourses(false)}>
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>Select courses this trainer can teach.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {ALL_COURSES.map(c => {
              const isSelected = assignedCourses.includes(c);
              return (
                <div key={c} onClick={() => setAssignedCourses(prev => isSelected ? prev.filter(x => x !== c) : [...prev, c])}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, cursor: "pointer", border: `1.5px solid ${isSelected ? "#6366f1" : "#e5e7eb"}`, background: isSelected ? "#ede9fe" : "#f9fafb" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${isSelected ? "#6366f1" : "#d1d5db"}`, background: isSelected ? "#6366f1" : "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", flexShrink: 0 }}>
                    {isSelected ? "✓" : ""}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: isSelected ? 700 : 500, color: isSelected ? "#4f46e5" : "#374151" }}>{c}</span>
                </div>
              );
            })}
          </div>
          <button onClick={() => { onUpdate({ ...trainer, assignedCourses }); setToast({ msg: "Courses assigned!", type: "success" }); setShowCourses(false); }}
            style={{ ...S.primaryBtn, width: "100%" }}>
            Save Assignments ({assignedCourses.length} selected)
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ── Add Trainer Modal ── */
function AddTrainerModal({ onAdd, onClose, setToast }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "",
    qualification: "Graduate", linkedin: "",
    bio: "", status: "active"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.subject) {
      setToast({ msg: "Name and expertise required.", type: "error" });
      return;
    }
    onAdd({
      id: Date.now(),
      ...form,
      courses: 0, batches: 0, sessions: 0, rating: 0,
      joined: new Date().toLocaleDateString("en-IN"),
      assignedCourses: [form.subject],
      portalAccess: {
        uploadContent: true,
        reviewAssignments: true,
        hostSessions: true,
        respondForum: true,
        viewOwnBatch: true,
      }
    });
    setToast({ msg: "Trainer added successfully!", type: "success" });
    onClose();
  };

  return (
    <Modal title="➕ Add New Trainer" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { key: "name",          label: "Full Name *",    icon: "👤", ph: "Dr. Rekha Iyer"         },
            { key: "subject",       label: "Expertise *",    icon: "📚", ph: "Early Childhood Ed"     },
            { key: "email",         label: "Email",          icon: "📧", ph: "trainer@spaceece.in", type: "email" },
            { key: "phone",         label: "Phone",          icon: "📱", ph: "+91 98765 43210"         },
            { key: "linkedin",      label: "LinkedIn URL",   icon: "🔗", ph: "linkedin.com/in/..."     },
            { key: "qualification", label: "Qualification",  icon: "🎓", ph: "M.Ed / PhD"             },
          ].map(f => (
            <div key={f.key}>
              <label style={S.label}>{f.label}</label>
              <div style={{ position: "relative" }}>
                <span style={S.fieldIcon}>{f.icon}</span>
                <input style={{ ...S.input, paddingLeft: 32 }} type={f.type || "text"} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.ph} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={S.label}>Bio / Description</label>
          <textarea style={{ ...S.input, height: 70, resize: "none" }} value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            placeholder="Short description of the trainer's background and teaching style..." />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, marginBottom: 20 }}>
          <div>
            <label style={S.label}>Status</label>
            <select style={S.input} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <button type="submit" style={{ ...S.primaryBtn, width: "100%" }}>Add Trainer →</button>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════
   MAIN TRAINER MANAGEMENT TAB — A5.1 + A5.2
══════════════════════════════════════════ */
function TrainerManagementTab({ trainers, setTrainers, batches, setToast }) {
  const [selected,    setSelected]    = useState(null);
  const [addModal,    setAddModal]    = useState(false);
  const [statusFilter,setStatusFilter]= useState("all");
  const [search,      setSearch]      = useState("");

  const addTrainer   = (t)       => setTrainers(prev => [...prev, t]);
  const updateTrainer= (updated) => setTrainers(prev => prev.map(t => t.id === updated.id ? updated : t));
  const deleteTrainer= (id)      => { setTrainers(prev => prev.filter(t => t.id !== id)); setToast({ msg: "Trainer removed.", type: "error" }); };

  const filtered = trainers.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (selected) return (
    <TrainerProfileView
      trainer={selected}
      batches={batches}
      onBack={() => setSelected(null)}
      setToast={setToast}
      onUpdate={updated => { updateTrainer(updated); setSelected(updated); }}
    />
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {addModal && <AddTrainerModal onAdd={addTrainer} onClose={() => setAddModal(false)} setToast={setToast} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={S.pageTitle}>Trainer Management</h1>
          <p style={S.pageSub}>
            {trainers.length} total &nbsp;·&nbsp;
            {trainers.filter(t => t.status === "active").length} active &nbsp;·&nbsp;
            {trainers.filter(t => t.status === "inactive").length} inactive
          </p>
        </div>
        <button onClick={() => setAddModal(true)} style={S.primaryBtn}>+ Add Trainer</button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon="🎓" label="Total Trainers"  val={trainers.length}                                     color="#6366f1" bg="#ede9fe" />
        <StatCard icon="✅" label="Active"           val={trainers.filter(t => t.status === "active").length}  color="#10b981" bg="#d1fae5" />
        <StatCard icon="📚" label="Courses Covered" val={trainers.reduce((a, t) => a + t.courses, 0)}          color="#f59e0b" bg="#fef3c7" />
        <StatCard icon="🎥" label="Total Sessions"  val={trainers.reduce((a, t) => a + t.sessions, 0)}         color="#3b82f6" bg="#dbeafe" />
        <StatCard icon="⭐" label="Avg Rating"      val={(trainers.filter(t=>t.rating>0).reduce((a,t)=>a+t.rating,0)/Math.max(1,trainers.filter(t=>t.rating>0).length)).toFixed(1)} color="#f59e0b" bg="#fef3c7" />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search trainer by name or expertise..." />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "active", "inactive"].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${statusFilter === f ? "#6366f1" : "#e5e7eb"}`, background: statusFilter === f ? "#ede9fe" : "white", color: statusFilter === f ? "#4f46e5" : "#6b7280", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
              {f === "all" ? "All Trainers" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Trainer Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
        {filtered.map((t, i) => {
          const trainerBatches = batches.filter(b => b.trainer === t.name || b.coTrainer === t.name);
          return (
            <div key={i} style={{ background: "white", borderRadius: 18, padding: "20px", border: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderTop: `3px solid ${t.status === "active" ? "#6366f1" : "#e5e7eb"}` }}>
              {/* Card Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "white", flexShrink: 0 }}>
                  {t.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#1c1917" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{t.subject}</div>
                  {t.qualification && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{t.qualification}</div>}
                </div>
                <StatusBadge status={t.status} />
              </div>

              {/* Stats Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, textAlign: "center", marginBottom: 14 }}>
                {[
                  { label: "Courses",  val: t.courses,       icon: "📚" },
                  { label: "Batches",  val: trainerBatches.length, icon: "🗂️" },
                  { label: "Sessions", val: t.sessions,      icon: "🎥" },
                  { label: "Rating",   val: t.rating || "—", icon: "⭐" },
                ].map((s, j) => (
                  <div key={j} style={{ background: "#f9fafb", borderRadius: 8, padding: "8px 4px", border: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: 12 }}>{s.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#1c1917" }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: "#9ca3af" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Bio preview */}
              {t.bio && (
                <p style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5, marginBottom: 12, borderTop: "1px solid #f3f4f6", paddingTop: 10 }}>
                  {t.bio.substring(0, 90)}{t.bio.length > 90 ? "..." : ""}
                </p>
              )}

              {/* Rating bar */}
              {t.rating > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 11 }}>
                    <span style={{ color: "#9ca3af" }}>Rating</span>
                    <span style={{ color: "#f59e0b", fontWeight: 700 }}>⭐ {t.rating} / 5.0</span>
                  </div>
                  <div style={{ height: 5, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(t.rating / 5) * 100}%`, background: "#f59e0b", borderRadius: 4 }} />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
                <button onClick={() => setSelected(t)} style={{ ...S.tblBtn, flex: 1, color: "#4f46e5", borderColor: "#c4b5fd" }}>👁 View Profile</button>
                <button onClick={() => { updateTrainer({ ...t, status: t.status === "active" ? "inactive" : "active" }); setToast({ msg: "Trainer status updated!", type: "success" }); }}
                  style={{ ...S.tblBtn, color: t.status === "active" ? "#d97706" : "#059669", borderColor: t.status === "active" ? "#fbbf24" : "#6ee7b7" }}>
                  {t.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => deleteTrainer(t.id)} style={{ ...S.tblBtn, color: "#dc2626", borderColor: "#fca5a5" }}>🗑️</button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>No trainers found</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Try adjusting your filters or add a new trainer</div>
        </div>
      )}
    </div>
  );
}
/* ── A6: Assignment Review ── */
function AssignmentReviewTab({ assignments, setAssignments, setToast }) {
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [courseFilter,  setCourseFilter]  = useState("all");
  const [trainerFilter, setTrainerFilter] = useState("all");
  const [sortBy,        setSortBy]        = useState("date");
  const [search,        setSearch]        = useState("");
  const [selected,      setSelected]      = useState(null);
  const [activePanel,   setActivePanel]   = useState("review"); // review | pdf | rubric
  const [aiLoading,     setAiLoading]     = useState(false);
  const [aiSuggestion,  setAiSuggestion]  = useState("");
  const [annoColor,     setAnnoColor]     = useState("#f59e0b");
  const [annoText,      setAnnoText]      = useState("");
  const [annoPage,      setAnnoPage]      = useState(1);
  const [addAnnoMode,   setAddAnnoMode]   = useState(false);
  const [assignModal,   setAssignModal]   = useState(null);
  const [assignTrainer, setAssignTrainer] = useState("");
 
  const TRAINERS = ["Dr. Rekha Iyer", "Prof. Amol Desai", "Ms. Geeta Rao", "Dr. Vikram Shah", "Mr. Sunil Mehta"];
  const ALL_COURSES = [...new Set(assignments.map(a => a.course))];
  const STATUS_COLOR = { pending: "#f59e0b", "under review": "#3b82f6", reviewed: "#10b981", revision: "#ef4444", approved: "#7c3aed" };
  const STATUS_BG    = { pending: "#fef9c3", "under review": "#dbeafe", reviewed: "#d1fae5", revision: "#fee2e2", approved: "#ede9fe" };
 
  // ── Filter + Sort ──
  const filtered = assignments
    .filter(a => {
      const q = search.toLowerCase();
      const matchSearch  = a.teacher.toLowerCase().includes(q) || a.title.toLowerCase().includes(q) || a.course.toLowerCase().includes(q);
      const matchStatus  = statusFilter  === "all" || a.status  === statusFilter;
      const matchCourse  = courseFilter  === "all" || a.course  === courseFilter;
      const matchTrainer = trainerFilter === "all" || a.trainer === trainerFilter;
      return matchSearch && matchStatus && matchCourse && matchTrainer;
    })
    .sort((a, b) => {
      if (sortBy === "date")    return new Date(b.submittedDate) - new Date(a.submittedDate);
      if (sortBy === "course")  return a.course.localeCompare(b.course);
      if (sortBy === "batch")   return a.batch.localeCompare(b.batch);
      if (sortBy === "status")  return a.status.localeCompare(b.status);
      return 0;
    });
 
  // ── Actions ──
  const updateAssignment = (id, changes) => {
    setAssignments(p => p.map(a => a.id === id ? { ...a, ...changes } : a));
    if (selected?.id === id) setSelected(s => ({ ...s, ...changes }));
  };
 
  const updateRubricScore = (id, index, score) => {
    const a = assignments.find(x => x.id === id);
    if (!a) return;
    const rubric = a.rubric.map((r, i) => i === index ? { ...r, score: score === "" ? null : Math.min(Number(score), r.maxScore) } : r);
    const total = rubric.reduce((sum, r) => sum + (r.score || 0), 0);
    updateAssignment(id, { rubric, score: total });
  };
 
  const handleApprove = id => {
    const a = assignments.find(x => x.id === id);
    if (!a) return;
    const rubricComplete = a.rubric.every(r => r.score !== null);
    if (!rubricComplete) { setToast({ msg: "Please fill all rubric scores first.", type: "error" }); return; }
    if (!a.feedback.trim()) { setToast({ msg: "Please add written feedback before approving.", type: "error" }); return; }
    updateAssignment(id, { status: "approved", reviewedBy: "Admin" });
    setToast({ msg: "Assignment approved! ✓", type: "success" });
  };
 
  const handleRevision = id => {
    const a = assignments.find(x => x.id === id);
    if (!a?.feedback.trim()) { setToast({ msg: "Add feedback before requesting revision.", type: "error" }); return; }
    updateAssignment(id, { status: "revision", reviewedBy: "Admin" });
    setToast({ msg: "Revision requested. Teacher notified.", type: "error" });
  };
 
  const handleMarkUnderReview = id => {
    updateAssignment(id, { status: "under review", reviewedBy: "Admin" });
    setToast({ msg: "Marked as Under Review.", type: "success" });
  };
 
  const handleNotify = id => {
    updateAssignment(id, { notified: true });
    setToast({ msg: "Teacher notified via email & in-app! 📨", type: "success" });
  };
 
  const handleAssignTrainer = id => {
    if (!assignTrainer) { setToast({ msg: "Select a trainer.", type: "error" }); return; }
    updateAssignment(id, { trainer: assignTrainer, status: "under review" });
    setAssignModal(null);
    setAssignTrainer("");
    setToast({ msg: `Assigned to ${assignTrainer}!`, type: "success" });
  };
 
  const addAnnotation = id => {
    if (!annoText.trim()) { setToast({ msg: "Annotation text cannot be empty.", type: "error" }); return; }
    const a = assignments.find(x => x.id === id);
    const newAnno = { id: Date.now(), page: annoPage, x: Math.round(Math.random() * 60 + 10), y: Math.round(Math.random() * 60 + 10), text: annoText, color: annoColor };
    updateAssignment(id, { annotations: [...(a?.annotations || []), newAnno] });
    setAnnoText("");
    setAddAnnoMode(false);
    setToast({ msg: "Annotation added!", type: "success" });
  };
 
  const removeAnnotation = (assignId, annoId) => {
    const a = assignments.find(x => x.id === assignId);
    updateAssignment(assignId, { annotations: a.annotations.filter(n => n.id !== annoId) });
  };
 
  const runAiFeedback = async id => {
    const a = assignments.find(x => x.id === id);
    if (!a) return;
    setAiLoading(true);
    setAiSuggestion("");
    await new Promise(r => setTimeout(r, 2000));
    const totalScore = a.rubric.reduce((s, r) => s + (r.score || 0), 0);
    const maxScore   = a.rubric.reduce((s, r) => s + r.maxScore, 0);
    const pct = maxScore ? Math.round((totalScore / maxScore) * 100) : 0;
    let suggestion = "";
    if (pct >= 85) {
      suggestion = `Dear ${a.teacher.split(" ")[0]},\n\nExcellent work on "${a.title}"! Your submission demonstrates a strong grasp of the core concepts. The content is well-structured, age-appropriate, and shows creativity. Your practical approach to the learning objectives is commendable.\n\nHighlights:\n• Strong content accuracy and curriculum alignment\n• Excellent presentation and layout\n• Creative and engaging activities\n\nKeep up the outstanding work! You are well on track in this course.\n\nBest regards,\nAdmin Team`;
    } else if (pct >= 60) {
      suggestion = `Dear ${a.teacher.split(" ")[0]},\n\nThank you for submitting "${a.title}". Your work shows a good foundational understanding. There are a few areas that could be strengthened:\n\n• Review the practical applicability section — consider adding more real classroom examples\n• The presentation could benefit from clearer headings and structure\n• Content accuracy is good overall but double-check Module 2 references\n\nPlease review the rubric feedback and feel free to resubmit if required.\n\nBest regards,\nAdmin Team`;
    } else {
      suggestion = `Dear ${a.teacher.split(" ")[0]},\n\nThank you for submitting "${a.title}". We appreciate your effort. However, the submission needs significant improvement in the following areas:\n\n• Content accuracy requires more alignment with course objectives\n• Activities need to be more age-appropriate for the target group\n• Presentation and formatting need to meet the assignment guidelines\n\nPlease review the detailed rubric scores, revise accordingly, and resubmit at your earliest.\n\nBest regards,\nAdmin Team`;
    }
    setAiSuggestion(suggestion);
    setAiLoading(false);
  };
 
  const applyAiFeedback = id => {
    updateAssignment(id, { feedback: aiSuggestion });
    setAiSuggestion("");
    setToast({ msg: "AI feedback applied!", type: "success" });
  };
 
  // ── Stats ──
  const pending    = assignments.filter(a => a.status === "pending").length;
  const underRev   = assignments.filter(a => a.status === "under review").length;
  const reviewed   = assignments.filter(a => a.status === "reviewed").length;
  const approved   = assignments.filter(a => a.status === "approved").length;
  const revision   = assignments.filter(a => a.status === "revision").length;
 
  // ─────────────────────────────────────────────
  //  REVIEW DETAIL VIEW
  // ─────────────────────────────────────────────
  if (selected) {
    const a = assignments.find(x => x.id === selected.id) || selected;
    const rubricTotal = a.rubric.reduce((s, r) => s + (r.score || 0), 0);
    const rubricMax   = a.rubric.reduce((s, r) => s + r.maxScore, 0);
    const rubricPct   = rubricMax ? Math.round((rubricTotal / rubricMax) * 100) : 0;
    const scoreColor  = rubricPct >= 80 ? "#10b981" : rubricPct >= 60 ? "#f59e0b" : "#ef4444";
 
    return (
      <div style={{ animation: "fadeIn 0.3s ease" }}>
 
        {/* Assign Trainer Modal */}
        {assignModal && (
          <div style={AR_OVERLAY}>
            <div style={AR_MODAL}>
              <div style={AR_HDR}>
                <span style={{ fontSize: 15, fontWeight: 800 }}>👩‍🏫 Assign Reviewer</span>
                <button onClick={() => setAssignModal(null)} style={AR_CLOSE}>✕</button>
              </div>
              <div style={{ padding: "20px 24px 24px" }}>
                <label style={S.label}>Select Trainer *</label>
                <select style={{ ...S.input, marginBottom: 20 }} value={assignTrainer} onChange={e => setAssignTrainer(e.target.value)}>
                  <option value="">Select a trainer...</option>
                  {TRAINERS.map(t => <option key={t}>{t}</option>)}
                </select>
                <button onClick={() => handleAssignTrainer(assignModal)} style={{ ...AR_BTN_PRIMARY, width: "100%" }}>
                  Assign & Notify →
                </button>
              </div>
            </div>
          </div>
        )}
 
        <button onClick={() => { setSelected(null); setAiSuggestion(""); }} style={S.backBtn}>← Back to Assignments</button>
 
        {/* Assignment Header */}
        <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "white", flexShrink: 0 }}>
              {a.teacher[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", marginBottom: 4 }}>{a.title}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: STATUS_BG[a.status] || "#f3f4f6", color: STATUS_COLOR[a.status] || "#6b7280" }}>
                  {a.status.toUpperCase()}
                </span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>👤 {a.teacher}</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>📚 {a.course}</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>🗂️ {a.batch}</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>📅 {a.submitted}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => setAssignModal(a.id)} style={AR_BTN_GHOST}>👩‍🏫 Assign</button>
              {!a.notified && (a.status === "approved" || a.status === "revision" || a.status === "reviewed") && (
                <button onClick={() => handleNotify(a.id)} style={{ ...AR_BTN_PRIMARY, background: "#8b5cf6" }}>📨 Notify Teacher</button>
              )}
              {a.notified && <span style={{ fontSize: 11, color: "#9ca3af", alignSelf: "center" }}>✓ Notified</span>}
            </div>
          </div>
 
          {/* Reviewer + Score strip */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Assigned Reviewer", val: a.trainer || "Unassigned" },
              { label: "Reviewed By",       val: a.reviewedBy || "—" },
              { label: "Total Score",       val: a.score != null ? `${a.score} / ${rubricMax}` : "—" },
              { label: "Percentage",        val: a.score != null ? `${rubricPct}%` : "—" },
            ].map((r, i) => (
              <div key={i} style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 13px", border: "1px solid #f3f4f6" }}>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 2 }}>{r.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: i === 2 || i === 3 ? scoreColor : "#0f172a" }}>{r.val}</div>
              </div>
            ))}
          </div>
 
          {/* Quick Action Buttons */}
          {(a.status === "pending" || a.status === "under review") && (
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              {a.status === "pending" && (
                <button onClick={() => handleMarkUnderReview(a.id)} style={{ ...AR_BTN_GHOST, color: "#2563eb", borderColor: "#93c5fd" }}>▶ Start Review</button>
              )}
              <button onClick={() => handleApprove(a.id)} style={{ ...AR_BTN_PRIMARY, background: "#059669" }}>✓ Approve</button>
              <button onClick={() => handleRevision(a.id)} style={{ ...AR_BTN_PRIMARY, background: "#dc2626" }}>↩ Request Revision</button>
            </div>
          )}
          {a.status === "revision" && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: "#fee2e2", borderRadius: 10, fontSize: 12, color: "#991b1b", border: "1px solid #fca5a5" }}>
              ↩ Revision requested. Awaiting teacher resubmission.
            </div>
          )}
          {a.status === "approved" && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: "#d1fae5", borderRadius: 10, fontSize: 12, color: "#065f46", border: "1px solid #86efac" }}>
              ✓ Assignment approved and marks finalised.
            </div>
          )}
        </div>
 
        {/* Panel Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: "2px solid #f3f4f6" }}>
          {[
            { key: "review", label: "✏️ Review & Feedback" },
            { key: "rubric", label: "📊 Scoring Rubric"    },
            { key: "pdf",    label: "📄 PDF Viewer"        },
          ].map(t => (
            <button key={t.key} onClick={() => setActivePanel(t.key)}
              style={{ padding: "10px 18px", border: "none", borderBottom: `2px solid ${activePanel === t.key ? "#f59e0b" : "transparent"}`, background: "none", color: activePanel === t.key ? "#92400e" : "#9ca3af", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: -2 }}>
              {t.label}
            </button>
          ))}
        </div>
 
        {/* ── REVIEW & FEEDBACK PANEL ── */}
        {activePanel === "review" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {/* Written Feedback */}
            <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>📝 Written Feedback</div>
                <button
                  onClick={() => runAiFeedback(a.id)}
                  disabled={aiLoading}
                  style={{ ...AR_BTN_PRIMARY, background: "#8b5cf6", fontSize: 11, opacity: aiLoading ? 0.7 : 1 }}>
                  {aiLoading ? "⏳ Generating..." : "🤖 AI Assist"}
                </button>
              </div>
 
              <textarea
                value={a.feedback}
                onChange={e => updateAssignment(a.id, { feedback: e.target.value })}
                rows={8}
                style={{ ...S.input, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6, fontSize: 13 }}
                placeholder="Write detailed feedback for the teacher here..."
              />
 
              {/* AI Suggestion */}
              {aiLoading && (
                <div style={{ marginTop: 10, padding: 14, background: "#f5f3ff", borderRadius: 10, border: "1px solid #c4b5fd", fontSize: 12, color: "#7c3aed" }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>🤖 AI is analysing rubric scores...</div>
                  <div style={{ height: 4, background: "#e5e7eb", borderRadius: 4, overflow: "hidden", marginTop: 8 }}>
                    <div style={{ height: "100%", width: "65%", background: "#8b5cf6", borderRadius: 4 }} />
                  </div>
                </div>
              )}
 
              {aiSuggestion && (
                <div style={{ marginTop: 10, padding: 14, background: "#f5f3ff", borderRadius: 10, border: "1px solid #c4b5fd" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", marginBottom: 6 }}>🤖 AI Suggested Feedback</div>
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: 11, color: "#374151", lineHeight: 1.6, fontFamily: "inherit", maxHeight: 180, overflowY: "auto" }}>{aiSuggestion}</pre>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button onClick={() => applyAiFeedback(a.id)} style={{ ...AR_BTN_PRIMARY, flex: 1, fontSize: 11 }}>✓ Use This Feedback</button>
                    <button onClick={() => setAiSuggestion("")} style={{ ...AR_BTN_GHOST, flex: 1, fontSize: 11 }}>✕ Dismiss</button>
                  </div>
                </div>
              )}
 
              {/* Approve / Revision buttons */}
              {(a.status === "pending" || a.status === "under review") && (
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button onClick={() => handleApprove(a.id)} style={{ ...AR_BTN_PRIMARY, flex: 1, background: "#059669" }}>✓ Approve</button>
                  <button onClick={() => handleRevision(a.id)} style={{ ...AR_BTN_PRIMARY, flex: 1, background: "#dc2626" }}>↩ Revision</button>
                </div>
              )}
 
              {/* Notify button */}
              {!a.notified && (a.status === "approved" || a.status === "revision") && (
                <button onClick={() => handleNotify(a.id)} style={{ ...AR_BTN_PRIMARY, width: "100%", marginTop: 10, background: "#8b5cf6" }}>
                  📨 Send Feedback Notification to Teacher
                </button>
              )}
              {a.notified && (
                <div style={{ marginTop: 10, fontSize: 12, color: "#059669", fontWeight: 600, textAlign: "center" }}>✓ Teacher has been notified</div>
              )}
            </div>
 
            {/* Rubric Summary */}
            <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 14 }}>📊 Rubric Summary</div>
              {a.rubric.map((r, i) => {
                const rPct = r.score != null ? Math.round((r.score / r.maxScore) * 100) : 0;
                const rColor = r.score != null ? (rPct >= 80 ? "#10b981" : rPct >= 60 ? "#f59e0b" : "#ef4444") : "#d1d5db";
                return (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                      <span style={{ fontWeight: 700, color: "#374151" }}>{r.criterion}</span>
                      <span style={{ fontWeight: 800, color: rColor }}>
                        {r.score != null ? `${r.score} / ${r.maxScore}` : `— / ${r.maxScore}`}
                      </span>
                    </div>
                    <div style={{ height: 7, background: "#f3f4f6", borderRadius: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${rPct}%`, background: rColor, borderRadius: 6, transition: "width .5s" }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ borderTop: "2px solid #f3f4f6", paddingTop: 12, marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Total</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: scoreColor }}>{rubricTotal} / {rubricMax}</span>
                </div>
                <div style={{ height: 8, background: "#f3f4f6", borderRadius: 6, overflow: "hidden", marginTop: 8 }}>
                  <div style={{ height: "100%", width: `${rubricPct}%`, background: scoreColor, borderRadius: 6 }} />
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textAlign: "right" }}>
                  {rubricPct >= 80 ? "🟢 Pass" : rubricPct >= 60 ? "🟡 Borderline" : "🔴 Fail"}
                </div>
              </div>
            </div>
          </div>
        )}
 
        {/* ── SCORING RUBRIC PANEL ── */}
        {activePanel === "rubric" && (
          <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>📊 Scoring Rubric — {a.title}</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>Enter marks for each criterion. Total = {rubricMax} marks.</div>
 
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {a.rubric.map((r, i) => {
                const rPct   = r.score != null ? Math.round((r.score / r.maxScore) * 100) : 0;
                const rColor = r.score != null ? (rPct >= 80 ? "#10b981" : rPct >= 60 ? "#f59e0b" : "#ef4444") : "#d1d5db";
                return (
                  <div key={i} style={{ padding: 16, background: "#f9fafb", borderRadius: 12, border: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{r.criterion}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>Maximum: {r.maxScore} marks</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input
                          type="number"
                          min="0"
                          max={r.maxScore}
                          value={r.score ?? ""}
                          onChange={e => updateRubricScore(a.id, i, e.target.value)}
                          placeholder="0"
                          style={{ width: 70, padding: "8px 10px", borderRadius: 9, border: `2px solid ${rColor}`, fontFamily: "inherit", fontSize: 16, fontWeight: 800, color: rColor, textAlign: "center", outline: "none" }}
                        />
                        <span style={{ fontSize: 14, color: "#9ca3af" }}>/ {r.maxScore}</span>
                      </div>
                    </div>
                    <div style={{ height: 6, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${rPct}%`, background: rColor, borderRadius: 4, transition: "width .4s" }} />
                    </div>
 
                    {/* Per-criterion guide */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginTop: 10 }}>
                      {[
                        { label: "Excellent", range: `${r.maxScore}–${Math.ceil(r.maxScore * 0.85)}`, color: "#10b981" },
                        { label: "Good",      range: `${Math.ceil(r.maxScore * 0.84)}–${Math.ceil(r.maxScore * 0.70)}`, color: "#3b82f6" },
                        { label: "Average",   range: `${Math.ceil(r.maxScore * 0.69)}–${Math.ceil(r.maxScore * 0.50)}`, color: "#f59e0b" },
                        { label: "Poor",      range: `< ${Math.ceil(r.maxScore * 0.50)}`, color: "#ef4444" },
                      ].map((g, j) => (
                        <div key={j} style={{ padding: "4px 8px", borderRadius: 6, background: `${g.color}15`, textAlign: "center" }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: g.color }}>{g.label}</div>
                          <div style={{ fontSize: 9, color: "#9ca3af" }}>{g.range}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
 
            {/* Total */}
            <div style={{ marginTop: 20, padding: 18, background: `${scoreColor}15`, borderRadius: 14, border: `2px solid ${scoreColor}40`, textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 4 }}>Total Score</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: scoreColor }}>{rubricTotal} <span style={{ fontSize: 18, color: "#9ca3af" }}>/ {rubricMax}</span></div>
              <div style={{ fontSize: 14, fontWeight: 700, color: scoreColor, marginTop: 4 }}>{rubricPct}% — {rubricPct >= 80 ? "Pass ✓" : rubricPct >= 60 ? "Borderline" : "Fail ✕"}</div>
            </div>
 
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={() => handleApprove(a.id)} style={{ ...AR_BTN_PRIMARY, flex: 1, background: "#059669" }}>✓ Approve with These Scores</button>
              <button onClick={() => handleRevision(a.id)} style={{ ...AR_BTN_PRIMARY, flex: 1, background: "#dc2626" }}>↩ Request Revision</button>
            </div>
          </div>
        )}
 
        {/* ── PDF VIEWER & ANNOTATION PANEL ── */}
        {activePanel === "pdf" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
            {/* PDF Viewer (simulated) */}
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "12px 16px", background: "#f9fafb", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>📄</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", flex: 1 }}>{a.title}.pdf</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>Page</span>
                  <input type="number" min="1" max="5" value={annoPage} onChange={e => setAnnoPage(Number(e.target.value))}
                    style={{ width: 48, padding: "4px 8px", borderRadius: 6, border: "1px solid #e5e7eb", textAlign: "center", fontSize: 12, fontFamily: "inherit" }} />
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>of 5</span>
                </div>
              </div>
 
              {/* Simulated PDF page with annotations */}
              <div style={{ position: "relative", background: "#fff", minHeight: 480, padding: 24 }}>
                {/* Fake PDF content */}
                <div style={{ fontFamily: "Georgia, serif", color: "#374151" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, textAlign: "center", color: "#0f172a" }}>
                    {a.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginBottom: 20 }}>
                    Submitted by {a.teacher} · {a.submitted} · {a.course}
                  </div>
                  {[
                    "This assignment explores the core principles of early childhood education with a specific focus on age-appropriate learning methodologies.",
                    "Section 1: Learning Objectives — The primary objective of this lesson plan is to foster foundational literacy skills among children aged 3-4 years through play-based learning.",
                    "Section 2: Activity Design — Each activity has been carefully designed to align with developmental milestones and NEP 2020 guidelines for the foundational stage.",
                    "Section 3: Assessment Strategy — Formative assessment will be conducted through observation checklists and portfolio documentation.",
                    "Section 4: Resources Required — Materials include story cards, number blocks, sand trays, and printed worksheets tailored for motor skill development.",
                  ].map((para, pi) => (
                    <p key={pi} style={{ fontSize: 12, lineHeight: 1.8, marginBottom: 12, color: "#374151" }}>{para}</p>
                  ))}
                </div>
 
                {/* Annotation pins */}
                {(a.annotations || []).filter(n => n.page === annoPage).map(ann => (
                  <div key={ann.id} style={{ position: "absolute", left: `${ann.x}%`, top: `${ann.y}%`, zIndex: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: ann.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white", fontWeight: 800, cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", border: "2px solid white" }}
                      title={ann.text}>💬</div>
                    <div style={{ position: "absolute", left: 28, top: -4, background: ann.color, color: "white", padding: "4px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", maxWidth: 160 }}>
                      {ann.text}
                    </div>
                  </div>
                ))}
 
                {/* Click to annotate overlay */}
                {addAnnoMode && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(245,158,11,0.08)", border: "2px dashed #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "crosshair", zIndex: 5 }}>
                    <div style={{ background: "#fef3c7", borderRadius: 10, padding: "10px 16px", fontSize: 12, fontWeight: 700, color: "#92400e" }}>Click anywhere on the document to place annotation</div>
                  </div>
                )}
              </div>
            </div>
 
            {/* Annotation Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "white", borderRadius: 16, padding: 16, border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>✍️ Add Annotation</div>
                <label style={S.label}>Annotation Text</label>
                <textarea value={annoText} onChange={e => setAnnoText(e.target.value)} rows={3}
                  style={{ ...S.input, resize: "none", marginBottom: 10, fontSize: 12 }}
                  placeholder="Add a note or comment..." />
                <label style={S.label}>Colour</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {["#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6"].map(c => (
                    <div key={c} onClick={() => setAnnoColor(c)}
                      style={{ width: 26, height: 26, borderRadius: "50%", background: c, cursor: "pointer", border: `3px solid ${annoColor === c ? "#0f172a" : "transparent"}` }} />
                  ))}
                </div>
                <button onClick={() => addAnnotation(a.id)} style={{ ...AR_BTN_PRIMARY, width: "100%" }}>📌 Add Pin (Page {annoPage})</button>
              </div>
 
              {/* Existing Annotations */}
              <div style={{ background: "white", borderRadius: 16, padding: 16, border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>
                  📋 Annotations ({(a.annotations || []).length})
                </div>
                {(a.annotations || []).length === 0 ? (
                  <div style={{ textAlign: "center", padding: 20, color: "#9ca3af", fontSize: 12 }}>No annotations yet</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
                    {(a.annotations || []).map(ann => (
                      <div key={ann.id} style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${ann.color}40`, background: `${ann.color}10`, display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: ann.color, flexShrink: 0, marginTop: 2 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.4 }}>{ann.text}</div>
                          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>Page {ann.page}</div>
                        </div>
                        <button onClick={() => removeAnnotation(a.id, ann.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 14, padding: 0 }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
 
  // ─────────────────────────────────────────────
  //  INBOX LIST VIEW
  // ─────────────────────────────────────────────
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
 
      {/* Assign Trainer Modal (from list) */}
      {assignModal && (
        <div style={AR_OVERLAY}>
          <div style={AR_MODAL}>
            <div style={AR_HDR}>
              <span style={{ fontSize: 15, fontWeight: 800 }}>👩‍🏫 Assign Reviewer</span>
              <button onClick={() => setAssignModal(null)} style={AR_CLOSE}>✕</button>
            </div>
            <div style={{ padding: "20px 24px 24px" }}>
              <label style={S.label}>Select Trainer *</label>
              <select style={{ ...S.input, marginBottom: 20 }} value={assignTrainer} onChange={e => setAssignTrainer(e.target.value)}>
                <option value="">Select a trainer...</option>
                {TRAINERS.map(t => <option key={t}>{t}</option>)}
              </select>
              <button onClick={() => handleAssignTrainer(assignModal)} style={{ ...AR_BTN_PRIMARY, width: "100%" }}>
                Assign & Notify →
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={S.pageTitle}>Assignment Review</h1>
          <p style={S.pageSub}>{pending} pending · {underRev} under review · {revision} revision requested</p>
        </div>
      </div>
 
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { icon: "📥", label: "Pending",      val: pending,  color: "#f59e0b", bg: "#fef9c3" },
          { icon: "🔍", label: "Under Review", val: underRev, color: "#3b82f6", bg: "#dbeafe" },
          { icon: "✅", label: "Reviewed",     val: reviewed, color: "#10b981", bg: "#d1fae5" },
          { icon: "↩", label: "Revision",      val: revision, color: "#ef4444", bg: "#fee2e2" },
          { icon: "🏅", label: "Approved",     val: approved, color: "#7c3aed", bg: "#ede9fe" },
        ].map((k, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: "12px 14px", border: `1px solid ${k.color}30`, borderLeft: `3px solid ${k.color}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", cursor: "pointer" }}
            onClick={() => setStatusFilter(statusFilter === k.label.toLowerCase() ? "all" : k.label.toLowerCase())}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{k.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{k.val}</div>
            <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".3px" }}>{k.label}</div>
          </div>
        ))}
      </div>
 
      {/* Filters */}
      <div style={{ background: "white", borderRadius: 14, padding: "14px 18px", border: "1px solid #f1f5f9", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teacher, title, course..."
              style={{ ...S.input, paddingLeft: 34, marginBottom: 0 }} />
          </div>
          {/* Status filter pills */}
          {["all", "pending", "under review", "reviewed", "revision", "approved"].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              style={{ padding: "7px 12px", borderRadius: 8, border: `1.5px solid ${statusFilter === f ? "#f59e0b" : "#e5e7eb"}`, background: statusFilter === f ? "#fef3c7" : "white", color: statusFilter === f ? "#92400e" : "#6b7280", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize", whiteSpace: "nowrap" }}>
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 10 }}>
          {/* Course filter */}
          <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} style={{ ...S.input, marginBottom: 0, width: 220 }}>
            <option value="all">All Courses</option>
            {ALL_COURSES.map(c => <option key={c} value={c}>{c.substring(0, 30)}</option>)}
          </select>
          {/* Trainer filter */}
          <select value={trainerFilter} onChange={e => setTrainerFilter(e.target.value)} style={{ ...S.input, marginBottom: 0, width: 200 }}>
            <option value="all">All Trainers</option>
            {TRAINERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...S.input, marginBottom: 0, width: 160 }}>
            <option value="date">Sort: Date</option>
            <option value="course">Sort: Course</option>
            <option value="batch">Sort: Batch</option>
            <option value="status">Sort: Status</option>
          </select>
          {(search || statusFilter !== "all" || courseFilter !== "all" || trainerFilter !== "all") && (
            <button onClick={() => { setSearch(""); setStatusFilter("all"); setCourseFilter("all"); setTrainerFilter("all"); }}
              style={{ ...AR_BTN_GHOST, color: "#ef4444", borderColor: "#fca5a5" }}>✕ Clear</button>
          )}
        </div>
      </div>
 
      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>Showing {filtered.length} of {assignments.length} assignments</div>
 
      {/* Inbox List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(a => {
          const rubricTotal = a.rubric.reduce((s, r) => s + (r.score || 0), 0);
          const rubricMax   = a.rubric.reduce((s, r) => s + r.maxScore, 0);
          const rubricPct   = rubricMax ? Math.round((rubricTotal / rubricMax) * 100) : 0;
          const sc          = rubricPct >= 80 ? "#10b981" : rubricPct >= 60 ? "#f59e0b" : "#ef4444";
 
          return (
            <div key={a.id} style={{ background: "white", borderRadius: 14, padding: "16px 20px", border: "1px solid #f1f5f9", borderLeft: `4px solid ${STATUS_COLOR[a.status] || "#e5e7eb"}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Avatar */}
                <div style={{ width: 42, height: 42, borderRadius: 11, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: "white", flexShrink: 0 }}>{a.teacher[0]}</div>
 
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span>👤 {a.teacher}</span>
                    <span>📚 {a.course}</span>
                    <span>🗂️ {a.batch}</span>
                    <span>👩‍🏫 {a.trainer}</span>
                    <span>📅 {a.submitted}</span>
                  </div>
                </div>
 
                {/* Score badge */}
                {a.score != null && (
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: sc }}>{a.score}</div>
                    <div style={{ fontSize: 10, color: "#9ca3af" }}>/ {rubricMax}</div>
                  </div>
                )}
 
                {/* Status + notified */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, background: STATUS_BG[a.status] || "#f3f4f6", color: STATUS_COLOR[a.status] || "#6b7280" }}>
                    {a.status.toUpperCase()}
                  </span>
                  {a.notified && <span style={{ fontSize: 10, color: "#059669" }}>✓ Notified</span>}
                </div>
 
                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => { setSelected(a); setActivePanel("review"); }}
                    style={{ ...AR_BTN_PRIMARY, fontSize: 12 }}>
                    {a.status === "pending" ? "▶ Review" : "👁 View"}
                  </button>
                  {a.status === "pending" && (
                    <button onClick={() => setAssignModal(a.id)} style={AR_BTN_GHOST}>Assign</button>
                  )}
                  {!a.notified && (a.status === "approved" || a.status === "revision") && (
                    <button onClick={() => handleNotify(a.id)} style={{ ...AR_BTN_GHOST, color: "#8b5cf6", borderColor: "#c4b5fd" }}>📨</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>No assignments found</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── A7: Attendance Management ── */
/* ═══════════════════════════════════════════════════════════
   ATTENDANCE MANAGEMENT TAB — A9.1 + A9.2
   Paste this block into AdminDashboard.jsx
   replacing the old AttendanceTab function.
═══════════════════════════════════════════════════════════ */

/* ── Attendance Mock Data (add to your MOCK DATA section) ──
const MOCK_ATTENDANCE_RECORDS = [
  { id:1, teacherId:1, teacherName:"Priya Sharma",  sessionId:1, sessionTitle:"Classroom Management Techniques",  batch:"Batch A", date:"02/06/2026", status:"present",  markedBy:"auto",  note:"" },
  { id:2, teacherId:4, teacherName:"Meera Patel",   sessionId:1, sessionTitle:"Classroom Management Techniques",  batch:"Batch A", date:"02/06/2026", status:"late",     markedBy:"auto",  note:"Joined 10 mins late" },
  { id:3, teacherId:2, teacherName:"Rahul Verma",   sessionId:2, sessionTitle:"Montessori Material Demonstration",batch:"Batch B", date:"03/06/2026", status:"present",  markedBy:"auto",  note:"" },
  { id:4, teacherId:7, teacherName:"Deepak Nair",   sessionId:2, sessionTitle:"Montessori Material Demonstration",batch:"Batch B", date:"03/06/2026", status:"absent",   markedBy:"auto",  note:"" },
  { id:5, teacherId:5, teacherName:"Suresh Kumar",  sessionId:3, sessionTitle:"NEP 2020 Overview & FLN Goals",    batch:"Batch C", date:"01/06/2026", status:"present",  markedBy:"auto",  note:"" },
  { id:6, teacherId:1, teacherName:"Priya Sharma",  sessionId:5, sessionTitle:"Digital Tools for Preschool",      batch:"Batch A", date:"05/06/2026", status:"excused",  markedBy:"admin", note:"Medical leave" },
  { id:7, teacherId:4, teacherName:"Meera Patel",   sessionId:5, sessionTitle:"Digital Tools for Preschool",      batch:"Batch A", date:"05/06/2026", status:"present",  markedBy:"auto",  note:"" },
  { id:8, teacherId:2, teacherName:"Rahul Verma",   sessionId:4, sessionTitle:"Child Development Milestones",     batch:"Batch B", date:"30/05/2026", status:"present",  markedBy:"auto",  note:"" },
  { id:9, teacherId:7, teacherName:"Deepak Nair",   sessionId:4, sessionTitle:"Child Development Milestones",     batch:"Batch B", date:"30/05/2026", status:"present",  markedBy:"auto",  note:"" },
];
── end of mock data ── */

/* ── Audit Log Entry ── */
function AuditLogEntry({ entry }) {
  return (
    <div style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:"1px solid #f3f4f6", alignItems:"flex-start" }}>
      <div style={{ width:28, height:28, borderRadius:8, background:"#f0f9ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>📝</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:12, color:"#1c1917", fontWeight:600 }}>{entry.action}</div>
        <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>{entry.by} · {entry.time}</div>
      </div>
    </div>
  );
}

/* ── Status Badge for Attendance ── */
function AttStatusBadge({ status }) {
  const map = {
    present: { label:"Present", color:"#059669", bg:"#d1fae5" },
    late:    { label:"Late",    color:"#d97706", bg:"#fef3c7" },
    absent:  { label:"Absent",  color:"#dc2626", bg:"#fee2e2" },
    excused: { label:"Excused", color:"#6366f1", bg:"#ede9fe" },
  };
  const s = map[status] || { label:status, color:"#6b7280", bg:"#f3f4f6" };
  return (
    <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, color:s.color, background:s.bg, border:`1px solid ${s.color}30`, whiteSpace:"nowrap" }}>
      {s.label}
    </span>
  );
}

/* ── Manual Attendance Entry Modal ── */
function ManualAttendanceModal({ session, teachers, existingRecords, onSave, onClose, setToast }) {
  const batchTeachers = teachers.filter(t => t.batch === session.batch && t.status === "approved");
  const [entries, setEntries] = useState(
    batchTeachers.map(t => {
      const existing = existingRecords.find(r => r.teacherId === t.id && r.sessionId === session.id);
      return {
        teacherId:   t.id,
        teacherName: t.name,
        status:      existing?.status || "present",
        note:        existing?.note   || "",
      };
    })
  );

  const setStatus = (teacherId, status) =>
    setEntries(prev => prev.map(e => e.teacherId === teacherId ? { ...e, status } : e));

  const setNote = (teacherId, note) =>
    setEntries(prev => prev.map(e => e.teacherId === teacherId ? { ...e, note } : e));

  const handleSave = () => {
    const newRecords = entries.map(e => ({
      id:           Date.now() + e.teacherId,
      teacherId:    e.teacherId,
      teacherName:  e.teacherName,
      sessionId:    session.id,
      sessionTitle: session.title,
      batch:        session.batch,
      date:         session.date,
      status:       e.status,
      markedBy:     "admin",
      note:         e.note,
    }));
    onSave(newRecords, session.id);
    setToast({ msg:`Attendance saved for ${session.title}!`, type:"success" });
    onClose();
  };

  const statusColors = {
    present: { bg:"#d1fae5", color:"#059669", border:"#6ee7b7" },
    late:    { bg:"#fef3c7", color:"#d97706", border:"#fbbf24" },
    absent:  { bg:"#fee2e2", color:"#dc2626", border:"#fca5a5" },
    excused: { bg:"#ede9fe", color:"#6366f1", border:"#c4b5fd" },
  };

  return (
    <Modal title={`📋 Manual Attendance — ${session.title}`} onClose={onClose}>
      <div style={{ background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#0369a1" }}>
        📅 {session.date} · 🗂️ {session.batch} · 🕐 {session.time || "—"}
      </div>
      <div style={{ maxHeight:360, overflowY:"auto" }}>
        {batchTeachers.length === 0 ? (
          <div style={{ textAlign:"center", padding:20, color:"#9ca3af", fontSize:13 }}>No approved teachers in {session.batch}</div>
        ) : (
          entries.map(e => (
            <div key={e.teacherId} style={{ padding:"12px 0", borderBottom:"1px solid #f3f4f6" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"white", flexShrink:0 }}>
                  {e.teacherName[0]}
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:"#1c1917", flex:1 }}>{e.teacherName}</div>
                <div style={{ display:"flex", gap:6 }}>
                  {["present","late","absent","excused"].map(s => (
                    <button key={s} onClick={() => setStatus(e.teacherId, s)}
                      style={{ padding:"4px 10px", borderRadius:8, border:`1.5px solid ${e.status===s?statusColors[s].border:"#e5e7eb"}`, background:e.status===s?statusColors[s].bg:"white", color:e.status===s?statusColors[s].color:"#9ca3af", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {(e.status === "late" || e.status === "excused" || e.status === "absent") && (
                <input
                  style={{ ...S.input, fontSize:11, padding:"6px 10px", marginLeft:42 }}
                  value={e.note}
                  onChange={ev => setNote(e.teacherId, ev.target.value)}
                  placeholder={e.status === "excused" ? "Reason for excuse..." : e.status === "late" ? "How late? Note..." : "Reason for absence..."}
                />
              )}
            </div>
          ))
        )}
      </div>
      <div style={{ display:"flex", gap:10, marginTop:16 }}>
        <button onClick={handleSave} style={{ ...S.primaryBtn, flex:1 }}>💾 Save Attendance</button>
        <button onClick={onClose}   style={{ ...S.tblBtn,    flex:1 }}>Cancel</button>
      </div>
    </Modal>
  );
}

/* ── Edit Single Record Modal (Audit Log) ── */
function EditRecordModal({ record, onSave, onClose, setToast }) {
  const [status, setStatus] = useState(record.status);
  const [note,   setNote]   = useState(record.note || "");

  const handleSave = () => {
    onSave({ ...record, status, note, markedBy:"admin", editedAt:new Date().toLocaleString("en-IN") });
    setToast({ msg:"Attendance record updated!", type:"success" });
    onClose();
  };

  return (
    <Modal title={`✏️ Edit Attendance — ${record.teacherName}`} onClose={onClose}>
      <div style={{ background:"#f9fafb", borderRadius:10, padding:"12px 14px", marginBottom:14, fontSize:12, color:"#6b7280" }}>
        Session: <b>{record.sessionTitle}</b> · Date: <b>{record.date}</b>
      </div>
      <label style={S.label}>Status</label>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {["present","late","absent","excused"].map(s => (
          <button key={s} onClick={() => setStatus(s)}
            style={{ flex:1, padding:"8px", borderRadius:8, border:`1.5px solid ${status===s?"#f59e0b":"#e5e7eb"}`, background:status===s?"#fef3c7":"white", color:status===s?"#92400e":"#6b7280", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize" }}>
            {s}
          </button>
        ))}
      </div>
      <label style={S.label}>Note / Reason</label>
      <textarea style={{ ...S.input, height:70, resize:"none", marginBottom:14 }} value={note} onChange={e=>setNote(e.target.value)} placeholder="Reason for change..."/>
      <div style={{ background:"#fef3c7", border:"1px solid #fbbf24", borderRadius:8, padding:"8px 12px", fontSize:11, color:"#92400e", marginBottom:16 }}>
        ⚠️ This edit will be logged in the audit trail with your admin credentials.
      </div>
      <button onClick={handleSave} style={{ ...S.primaryBtn, width:"100%" }}>Save Change →</button>
    </Modal>
  );
}

/* ══════════════════════════════════════════
   MAIN ATTENDANCE MANAGEMENT TAB — A9.1 + A9.2
══════════════════════════════════════════ */
function AttendanceTab({ teachers, sessions, attendanceRecords: propRecords, setAttendanceRecords: setPropRecords }) {
  /* ── Fallback internal state if prop not passed ── */
  const INITIAL_RECORDS = [
    { id:1, teacherId:1, teacherName:"Priya Sharma",  sessionId:1, sessionTitle:"Classroom Management Techniques",   batch:"Batch A", date:"02/06/2026", status:"present", markedBy:"auto",  note:"" },
    { id:2, teacherId:4, teacherName:"Meera Patel",   sessionId:1, sessionTitle:"Classroom Management Techniques",   batch:"Batch A", date:"02/06/2026", status:"late",    markedBy:"auto",  note:"Joined 10 mins late" },
    { id:3, teacherId:2, teacherName:"Rahul Verma",   sessionId:2, sessionTitle:"Montessori Material Demonstration", batch:"Batch B", date:"03/06/2026", status:"present", markedBy:"auto",  note:"" },
    { id:4, teacherId:7, teacherName:"Deepak Nair",   sessionId:2, sessionTitle:"Montessori Material Demonstration", batch:"Batch B", date:"03/06/2026", status:"absent",  markedBy:"auto",  note:"" },
    { id:5, teacherId:5, teacherName:"Suresh Kumar",  sessionId:3, sessionTitle:"NEP 2020 Overview & FLN Goals",     batch:"Batch C", date:"01/06/2026", status:"present", markedBy:"auto",  note:"" },
    { id:6, teacherId:1, teacherName:"Priya Sharma",  sessionId:5, sessionTitle:"Digital Tools for Preschool",       batch:"Batch A", date:"05/06/2026", status:"excused", markedBy:"admin", note:"Medical leave" },
    { id:7, teacherId:4, teacherName:"Meera Patel",   sessionId:5, sessionTitle:"Digital Tools for Preschool",       batch:"Batch A", date:"05/06/2026", status:"present", markedBy:"auto",  note:"" },
    { id:8, teacherId:2, teacherName:"Rahul Verma",   sessionId:4, sessionTitle:"Child Development Milestones",      batch:"Batch B", date:"30/05/2026", status:"present", markedBy:"auto",  note:"" },
    { id:9, teacherId:7, teacherName:"Deepak Nair",   sessionId:4, sessionTitle:"Child Development Milestones",      batch:"Batch B", date:"30/05/2026", status:"present", markedBy:"auto",  note:"" },
  ];

  const [records,       setRecordsState] = useState(propRecords || INITIAL_RECORDS);
  const [activeTab,     setActiveTab]    = useState("register");
  const [batchFilter,   setBatchFilter]  = useState("all");
  const [sessionFilter, setSessionFilter]= useState("all");
  const [manualModal,   setManualModal]  = useState(null);  // session object
  const [editModal,     setEditModal]    = useState(null);  // record object
  const [auditLog,      setAuditLog]     = useState([
    { action:"Auto-captured attendance for Classroom Management (Batch A)",  by:"System (Zoom webhook)", time:"02/06/2026 11:32 AM" },
    { action:"Auto-captured attendance for Montessori Demonstration (Batch B)", by:"System (Google Meet)", time:"03/06/2026 12:05 PM" },
    { action:"Manual edit: Priya Sharma → Excused (Medical leave)",          by:"Admin",                  time:"05/06/2026 02:10 PM" },
  ]);

  const setRecords = (val) => {
    setRecordsState(val);
    if (setPropRecords) setPropRecords(val);
  };

  /* ── Derived Data ── */
  const batches  = ["all", ...new Set(sessions.map(s => s.batch))];
  const approved = teachers.filter(t => t.status === "approved");

  /* Per-teacher attendance percentage */
  const teacherStats = approved.map(t => {
    const teacherRecs = records.filter(r => r.teacherId === t.id);
    const total   = teacherRecs.length;
    const present = teacherRecs.filter(r => r.status === "present" || r.status === "late").length;
    const pct     = total > 0 ? Math.round((present / total) * 100) : t.attendance;
    return { ...t, recordCount:total, presentCount:present, pct };
  });

  const lowAlert  = teacherStats.filter(t => t.pct < 60);
  const warnAlert = teacherStats.filter(t => t.pct >= 60 && t.pct < 75);

  /* Session-level attendance matrix */
  const filteredSessions = sessions.filter(s => batchFilter === "all" || s.batch === batchFilter);

  /* Per-session stats */
  const sessionStats = filteredSessions.map(s => {
    const recs     = records.filter(r => r.sessionId === s.id);
    const present  = recs.filter(r => r.status === "present").length;
    const late     = recs.filter(r => r.status === "late").length;
    const absent   = recs.filter(r => r.status === "absent").length;
    const excused  = recs.filter(r => r.status === "excused").length;
    return { ...s, present, late, absent, excused, total:recs.length };
  });

  /* Batch comparison */
  const batchNames = [...new Set(sessions.map(s => s.batch))];
  const batchComparison = batchNames.map(batch => {
    const batchRecs     = records.filter(r => r.batch === batch);
    const batchPresent  = batchRecs.filter(r => r.status === "present" || r.status === "late").length;
    const pct           = batchRecs.length > 0 ? Math.round((batchPresent / batchRecs.length) * 100) : 0;
    return { batch, total:batchRecs.length, present:batchPresent, pct };
  });

  /* Save manual attendance */
  const saveManualAttendance = (newRecs, sessionId) => {
    setRecords(prev => {
      const filtered = prev.filter(r => r.sessionId !== sessionId || !newRecs.find(nr => nr.teacherId === r.teacherId));
      return [...filtered, ...newRecs];
    });
    setAuditLog(prev => [{
      action:`Manual attendance entered for session ID ${sessionId}`,
      by:"Admin",
      time:new Date().toLocaleString("en-IN"),
    }, ...prev]);
  };

  /* Save edit */
  const saveEdit = (updated) => {
    setRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
    setAuditLog(prev => [{
      action:`Edited: ${updated.teacherName} → ${updated.status}${updated.note ? ` (${updated.note})` : ""}`,
      by:"Admin",
      time:new Date().toLocaleString("en-IN"),
    }, ...prev]);
  };

  /* Export CSV */
  const exportCSV = () => {
    const headers = ["Teacher","Session","Batch","Date","Status","Marked By","Note"];
    const rows    = records.map(r => [r.teacherName, r.sessionTitle, r.batch, r.date, r.status, r.markedBy, r.note]);
    const csv     = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(",")).join("\n");
    const blob    = new Blob([csv], { type:"text/csv" });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement("a");
    a.href = url; a.download = "attendance_report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { key:"register",   label:"📋 Attendance Register" },
    { key:"matrix",     label:"🗂️ Session Matrix"      },
    { key:"analytics",  label:"📊 Analytics"           },
    { key:"audit",      label:"🕓 Audit Log"            },
  ];

  const statusIcon = { present:"✅", late:"⏰", absent:"❌", excused:"💙" };

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>

      {/* Modals */}
      {manualModal && (
        <ManualAttendanceModal
          session={manualModal}
          teachers={teachers}
          existingRecords={records}
          onSave={saveManualAttendance}
          onClose={() => setManualModal(null)}
          setToast={() => {}}
        />
      )}
      {editModal && (
        <EditRecordModal
          record={editModal}
          onSave={saveEdit}
          onClose={() => setEditModal(null)}
          setToast={() => {}}
        />
      )}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={S.pageTitle}>Attendance Management</h1>
          <p style={S.pageSub}>Session attendance, reports, and analytics across all batches</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={exportCSV} style={S.exportBtn}>⬇ Export CSV</button>
          <button onClick={() => alert("PDF export requires a PDF library. CSV is available.")} style={S.exportBtn}>⬇ Export PDF</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:14, marginBottom:20 }}>
        <StatCard icon="📋" label="Total Records"   val={records.length}                                              color="#f59e0b" bg="#fef3c7"/>
        <StatCard icon="✅" label="Present"         val={records.filter(r=>r.status==="present").length}              color="#10b981" bg="#d1fae5"/>
        <StatCard icon="⏰" label="Late"            val={records.filter(r=>r.status==="late").length}                 color="#d97706" bg="#fef3c7"/>
        <StatCard icon="❌" label="Absent"          val={records.filter(r=>r.status==="absent").length}               color="#ef4444" bg="#fee2e2"/>
        <StatCard icon="⚠️" label="Low Attendance" val={lowAlert.length}                                             color="#ef4444" bg="#fee2e2"/>
      </div>

      {/* Low Attendance Alert */}
      {lowAlert.length > 0 && (
        <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:12, padding:"14px 18px", marginBottom:16, display:"flex", alignItems:"flex-start", gap:12 }}>
          <span style={{ fontSize:22, flexShrink:0 }}>🚨</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:800, color:"#991b1b", marginBottom:4 }}>
              Low Attendance Alert — {lowAlert.length} teacher{lowAlert.length>1?"s":""} below 60%
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {lowAlert.map(t => (
                <span key={t.id} style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:"#fee2e2", color:"#dc2626", border:"1px solid #fca5a5" }}>
                  {t.name} ({t.pct}%)
                </span>
              ))}
            </div>
          </div>
          <button style={{ ...S.primaryBtn, fontSize:11, padding:"7px 14px", flexShrink:0 }}>
            📧 Send Alerts
          </button>
        </div>
      )}
      {warnAlert.length > 0 && (
        <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:12, padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:18 }}>⚠️</span>
          <div style={{ fontSize:12, color:"#92400e" }}>
            <b>{warnAlert.length} teacher{warnAlert.length>1?"s":""}</b> between 60–75%: {warnAlert.map(t=>`${t.name} (${t.pct}%)`).join(" · ")}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding:"8px 16px", borderRadius:8, border:`1.5px solid ${activeTab===t.key?"#f59e0b":"#e5e7eb"}`, background:activeTab===t.key?"#fef3c7":"white", color:activeTab===t.key?"#92400e":"#6b7280", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ TAB: REGISTER ══ */}
      {activeTab === "register" && (
        <div>
          {/* Filters */}
          <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {batches.map(b => (
                <button key={b} onClick={() => setBatchFilter(b)}
                  style={{ padding:"7px 14px", borderRadius:8, border:`1.5px solid ${batchFilter===b?"#f59e0b":"#e5e7eb"}`, background:batchFilter===b?"#fef3c7":"white", color:batchFilter===b?"#92400e":"#6b7280", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                  {b === "all" ? "All Batches" : b}
                </button>
              ))}
            </div>
          </div>

          {/* Per-Teacher Attendance Register */}
          <SectionCard title="👩‍🏫 Teacher Attendance Register">
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
                <thead>
                  <tr style={{ background:"#f9fafb", borderBottom:"1px solid #f1f5f9" }}>
                    {["Teacher","Batch","Sessions","Present","Late","Absent","Excused","Rate","Alert"].map(h => (
                      <th key={h} style={{ padding:"10px 14px", fontSize:11, fontWeight:700, color:"#9ca3af", textAlign:"left", textTransform:"uppercase", letterSpacing:"0.5px", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teacherStats
                    .filter(t => batchFilter === "all" || t.batch === batchFilter)
                    .map((t, i) => {
                      const tRecs   = records.filter(r => r.teacherId === t.id);
                      const present = tRecs.filter(r => r.status === "present").length;
                      const late    = tRecs.filter(r => r.status === "late").length;
                      const absent  = tRecs.filter(r => r.status === "absent").length;
                      const excused = tRecs.filter(r => r.status === "excused").length;
                      const pctColor = t.pct >= 75 ? "#10b981" : t.pct >= 60 ? "#f59e0b" : "#ef4444";
                      return (
                        <tr key={t.id} style={{ borderBottom:"1px solid #f9fafb", background:i%2===0?"white":"#fafafa" }}>
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"white", flexShrink:0 }}>{t.name[0]}</div>
                              <div>
                                <div style={{ fontSize:13, fontWeight:700, color:"#1c1917" }}>{t.name}</div>
                                <div style={{ fontSize:10, color:"#9ca3af" }}>{t.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"12px 14px", fontSize:12, color:"#374151" }}>{t.batch || "—"}</td>
                          <td style={{ padding:"12px 14px", fontSize:13, fontWeight:600, color:"#374151", textAlign:"center" }}>{tRecs.length || t.classes}</td>
                          <td style={{ padding:"12px 14px", textAlign:"center" }}><span style={{ fontSize:12, fontWeight:700, color:"#10b981" }}>{present || "—"}</span></td>
                          <td style={{ padding:"12px 14px", textAlign:"center" }}><span style={{ fontSize:12, fontWeight:700, color:"#d97706" }}>{late || "—"}</span></td>
                          <td style={{ padding:"12px 14px", textAlign:"center" }}><span style={{ fontSize:12, fontWeight:700, color:"#ef4444" }}>{absent || "—"}</span></td>
                          <td style={{ padding:"12px 14px", textAlign:"center" }}><span style={{ fontSize:12, fontWeight:700, color:"#6366f1" }}>{excused || "—"}</span></td>
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <div style={{ width:52, height:6, background:"#f3f4f6", borderRadius:4, overflow:"hidden" }}>
                                <div style={{ height:"100%", width:`${t.pct}%`, background:pctColor }}/>
                              </div>
                              <span style={{ fontSize:11, fontWeight:800, color:pctColor }}>{t.pct}%</span>
                            </div>
                          </td>
                          <td style={{ padding:"12px 14px" }}>
                            {t.pct < 60 && <span style={{ fontSize:10, fontWeight:700, color:"#dc2626", background:"#fee2e2", padding:"2px 8px", borderRadius:20 }}>🚨 LOW</span>}
                            {t.pct >= 60 && t.pct < 75 && <span style={{ fontSize:10, fontWeight:700, color:"#d97706", background:"#fef3c7", padding:"2px 8px", borderRadius:20 }}>⚠️ WARN</span>}
                            {t.pct >= 75 && <span style={{ fontSize:10, color:"#9ca3af" }}>—</span>}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Session List with Manual Entry Buttons */}
          <SectionCard title="📅 Sessions — Mark or Edit Attendance">
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {filteredSessions.map((s, i) => {
                const stat = sessionStats.find(ss => ss.id === s.id);
                const isCompleted = s.status === "completed";
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:12, border:"1px solid #f1f5f9", background:isCompleted?"#f9fafb":"white" }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:isCompleted?"#d1fae5":"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                      {isCompleted ? "✅" : "📹"}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#1c1917" }}>{s.title}</div>
                      <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>📅 {s.date} · 🗂️ {s.batch} · 👩‍🏫 {s.trainer}</div>
                    </div>
                    {/* Stats pills */}
                    {stat && stat.total > 0 && (
                      <div style={{ display:"flex", gap:6 }}>
                        {[["✅",stat.present,"#d1fae5","#059669"],["⏰",stat.late,"#fef3c7","#d97706"],["❌",stat.absent,"#fee2e2","#dc2626"],["💙",stat.excused,"#ede9fe","#6366f1"]].map(([icon,val,bg,color],j)=>(
                          val > 0 && <span key={j} style={{ fontSize:11, fontWeight:700, color, background:bg, padding:"2px 8px", borderRadius:20 }}>{icon} {val}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                      <StatusBadge status={s.status}/>
                      <button onClick={() => setManualModal(s)} style={{ ...S.tblBtn, color:"#3b82f6", borderColor:"#93c5fd" }}>
                        {stat && stat.total > 0 ? "✏️ Edit" : "📋 Mark"}
                      </button>
                      {s.status === "upcoming" && (
                        <span style={{ fontSize:10, color:"#9ca3af", padding:"4px 8px", background:"#f0f9ff", borderRadius:8, border:"1px solid #bae6fd" }}>🔗 Zoom Auto</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ══ TAB: MATRIX ══ */}
      {activeTab === "matrix" && (
        <SectionCard title="🗂️ Attendance Matrix — Teacher × Session">
          <div style={{ marginBottom:14, display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:12, color:"#6b7280", fontWeight:600 }}>Filter by batch:</span>
            {batches.map(b => (
              <button key={b} onClick={() => setBatchFilter(b)}
                style={{ padding:"5px 12px", borderRadius:8, border:`1.5px solid ${batchFilter===b?"#f59e0b":"#e5e7eb"}`, background:batchFilter===b?"#fef3c7":"white", color:batchFilter===b?"#92400e":"#6b7280", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                {b === "all" ? "All" : b}
              </button>
            ))}
          </div>

          <div style={{ overflowX:"auto" }}>
            <table style={{ borderCollapse:"collapse", minWidth:600 }}>
              <thead>
                <tr style={{ background:"#f9fafb" }}>
                  <th style={{ padding:"10px 14px", fontSize:11, fontWeight:700, color:"#9ca3af", textAlign:"left", minWidth:160, borderBottom:"1px solid #f1f5f9" }}>TEACHER</th>
                  {filteredSessions.map(s => (
                    <th key={s.id} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, color:"#9ca3af", textAlign:"center", borderBottom:"1px solid #f1f5f9", minWidth:100 }}>
                      <div style={{ maxWidth:90, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                      <div style={{ fontSize:9, color:"#d1d5db", marginTop:2 }}>{s.date}</div>
                    </th>
                  ))}
                  <th style={{ padding:"10px 14px", fontSize:11, fontWeight:700, color:"#9ca3af", textAlign:"center", borderBottom:"1px solid #f1f5f9", minWidth:80 }}>RATE</th>
                </tr>
              </thead>
              <tbody>
                {approved
                  .filter(t => batchFilter === "all" || t.batch === batchFilter)
                  .map((t, ri) => {
                    const tRecs  = records.filter(r => r.teacherId === t.id);
                    const total   = filteredSessions.length;
                    const present = tRecs.filter(r => r.status === "present" || r.status === "late").length;
                    const pct     = total > 0 ? Math.round((present / Math.max(1, tRecs.length)) * 100) : t.attendance;
                    return (
                      <tr key={t.id} style={{ borderBottom:"1px solid #f9fafb", background:ri%2===0?"white":"#fafafa" }}>
                        <td style={{ padding:"10px 14px" }}>
                          <div style={{ fontSize:12, fontWeight:700, color:"#1c1917" }}>{t.name}</div>
                          <div style={{ fontSize:10, color:"#9ca3af" }}>{t.batch}</div>
                        </td>
                        {filteredSessions.map(s => {
                          const rec = records.find(r => r.teacherId === t.id && r.sessionId === s.id);
                          const cellBg = !rec ? "#f9fafb" : rec.status==="present" ? "#d1fae5" : rec.status==="late" ? "#fef3c7" : rec.status==="absent" ? "#fee2e2" : "#ede9fe";
                          return (
                            <td key={s.id} style={{ padding:"8px 10px", textAlign:"center", background:cellBg, border:"1px solid white" }}>
                              {rec ? (
                                <button onClick={() => setEditModal(rec)}
                                  style={{ background:"none", border:"none", cursor:"pointer", fontSize:16 }}
                                  title={`${rec.status}${rec.note ? ` — ${rec.note}` : ""}`}>
                                  {statusIcon[rec.status] || "?"}
                                </button>
                              ) : (
                                <span style={{ fontSize:12, color:"#d1d5db" }}>—</span>
                              )}
                            </td>
                          );
                        })}
                        <td style={{ padding:"10px 14px", textAlign:"center" }}>
                          <span style={{ fontSize:12, fontWeight:800, color:pct>=75?"#10b981":pct>=60?"#f59e0b":"#ef4444" }}>{pct}%</span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div style={{ display:"flex", gap:16, marginTop:14, flexWrap:"wrap" }}>
            {[["✅","Present","#d1fae5"],["⏰","Late","#fef3c7"],["❌","Absent","#fee2e2"],["💙","Excused","#ede9fe"],["—","No Record","#f9fafb"]].map(([icon,label,bg]) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:24, height:24, borderRadius:6, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, border:"1px solid #e5e7eb" }}>{icon}</div>
                <span style={{ fontSize:11, color:"#6b7280" }}>{label}</span>
              </div>
            ))}
            <span style={{ fontSize:11, color:"#9ca3af", marginLeft:"auto" }}>Click any cell to edit (with audit log)</span>
          </div>
        </SectionCard>
      )}

      {/* ══ TAB: ANALYTICS ══ */}
      {activeTab === "analytics" && (
        <div>
          {/* Batch Comparison */}
          <SectionCard title="📊 Attendance Rate Comparison — Across Batches">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14, marginBottom:20 }}>
              {batchComparison.map((b, i) => {
                const color = b.pct >= 80 ? "#10b981" : b.pct >= 65 ? "#f59e0b" : "#ef4444";
                return (
                  <div key={i} style={{ background:"white", borderRadius:14, padding:"16px", border:`1px solid ${color}30`, borderTop:`3px solid ${color}` }}>
                    <div style={{ fontSize:13, fontWeight:800, color:"#1c1917", marginBottom:4 }}>{b.batch}</div>
                    <div style={{ fontSize:28, fontWeight:900, color, marginBottom:4 }}>{b.pct}%</div>
                    <div style={{ fontSize:11, color:"#9ca3af" }}>{b.present} present of {b.total} records</div>
                    <div style={{ height:6, background:"#f3f4f6", borderRadius:4, overflow:"hidden", marginTop:10 }}>
                      <div style={{ height:"100%", width:`${b.pct}%`, background:color, borderRadius:4 }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Individual Teacher Analytics */}
          <SectionCard title="👩‍🏫 Individual Teacher Attendance % by Course">
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {teacherStats.map(t => {
                const pctColor = t.pct >= 75 ? "#10b981" : t.pct >= 60 ? "#f59e0b" : "#ef4444";
                return (
                  <div key={t.id} style={{ padding:"14px 16px", borderRadius:12, border:`1px solid ${t.pct<60?"#fca5a5":t.pct<75?"#fde68a":"#f1f5f9"}`, background:t.pct<60?"#fef2f2":t.pct<75?"#fffbeb":"white" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"white", flexShrink:0 }}>{t.name[0]}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:"#1c1917" }}>{t.name}</div>
                        <div style={{ fontSize:11, color:"#9ca3af" }}>{t.course || "—"} · {t.batch || "—"}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:22, fontWeight:900, color:pctColor }}>{t.pct}%</div>
                        {t.pct < 60 && <span style={{ fontSize:10, fontWeight:700, color:"#dc2626", background:"#fee2e2", padding:"2px 8px", borderRadius:20 }}>🚨 LOW</span>}
                        {t.pct >= 60 && t.pct < 75 && <span style={{ fontSize:10, fontWeight:700, color:"#d97706", background:"#fef3c7", padding:"2px 8px", borderRadius:20 }}>⚠️ WARN</span>}
                      </div>
                    </div>
                    <div style={{ height:8, background:"#f3f4f6", borderRadius:6, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${t.pct}%`, background:pctColor, borderRadius:6, transition:"width 0.8s" }}/>
                    </div>
                    <div style={{ display:"flex", gap:16, marginTop:8 }}>
                      {[["✅",records.filter(r=>r.teacherId===t.id&&r.status==="present").length,"Present"],["⏰",records.filter(r=>r.teacherId===t.id&&r.status==="late").length,"Late"],["❌",records.filter(r=>r.teacherId===t.id&&r.status==="absent").length,"Absent"],["💙",records.filter(r=>r.teacherId===t.id&&r.status==="excused").length,"Excused"]].map(([icon,val,label])=>(
                        val > 0 && <span key={label} style={{ fontSize:11, color:"#6b7280" }}>{icon} {val} {label}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Session attendance stats */}
          <SectionCard title="📅 Per-Session Attendance Breakdown" action={<button onClick={exportCSV} style={S.exportBtn}>⬇ Export Excel</button>}>
            {sessionStats.filter(s => s.total > 0).map((s, i) => {
              const pct = s.total > 0 ? Math.round(((s.present + s.late) / s.total) * 100) : 0;
              return (
                <div key={i} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#1c1917" }}>{s.title}</div>
                      <div style={{ fontSize:11, color:"#9ca3af" }}>{s.batch} · {s.date}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:16, fontWeight:800, color:pct>=75?"#10b981":pct>=60?"#f59e0b":"#ef4444" }}>{pct}%</div>
                      <div style={{ fontSize:10, color:"#9ca3af" }}>{s.present+s.late}/{s.total} attended</div>
                    </div>
                  </div>
                  <div style={{ height:8, background:"#f3f4f6", borderRadius:6, overflow:"hidden", marginBottom:6 }}>
                    <div style={{ height:"100%", borderRadius:6, display:"flex" }}>
                      <div style={{ width:`${s.total>0?(s.present/s.total*100):0}%`, background:"#10b981" }}/>
                      <div style={{ width:`${s.total>0?(s.late/s.total*100):0}%`, background:"#f59e0b" }}/>
                      <div style={{ width:`${s.total>0?(s.absent/s.total*100):0}%`, background:"#ef4444" }}/>
                      <div style={{ width:`${s.total>0?(s.excused/s.total*100):0}%`, background:"#6366f1" }}/>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:12, fontSize:10, color:"#6b7280" }}>
                    <span>✅ {s.present} Present</span>
                    <span>⏰ {s.late} Late</span>
                    <span>❌ {s.absent} Absent</span>
                    <span>💙 {s.excused} Excused</span>
                  </div>
                </div>
              );
            })}
            {sessionStats.filter(s => s.total > 0).length === 0 && (
              <div style={{ textAlign:"center", padding:20, color:"#9ca3af", fontSize:13 }}>No attendance records yet.</div>
            )}
          </SectionCard>
        </div>
      )}

      {/* ══ TAB: AUDIT LOG ══ */}
      {activeTab === "audit" && (
        <SectionCard title="🕓 Attendance Audit Log">
          <div style={{ background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#0369a1" }}>
            Every manual edit and auto-capture event is logged here for compliance.
          </div>
          <div style={{ display:"flex", flexDirection:"column" }}>
            {auditLog.map((entry, i) => (
              <AuditLogEntry key={i} entry={entry}/>
            ))}
            {auditLog.length === 0 && (
              <div style={{ textAlign:"center", padding:20, color:"#9ca3af", fontSize:13 }}>No audit entries yet.</div>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

/* ── A8: Live Sessions ── */
function LiveSessionsTab({ sessions, setSessions, teachers, batches, setToast }) {

  const [view,          setView]          = useState("list");   // list | detail
  const [selected,      setSelected]      = useState(null);
  const [addModal,      setAddModal]      = useState(false);
  const [postModal,     setPostModal]     = useState(null);
  const [aiLoading,     setAiLoading]     = useState(false);
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [batchFilter,   setBatchFilter]   = useState("all");
  const [search,        setSearch]        = useState("");

  const PLATFORMS = ["Zoom","Google Meet","Microsoft Teams","Webex"];
  const TRAINERS  = [...new Set((teachers||[]).filter(t=>t.status==="approved").map(t=>t.name))];
  const BATCHES   = [...new Set((batches||[]).map(b=>b.name))];

  const emptyForm = {
    title:"", date:"", time:"", duration:60, batch:"", trainer:"", backupTrainer:"",
    platform:"Zoom", meetingLink:"", maxParticipants:40,
    recurrence:"none", recurrenceEnd:"", status:"upcoming",
  };
  const [form, setForm] = useState(emptyForm);
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));

  // Post-session form state
  const [postForm, setPostForm] = useState({
    recording:"", newMaterial:"", feedbackMsg:"", summary:"",
  });

  const filtered = sessions.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.title.toLowerCase().includes(q) || s.trainer.toLowerCase().includes(q) || s.batch.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchBatch  = batchFilter  === "all" || s.batch  === batchFilter;
    return matchSearch && matchStatus && matchBatch;
  });

  const updateSession = (id, changes) => {
    setSessions(prev => prev.map(s => s.id===id ? {...s,...changes} : s));
    if (selected?.id === id) setSelected(s => ({...s,...changes}));
  };

  // ── Auto-generate meeting link ──
  const generateLink = (platform) => {
    const id = Math.random().toString(36).substring(2,11);
    const links = {
      "Zoom":              `https://zoom.us/j/${Math.floor(Math.random()*9000000000+1000000000)}`,
      "Google Meet":       `https://meet.google.com/${id.substring(0,3)}-${id.substring(3,7)}-${id.substring(7,10)}`,
      "Microsoft Teams":   `https://teams.microsoft.com/l/meetup-join/${id}`,
      "Webex":             `https://webex.com/meet/${id}`,
    };
    upd("meetingLink", links[platform] || links["Zoom"]);
    setToast({ msg:"Meeting link generated!", type:"success" });
  };

  // ── Create session (with recurrence expansion) ──
  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title||!form.date||!form.time||!form.batch||!form.trainer) {
      setToast({ msg:"Fill required fields: title, date, time, batch, trainer.", type:"error" });
      return;
    }

    const base = {
      ...form,
      duration:       Number(form.duration),
      maxParticipants:Number(form.maxParticipants),
      attendees:0, recording:"", materials:[], feedbackSent:false, summary:"",
      reminderSent24h:false, reminderSent1h:false,
    };

    const newSessions = [];

    if (form.recurrence !== "none" && form.recurrenceEnd) {
      const startDate = new Date(form.date);
      const endDate   = new Date(form.recurrenceEnd);
      const stepDays  = form.recurrence === "weekly" ? 7 : 14;
      let current     = new Date(startDate);

      while (current <= endDate) {
        newSessions.push({
          ...base,
          id:   Date.now() + newSessions.length,
          date: current.toLocaleDateString("en-IN"),
        });
        current.setDate(current.getDate() + stepDays);
      }
      setToast({ msg:`${newSessions.length} recurring sessions created!`, type:"success" });
    } else {
      newSessions.push({ ...base, id:Date.now(), date:new Date(form.date).toLocaleDateString("en-IN") });
      setToast({ msg:"Session scheduled!", type:"success" });
    }

    setSessions(prev => [...prev, ...newSessions]);
    setAddModal(false);
    setForm(emptyForm);
  };

  // ── Send reminders ──
  const sendReminder = (id, type) => {
    const key = type === "24h" ? "reminderSent24h" : "reminderSent1h";
    updateSession(id, { [key]:true });
    setToast({ msg:`${type === "24h" ? "24-hour" : "1-hour"} reminder sent via email + SMS!`, type:"success" });
  };

  // ── Post-session save ──
  const savePostSession = (id) => {
    const s = sessions.find(x=>x.id===id);
    const updates = {};
    if (postForm.recording)    updates.recording = postForm.recording;
    if (postForm.newMaterial)  updates.materials = [...(s?.materials||[]), postForm.newMaterial];
    if (postForm.summary)      updates.summary   = postForm.summary;
    if (postForm.feedbackMsg)  updates.feedbackSent = true;
    updateSession(id, updates);
    setToast({ msg:"Post-session tasks saved!", type:"success" });
    setPostModal(null);
    setPostForm({ recording:"", newMaterial:"", feedbackMsg:"", summary:"" });
  };

  // ── AI session summary ──
  const generateAISummary = async (session) => {
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    const summary = `📋 AI Session Summary — ${session.title}\n\nDate: ${session.date} | Duration: ${session.duration} min | Batch: ${session.batch}\nTrainer: ${session.trainer} | Platform: ${session.platform}\nAttendees: ${session.attendees} / ${session.maxParticipants}\n\nKey Topics Covered:\n• Introduction and context setting for ${session.batch}\n• Core concepts aligned with course curriculum\n• Interactive Q&A with ${session.attendees} participants\n• Practical demonstrations and activity walkthroughs\n\nEngagement Level: ${session.attendees > 20 ? "High" : "Moderate"}\nCompletion Rate: ${Math.round((session.attendees/session.maxParticipants)*100)}%\n\nNext Steps:\n• Review uploaded materials before next session\n• Complete assigned module quiz by end of week\n• Trainer to follow up with absentees`;
    setPostForm(f => ({...f, summary}));
    setAiLoading(false);
    setToast({ msg:"AI summary generated!", type:"success" });
  };

  const platformIcon = { "Zoom":"📹", "Google Meet":"📞", "Microsoft Teams":"💼", "Webex":"🌐" };
  const statusColor  = { upcoming:"#2563eb", completed:"#7c3aed", cancelled:"#dc2626", live:"#059669" };
  const statusBg     = { upcoming:"#dbeafe", completed:"#ede9fe", cancelled:"#fee2e2", live:"#d1fae5" };

  // ── DETAIL VIEW ──
  if (view === "detail" && selected) {
    const s = sessions.find(x=>x.id===selected.id) || selected;
    return (
      <div style={{ animation:"fadeIn 0.3s ease" }}>

        {/* Post-session modal */}
        {postModal && (
          <Modal title={`📋 Post-Session Tasks — ${s.title}`} onClose={()=>setPostModal(null)}>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

              {/* Recording upload */}
              <div>
                <label style={S.label}>🎥 Session Recording URL</label>
                <input style={S.input} value={postForm.recording} onChange={e=>setPostForm(f=>({...f,recording:e.target.value}))}
                  placeholder="https://recordings.spaceece.in/session.mp4 or Drive link"/>
                {s.recording && <div style={{ fontSize:11, color:"#059669", marginTop:4 }}>✓ Current: {s.recording.substring(0,40)}...</div>}
              </div>

              {/* Materials */}
              <div>
                <label style={S.label}>📎 Upload Session Material</label>
                <input style={S.input} value={postForm.newMaterial} onChange={e=>setPostForm(f=>({...f,newMaterial:e.target.value}))}
                  placeholder="Filename or URL e.g. Session_Notes.pdf"/>
                {s.materials?.length > 0 && (
                  <div style={{ marginTop:6, display:"flex", flexWrap:"wrap", gap:6 }}>
                    {s.materials.map((m,i)=>(
                      <span key={i} style={{ fontSize:11, padding:"3px 10px", background:"#dbeafe", color:"#1d4ed8", borderRadius:20, fontWeight:600 }}>📎 {m}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Attendance button */}
              <div style={{ padding:"12px 14px", background:"#f9fafb", borderRadius:10, border:"1px solid #f3f4f6" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#374151", marginBottom:6 }}>📊 Mark Attendance</div>
                <div style={{ fontSize:12, color:"#6b7280", marginBottom:8 }}>Attendance for this session is managed in the Attendance tab.</div>
                <button onClick={()=>{ setToast({ msg:"Go to Attendance tab to mark this session.", type:"success" }); setPostModal(null); }}
                  style={{ ...S.exportBtn, fontSize:11 }}>Go to Attendance →</button>
              </div>

              {/* Feedback form */}
              <div>
                <label style={S.label}>💬 Send Feedback Form to Attendees</label>
                <textarea style={{ ...S.input, height:60, resize:"none" }}
                  value={postForm.feedbackMsg}
                  onChange={e=>setPostForm(f=>({...f,feedbackMsg:e.target.value}))}
                  placeholder="Optional message to include with feedback form link..."/>
                {s.feedbackSent && <div style={{ fontSize:11, color:"#059669", marginTop:4 }}>✓ Feedback form already sent</div>}
              </div>

              {/* AI Summary */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <label style={S.label}>🤖 AI Session Summary</label>
                  <button onClick={()=>generateAISummary(s)} disabled={aiLoading}
                    style={{ ...S.exportBtn, fontSize:11, opacity:aiLoading?0.7:1 }}>
                    {aiLoading ? "⏳ Generating..." : "🤖 Generate"}
                  </button>
                </div>
                <textarea style={{ ...S.input, height:130, resize:"none", fontSize:11, fontFamily:"inherit", lineHeight:1.6 }}
                  value={postForm.summary}
                  onChange={e=>setPostForm(f=>({...f,summary:e.target.value}))}
                  placeholder="AI-generated or manual session summary..."/>
                {s.summary && !postForm.summary && (
                  <div style={{ fontSize:11, color:"#6b7280", marginTop:4 }}>
                    <button onClick={()=>setPostForm(f=>({...f,summary:s.summary}))} style={{ ...S.tblBtn, fontSize:10 }}>Load existing summary</button>
                  </div>
                )}
              </div>

              <button onClick={()=>savePostSession(s.id)} style={{ ...S.primaryBtn, width:"100%" }}>
                💾 Save Post-Session Tasks
              </button>
            </div>
          </Modal>
        )}

        <button onClick={()=>{ setView("list"); setSelected(null); }} style={S.backBtn}>← Back to Sessions</button>

        {/* Session header card */}
        <div style={{ background:"white", borderRadius:20, padding:28, border:"1px solid #f1f5f9", boxShadow:"0 4px 20px rgba(0,0,0,0.06)", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:20, paddingBottom:18, borderBottom:"1px solid #f3f4f6" }}>
            <div style={{ width:60, height:60, borderRadius:16, background:statusBg[s.status]||"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>
              {platformIcon[s.platform]||"📹"}
            </div>
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize:20, fontWeight:900, color:"#0f172a", margin:"0 0 6px" }}>{s.title}</h2>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:700, background:statusBg[s.status], color:statusColor[s.status] }}>{s.status.toUpperCase()}</span>
                <span style={{ padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:700, background:"#fef3c7", color:"#92400e" }}>{s.batch}</span>
                <span style={{ padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:700, background:"#f3f4f6", color:"#374151" }}>{s.platform}</span>
                {s.recurrence !== "none" && <span style={{ padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:700, background:"#ede9fe", color:"#6d28d9" }}>🔁 {s.recurrence}</span>}
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {s.status === "upcoming" && (
                <button onClick={()=>updateSession(s.id,{status:"live"})} style={{ ...S.btnGreen }}>▶ Go Live</button>
              )}
              {s.status === "live" && (
                <button onClick={()=>updateSession(s.id,{status:"completed"})} style={{ ...S.btnOrange }}>■ End Session</button>
              )}
              <button onClick={()=>{ setPostForm({ recording:s.recording||"", newMaterial:"", feedbackMsg:"", summary:s.summary||"" }); setPostModal(s); }}
                style={S.exportBtn}>📋 Post-Session Tasks</button>
            </div>
          </div>

          {/* Details grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
            {[
              { icon:"📅", label:"Date",          val:s.date                                      },
              { icon:"🕐", label:"Time",          val:s.time                                      },
              { icon:"⏱",  label:"Duration",      val:`${s.duration} min`                         },
              { icon:"👩‍🏫", label:"Primary Trainer",val:s.trainer                                 },
              { icon:"👥", label:"Backup Trainer", val:s.backupTrainer||"Not assigned"             },
              { icon:"🪑", label:"Capacity",       val:`${s.attendees}/${s.maxParticipants} seats` },
            ].map((r,i)=>(
              <div key={i} style={{ background:"#f9fafb", borderRadius:10, padding:"10px 13px", border:"1px solid #f3f4f6" }}>
                <div style={{ fontSize:10, color:"#9ca3af", fontWeight:700, textTransform:"uppercase", letterSpacing:".4px", marginBottom:2 }}>{r.label}</div>
                <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>{r.icon} {r.val}</div>
              </div>
            ))}
          </div>

          {/* Meeting link */}
          {s.meetingLink && (
            <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <span style={{ fontSize:16 }}>🔗</span>
              <a href={s.meetingLink} target="_blank" rel="noreferrer" style={{ fontSize:12, fontWeight:700, color:"#2563eb", flex:1 }}>{s.meetingLink}</a>
              <button onClick={()=>{ navigator.clipboard?.writeText(s.meetingLink); setToast({ msg:"Link copied!", type:"success" }); }}
                style={{ ...S.tblBtn, fontSize:11 }}>📋 Copy</button>
            </div>
          )}

          {/* Reminders */}
          {s.status === "upcoming" && (
            <div style={{ background:"#f9fafb", borderRadius:12, padding:"14px 16px", border:"1px solid #f3f4f6" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#374151", marginBottom:10 }}>🔔 Session Reminders</div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <div style={{ flex:1, padding:"10px 14px", background:"white", borderRadius:10, border:`1px solid ${s.reminderSent24h?"#86efac":"#e5e7eb"}` }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#374151" }}>24-Hour Reminder</div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginBottom:8 }}>Email + SMS to all enrolled teachers</div>
                  {s.reminderSent24h
                    ? <span style={{ fontSize:11, color:"#059669", fontWeight:700 }}>✓ Sent</span>
                    : <button onClick={()=>sendReminder(s.id,"24h")} style={{ ...S.btnGreen, fontSize:11, padding:"5px 12px" }}>Send Now</button>}
                </div>
                <div style={{ flex:1, padding:"10px 14px", background:"white", borderRadius:10, border:`1px solid ${s.reminderSent1h?"#86efac":"#e5e7eb"}` }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#374151" }}>1-Hour Reminder</div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginBottom:8 }}>Email + SMS to all enrolled teachers</div>
                  {s.reminderSent1h
                    ? <span style={{ fontSize:11, color:"#059669", fontWeight:700 }}>✓ Sent</span>
                    : <button onClick={()=>sendReminder(s.id,"1h")} style={{ ...S.btnGreen, fontSize:11, padding:"5px 12px" }}>Send Now</button>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recording & Materials */}
        {s.status === "completed" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
            <SectionCard title="🎥 Session Recording">
              {s.recording ? (
                <div>
                  <div style={{ background:"#f9fafb", borderRadius:10, padding:"14px", border:"1px solid #f3f4f6", marginBottom:10 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#374151", marginBottom:4 }}>Recording Available</div>
                    <a href={s.recording} target="_blank" rel="noreferrer" style={{ fontSize:11, color:"#2563eb", wordBreak:"break-all" }}>{s.recording}</a>
                  </div>
                  <div style={{ fontSize:11, color:"#059669", fontWeight:600 }}>✓ Auto-available in Live Session page for enrolled teachers</div>
                </div>
              ) : (
                <div style={{ textAlign:"center", padding:20, color:"#9ca3af" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>🎥</div>
                  <div style={{ fontSize:12, marginBottom:10 }}>No recording uploaded yet</div>
                  <button onClick={()=>{ setPostForm({ recording:"", newMaterial:"", feedbackMsg:"", summary:"" }); setPostModal(s); }}
                    style={S.primaryBtn}>Upload Recording</button>
                </div>
              )}
            </SectionCard>

            <SectionCard title="📎 Session Materials">
              {s.materials?.length > 0 ? (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {s.materials.map((m,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"#f9fafb", borderRadius:8, border:"1px solid #f3f4f6" }}>
                      <span style={{ fontSize:16 }}>📄</span>
                      <span style={{ fontSize:12, fontWeight:600, color:"#374151", flex:1 }}>{m}</span>
                      <button style={{ ...S.tblBtn, fontSize:10 }}>⬇ Download</button>
                    </div>
                  ))}
                  <button onClick={()=>{ setPostForm(f=>({...f})); setPostModal(s); }} style={{ ...S.exportBtn, marginTop:4, fontSize:11 }}>+ Add More</button>
                </div>
              ) : (
                <div style={{ textAlign:"center", padding:20, color:"#9ca3af" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>📎</div>
                  <div style={{ fontSize:12, marginBottom:10 }}>No materials uploaded</div>
                  <button onClick={()=>{ setPostForm({ recording:"", newMaterial:"", feedbackMsg:"", summary:"" }); setPostModal(s); }}
                    style={S.exportBtn}>Upload Material</button>
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {/* AI Summary */}
        {s.summary && (
          <SectionCard title="🤖 AI Session Summary">
            <pre style={{ whiteSpace:"pre-wrap", fontSize:12, color:"#374151", lineHeight:1.7, fontFamily:"inherit", background:"#f9fafb", padding:14, borderRadius:10, border:"1px solid #f3f4f6" }}>
              {s.summary}
            </pre>
          </SectionCard>
        )}

        {/* Post-session checklist */}
        {s.status === "completed" && (
          <SectionCard title="✅ Post-Session Checklist">
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { label:"Recording uploaded",         done:!!s.recording    },
                { label:"Materials uploaded",          done:(s.materials?.length||0)>0 },
                { label:"Attendance marked",           done:s.attendees>0   },
                { label:"Feedback form sent",          done:s.feedbackSent  },
                { label:"Session summary generated",   done:!!s.summary     },
              ].map((item,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:item.done?"#ecfdf5":"#f9fafb", borderRadius:10, border:`1px solid ${item.done?"#86efac":"#f3f4f6"}` }}>
                  <span style={{ fontSize:18 }}>{item.done?"✅":"⏳"}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:item.done?"#065f46":"#6b7280" }}>{item.label}</span>
                  {!item.done && (
                    <button onClick={()=>{ setPostForm({ recording:s.recording||"", newMaterial:"", feedbackMsg:"", summary:s.summary||"" }); setPostModal(s); }}
                      style={{ ...S.tblBtn, marginLeft:"auto", fontSize:11 }}>Complete →</button>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>

      {/* Schedule Session Modal */}
      {addModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, backdropFilter:"blur(4px)", padding:20 }}>
          <div style={{ background:"white", borderRadius:20, width:"100%", maxWidth:680, maxHeight:"92vh", display:"flex", flexDirection:"column", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", overflow:"hidden" }}>
            <div style={{ padding:"20px 28px", borderBottom:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
              <h3 style={{ fontSize:17, fontWeight:900, color:"#1c1917", margin:0 }}>📅 Schedule New Session</h3>
              <button onClick={()=>{ setAddModal(false); setForm(emptyForm); }} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#9ca3af" }}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ padding:"20px 28px 24px", overflowY:"auto" }}>

              {/* Title */}
              <label style={S.label}>Session Title *</label>
              <input style={{ ...S.input, marginBottom:12 }} value={form.title} onChange={e=>upd("title",e.target.value)} placeholder="e.g. Classroom Management Techniques"/>

              {/* Date / Time / Duration */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:12 }}>
                <div>
                  <label style={S.label}>Date *</label>
                  <input style={S.input} type="date" value={form.date} onChange={e=>upd("date",e.target.value)}/>
                </div>
                <div>
                  <label style={S.label}>Time *</label>
                  <input style={S.input} type="time" value={form.time} onChange={e=>upd("time",e.target.value)}/>
                </div>
                <div>
                  <label style={S.label}>Duration (min)</label>
                  <input style={S.input} type="number" value={form.duration} onChange={e=>upd("duration",e.target.value)} min="15" max="300"/>
                </div>
              </div>

              {/* Batch / Max Participants */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                <div>
                  <label style={S.label}>Batch *</label>
                  <select style={S.input} value={form.batch} onChange={e=>upd("batch",e.target.value)}>
                    <option value="">Select batch...</option>
                    {BATCHES.map(b=><option key={b}>{b}</option>)}
                    <option value="All Batches">All Batches</option>
                  </select>
                </div>
                <div>
                  <label style={S.label}>Max Participants</label>
                  <input style={S.input} type="number" value={form.maxParticipants} onChange={e=>upd("maxParticipants",e.target.value)} min="1"/>
                </div>
              </div>

              {/* Trainers */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                <div>
                  <label style={S.label}>Primary Trainer *</label>
                  <select style={S.input} value={form.trainer} onChange={e=>upd("trainer",e.target.value)}>
                    <option value="">Select trainer...</option>
                    {["Dr. Rekha Iyer","Prof. Amol Desai","Ms. Geeta Rao","Dr. Vikram Shah","Mr. Sunil Mehta"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Backup Trainer</label>
                  <select style={S.input} value={form.backupTrainer} onChange={e=>upd("backupTrainer",e.target.value)}>
                    <option value="">None</option>
                    {["Dr. Rekha Iyer","Prof. Amol Desai","Ms. Geeta Rao","Dr. Vikram Shah","Mr. Sunil Mehta"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Platform + Meeting Link */}
              <div style={{ marginBottom:12 }}>
                <label style={S.label}>Platform</label>
                <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                  {PLATFORMS.map(p=>(
                    <button key={p} type="button" onClick={()=>upd("platform",p)}
                      style={{ flex:1, padding:"8px", borderRadius:8, border:`1.5px solid ${form.platform===p?"#f59e0b":"#e5e7eb"}`, background:form.platform===p?"#fef3c7":"white", color:form.platform===p?"#92400e":"#6b7280", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                      {platformIcon[p]} {p}
                    </button>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <input style={{ ...S.input, marginBottom:0, flex:1 }} value={form.meetingLink} onChange={e=>upd("meetingLink",e.target.value)} placeholder="Paste meeting link or auto-generate below"/>
                  <button type="button" onClick={()=>generateLink(form.platform)} style={{ ...S.exportBtn, whiteSpace:"nowrap" }}>⚡ Auto-Generate</button>
                </div>
              </div>

              {/* Recurrence */}
              <div style={{ background:"#f9fafb", borderRadius:12, padding:"14px 16px", border:"1px solid #f3f4f6", marginBottom:20 }}>
                <label style={{ ...S.label, marginBottom:8 }}>🔁 Recurrence</label>
                <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                  {["none","weekly","bi-weekly"].map(r=>(
                    <button key={r} type="button" onClick={()=>upd("recurrence",r)}
                      style={{ flex:1, padding:"8px", borderRadius:8, border:`1.5px solid ${form.recurrence===r?"#f59e0b":"#e5e7eb"}`, background:form.recurrence===r?"#fef3c7":"white", color:form.recurrence===r?"#92400e":"#6b7280", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize" }}>
                      {r==="none"?"One-time":r==="weekly"?"Weekly":"Bi-weekly"}
                    </button>
                  ))}
                </div>
                {form.recurrence !== "none" && (
                  <div>
                    <label style={S.label}>Repeat Until *</label>
                    <input style={{ ...S.input, marginBottom:0 }} type="date" value={form.recurrenceEnd} onChange={e=>upd("recurrenceEnd",e.target.value)}/>
                    {form.date && form.recurrenceEnd && (
                      <div style={{ fontSize:11, color:"#6366f1", marginTop:4, fontWeight:600 }}>
                        ≈ {Math.ceil((new Date(form.recurrenceEnd)-new Date(form.date))/(1000*60*60*24)/(form.recurrence==="weekly"?7:14))+1} sessions will be created
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button type="submit" style={{ ...S.primaryBtn, width:"100%" }}>Schedule Session →</button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={S.pageTitle}>Live Session Management</h1>
          <p style={S.pageSub}>
            {sessions.filter(s=>s.status==="upcoming").length} upcoming &nbsp;·&nbsp;
            {sessions.filter(s=>s.status==="live").length} live now &nbsp;·&nbsp;
            {sessions.filter(s=>s.status==="completed").length} completed
          </p>
        </div>
        <button onClick={()=>setAddModal(true)} style={S.primaryBtn}>+ Schedule Session</button>
      </div>

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:14, marginBottom:20 }}>
        {[
          { icon:"📅", label:"Total Sessions",  val:sessions.length,                                          color:"#f59e0b", bg:"#fef3c7" },
          { icon:"🟢", label:"Live Now",         val:sessions.filter(s=>s.status==="live").length,             color:"#10b981", bg:"#d1fae5" },
          { icon:"⏳", label:"Upcoming",         val:sessions.filter(s=>s.status==="upcoming").length,         color:"#3b82f6", bg:"#dbeafe" },
          { icon:"✅", label:"Completed",        val:sessions.filter(s=>s.status==="completed").length,        color:"#7c3aed", bg:"#ede9fe" },
          { icon:"🎥", label:"Recordings Ready", val:sessions.filter(s=>s.recording).length,                  color:"#ef4444", bg:"#fee2e2" },
          { icon:"🔁", label:"Recurring",        val:sessions.filter(s=>s.recurrence!=="none").length,         color:"#06b6d4", bg:"#cffafe" },
        ].map((k,i)=>(
          <StatCard key={i} icon={k.icon} label={k.label} val={k.val} color={k.color} bg={k.bg}/>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ flex:1, minWidth:200, position:"relative" }}>
          <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:14 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search session, trainer, batch..."
            style={{ ...S.input, paddingLeft:34, marginBottom:0 }}/>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {["all","upcoming","live","completed","cancelled"].map(f=>(
            <button key={f} onClick={()=>setStatusFilter(f)}
              style={{ padding:"7px 12px", borderRadius:8, border:`1.5px solid ${statusFilter===f?"#f59e0b":"#e5e7eb"}`, background:statusFilter===f?"#fef3c7":"white", color:statusFilter===f?"#92400e":"#6b7280", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize" }}>
              {f==="all"?"All":f}
            </button>
          ))}
        </div>
        <select value={batchFilter} onChange={e=>setBatchFilter(e.target.value)} style={{ ...S.input, width:160, marginBottom:0 }}>
          <option value="all">All Batches</option>
          {BATCHES.map(b=><option key={b}>{b}</option>)}
        </select>
      </div>

      {/* Session Cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map((s,i)=>(
          <div key={i} style={{ background:"white", borderRadius:16, padding:"16px 20px", border:`1px solid ${s.status==="live"?"#86efac":"#f1f5f9"}`, borderLeft:`4px solid ${statusColor[s.status]||"#e5e7eb"}`, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>

              {/* Platform icon */}
              <div style={{ width:48, height:48, borderRadius:12, background:statusBg[s.status]||"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                {platformIcon[s.platform]||"📹"}
              </div>

              {/* Info */}
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:800, color:"#0f172a" }}>{s.title}</div>
                <div style={{ fontSize:12, color:"#6b7280", marginTop:3, display:"flex", gap:14, flexWrap:"wrap" }}>
                  <span>📅 {s.date} · 🕐 {s.time}</span>
                  <span>⏱ {s.duration} min</span>
                  <span>🗂️ {s.batch}</span>
                  <span>👩‍🏫 {s.trainer}</span>
                  {s.backupTrainer && <span>👥 Backup: {s.backupTrainer}</span>}
                  <span>🪑 {s.attendees}/{s.maxParticipants}</span>
                </div>
                <div style={{ display:"flex", gap:8, marginTop:6, flexWrap:"wrap" }}>
                  <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:statusBg[s.status], color:statusColor[s.status] }}>{s.status.toUpperCase()}</span>
                  {s.recurrence !== "none" && <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:"#ede9fe", color:"#6d28d9" }}>🔁 {s.recurrence}</span>}
                  {s.recording  && <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:"#dbeafe", color:"#1d4ed8" }}>🎥 Recording</span>}
                  {s.feedbackSent && <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:"#d1fae5", color:"#065f46" }}>💬 Feedback Sent</span>}
                  {s.summary    && <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:"#ede9fe", color:"#6d28d9" }}>🤖 AI Summary</span>}
                  {!s.reminderSent24h && s.status==="upcoming" && <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:"#fef3c7", color:"#92400e" }}>⏰ Reminder Pending</span>}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display:"flex", gap:6, flexShrink:0, flexWrap:"wrap" }}>
                <button onClick={()=>{ setSelected(s); setView("detail"); }} style={{ ...S.tblBtn, color:"#2563eb", borderColor:"#93c5fd" }}>👁 View</button>
                {s.status === "upcoming" && <>
                  <button onClick={()=>updateSession(s.id,{status:"live"})} style={{ ...S.btnGreen, fontSize:11 }}>▶ Start</button>
                  {!s.reminderSent24h && <button onClick={()=>sendReminder(s.id,"24h")} style={{ ...S.tblBtn, fontSize:11 }}>🔔 Remind</button>}
                </>}
                {s.status === "live" && (
                  <button onClick={()=>updateSession(s.id,{status:"completed"})} style={{ ...S.btnOrange, fontSize:11 }}>■ End</button>
                )}
                {s.status === "completed" && (
                  <button onClick={()=>{ setPostForm({ recording:s.recording||"", newMaterial:"", feedbackMsg:"", summary:s.summary||"" }); setPostModal(s); }}
                    style={{ ...S.tblBtn, color:"#7c3aed", borderColor:"#c4b5fd", fontSize:11 }}>📋 Post-Tasks</button>
                )}
                <button onClick={()=>{ setSessions(prev=>prev.filter(x=>x.id!==s.id)); setToast({ msg:"Session deleted.", type:"error" }); }}
                  style={{ ...S.tblBtn, color:"#dc2626", borderColor:"#fca5a5", fontSize:11 }}>🗑</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:60, color:"#9ca3af" }}>
            <div style={{ fontSize:40, marginBottom:10 }}>📅</div>
            <div style={{ fontSize:14, fontWeight:700 }}>No sessions found</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── A9: Reports & Analytics ── */
function ReportsTab({ teachers, courses, batches }) {
  const [activeReport, setActiveReport] = useState("enrollment");
  const approved = teachers.filter(t=>t.status==="approved");
  const totalRevenue = teachers.reduce((a,t)=>a+t.revenue,0);

  const reports = [
    { key:"enrollment", label:"📋 Enrollment",  icon:"📋" },
    { key:"completion", label:"🎓 Completion",  icon:"🎓" },
    { key:"revenue",    label:"💰 Revenue",      icon:"💰" },
    { key:"attendance", label:"📊 Attendance",  icon:"📊" },
    { key:"trainer",    label:"👩‍🏫 Trainers",    icon:"👩‍🏫" },
  ];

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <h1 style={S.pageTitle}>Reports & Analytics</h1>
      <p style={S.pageSub}>Comprehensive platform insights and data exports</p>

      {/* Summary KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:14, marginBottom:24 }}>
        <StatCard icon="👥" label="Total Enrolled"   val={teachers.length}      color="#f59e0b" bg="#fef3c7"/>
        <StatCard icon="✅" label="Completed"        val={approved.length}      color="#10b981" bg="#d1fae5"/>
        <StatCard icon="💰" label="Total Revenue"    val={`₹${(totalRevenue/100000).toFixed(1)}L`} color="#8b5cf6" bg="#ede9fe"/>
        <StatCard icon="📚" label="Active Courses"   val={courses.filter(c=>c.status==="published").length} color="#3b82f6" bg="#dbeafe"/>
        <StatCard icon="🗂️" label="Active Batches"   val={batches.filter(b=>b.status==="active").length}   color="#06b6d4" bg="#cffafe"/>
      </div>

      {/* Report tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {reports.map(r=>(
          <button key={r.key} onClick={()=>setActiveReport(r.key)}
            style={{ padding:"8px 16px", borderRadius:8, border:`1.5px solid ${activeReport===r.key?"#f59e0b":"#e5e7eb"}`,
              background:activeReport===r.key?"#fef3c7":"white", color:activeReport===r.key?"#92400e":"#6b7280",
              fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{r.label}</button>
        ))}
      </div>

      {activeReport==="enrollment" && (
        <SectionCard title="📋 Enrollment Report — Last 12 Months"
          action={<button style={S.exportBtn}>⬇ Export CSV</button>}>
          <BarChart data={MONTHLY_ENROLLMENT} color="#f59e0b" height={120}/>
          <div style={{ marginTop:20, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            {courses.slice(0,6).map((c,i)=>(
              <div key={i} style={{ background:"#f9fafb", borderRadius:10, padding:"10px 14px", border:"1px solid #f3f4f6" }}>
                <div style={{ fontSize:11, color:"#9ca3af", marginBottom:2 }}>{c.category}</div>
                <div style={{ fontSize:13, fontWeight:700, color:"#1c1917" }}>{c.enrolled} enrolled</div>
                <div style={{ fontSize:11, color:"#6b7280" }}>{c.title.substring(0,30)}...</div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {activeReport==="completion" && (
        <SectionCard title="🎓 Course Completion Report"
          action={<button style={S.exportBtn}>⬇ Export PDF</button>}>
          {courses.filter(c=>c.status==="published").map((c,i)=>(
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{c.title.split("(")[0].trim()}</span>
                <span style={{ fontSize:12, fontWeight:800, color:c.completion>=80?"#10b981":c.completion>=60?"#f59e0b":"#ef4444" }}>{c.completion}%</span>
              </div>
              <div style={{ height:8, background:"#f3f4f6", borderRadius:4, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${c.completion}%`, background:c.completion>=80?"#10b981":c.completion>=60?"#f59e0b":"#ef4444", borderRadius:4 }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:2, fontSize:11, color:"#9ca3af" }}>
                <span>{c.enrolled} enrolled</span>
                <span>₹{(c.revenue/1000).toFixed(0)}k revenue</span>
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {activeReport==="revenue" && (
        <SectionCard title="💰 Revenue Report"
          action={<button style={S.exportBtn}>⬇ Export Excel</button>}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20 }}>
            <div style={{ background:"#fef3c7", borderRadius:12, padding:"16px", border:"1px solid #fbbf24" }}>
              <div style={{ fontSize:11, color:"#92400e", fontWeight:700, marginBottom:4 }}>THIS MONTH</div>
              <div style={{ fontSize:24, fontWeight:800, color:"#1c1917" }}>₹2.72L</div>
            </div>
            <div style={{ background:"#d1fae5", borderRadius:12, padding:"16px", border:"1px solid #6ee7b7" }}>
              <div style={{ fontSize:11, color:"#065f46", fontWeight:700, marginBottom:4 }}>THIS YEAR</div>
              <div style={{ fontSize:24, fontWeight:800, color:"#1c1917" }}>₹21.9L</div>
            </div>
            <div style={{ background:"#ede9fe", borderRadius:12, padding:"16px", border:"1px solid #c4b5fd" }}>
              <div style={{ fontSize:11, color:"#5b21b6", fontWeight:700, marginBottom:4 }}>ALL TIME</div>
              <div style={{ fontSize:24, fontWeight:800, color:"#1c1917" }}>₹{(totalRevenue/100000).toFixed(1)}L</div>
            </div>
          </div>
          <BarChart data={MONTHLY_REVENUE} color="#10b981" height={120} formatVal={v=>`${(v/1000).toFixed(0)}k`}/>
        </SectionCard>
      )}

      {activeReport==="attendance" && (
        <SectionCard title="📊 Attendance Report"
          action={<button style={S.exportBtn}>⬇ Export PDF</button>}>
          {teachers.filter(t=>t.status==="approved").map((t,i)=>(
            <AttendanceBar key={i} val={t.attendance} name={`${t.name} (${t.batch||"No batch"})`}/>
          ))}
        </SectionCard>
      )}

      {activeReport==="trainer" && (
        <SectionCard title="👩‍🏫 Trainer Performance Report"
          action={<button style={S.exportBtn}>⬇ Export CSV</button>}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ borderBottom:"2px solid #f3f4f6" }}>
              {["Trainer","Subject","Batches","Sessions","Rating"].map(h=>(
                <th key={h} style={{ padding:"10px 12px", fontSize:11, fontWeight:700, color:"#9ca3af", textAlign:"left", textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {MOCK_TRAINERS.map((t,i)=>(
                <tr key={i} style={{ borderBottom:"1px solid #f9fafb" }}>
                  <td style={{ padding:"12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#6366f1,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"white" }}>{t.name[0]}</div>
                      <span style={{ fontSize:13, fontWeight:700, color:"#1c1917" }}>{t.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px", fontSize:12, color:"#6b7280" }}>{t.subject}</td>
                  <td style={{ padding:"12px", fontSize:13, fontWeight:600, color:"#374151" }}>{t.batches}</td>
                  <td style={{ padding:"12px", fontSize:13, fontWeight:600, color:"#374151" }}>{t.sessions}</td>
                  <td style={{ padding:"12px" }}><span style={{ fontSize:14, color:"#f59e0b" }}>⭐</span><span style={{ fontSize:13, fontWeight:800, color:"#1c1917" }}> {t.rating}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}
    </div>
  );
}

/* ── A10: Notifications ── */
function NotificationsTab({ teachers, setToast }) {
  const [activeTab,      setActiveTab]      = useState("compose");
  const [templates,      setTemplates]      = useState(MOCK_NOTIFICATION_TEMPLATES);
  const [notifLog,       setNotifLog]       = useState(MOCK_NOTIFICATION_LOG);
  const [channelConfig,  setChannelConfig]  = useState(MOCK_CHANNEL_CONFIG);
 
  // Compose state
  const [channels,       setChannels]       = useState(["email"]);
  const [audience,       setAudience]       = useState("all");
  const [courseAudience, setCourseAudience] = useState("");
  const [batchAudience,  setBatchAudience]  = useState("");
  const [subject,        setSubject]        = useState("");
  const [subjectB,       setSubjectB]       = useState("");     // A/B test
  const [body,           setBody]           = useState("");
  const [scheduleMode,   setScheduleMode]   = useState("now");  // now | scheduled
  const [schedDate,      setSchedDate]      = useState("");
  const [schedTime,      setSchedTime]      = useState("");
  const [abTest,         setAbTest]         = useState(false);
  const [sending,        setSending]        = useState(false);
  const [sentAnim,       setSentAnim]       = useState(false);
 
  // Template edit
  const [editTemplate,   setEditTemplate]   = useState(null);
 
  // Channel config edit
  const [editChannel,    setEditChannel]    = useState(null);
  const [chanFormData,   setChanFormData]   = useState({});
 
  const ALL_COURSES = [...new Set(teachers.map(t => t.course).filter(Boolean))];
  const ALL_BATCHES = [...new Set(teachers.map(t => t.batch).filter(Boolean))];
 
  const CHANNEL_META = {
    email:    { icon:"📧", label:"Email",    color:"#3b82f6", provider:"SendGrid / AWS SES / SMTP"     },
    sms:      { icon:"💬", label:"SMS",      color:"#10b981", provider:"Twilio / MSG91"                },
    "in-app": { icon:"🔔", label:"In-App",   color:"#8b5cf6", provider:"Built-in Push"                },
    whatsapp: { icon:"💚", label:"WhatsApp", color:"#25d366", provider:"WhatsApp Business API"         },
  };
 
  const getAudienceCount = () => {
    if (audience === "all")    return teachers.length;
    if (audience === "course") return teachers.filter(t => t.course === courseAudience).length;
    if (audience === "batch")  return teachers.filter(t => t.batch  === batchAudience).length;
    if (audience === "approved") return teachers.filter(t => t.status === "approved").length;
    if (audience === "pending")  return teachers.filter(t => t.status === "pending").length;
    return 0;
  };
 
  const toggleChannel = ch => setChannels(p => p.includes(ch) ? p.filter(x => x !== ch) : [...p, ch]);
 
  const handleSend = async () => {
    if (!subject || !body)    { setToast({ msg:"Fill subject and message.", type:"error" }); return; }
    if (channels.length === 0){ setToast({ msg:"Select at least one channel.", type:"error" }); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 1800));
    const count = getAudienceCount();
    const now   = new Date().toLocaleString("en-IN");
    // Add to log
    const newEntries = Array.from({ length: Math.min(count, 5) }, (_, i) => ({
      id: Date.now() + i,
      type: "Manual Broadcast",
      recipient: teachers[i]?.name || `Teacher ${i+1}`,
      channel: channels[0],
      subject,
      sentAt: now,
      status: "delivered",
      opened: false,
      clicked: false,
    }));
    setNotifLog(p => [...newEntries, ...p]);
    setSending(false);
    setSentAnim(true);
    setTimeout(() => setSentAnim(false), 3000);
    setToast({ msg: `${scheduleMode === "now" ? "Sent" : "Scheduled"} to ${count} teachers via ${channels.join(", ")}! 📨`, type:"success" });
    setSubject(""); setBody(""); setSubjectB(""); setAbTest(false);
  };
 
  // Delivery stats
  const deliveryStats = {
    sent:      notifLog.length,
    delivered: notifLog.filter(n => n.status === "delivered").length,
    opened:    notifLog.filter(n => n.opened).length,
    clicked:   notifLog.filter(n => n.clicked).length,
    bounced:   notifLog.filter(n => n.status === "bounced").length,
  };
  const openRate  = deliveryStats.delivered > 0 ? Math.round((deliveryStats.opened   / deliveryStats.delivered) * 100) : 0;
  const clickRate = deliveryStats.opened    > 0 ? Math.round((deliveryStats.clicked  / deliveryStats.opened)    * 100) : 0;
 
  // ─────────────────────────────────────────────
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
 
      {/* Template Edit Modal */}
      {editTemplate && (
        <div style={NT_OVERLAY}>
          <div style={NT_MODAL}>
            <div style={NT_HDR}>
              <span style={{ fontSize:15, fontWeight:800 }}>✏️ Edit Template — {editTemplate.type}</span>
              <button onClick={() => setEditTemplate(null)} style={NT_CLOSE}>✕</button>
            </div>
            <div style={{ padding:"20px 24px 24px", overflowY:"auto", maxHeight:"75vh" }}>
              <div style={{ marginBottom:12 }}>
                <label style={S.label}>Notification Type</label>
                <input style={{ ...S.input, background:"#f9fafb", color:"#9ca3af" }} value={editTemplate.type} readOnly />
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={S.label}>Trigger</label>
                <input style={S.input} value={editTemplate.trigger}
                  onChange={e => setEditTemplate(t => ({ ...t, trigger:e.target.value }))} />
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={S.label}>Subject Line</label>
                <input style={S.input} value={editTemplate.subject}
                  onChange={e => setEditTemplate(t => ({ ...t, subject:e.target.value }))} />
                <div style={{ fontSize:10, color:"#9ca3af", marginTop:3 }}>
                  Variables: {"{{name}}, {{course}}, {{batch}}, {{sessionTitle}}, {{dueDate}}, {{downloadLink}}"}
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={S.label}>Message Body</label>
                <textarea style={{ ...S.input, height:120, resize:"vertical" }} value={editTemplate.body}
                  onChange={e => setEditTemplate(t => ({ ...t, body:e.target.value }))} />
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={S.label}>Channels</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {Object.entries(CHANNEL_META).map(([ch, meta]) => (
                    <button key={ch} onClick={() => setEditTemplate(t => ({
                      ...t,
                      channel: t.channel.includes(ch) ? t.channel.filter(x => x !== ch) : [...t.channel, ch]
                    }))}
                      style={{ padding:"7px 12px", borderRadius:8, border:`1.5px solid ${editTemplate.channel.includes(ch) ? meta.color : "#e5e7eb"}`, background:editTemplate.channel.includes(ch) ? `${meta.color}15` : "white", color:editTemplate.channel.includes(ch) ? meta.color : "#6b7280", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                      {meta.icon} {meta.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => {
                  setTemplates(p => p.map(t => t.id === editTemplate.id ? editTemplate : t));
                  setEditTemplate(null);
                  setToast({ msg:"Template saved!", type:"success" });
                }} style={{ ...NT_BTN_PRIMARY, flex:1 }}>💾 Save Template</button>
                <button onClick={() => setEditTemplate(null)} style={{ ...NT_BTN_GHOST, flex:1 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* Channel Config Modal */}
      {editChannel && (
        <div style={NT_OVERLAY}>
          <div style={{ ...NT_MODAL, maxWidth:480 }}>
            <div style={NT_HDR}>
              <span style={{ fontSize:15, fontWeight:800 }}>
                {CHANNEL_META[editChannel]?.icon} Configure {CHANNEL_META[editChannel]?.label}
              </span>
              <button onClick={() => setEditChannel(null)} style={NT_CLOSE}>✕</button>
            </div>
            <div style={{ padding:"20px 24px 24px" }}>
              {editChannel === "email" && (
                <div>
                  <div style={{ marginBottom:12 }}>
                    <label style={S.label}>Provider</label>
                    <select style={S.input} value={chanFormData.provider || channelConfig.email.provider}
                      onChange={e => setChanFormData(p => ({ ...p, provider:e.target.value }))}>
                      {["SendGrid","AWS SES","SMTP","Mailgun"].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={S.label}>API Key</label>
                    <input style={S.input} type="password" placeholder="••••••••••••••••"
                      value={chanFormData.apiKey || ""}
                      onChange={e => setChanFormData(p => ({ ...p, apiKey:e.target.value }))} />
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                    <div>
                      <label style={S.label}>From Name</label>
                      <input style={S.input} value={chanFormData.fromName || channelConfig.email.fromName}
                        onChange={e => setChanFormData(p => ({ ...p, fromName:e.target.value }))} />
                    </div>
                    <div>
                      <label style={S.label}>From Email</label>
                      <input style={S.input} type="email" value={chanFormData.fromEmail || channelConfig.email.fromEmail}
                        onChange={e => setChanFormData(p => ({ ...p, fromEmail:e.target.value }))} />
                    </div>
                  </div>
                </div>
              )}
              {editChannel === "sms" && (
                <div>
                  <div style={{ marginBottom:12 }}>
                    <label style={S.label}>Provider</label>
                    <select style={S.input} value={chanFormData.provider || channelConfig.sms.provider}
                      onChange={e => setChanFormData(p => ({ ...p, provider:e.target.value }))}>
                      {["MSG91","Twilio","TextLocal","Kaleyra"].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={S.label}>API Key</label>
                    <input style={S.input} type="password" placeholder="••••••••••••••••"
                      onChange={e => setChanFormData(p => ({ ...p, apiKey:e.target.value }))} />
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={S.label}>Sender ID</label>
                    <input style={S.input} value={chanFormData.senderId || channelConfig.sms.senderId}
                      onChange={e => setChanFormData(p => ({ ...p, senderId:e.target.value }))} placeholder="SPCEDU" />
                  </div>
                </div>
              )}
              {editChannel === "whatsapp" && (
                <div>
                  <div style={{ background:"#dcfce7", border:"1px solid #86efac", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#166534" }}>
                    💚 WhatsApp Business API — requires Meta Business account verification.
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={S.label}>Access Token</label>
                    <input style={S.input} type="password" placeholder="••••••••••••••••"
                      onChange={e => setChanFormData(p => ({ ...p, token:e.target.value }))} />
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={S.label}>Phone Number ID</label>
                    <input style={S.input} value={chanFormData.phoneNumberId || channelConfig.whatsapp.phoneNumberId}
                      onChange={e => setChanFormData(p => ({ ...p, phoneNumberId:e.target.value }))} />
                  </div>
                </div>
              )}
              {editChannel === "in-app" && (
                <div style={{ textAlign:"center", padding:20 }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>🔔</div>
                  <div style={{ fontSize:13, color:"#374151", fontWeight:600, marginBottom:6 }}>Built-in Push Notifications</div>
                  <div style={{ fontSize:12, color:"#9ca3af" }}>In-app notifications are handled natively. No external configuration required.</div>
                </div>
              )}
              <div style={{ display:"flex", gap:10, marginTop:16 }}>
                <button onClick={() => {
                  setChannelConfig(p => ({ ...p, [editChannel]: { ...p[editChannel], ...chanFormData, connected:true } }));
                  setEditChannel(null);
                  setChanFormData({});
                  setToast({ msg:`${CHANNEL_META[editChannel]?.label} channel configured!`, type:"success" });
                }} style={{ ...NT_BTN_PRIMARY, flex:1 }}>💾 Save Configuration</button>
                <button onClick={() => { setEditChannel(null); setChanFormData({}); }} style={{ ...NT_BTN_GHOST, flex:1 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={S.pageTitle}>Notifications Management</h1>
          <p style={S.pageSub}>Email · SMS · In-App · WhatsApp — templates, bulk messaging & delivery reports</p>
        </div>
      </div>
 
      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:12, marginBottom:20 }}>
        {[
          { icon:"📤", label:"Sent",      val:deliveryStats.sent,      color:"#f59e0b", bg:"#fef9c3" },
          { icon:"✅", label:"Delivered", val:deliveryStats.delivered, color:"#10b981", bg:"#d1fae5" },
          { icon:"👁", label:"Open Rate", val:`${openRate}%`,          color:"#3b82f6", bg:"#dbeafe" },
          { icon:"🖱", label:"Click Rate",val:`${clickRate}%`,         color:"#8b5cf6", bg:"#ede9fe" },
          { icon:"⚠️", label:"Bounced",   val:deliveryStats.bounced,   color:"#ef4444", bg:"#fee2e2" },
        ].map((k,i) => (
          <div key={i} style={{ background:"white", borderRadius:12, padding:"12px 14px", border:`1px solid ${k.color}30`, borderLeft:`3px solid ${k.color}`, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:18, marginBottom:4 }}>{k.icon}</div>
            <div style={{ fontSize:20, fontWeight:800, color:k.color }}>{k.val}</div>
            <div style={{ fontSize:10, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:".3px" }}>{k.label}</div>
          </div>
        ))}
      </div>
 
      {/* Sub Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:18, borderBottom:"2px solid #f3f4f6" }}>
        {[
          { key:"compose",   label:"✉️ Compose & Send"    },
          { key:"templates", label:"📋 Templates"         },
          { key:"channels",  label:"⚙️ Channel Config"    },
          { key:"reports",   label:"📊 Delivery Reports"  },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding:"10px 18px", border:"none", borderBottom:`2px solid ${activeTab===t.key?"#f59e0b":"transparent"}`, background:"none", color:activeTab===t.key?"#92400e":"#9ca3af", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginBottom:-2 }}>
            {t.label}
          </button>
        ))}
      </div>
 
      {/* ── COMPOSE TAB ── */}
      {activeTab === "compose" && (
        <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:20 }}>
          {/* Compose form */}
          <div style={{ background:"white", borderRadius:16, padding:22, border:"1px solid #f1f5f9", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:14, fontWeight:800, color:"#0f172a", marginBottom:16 }}>✉️ New Notification</div>
 
            {/* Channel selector */}
            <div style={{ marginBottom:16 }}>
              <label style={S.label}>Send via (select multiple)</label>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {Object.entries(CHANNEL_META).map(([ch, meta]) => {
                  const cfg = channelConfig[ch === "in-app" ? "inapp" : ch];
                  const connected = ch === "in-app" ? true : cfg?.connected;
                  return (
                    <button key={ch} onClick={() => connected && toggleChannel(ch)}
                      title={!connected ? "Not configured — go to Channel Config" : ""}
                      style={{ padding:"8px 14px", borderRadius:9, border:`1.5px solid ${channels.includes(ch) ? meta.color : "#e5e7eb"}`, background:channels.includes(ch) ? `${meta.color}15` : connected ? "white" : "#f9fafb", color:channels.includes(ch) ? meta.color : connected ? "#6b7280" : "#d1d5db", fontSize:12, fontWeight:700, cursor:connected ? "pointer" : "not-allowed", fontFamily:"inherit", position:"relative" }}>
                      {meta.icon} {meta.label}
                      {!connected && <span style={{ fontSize:9, marginLeft:4 }}>🔴</span>}
                    </button>
                  );
                })}
              </div>
            </div>
 
            {/* Audience */}
            <div style={{ marginBottom:14 }}>
              <label style={S.label}>Send To</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
                {[
                  { val:"all",      label:`All Teachers (${teachers.length})`                                        },
                  { val:"approved", label:`Active Only (${teachers.filter(t=>t.status==="approved").length})`         },
                  { val:"pending",  label:`Pending (${teachers.filter(t=>t.status==="pending").length})`              },
                  { val:"course",   label:"By Course"                                                                 },
                  { val:"batch",    label:"By Batch"                                                                  },
                ].map(opt => (
                  <button key={opt.val} onClick={() => setAudience(opt.val)}
                    style={{ padding:"8px 12px", borderRadius:8, border:`1.5px solid ${audience===opt.val?"#f59e0b":"#e5e7eb"}`, background:audience===opt.val?"#fef3c7":"white", color:audience===opt.val?"#92400e":"#6b7280", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {audience === "course" && (
                <select style={{ ...S.input, marginBottom:0 }} value={courseAudience} onChange={e => setCourseAudience(e.target.value)}>
                  <option value="">Select course...</option>
                  {ALL_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
              {audience === "batch" && (
                <select style={{ ...S.input, marginBottom:0 }} value={batchAudience} onChange={e => setBatchAudience(e.target.value)}>
                  <option value="">Select batch...</option>
                  {ALL_BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              )}
              <div style={{ fontSize:12, color:"#9ca3af", marginTop:6 }}>
                📨 Reaching <b style={{ color:"#f59e0b" }}>{getAudienceCount()} teachers</b>
              </div>
            </div>
 
            {/* Subject with A/B toggle */}
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                <label style={{ ...S.label, margin:0 }}>Subject Line</label>
                <button onClick={() => setAbTest(!abTest)}
                  style={{ padding:"3px 10px", borderRadius:20, border:`1px solid ${abTest?"#8b5cf6":"#e5e7eb"}`, background:abTest?"#ede9fe":"white", color:abTest?"#7c3aed":"#9ca3af", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  {abTest ? "🧪 A/B ON" : "🧪 A/B Test"}
                </button>
              </div>
              <input style={{ ...S.input, marginBottom: abTest ? 8 : 0 }} value={subject} onChange={e => setSubject(e.target.value)} placeholder={abTest ? "Version A subject..." : "Notification subject..."} />
              {abTest && (
                <input style={{ ...S.input, marginBottom:0, borderColor:"#c4b5fd" }} value={subjectB} onChange={e => setSubjectB(e.target.value)} placeholder="Version B subject..." />
              )}
              {abTest && (
                <div style={{ fontSize:10, color:"#7c3aed", marginTop:4, fontWeight:600 }}>
                  🧪 A/B test: 50% will receive Version A, 50% Version B. Results shown in Delivery Reports.
                </div>
              )}
            </div>
 
            {/* Message body */}
            <div style={{ marginBottom:14 }}>
              <label style={S.label}>Message Body</label>
              <textarea style={{ ...S.input, height:130, resize:"vertical", fontFamily:"inherit", lineHeight:1.6 }}
                value={body} onChange={e => setBody(e.target.value)}
                placeholder="Write your message... Use {{name}}, {{course}}, {{batch}} for personalisation." />
              <div style={{ fontSize:10, color:"#9ca3af", marginTop:3 }}>
                {body.length} chars · Variables: {"{{name}}, {{course}}, {{batch}}, {{dueDate}}"}
              </div>
            </div>
 
            {/* Schedule */}
            <div style={{ marginBottom:16 }}>
              <label style={S.label}>Send</label>
              <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                {[["now","Send Now"],["scheduled","Schedule"]].map(([val, label]) => (
                  <button key={val} onClick={() => setScheduleMode(val)}
                    style={{ flex:1, padding:"8px", borderRadius:8, border:`1.5px solid ${scheduleMode===val?"#f59e0b":"#e5e7eb"}`, background:scheduleMode===val?"#fef3c7":"white", color:scheduleMode===val?"#92400e":"#6b7280", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                    {val === "now" ? "⚡ " : "📅 "}{label}
                  </button>
                ))}
              </div>
              {scheduleMode === "scheduled" && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <div>
                    <label style={S.label}>Date</label>
                    <input type="date" style={{ ...S.input, marginBottom:0 }} value={schedDate} onChange={e => setSchedDate(e.target.value)} />
                  </div>
                  <div>
                    <label style={S.label}>Time</label>
                    <input type="time" style={{ ...S.input, marginBottom:0 }} value={schedTime} onChange={e => setSchedTime(e.target.value)} />
                  </div>
                </div>
              )}
            </div>
 
            {/* Send button */}
            {sentAnim ? (
              <div style={{ background:"#d1fae5", border:"1px solid #86efac", borderRadius:12, padding:"16px", textAlign:"center" }}>
                <div style={{ fontSize:28, marginBottom:4 }}>✅</div>
                <div style={{ fontSize:13, fontWeight:800, color:"#065f46" }}>
                  {scheduleMode === "now" ? "Sent successfully!" : "Scheduled!"}
                </div>
              </div>
            ) : (
              <button onClick={handleSend} disabled={sending}
                style={{ ...NT_BTN_PRIMARY, width:"100%", padding:"12px", fontSize:14, opacity:sending?0.7:1 }}>
                {sending ? "⏳ Sending..." : scheduleMode === "now" ? `📤 Send to ${getAudienceCount()} Teachers` : `📅 Schedule for ${schedDate} ${schedTime}`}
              </button>
            )}
          </div>
 
          {/* Quick templates panel */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:"white", borderRadius:16, padding:20, border:"1px solid #f1f5f9", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize:14, fontWeight:800, color:"#0f172a", marginBottom:14 }}>⚡ Quick Templates</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {templates.filter(t => t.active).slice(0,6).map(t => (
                  <div key={t.id} onClick={() => { setSubject(t.subject); setBody(t.body); setChannels(t.channel); }}
                    style={{ padding:"12px 14px", background:"#f9fafb", borderRadius:10, cursor:"pointer", border:"1px solid #f3f4f6", transition:"all .15s" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>{t.type}</div>
                      <div style={{ display:"flex", gap:4 }}>
                        {t.channel.map(ch => (
                          <span key={ch} style={{ fontSize:14 }}>{CHANNEL_META[ch]?.icon || "📢"}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{t.trigger}</div>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Channel status */}
            <div style={{ background:"white", borderRadius:16, padding:20, border:"1px solid #f1f5f9", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize:13, fontWeight:800, color:"#0f172a", marginBottom:12 }}>⚙️ Channel Status</div>
              {Object.entries(CHANNEL_META).map(([ch, meta]) => {
                const cfgKey = ch === "in-app" ? "inapp" : ch;
                const cfg = channelConfig[cfgKey];
                const connected = ch === "in-app" ? true : cfg?.connected;
                return (
                  <div key={ch} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid #f9fafb" }}>
                    <span style={{ fontSize:18 }}>{meta.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#0f172a" }}>{meta.label}</div>
                      <div style={{ fontSize:10, color:"#9ca3af" }}>{ch !== "in-app" ? cfg?.provider : "Built-in"}</div>
                    </div>
                    <span style={{ padding:"2px 9px", borderRadius:20, fontSize:10, fontWeight:700, background:connected?"#d1fae5":"#fee2e2", color:connected?"#059669":"#dc2626" }}>
                      {connected ? "✓ Connected" : "✕ Not Connected"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
 
      {/* ── TEMPLATES TAB ── */}
      {activeTab === "templates" && (
        <div>
          <div style={{ fontSize:13, color:"#6b7280", marginBottom:16 }}>
            Manage auto-triggered notification templates. Click Edit to customise any template.
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {templates.map(t => (
              <div key={t.id} style={{ background:"white", borderRadius:14, padding:"16px 20px", border:"1px solid #f1f5f9", boxShadow:"0 1px 4px rgba(0,0,0,0.04)", display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:t.active?"#fef3c7":"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                  {t.channel[0] ? CHANNEL_META[t.channel[0]]?.icon : "📢"}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                    <div style={{ fontSize:14, fontWeight:800, color:"#0f172a" }}>{t.type}</div>
                    {t.channel.map(ch => (
                      <span key={ch} style={{ padding:"1px 7px", borderRadius:20, fontSize:10, fontWeight:700, background:`${CHANNEL_META[ch]?.color}15`, color:CHANNEL_META[ch]?.color || "#6b7280" }}>
                        {CHANNEL_META[ch]?.icon} {CHANNEL_META[ch]?.label}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize:11, color:"#9ca3af" }}>🔁 {t.trigger}</div>
                  <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>Subject: {t.subject}</div>
                </div>
                <div style={{ textAlign:"center", flexShrink:0 }}>
                  <div style={{ fontSize:16, fontWeight:800, color:"#0f172a" }}>{t.sentCount}</div>
                  <div style={{ fontSize:10, color:"#9ca3af" }}>sent</div>
                  <div style={{ fontSize:10, color:"#9ca3af" }}>{t.lastSent}</div>
                </div>
                <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                  {/* Toggle active */}
                  <div onClick={() => setTemplates(p => p.map(x => x.id===t.id ? {...x,active:!x.active} : x))}
                    style={{ width:40, height:22, borderRadius:11, background:t.active?"#10b981":"#e5e7eb", position:"relative", cursor:"pointer", transition:"background .3s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:2, left:t.active?18:2, width:18, height:18, borderRadius:"50%", background:"white", transition:"left .3s", boxShadow:"0 1px 3px rgba(0,0,0,.2)" }}/>
                  </div>
                  <button onClick={() => setEditTemplate({ ...t })} style={NT_BTN_GHOST}>✏️ Edit</button>
                  <button onClick={() => { setSubject(t.subject); setBody(t.body); setChannels(t.channel); setActiveTab("compose"); setToast({ msg:"Template loaded in Compose!", type:"success" }); }}
                    style={NT_BTN_PRIMARY}>Use →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
 
      {/* ── CHANNEL CONFIG TAB ── */}
      {activeTab === "channels" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
          {Object.entries(CHANNEL_META).map(([ch, meta]) => {
            const cfgKey = ch === "in-app" ? "inapp" : ch;
            const cfg    = channelConfig[cfgKey];
            const connected = ch === "in-app" ? true : cfg?.connected;
            return (
              <div key={ch} style={{ background:"white", borderRadius:16, padding:20, border:`1px solid ${meta.color}30`, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:`${meta.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{meta.icon}</div>
                  <div>
                    <div style={{ fontSize:15, fontWeight:800, color:"#0f172a" }}>{meta.label}</div>
                    <div style={{ fontSize:11, color:"#9ca3af" }}>{meta.provider}</div>
                  </div>
                  <span style={{ marginLeft:"auto", padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700, background:connected?"#d1fae5":"#fee2e2", color:connected?"#059669":"#dc2626" }}>
                    {connected ? "✓ Live" : "✕ Off"}
                  </span>
                </div>
 
                {ch !== "in-app" && cfg && (
                  <div style={{ background:"#f9fafb", borderRadius:10, padding:"10px 12px", marginBottom:12, fontSize:11, color:"#6b7280" }}>
                    <div>Provider: <b>{cfg.provider}</b></div>
                    {cfg.fromEmail && <div>From: <b>{cfg.fromEmail}</b></div>}
                    {cfg.senderId  && <div>Sender ID: <b>{cfg.senderId}</b></div>}
                    {cfg.phoneNumberId && <div>Phone ID: <b>{cfg.phoneNumberId}</b></div>}
                  </div>
                )}
 
                {ch === "whatsapp" && !connected && (
                  <div style={{ background:"#dcfce7", border:"1px solid #86efac", borderRadius:8, padding:"8px 12px", marginBottom:12, fontSize:11, color:"#166534" }}>
                    💚 Optional advanced feature. Requires Meta Business verification.
                  </div>
                )}
 
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => { setEditChannel(ch); setChanFormData({}); }}
                    style={{ ...NT_BTN_PRIMARY, flex:1 }}>{connected ? "⚙️ Reconfigure" : "🔗 Connect"}</button>
                  {connected && ch !== "in-app" && (
                    <button onClick={() => {
                      setChannelConfig(p => ({ ...p, [cfgKey]: { ...p[cfgKey], connected:false } }));
                      setToast({ msg:`${meta.label} disconnected.`, type:"error" });
                    }} style={{ ...NT_BTN_GHOST, color:"#dc2626", borderColor:"#fca5a5" }}>Disconnect</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
 
      {/* ── DELIVERY REPORTS TAB ── */}
      {activeTab === "reports" && (
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          {/* Summary bars */}
          <div style={{ background:"white", borderRadius:16, padding:20, border:"1px solid #f1f5f9", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:14, fontWeight:800, color:"#0f172a", marginBottom:16 }}>📊 Delivery Performance</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
              {[
                { label:"Delivery Rate", val:deliveryStats.delivered, total:deliveryStats.sent,      pct:Math.round((deliveryStats.delivered/Math.max(deliveryStats.sent,1))*100), color:"#10b981" },
                { label:"Open Rate",     val:deliveryStats.opened,    total:deliveryStats.delivered, pct:openRate,  color:"#3b82f6" },
                { label:"Click Rate",    val:deliveryStats.clicked,   total:deliveryStats.opened,    pct:clickRate, color:"#8b5cf6" },
                { label:"Bounce Rate",   val:deliveryStats.bounced,   total:deliveryStats.sent,      pct:Math.round((deliveryStats.bounced/Math.max(deliveryStats.sent,1))*100), color:"#ef4444" },
              ].map((stat,i) => (
                <div key={i} style={{ padding:14, background:"#f9fafb", borderRadius:12, border:"1px solid #f3f4f6" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#374151" }}>{stat.label}</span>
                    <span style={{ fontSize:16, fontWeight:900, color:stat.color }}>{stat.pct}%</span>
                  </div>
                  <div style={{ height:6, background:"#e5e7eb", borderRadius:4, overflow:"hidden", marginBottom:4 }}>
                    <div style={{ height:"100%", width:`${stat.pct}%`, background:stat.color, borderRadius:4 }} />
                  </div>
                  <div style={{ fontSize:10, color:"#9ca3af" }}>{stat.val} of {stat.total}</div>
                </div>
              ))}
            </div>
          </div>
 
          {/* A/B Test results simulation */}
          <div style={{ background:"white", borderRadius:16, padding:20, border:"1px solid #f1f5f9", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:14, fontWeight:800, color:"#0f172a", marginBottom:14 }}>🧪 A/B Test Results</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {[
                { label:"Version A", subject:"Live Session Tomorrow: Classroom Management", openRate:68, clickRate:42, sent:Math.floor(getAudienceCount()/2), winner:true  },
                { label:"Version B", subject:"Don't Miss Tomorrow's Live Session!",         openRate:54, clickRate:35, sent:Math.ceil(getAudienceCount()/2),  winner:false },
              ].map((v,i) => (
                <div key={i} style={{ padding:16, background:v.winner?"#ecfdf5":"#f9fafb", borderRadius:12, border:`1.5px solid ${v.winner?"#86efac":"#f3f4f6"}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <span style={{ fontSize:13, fontWeight:800, color:"#0f172a" }}>{v.label}</span>
                    {v.winner && <span style={{ padding:"2px 9px", borderRadius:20, fontSize:10, fontWeight:700, background:"#d1fae5", color:"#059669" }}>🏆 Winner</span>}
                  </div>
                  <div style={{ fontSize:11, color:"#6b7280", marginBottom:10, fontStyle:"italic" }}>"{v.subject}"</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    {[{l:"Sent",v:v.sent,c:"#374151"},{l:"Open Rate",v:`${v.openRate}%`,c:"#3b82f6"},{l:"Click Rate",v:`${v.clickRate}%`,c:"#8b5cf6"}].map((s,j) => (
                      <div key={j} style={{ textAlign:"center", background:"white", borderRadius:8, padding:"8px 4px" }}>
                        <div style={{ fontSize:14, fontWeight:800, color:s.c }}>{s.v}</div>
                        <div style={{ fontSize:9, color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
 
          {/* Notification log table */}
          <div style={{ background:"white", borderRadius:16, border:"1px solid #f1f5f9", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ padding:"14px 18px", borderBottom:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:13, fontWeight:800, color:"#0f172a" }}>📋 Notification Log ({notifLog.length})</div>
              <button onClick={() => {
                const csv = [["Recipient","Type","Channel","Subject","Sent At","Status","Opened","Clicked"],
                  ...notifLog.map(n => [n.recipient,n.type,n.channel,n.subject,n.sentAt,n.status,n.opened?"Yes":"No",n.clicked?"Yes":"No"])
                ].map(r => r.map(v=>`"${v}"`).join(",")).join("\n");
                const a = document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURI(csv); a.download="notification_log.csv"; a.click();
                setToast({ msg:"Log exported!", type:"success" });
              }} style={NT_BTN_GHOST}>⬇ Export CSV</button>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#f9fafb", borderBottom:"1px solid #f1f5f9" }}>
                    {["Recipient","Type","Channel","Subject","Sent At","Status","Opened","Clicked"].map(h => (
                      <th key={h} style={{ padding:"10px 12px", fontSize:10.5, fontWeight:700, color:"#9ca3af", textAlign:"left", textTransform:"uppercase", letterSpacing:".4px", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {notifLog.map((n,i) => (
                    <tr key={n.id} style={{ borderBottom:"1px solid #f9fafb", background:i%2===0?"white":"#fafafa" }}>
                      <td style={{ padding:"10px 12px", fontSize:13, fontWeight:700, color:"#0f172a" }}>{n.recipient}</td>
                      <td style={{ padding:"10px 12px", fontSize:11, color:"#6b7280" }}>{n.type}</td>
                      <td style={{ padding:"10px 12px" }}>
                        <span style={{ fontSize:14 }}>{CHANNEL_META[n.channel]?.icon || "📢"}</span>
                        <span style={{ fontSize:11, color:"#6b7280", marginLeft:4 }}>{CHANNEL_META[n.channel]?.label || n.channel}</span>
                      </td>
                      <td style={{ padding:"10px 12px", fontSize:11, color:"#374151", maxWidth:160, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{n.subject}</td>
                      <td style={{ padding:"10px 12px", fontSize:11, color:"#9ca3af" }}>{n.sentAt}</td>
                      <td style={{ padding:"10px 12px" }}>
                        <span style={{ padding:"2px 9px", borderRadius:20, fontSize:10, fontWeight:700, background:n.status==="delivered"?"#d1fae5":"#fee2e2", color:n.status==="delivered"?"#059669":"#dc2626" }}>
                          {n.status}
                        </span>
                      </td>
                      <td style={{ padding:"10px 12px", textAlign:"center" }}>
                        <span style={{ fontSize:14 }}>{n.opened ? "👁" : "—"}</span>
                      </td>
                      <td style={{ padding:"10px 12px", textAlign:"center" }}>
                        <span style={{ fontSize:14 }}>{n.clicked ? "🖱" : "—"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 

/* ── A11: Settings ── */
function SettingsTab() {
  const [portalName, setPortalName] = useState("SpacECE Teacher Training Portal");
  const [maintenance, setMaintenance] = useState(false);
  const [toast, setToast] = useState({msg:"",type:""});

  const roles = [
    { role:"Super Admin",    access:"Full access to all modules including financial and role management" },
    { role:"Admin",          access:"All modules except role management and financial reports" },
    { role:"Trainer",        access:"Content upload, assignment review, live sessions, forum" },
    { role:"Support Staff",  access:"Teacher management, notifications, feedback only" },
    { role:"Finance Manager",access:"Revenue reports, payment records, invoice generation" },
  ];

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:"",type:""})}/>
      <h1 style={S.pageTitle}>Settings & Roles</h1>
      <p style={S.pageSub}>Manage portal settings, roles, and access control</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Portal Settings */}
        <SectionCard title="⚙️ Portal Settings">
          <div style={{ marginBottom:12 }}>
            <label style={S.label}>Portal Name</label>
            <input style={S.input} value={portalName} onChange={e=>setPortalName(e.target.value)}/>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={S.label}>Default Language</label>
            <select style={S.input}>
              {["English","Hindi","Marathi","Tamil","Telugu"].map(l=><option key={l}>{l}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={S.label}>Timezone</label>
            <select style={S.input}>
              <option>Asia/Kolkata (IST)</option>
              <option>UTC</option>
            </select>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderTop:"1px solid #f3f4f6", marginTop:4 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#1c1917" }}>🔧 Maintenance Mode</div>
              <div style={{ fontSize:11, color:"#9ca3af" }}>Disable public access to portal</div>
            </div>
            <div onClick={()=>setMaintenance(!maintenance)}
              style={{ width:46, height:26, borderRadius:13, background:maintenance?"#ef4444":"#e5e7eb",
                position:"relative", cursor:"pointer", transition:"background 0.3s" }}>
              <div style={{ position:"absolute", top:3, left:maintenance?22:3, width:20, height:20,
                borderRadius:"50%", background:"white", transition:"left 0.3s",
                boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
            </div>
          </div>
          <button onClick={()=>setToast({msg:"Settings saved!",type:"success"})}
            style={{ ...S.primaryBtn, width:"100%", marginTop:12 }}>Save Settings</button>
        </SectionCard>

        {/* Role-Based Access */}
        <SectionCard title="🛡️ Role-Based Access Control">
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {roles.map((r,i)=>(
              <div key={i} style={{ padding:"12px 14px", background:"#f9fafb", borderRadius:10, border:"1px solid #f3f4f6" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#1c1917" }}>{r.role}</span>
                  <button style={S.tblBtn}>Edit</button>
                </div>
                <p style={{ fontSize:11, color:"#9ca3af", margin:0 }}>{r.access}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN ADMIN DASHBOARD
═══════════════════════════════════════════ */
export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [teachers,  setTeachers]  = useState(MOCK_TEACHERS);
  const [courses,   setCourses]   = useState(MOCK_COURSES);
  const [batches,   setBatches]   = useState(MOCK_BATCHES);
  const [trainers,  setTrainers]  = useState(MOCK_TRAINERS);
  const [sessions,  setSessions]  = useState(MOCK_SESSIONS);
  const [assignments,setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [toast, setToast] = useState({msg:"",type:""});
  const [contentItems, setContentItems] = useState(MOCK_CONTENT_ITEMS);
  const [assessmentsData, setAssessmentsData] = useState(MOCK_ASSESSMENTS);
  const [certificates, setCertificates] = useState(MOCK_CERTIFICATES);
  const [feedbacks, setFeedbacks] = useState(MOCK_FEEDBACKS);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);

  const pending = teachers.filter(t=>t.status==="pending");

  const navItems = [
    { key:"overview",     label:"Overview",          icon:"📊" },
    { key:"teachers",     label:"Teacher Management",icon:"👩‍🏫", badge:pending.length },
    { key:"courses",      label:"Course Management", icon:"📚" },
    { key:"batches",      label:"Batch Management",  icon:"🗂️" },
    { key:"trainers",     label:"Trainer Management",icon:"🎓" },
    { key:"assignments",  label:"Assignment Review", icon:"📝", badge:assignments.filter(a=>a.status==="pending").length },
    { key:"attendance",   label:"Attendance",        icon:"📋" },
    { key:"sessions",     label:"Live Sessions",     icon:"📹" },
    { key:"reports",      label:"Reports & Analytics",icon:"📈" },
    { key:"notifications",label:"Notifications",     icon:"🔔" },
    { key:"settings",     label:"Settings & Roles",  icon:"⚙️" },
    { key:"content",      label:"Learning Content",      icon:"🎬" },
    { key:"assessments",  label:"Assessment Management", icon:"🧠" },
    { key:"certificates", label:"Certificates",          icon:"🏅" },
    { key:"feedback",     label:"Feedback",              icon:"💬" },
  ];
  const persistTeachers = (updater) => {
  setTeachers(prev => {
    const next = typeof updater === "function" ? updater(prev) : updater;
    const toStore = next.filter(t => t.password);
    localStorage.setItem("spaceece_teachers", JSON.stringify(toStore));
    return next;
  });
};


  const renderContent = () => {
    switch(activeTab) {
      case "overview":     return <OverviewTab teachers={teachers} courses={courses} batches={batches} sessions={sessions}/>;
      case "teachers": return <TeacherManagementTab teachers={teachers} setTeachers={persistTeachers} setToast={setToast}/>;
      case "courses":      return <CourseManagementTab courses={courses} setCourses={setCourses} categories={categories} setCategories={setCategories} setToast={setToast}/>;
      case "batches": return <BatchManagementTab batches={batches} setBatches={setBatches} teachers={teachers} setToast={setToast}/>;
      case "trainers": return <TrainerManagementTab trainers={trainers} setTrainers={setTrainers} batches={batches} setToast={setToast}/>;
      case "assignments":  return <AssignmentReviewTab assignments={assignments} setAssignments={setAssignments} setToast={setToast}/>;
      case "attendance":   return <AttendanceTab teachers={teachers} sessions={sessions}/>;
      case "sessions": return <LiveSessionsTab sessions={sessions} setSessions={setSessions} teachers={teachers} batches={batches} setToast={setToast}/>;
      case "reports":      return <ReportsTab teachers={teachers} courses={courses} batches={batches}/>;
      case "notifications":return <NotificationsTab teachers={teachers} setToast={setToast}/>;
      case "settings":     return <SettingsTab/>;
      case "content":      return <LearningContentManagementTab contentItems={contentItems} setContentItems={setContentItems} setToast={setToast}/>;
      case "assessments":  return <AssessmentManagementTab assessmentsData={assessmentsData} setAssessmentsData={setAssessmentsData} setToast={setToast}/>;
      case "certificates": return <CertificateManagementTab certificates={certificates} setCertificates={setCertificates} setToast={setToast}/>;
      case "feedback":     return <FeedbackManagementTab feedbacks={feedbacks} setFeedbacks={setFeedbacks} setToast={setToast}/>;
      default:             return null;
    }
  };
  useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("spaceece_teachers") || "[]");
  // Stored teachers (registered via form) take priority — merge with mocks
  const storedIds = new Set(stored.map(t => t.email));
  const merged = [
    ...MOCK_TEACHERS.filter(t => !storedIds.has(t.email)),
    ...stored,
  ];
  setTeachers(merged);
}, []);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f8fafc", fontFamily:"'Segoe UI','Inter',-apple-system,sans-serif" }}>
      <style>{globalCSS}</style>
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:"",type:""})}/>

      {/* ── Sidebar ── */}
      <div style={{ width:250, background:"white", borderRight:"1px solid #f1f5f9", display:"flex", flexDirection:"column", flexShrink:0, boxShadow:"2px 0 12px rgba(0,0,0,0.04)", position:"sticky", top:0, height:"100vh", overflowY:"auto" }}>
        <div style={{ padding:"20px 16px 12px" }}>
          <Logo size={120}/>
          <div style={{ textAlign:"center", padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700,
            background:"#fef3c7", color:"#92400e", border:"1px solid #fbbf24", margin:"6px auto 0", display:"inline-block", width:"fit-content", letterSpacing:"0.3px" }}>
            🛡️ Admin Panel
          </div>
        </div>

        <nav style={{ padding:"4px 10px", flex:1 }}>
          {navItems.map(item=>(
            <button key={item.key} onClick={()=>setActiveTab(item.key)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"9px 12px",
                border:"none", borderRadius:10, background:activeTab===item.key?"#fef3c7":"transparent",
                color:activeTab===item.key?"#92400e":"#6b7280", fontSize:12, fontWeight:600,
                cursor:"pointer", fontFamily:"inherit", textAlign:"left", marginBottom:2,
                transition:"all 0.18s" }}>
              <span style={{ fontSize:15 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.badge>0 && <span style={{ background:"#ef4444", color:"white", borderRadius:20, fontSize:10, fontWeight:800, padding:"1px 7px", minWidth:18, textAlign:"center" }}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding:"12px 16px", borderTop:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"white" }}>A</div>
          <div style={{ flex:1, overflow:"hidden" }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#1c1917" }}>Admin</div>
            <div style={{ fontSize:10, color:"#9ca3af", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.email}</div>
          </div>
          <button onClick={onLogout} title="Sign Out"
            style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#9ca3af", padding:4 }}>⏻</button>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, padding:"28px 32px", overflowY:"auto", maxHeight:"100vh" }}>
        {renderContent()}
      </div>
    </div>
  );
}

function LearningContentManagementTab({ contentItems, setContentItems, setToast }) {
  const [activeTab,    setActiveTab]    = useState("library");   // library | organiser | ai
  const [search,       setSearch]       = useState("");
  const [typeFilter,   setTypeFilter]   = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [dragId,       setDragId]       = useState(null);
  const [dragModule,   setDragModule]   = useState(null);
  const [detailItem,   setDetailItem]   = useState(null);
  const [uploads,      setUploads]      = useState([]);           // bulk upload queue
  const [aiModal,      setAiModal]      = useState(null);         // { tool, item }
  const [aiResult,     setAiResult]     = useState("");
  const [aiLoading,    setAiLoading]    = useState(false);
  const [prereqEdit,   setPrereqEdit]   = useState(null);
  const [dripEdit,     setDripEdit]     = useState(null);
  const fileInputRef = useRef(null);
 
  const FORMAT_LIMITS = {
    video:    { exts: ["MP4","MOV","AVI","MKV"],        maxMB: 2048, label: "2 GB"  },
    audio:    { exts: ["MP3","WAV","AAC"],               maxMB: 200,  label: "200 MB"},
    pdf:      { exts: ["PDF"],                           maxMB: 50,   label: "50 MB" },
    document: { exts: ["DOCX","DOC","XLSX","XLS","TXT"], maxMB: 50,   label: "50 MB" },
    slide:    { exts: ["PPTX","PPT"],                    maxMB: 50,   label: "50 MB" },
    image:    { exts: ["PNG","JPG","JPEG","GIF","WEBP"], maxMB: 10,   label: "10 MB" },
  };
 
  const TYPE_ICON  = { video:"🎥", audio:"🎵", pdf:"📄", document:"📝", slide:"📊", image:"🖼️" };
  const TYPE_COLOR = { video:"#3b82f6", audio:"#8b5cf6", pdf:"#ef4444", document:"#10b981", slide:"#f59e0b", image:"#06b6d4" };
 
  const allCourses = [...new Set(contentItems.map(i => i.course))];
  const allModules = [...new Set(contentItems.map(i => i.module))];
 
  // ── Filtered items ──
  const filtered = contentItems.filter(item => {
    const q = search.toLowerCase();
    const matchSearch = item.title.toLowerCase().includes(q) || item.course.toLowerCase().includes(q) || item.format.toLowerCase().includes(q);
    const matchType   = typeFilter   === "all" || item.type   === typeFilter;
    const matchCourse = courseFilter === "all" || item.course === courseFilter;
    return matchSearch && matchType && matchCourse;
  });
 
  // ── Grouped by Course > Module ──
  const grouped = {};
  contentItems.forEach(item => {
    if (!grouped[item.course]) grouped[item.course] = {};
    if (!grouped[item.course][item.module]) grouped[item.course][item.module] = [];
    grouped[item.course][item.module].push(item);
  });
 
  // ── Actions ──
  const togglePublish = id => {
    setContentItems(p => p.map(i => i.id === id ? { ...i, status: i.status === "published" ? "draft" : "published" } : i));
    setToast({ msg: "Status updated!", type: "success" });
  };
 
  const deleteItem = id => {
    setContentItems(p => p.filter(i => i.id !== id));
    setToast({ msg: "Content deleted.", type: "error" });
    if (detailItem?.id === id) setDetailItem(null);
  };
 
  const moveToModule = (id, module) => {
    setContentItems(p => p.map(i => i.id === id ? { ...i, module } : i));
    setToast({ msg: `Moved to ${module}`, type: "success" });
  };
 
  const reorderWithinModule = (draggedId, targetId) => {
    if (draggedId === targetId) return;
    setContentItems(prev => {
      const arr = [...prev];
      const fi = arr.findIndex(x => x.id === draggedId);
      const ti = arr.findIndex(x => x.id === targetId);
      const [moved] = arr.splice(fi, 1);
      arr.splice(ti, 0, moved);
      return arr;
    });
  };
 
  const savePrereq = (id, prereqId) => {
    setContentItems(p => p.map(i => i.id === id ? { ...i, prerequisite: prereqId === "" ? null : Number(prereqId) } : i));
    setPrereqEdit(null);
    setToast({ msg: "Prerequisite saved!", type: "success" });
  };
 
  const saveDrip = (id, week, date) => {
    setContentItems(p => p.map(i => i.id === id ? { ...i, dripWeek: Number(week), releaseDate: date } : i));
    setDripEdit(null);
    setToast({ msg: "Content schedule saved!", type: "success" });
  };
 
  // ── Bulk upload simulation ──
  const handleFileSelect = e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newUploads = files.map(f => {
      const ext = f.name.split(".").pop().toUpperCase();
      let type = "document";
      if (["MP4","MOV","AVI","MKV"].includes(ext)) type = "video";
      else if (["MP3","WAV","AAC"].includes(ext)) type = "audio";
      else if (ext === "PDF") type = "pdf";
      else if (["PPTX","PPT"].includes(ext)) type = "slide";
      else if (["PNG","JPG","JPEG","GIF","WEBP"].includes(ext)) type = "image";
      const sizeMB = (f.size / 1048576).toFixed(1);
      const limit = FORMAT_LIMITS[type]?.maxMB || 50;
      const overLimit = f.size / 1048576 > limit;
      return { id: Date.now() + Math.random(), name: f.name, ext, type, sizeMB, overLimit, progress: 0, done: false, error: overLimit };
    });
    setUploads(p => [...p, ...newUploads]);
    // Simulate progress
    newUploads.forEach(u => {
      if (u.overLimit) return;
      let prog = 0;
      const interval = setInterval(() => {
        prog += Math.random() * 25;
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
          setUploads(p => p.map(x => x.id === u.id ? { ...x, progress: 100, done: true } : x));
          // Add to library
          const newItem = {
            id: Date.now() + Math.random(),
            title: u.name.replace(/\.[^.]+$/, ""),
            type: u.type,
            course: "Unassigned",
            module: "Unassigned",
            lesson: "Lesson 1",
            format: u.ext,
            size: `${u.sizeMB} MB`,
            sizeBytes: 0,
            duration: u.type === "video" ? "—" : "—",
            status: "draft",
            ai: "",
            updated: new Date().toLocaleDateString("en-IN"),
            thumbnail: "",
            transcript: "",
            prerequisite: null,
            releaseDate: "",
            dripWeek: 1,
            duplicate: false,
            uploadProgress: 100,
          };
          setContentItems(p => [...p, newItem]);
          setToast({ msg: `${u.name} uploaded!`, type: "success" });
        } else {
          setUploads(p => p.map(x => x.id === u.id ? { ...x, progress: Math.round(prog) } : x));
        }
      }, 200);
    });
    e.target.value = "";
  };
 
  // ── AI Tools ──
  const runAiTool = async (tool, item) => {
    setAiLoading(true);
    setAiResult("");
    await new Promise(r => setTimeout(r, 1800));
    let result = "";
    if (tool === "transcribe") {
      result = item?.transcript || `[Auto-generated transcript for "${item?.title}"]\n\nWelcome to this lesson. In this session we will explore key concepts related to ${item?.course}. The content covers foundational principles, practical examples, and assessment strategies for early childhood educators...\n\n[00:00] Introduction\n[02:15] Key Concepts\n[06:40] Practical Examples\n[10:00] Summary & Next Steps`;
      setContentItems(p => p.map(i => i.id === item?.id ? { ...i, ai: "Captions", transcript: result } : i));
    } else if (tool === "summarise") {
      result = `📋 AI Summary for "${item?.title}"\n\nThis content covers the following key points:\n• Introduction to core concepts in ${item?.course}\n• Practical strategies for classroom implementation\n• Assessment and feedback methods\n• Recommended resources for further learning\n\nEstimated reading time: 8 minutes\nDifficulty: Intermediate`;
    } else if (tool === "quiz") {
      result = `🧠 AI-Generated Quiz (5 MCQs)\n\n1. What is the primary goal of early childhood education?\n   a) Academic achievement  b) Holistic development ✓  c) Exam preparation  d) Discipline\n\n2. Which approach emphasises child-led learning?\n   a) Traditional  b) Montessori ✓  c) Behavioural  d) Lecture-based\n\n3. What does FLN stand for?\n   a) Foundational Literacy & Numeracy ✓  b) Formal Learning Network  c) Federal Literacy Norm  d) None\n\n4. NEP 2020 recommends starting formal education at age:\n   a) 3  b) 5  c) 6 ✓  d) 8\n\n5. A prerequisite lesson ensures:\n   a) Faster completion  b) Sequential learning ✓  c) Shorter courses  d) Higher fees`;
    } else if (tool === "duplicate") {
      const dups = contentItems.filter(i => i.title === item?.title && i.id !== item?.id);
      result = dups.length > 0
        ? `⚠️ Duplicate Detected!\n\nFound ${dups.length} item(s) with the same title:\n${dups.map(d => `• "${d.title}" in ${d.course} / ${d.module}`).join("\n")}\n\nRecommendation: Remove duplicates or rename for clarity.`
        : `✅ No Duplicates Found\n\n"${item?.title}" appears only once in the media library.`;
    }
    setAiResult(result);
    setAiLoading(false);
  };
 
  // ── Stats ──
  const totalSize = contentItems.reduce((a, i) => a + (i.sizeBytes || 0), 0);
  const fmtSize = b => b > 1073741824 ? `${(b/1073741824).toFixed(1)} GB` : b > 1048576 ? `${(b/1048576).toFixed(0)} MB` : `${(b/1024).toFixed(0)} KB`;
 
  // ─────────────────────────────────────────────
  //  DETAIL PANEL
  // ─────────────────────────────────────────────
  if (detailItem) {
    const item = contentItems.find(i => i.id === detailItem.id) || detailItem;
    const prereqItem = contentItems.find(i => i.id === item.prerequisite);
    return (
      <div style={{ animation: "fadeIn 0.3s ease" }}>
        {/* AI Modal */}
        {aiModal && (
          <div style={LC_OVERLAY}>
            <div style={LC_MODAL}>
              <div style={LC_HDR}>
                <span style={{ fontSize: 15, fontWeight: 800 }}>{aiModal.label}</span>
                <button onClick={() => { setAiModal(null); setAiResult(""); }} style={LC_CLOSE}>✕</button>
              </div>
              <div style={{ padding: "20px 24px 24px" }}>
                {aiLoading ? (
                  <div style={{ textAlign: "center", padding: 40 }}>
                    <div style={{ fontSize: 36, marginBottom: 12, animation: "spin 1s linear infinite", display: "inline-block" }}>⚙️</div>
                    <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>AI is processing "{item.title}"...</div>
                    <div style={{ marginTop: 16, height: 6, background: "#f3f4f6", borderRadius: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "70%", background: "#f59e0b", borderRadius: 6, animation: "shimmer 1.5s infinite" }} />
                    </div>
                  </div>
                ) : aiResult ? (
                  <div>
                    <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#374151", background: "#f9fafb", borderRadius: 10, padding: 14, border: "1px solid #f3f4f6", maxHeight: 320, overflowY: "auto", fontFamily: "inherit", lineHeight: 1.7 }}>{aiResult}</pre>
                    <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                      <button onClick={() => { navigator.clipboard?.writeText(aiResult); setToast({ msg: "Copied!", type: "success" }); }} style={{ ...LC_BTN_GHOST, flex: 1 }}>📋 Copy</button>
                      <button onClick={() => { setAiModal(null); setAiResult(""); }} style={{ ...LC_BTN_PRIMARY, flex: 1 }}>Done</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: 20 }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>{aiModal.icon}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>{aiModal.desc}</div>
                    <button onClick={() => runAiTool(aiModal.tool, item)} style={{ ...LC_BTN_PRIMARY, width: "100%" }}>▶ Run {aiModal.label}</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
 
        <button onClick={() => setDetailItem(null)} style={S.backBtn}>← Back to Library</button>
 
        <div style={{ background: "white", borderRadius: 20, padding: 28, border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20, paddingBottom: 18, borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: `${TYPE_COLOR[item.type]}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
              {TYPE_ICON[item.type]}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", margin: "0 0 6px" }}>{item.title}</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${TYPE_COLOR[item.type]}20`, color: TYPE_COLOR[item.type] }}>{item.format}</span>
                <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: item.status === "published" ? "#d1fae5" : "#f3f4f6", color: item.status === "published" ? "#059669" : "#6b7280" }}>{item.status}</span>
                {item.duplicate && <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#fee2e2", color: "#dc2626" }}>⚠️ Duplicate</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => togglePublish(item.id)} style={{ ...LC_BTN_GHOST }}>
                {item.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <button onClick={() => { deleteItem(item.id); }} style={{ ...LC_BTN_GHOST, color: "#dc2626", borderColor: "#fca5a5" }}>🗑 Delete</button>
            </div>
          </div>
 
          {/* Details */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Course",     val: item.course   },
              { label: "Module",     val: item.module   },
              { label: "Lesson",     val: item.lesson   },
              { label: "Format",     val: item.format   },
              { label: "File Size",  val: item.size     },
              { label: "Duration",   val: item.duration },
              { label: "Updated",    val: item.updated  },
              { label: "Drip Week",  val: `Week ${item.dripWeek}` },
              { label: "Release",    val: item.releaseDate || "Immediate" },
            ].map((r, i) => (
              <div key={i} style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 13px", border: "1px solid #f3f4f6" }}>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 2 }}>{r.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{r.val}</div>
              </div>
            ))}
          </div>
 
          {/* Prerequisite */}
          <div style={{ background: "#f9fafb", borderRadius: 12, padding: 14, border: "1px solid #f3f4f6", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>🔒 Prerequisite Lesson</div>
              <button onClick={() => setPrereqEdit(item.id)} style={LC_BTN_GHOST}>Edit</button>
            </div>
            {prereqItem
              ? <div style={{ fontSize: 12, color: "#374151" }}>Must complete: <b>{prereqItem.title}</b> ({prereqItem.module})</div>
              : <div style={{ fontSize: 12, color: "#9ca3af" }}>No prerequisite — accessible immediately</div>}
            {prereqEdit === item.id && (
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <select id="prereq-sel" defaultValue={item.prerequisite || ""} style={{ ...S.input, marginBottom: 0, flex: 1 }}>
                  <option value="">No prerequisite</option>
                  {contentItems.filter(i => i.id !== item.id).map(i => (
                    <option key={i.id} value={i.id}>{i.title} ({i.module})</option>
                  ))}
                </select>
                <button onClick={() => savePrereq(item.id, document.getElementById("prereq-sel").value)} style={LC_BTN_PRIMARY}>Save</button>
                <button onClick={() => setPrereqEdit(null)} style={LC_BTN_GHOST}>✕</button>
              </div>
            )}
          </div>
 
          {/* Drip schedule */}
          <div style={{ background: "#f9fafb", borderRadius: 12, padding: 14, border: "1px solid #f3f4f6", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>📅 Content Drip Schedule</div>
              <button onClick={() => setDripEdit(item.id)} style={LC_BTN_GHOST}>Edit</button>
            </div>
            <div style={{ fontSize: 12, color: "#374151" }}>
              Release: <b>Week {item.dripWeek}</b>{item.releaseDate ? ` · Date: ${item.releaseDate}` : ""}
            </div>
            {dripEdit === item.id && (
              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: 8, alignItems: "end" }}>
                <div>
                  <label style={S.label}>Batch Week</label>
                  <input id="drip-week" type="number" min="1" max="52" defaultValue={item.dripWeek} style={{ ...S.input, marginBottom: 0 }} />
                </div>
                <div>
                  <label style={S.label}>Release Date</label>
                  <input id="drip-date" type="date" defaultValue={item.releaseDate} style={{ ...S.input, marginBottom: 0 }} />
                </div>
                <button onClick={() => saveDrip(item.id, document.getElementById("drip-week").value, document.getElementById("drip-date").value)} style={{ ...LC_BTN_PRIMARY, height: 38 }}>Save</button>
                <button onClick={() => setDripEdit(null)} style={{ ...LC_BTN_GHOST, height: 38 }}>✕</button>
              </div>
            )}
          </div>
 
          {/* AI Tools for this item */}
          <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>🤖 AI Tools</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
            {[
              { tool: "transcribe", label: "AI Transcription", icon: "📝", desc: "Auto-generate subtitles and captions from this video", show: item.type === "video" || item.type === "audio" },
              { tool: "summarise",  label: "AI Summariser",    icon: "🧠", desc: "Generate a lesson summary and reading preview",         show: true },
              { tool: "quiz",       label: "AI Quiz Generator",icon: "❓", desc: "Create MCQs from this content automatically",           show: true },
              { tool: "duplicate",  label: "Duplicate Detector",icon:"🔍", desc: "Check if this content exists elsewhere in the library", show: true },
            ].filter(t => t.show).map((tool, i) => (
              <button key={i} onClick={() => { setAiModal(tool); setAiResult(""); setAiLoading(false); }}
                style={{ padding: 14, background: "white", border: "1px solid #e5e7eb", borderRadius: 12, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all .2s" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{tool.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", marginBottom: 3 }}>{tool.label}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.4 }}>{tool.desc}</div>
              </button>
            ))}
          </div>
 
          {/* Transcript preview */}
          {item.transcript && (
            <div style={{ marginTop: 16, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", marginBottom: 6 }}>📝 Transcript Preview</div>
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, maxHeight: 100, overflowY: "auto" }}>{item.transcript}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
 
  // ─────────────────────────────────────────────
  //  MAIN VIEW
  // ─────────────────────────────────────────────
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%{width:10%} 50%{width:80%} 100%{width:10%} }
      `}</style>
 
      {/* AI Tool Modal (from main view) */}
      {aiModal && (
        <div style={LC_OVERLAY}>
          <div style={LC_MODAL}>
            <div style={LC_HDR}>
              <span style={{ fontSize: 15, fontWeight: 800 }}>{aiModal.label}</span>
              <button onClick={() => { setAiModal(null); setAiResult(""); }} style={LC_CLOSE}>✕</button>
            </div>
            <div style={{ padding: "20px 24px 24px" }}>
              {aiLoading ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>⚙️</div>
                  <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>Processing...</div>
                  <div style={{ marginTop: 16, height: 6, background: "#f3f4f6", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "60%", background: "#f59e0b", borderRadius: 6 }} />
                  </div>
                </div>
              ) : aiResult ? (
                <div>
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#374151", background: "#f9fafb", borderRadius: 10, padding: 14, border: "1px solid #f3f4f6", maxHeight: 320, overflowY: "auto", fontFamily: "inherit", lineHeight: 1.7 }}>{aiResult}</pre>
                  <button onClick={() => { setAiModal(null); setAiResult(""); }} style={{ ...LC_BTN_PRIMARY, width: "100%", marginTop: 14 }}>Done</button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 20 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>{aiModal.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{aiModal.label}</div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>{aiModal.desc}</div>
                  {aiModal.tool === "duplicate" ? (
                    <div>
                      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>Select a content item to check:</div>
                      <select id="ai-item-sel" style={{ ...S.input, marginBottom: 16 }}>
                        {contentItems.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
                      </select>
                      <button onClick={async () => {
                        const selId = Number(document.getElementById("ai-item-sel").value);
                        const selItem = contentItems.find(i => i.id === selId);
                        setAiLoading(true); setAiResult("");
                        await new Promise(r => setTimeout(r, 1500));
                        const dups = contentItems.filter(i => i.title === selItem?.title && i.id !== selItem?.id);
                        setAiResult(dups.length > 0
                          ? `⚠️ Duplicate Detected!\n\nFound ${dups.length} item(s) matching "${selItem?.title}":\n${dups.map(d => `• ${d.title} in ${d.course} / ${d.module}`).join("\n")}`
                          : `✅ No Duplicates Found for "${selItem?.title}"`);
                        setAiLoading(false);
                      }} style={{ ...LC_BTN_PRIMARY, width: "100%" }}>▶ Scan for Duplicates</button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>Select content to process:</div>
                      <select id="ai-item-sel" style={{ ...S.input, marginBottom: 16 }}>
                        {contentItems.filter(i => aiModal.tool !== "transcribe" || i.type === "video" || i.type === "audio").map(i => (
                          <option key={i.id} value={i.id}>{i.title} ({i.format})</option>
                        ))}
                      </select>
                      <button onClick={async () => {
                        const selId = Number(document.getElementById("ai-item-sel").value);
                        const selItem = contentItems.find(i => i.id === selId);
                        await runAiTool(aiModal.tool, selItem);
                      }} style={{ ...LC_BTN_PRIMARY, width: "100%" }}>▶ Run {aiModal.label}</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
 
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={S.pageTitle}>Learning Content Management</h1>
          <p style={S.pageSub}>Media library · Module organiser · AI content tools</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => fileInputRef.current?.click()} style={{ ...S.exportBtn }}>⬆ Bulk Upload</button>
          <input ref={fileInputRef} type="file" multiple accept=".mp4,.mp3,.pdf,.pptx,.docx,.png,.jpg,.jpeg,.mov,.avi" style={{ display: "none" }} onChange={handleFileSelect} />
        </div>
      </div>
 
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { icon: "🗃️", label: "Total Items",  val: contentItems.length,                                            color: "#f59e0b", bg: "#fef3c7" },
          { icon: "🎥", label: "Videos",        val: contentItems.filter(i => i.type === "video").length,           color: "#3b82f6", bg: "#dbeafe" },
          { icon: "✅", label: "Published",     val: contentItems.filter(i => i.status === "published").length,     color: "#10b981", bg: "#d1fae5" },
          { icon: "⚠️", label: "Duplicates",    val: contentItems.filter(i => i.duplicate).length,                 color: "#ef4444", bg: "#fee2e2" },
          { icon: "💾", label: "Total Size",    val: fmtSize(totalSize),                                            color: "#8b5cf6", bg: "#ede9fe" },
          { icon: "🤖", label: "AI Processed",  val: contentItems.filter(i => i.ai).length,                        color: "#06b6d4", bg: "#cffafe" },
        ].map((k, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: `1px solid ${k.color}30`, borderLeft: `3px solid ${k.color}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{k.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{k.val}</div>
            <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".3px" }}>{k.label}</div>
          </div>
        ))}
      </div>
 
      {/* Bulk Upload Queue */}
      {uploads.length > 0 && (
        <div style={{ background: "white", borderRadius: 14, padding: 16, border: "1px solid #f1f5f9", marginBottom: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>⬆ Upload Queue ({uploads.length} files)</div>
            <button onClick={() => setUploads([])} style={LC_BTN_GHOST}>Clear All</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {uploads.map(u => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#f9fafb", borderRadius: 10, border: u.overLimit ? "1px solid #fca5a5" : "1px solid #f3f4f6" }}>
                <span style={{ fontSize: 18 }}>{TYPE_ICON[u.type] || "📄"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{u.sizeMB} MB · {u.ext}</div>
                  {u.overLimit
                    ? <div style={{ fontSize: 11, color: "#dc2626", fontWeight: 600 }}>✕ Exceeds file size limit ({FORMAT_LIMITS[u.type]?.label})</div>
                    : u.done
                      ? <div style={{ fontSize: 11, color: "#059669", fontWeight: 600 }}>✓ Upload complete</div>
                      : (
                        <div style={{ marginTop: 4 }}>
                          <div style={{ height: 4, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${u.progress}%`, background: "#f59e0b", borderRadius: 4, transition: "width .2s" }} />
                          </div>
                          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{u.progress}%</div>
                        </div>
                      )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
 
      {/* Format Limits info */}
      <div style={{ background: "#fef9c3", border: "1px solid #fde68a", borderRadius: 12, padding: "10px 16px", marginBottom: 18, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 11, color: "#92400e", fontWeight: 600 }}>
        <span>📋 File Limits:</span>
        <span>🎥 Video: 2 GB</span>
        <span>🎵 Audio: 200 MB</span>
        <span>📄 PDF/Docs: 50 MB</span>
        <span>🖼️ Images: 10 MB</span>
        <span>Supported: MP4, MP3, PDF, PPTX, DOCX, PNG, JPG</span>
      </div>
 
      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 18, borderBottom: "2px solid #f3f4f6", paddingBottom: 0 }}>
        {[
          { key: "library",   label: "🗂️ Media Library"   },
          { key: "organiser", label: "🧩 Module Organiser" },
          { key: "ai",        label: "🤖 AI Tools"         },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: "10px 18px", border: "none", borderBottom: `2px solid ${activeTab === t.key ? "#f59e0b" : "transparent"}`, background: "none", color: activeTab === t.key ? "#92400e" : "#9ca3af", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: -2 }}>
            {t.label}
          </button>
        ))}
      </div>
 
      {/* ── LIBRARY TAB ── */}
      {activeTab === "library" && (
        <div>
          {/* Filters */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
              <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search title, course, format..."
                style={{ ...S.input, paddingLeft: 34, marginBottom: 0 }}
              />
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ ...S.input, marginBottom: 0, width: 140 }}>
              <option value="all">All Types</option>
              {Object.keys(TYPE_ICON).map(t => <option key={t} value={t}>{TYPE_ICON[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} style={{ ...S.input, marginBottom: 0, width: 220 }}>
              <option value="all">All Courses</option>
              {allCourses.map(c => <option key={c} value={c}>{c.substring(0, 30)}</option>)}
            </select>
            {(search || typeFilter !== "all" || courseFilter !== "all") && (
              <button onClick={() => { setSearch(""); setTypeFilter("all"); setCourseFilter("all"); }} style={{ ...LC_BTN_GHOST, color: "#ef4444", borderColor: "#fca5a5" }}>✕ Clear</button>
            )}
          </div>
 
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>Showing {filtered.length} of {contentItems.length} items</div>
 
          {/* Library table */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f1f5f9" }}>
                  {["Content", "Course › Module", "Format", "Size", "Drip", "AI", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "11px 14px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left", textTransform: "uppercase", letterSpacing: ".5px", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f9fafb", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${TYPE_COLOR[item.type]}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{TYPE_ICON[item.type]}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
                          {item.duplicate && <div style={{ fontSize: 10, color: "#dc2626", fontWeight: 700 }}>⚠️ Duplicate</div>}
                          {item.prerequisite && <div style={{ fontSize: 10, color: "#7c3aed" }}>🔒 Has prerequisite</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: 12, color: "#6b7280", maxWidth: 180 }}>
                      <div style={{ fontWeight: 600, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.course.substring(0, 25)}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.module} › {item.lesson}</div>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${TYPE_COLOR[item.type]}20`, color: TYPE_COLOR[item.type] }}>{item.format}</span>
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: 12, color: "#374151", fontWeight: 600 }}>{item.size}</td>
                    <td style={{ padding: "11px 14px", fontSize: 11, color: "#6b7280" }}>Wk {item.dripWeek}{item.releaseDate ? `\n${item.releaseDate}` : ""}</td>
                    <td style={{ padding: "11px 14px" }}>
                      {item.ai ? <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "#ede9fe", color: "#6d28d9" }}>{item.ai}</span> : <span style={{ color: "#d1d5db", fontSize: 11 }}>—</span>}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, background: item.status === "published" ? "#d1fae5" : "#f3f4f6", color: item.status === "published" ? "#059669" : "#6b7280" }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        <button onClick={() => setDetailItem(item)} style={{ ...LC_BTN_GHOST, fontSize: 11, padding: "4px 9px" }}>View</button>
                        <button onClick={() => togglePublish(item.id)} style={{ ...LC_BTN_GHOST, fontSize: 11, padding: "4px 9px", color: item.status === "published" ? "#dc2626" : "#059669" }}>
                          {item.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button onClick={() => deleteItem(item.id)} style={{ ...LC_BTN_GHOST, fontSize: 11, padding: "4px 9px", color: "#dc2626", borderColor: "#fca5a5" }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 48, color: "#9ca3af" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🗂️</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>No content found</div>
              </div>
            )}
          </div>
        </div>
      )}
 
      {/* ── ORGANISER TAB ── */}
      {activeTab === "organiser" && (
        <div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
            Drag lessons within a module to reorder. Click a lesson to set prerequisites or drip schedule.
          </div>
          {Object.entries(grouped).map(([course, modules]) => (
            <div key={course} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 12, padding: "8px 14px", background: "#fef3c7", borderRadius: 10, border: "1px solid #fbbf24" }}>
                📚 {course}
              </div>
              {Object.entries(modules).map(([module, items]) => (
                <div key={module} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8, paddingLeft: 8 }}>
                    📁 {module} <span style={{ fontSize: 10, color: "#9ca3af" }}>({items.length} items)</span>
                  </div>
                  <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => {
                      if (dragId) moveToModule(dragId, module);
                      setDragId(null); setDragModule(null);
                    }}
                    style={{ minHeight: 60, background: dragModule === module ? "#fef3c7" : "#f9fafb", borderRadius: 12, border: `2px dashed ${dragModule === module ? "#f59e0b" : "#e5e7eb"}`, padding: 10, transition: "all .2s" }}
                  >
                    {items.map((item, idx) => {
                      const prereqItem = contentItems.find(i => i.id === item.prerequisite);
                      return (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={() => { setDragId(item.id); setDragModule(module); }}
                          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                          onDrop={e => { e.stopPropagation(); reorderWithinModule(dragId, item.id); setDragId(null); setDragModule(null); }}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "white", borderRadius: 10, marginBottom: 6, border: "1px solid #f1f5f9", cursor: "grab", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                        >
                          <span style={{ color: "#d1d5db", fontSize: 16, flexShrink: 0 }}>⠿</span>
                          <span style={{ fontSize: 16 }}>{TYPE_ICON[item.type]}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{item.title}</div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
                              {item.lesson} · {item.format} · {item.size}
                              {prereqItem && <span style={{ color: "#7c3aed", marginLeft: 6 }}>🔒 After: {prereqItem.title}</span>}
                              {item.releaseDate && <span style={{ color: "#2563eb", marginLeft: 6 }}>📅 {item.releaseDate}</span>}
                              {item.dripWeek && <span style={{ color: "#059669", marginLeft: 6 }}>Wk {item.dripWeek}</span>}
                            </div>
                          </div>
                          <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: item.status === "published" ? "#d1fae5" : "#f3f4f6", color: item.status === "published" ? "#059669" : "#6b7280" }}>{item.status}</span>
                          <button onClick={() => setDetailItem(item)} style={{ ...LC_BTN_GHOST, fontSize: 11, padding: "4px 9px" }}>Edit</button>
                        </div>
                      );
                    })}
                    {items.length === 0 && <div style={{ textAlign: "center", padding: 16, fontSize: 12, color: "#9ca3af" }}>Drop content here</div>}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
 
      {/* ── AI TOOLS TAB ── */}
      {activeTab === "ai" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16, marginBottom: 24 }}>
            {[
              { tool: "transcribe", label: "AI Video Transcription", icon: "📝", desc: "Auto-generate subtitles and closed captions from uploaded video or audio files.", color: "#3b82f6", bg: "#dbeafe" },
              { tool: "summarise",  label: "AI Content Summariser",  icon: "🧠", desc: "Generate lesson summaries and reading previews from PDFs, videos, and documents.", color: "#8b5cf6", bg: "#ede9fe" },
              { tool: "quiz",       label: "AI Quiz Generator",      icon: "❓", desc: "Automatically create MCQ quizzes from uploaded PDF content or video transcripts.", color: "#f59e0b", bg: "#fef3c7" },
              { tool: "duplicate",  label: "Duplicate Detector",     icon: "🔍", desc: "Scan the media library to flag re-uploaded or duplicate content files.", color: "#ef4444", bg: "#fee2e2" },
            ].map((tool, i) => (
              <div key={i} style={{ background: "white", border: `1px solid ${tool.color}30`, borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: tool.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 12 }}>{tool.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>{tool.label}</div>
                <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, marginBottom: 16 }}>{tool.desc}</div>
                <button onClick={() => { setAiModal(tool); setAiResult(""); setAiLoading(false); }}
                  style={{ ...LC_BTN_PRIMARY, width: "100%", background: tool.color }}>
                  ▶ Run Tool
                </button>
              </div>
            ))}
          </div>
 
          {/* Duplicates list */}
          <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>⚠️ Flagged Duplicates</div>
            {contentItems.filter(i => i.duplicate).length === 0 ? (
              <div style={{ textAlign: "center", padding: 24, color: "#9ca3af" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                <div style={{ fontSize: 12 }}>No duplicates found in library</div>
              </div>
            ) : (
              contentItems.filter(i => i.duplicate).map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fca5a5", marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{TYPE_ICON[item.type]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#991b1b" }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: "#dc2626" }}>{item.course} · {item.module}</div>
                  </div>
                  <button onClick={() => deleteItem(item.id)} style={{ ...LC_BTN_GHOST, color: "#dc2626", borderColor: "#fca5a5", fontSize: 11 }}>🗑 Remove</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AssessmentManagementTab({ assessmentsData, setAssessmentsData, setToast }) {
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [newA, setNewA] = useState({
    title:"",
    course:"",
    questions:10,
    passMark:60,
    dueDate:"",
    status:"draft"
  });

  const filtered = assessmentsData.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.course.toLowerCase().includes(search.toLowerCase())
  );

  const totalAttempts = assessmentsData.reduce((a,x)=>a+x.attempts,0);
  const avgScore = assessmentsData.length
    ? Math.round(assessmentsData.reduce((a,x)=>a+x.avgScore,0) / assessmentsData.length)
    : 0;

  const togglePublish = (id) => {
    setAssessmentsData(prev =>
      prev.map(a => a.id===id ? { ...a, status:a.status==="published" ? "draft" : "published" } : a)
    );
    setToast({ msg:"Assessment status updated!", type:"success" });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newA.title || !newA.course) {
      setToast({ msg:"Please fill required fields.", type:"error" });
      return;
    }

    setAssessmentsData(prev => [
      ...prev,
      {
        id:Date.now(),
        ...newA,
        questions:Number(newA.questions),
        passMark:Number(newA.passMark),
        attempts:0,
        avgScore:0
      }
    ]);

    setToast({ msg:"New assessment created!", type:"success" });
    setAddModal(false);
    setNewA({ title:"", course:"", questions:10, passMark:60, dueDate:"", status:"draft" });
  };

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={S.pageTitle}>Assessment Management</h1>
          <p style={S.pageSub}>Quiz builder, question bank, and results management</p>
        </div>
        <button onClick={()=>setAddModal(true)} style={S.primaryBtn}>+ Create Quiz</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:16, marginBottom:20 }}>
        <StatCard icon="🧠" label="Assessments" val={assessmentsData.length} color="#f59e0b" bg="#fef3c7" />
        <StatCard icon="✅" label="Published" val={assessmentsData.filter(a=>a.status==="published").length} color="#10b981" bg="#d1fae5" />
        <StatCard icon="📚" label="Question Bank" val={MOCK_QUESTION_BANK.length} color="#3b82f6" bg="#dbeafe" />
        <StatCard icon="📈" label="Avg Score" val={`${avgScore}%`} color="#8b5cf6" bg="#ede9fe" />
        <StatCard icon="👥" label="Attempts" val={totalAttempts} color="#06b6d4" bg="#cffafe" />
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search quizzes or courses..." />

      <div style={{ display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:20, marginBottom:20 }}>
        <SectionCard title="📝 Quiz Builder">
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map(a=>(
              <div key={a.id} style={{ padding:"14px 16px", border:"1px solid #f1f5f9", borderRadius:12, background:"white" }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:800, color:"#1c1917" }}>{a.title}</div>
                    <div style={{ fontSize:12, color:"#6b7280", marginTop:4 }}>
                      {a.course} · {a.questions} questions · Pass mark {a.passMark}% · Due {a.dueDate || "—"}
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>

                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  <button onClick={()=>togglePublish(a.id)} style={S.tblBtn}>
                    {a.status==="published" ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={()=>setToast({ msg:"Question builder opened (demo).", type:"success" })} style={S.tblBtn}>
                    Build Questions
                  </button>
                  <button onClick={()=>setToast({ msg:"Assessment duplicated!", type:"success" })} style={S.tblBtn}>
                    Duplicate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="📚 Question Bank">
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {MOCK_QUESTION_BANK.map(q=>(
              <div key={q.id} style={{ padding:"12px 14px", background:"#f9fafb", borderRadius:10, border:"1px solid #f3f4f6" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#1c1917", marginBottom:4 }}>{q.question}</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:"#dbeafe", color:"#1d4ed8" }}>{q.type}</span>
                  <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:"#ede9fe", color:"#6d28d9" }}>{q.difficulty}</span>
                  <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:"#fef3c7", color:"#92400e" }}>{q.category}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="📊 Results Management">
        {assessmentsData.map(a=>{
          const passRate = a.avgScore >= a.passMark ? 100 : Math.max(30, Math.round((a.avgScore / a.passMark) * 100));
          return (
            <div key={a.id} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#374151" }}>{a.title}</span>
                <span style={{ fontSize:12, fontWeight:800, color:a.avgScore>=a.passMark?"#10b981":"#ef4444" }}>
                  Avg {a.avgScore}% · {a.attempts} attempts
                </span>
              </div>
              <div style={{ height:8, background:"#f3f4f6", borderRadius:6, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${passRate}%`, background:a.avgScore>=a.passMark?"#10b981":"#f59e0b", borderRadius:6 }} />
              </div>
              <div style={{ fontSize:11, color:"#9ca3af", marginTop:4 }}>Pass mark: {a.passMark}%</div>
            </div>
          );
        })}
      </SectionCard>

      {addModal && (
        <Modal title="Create New Assessment" onClose={()=>setAddModal(false)}>
          <form onSubmit={handleAdd}>
            <label style={S.label}>Assessment Title *</label>
            <input style={{ ...S.input, marginBottom:12 }} value={newA.title} onChange={e=>setNewA({...newA,title:e.target.value})} placeholder="Quiz title" />

            <label style={S.label}>Course *</label>
            <input style={{ ...S.input, marginBottom:12 }} value={newA.course} onChange={e=>setNewA({...newA,course:e.target.value})} placeholder="Course name" />

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <div>
                <label style={S.label}>Questions</label>
                <input style={S.input} type="number" value={newA.questions} onChange={e=>setNewA({...newA,questions:e.target.value})} />
              </div>
              <div>
                <label style={S.label}>Pass Mark (%)</label>
                <input style={S.input} type="number" value={newA.passMark} onChange={e=>setNewA({...newA,passMark:e.target.value})} />
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
              <div>
                <label style={S.label}>Due Date</label>
                <input style={S.input} type="date" value={newA.dueDate} onChange={e=>setNewA({...newA,dueDate:e.target.value})} />
              </div>
              <div>
                <label style={S.label}>Status</label>
                <select style={S.input} value={newA.status} onChange={e=>setNewA({...newA,status:e.target.value})}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <button type="submit" style={{ ...S.primaryBtn, width:"100%" }}>Create Assessment →</button>
          </form>
        </Modal>
      )}
    </div>
  );
}


function CertificateManagementTab({ certificates, setCertificates, setToast }) {
  const [bulkModal, setBulkModal] = useState(false);
  const [verifyId, setVerifyId] = useState("");
  const [verified, setVerified] = useState(null);
  const [bulk, setBulk] = useState({ course:"", batch:"", count:1, template:"Gold Standard" });

  const templates = [
    { name:"Gold Standard", style:"Premium completion certificate", color:"#f59e0b" },
    { name:"Modern Blue",   style:"Professional institute design", color:"#3b82f6" },
    { name:"Classic",       style:"Minimal print-friendly format", color:"#10b981" },
  ];

  const handleBulkGenerate = (e) => {
    e.preventDefault();

    if (!bulk.course || !bulk.count) {
      setToast({ msg:"Please fill required fields.", type:"error" });
      return;
    }

    const count = Number(bulk.count);

    const newCertificates = Array.from({ length:count }, (_, i) => ({
      id: Date.now() + i,
      certificateId: `SPC-QUEUE-${Date.now()}-${i+1}`,
      learner: `Learner ${i+1}`,
      course: bulk.course,
      template: bulk.template,
      issuedOn: "—",
      qrStatus: "queued",
      status: "queued"
    }));

    setCertificates(prev => [...newCertificates, ...prev]);
    setToast({ msg:`${count} certificates queued for generation!`, type:"success" });
    setBulkModal(false);
    setBulk({ course:"", batch:"", count:1, template:"Gold Standard" });
  };

  const handleVerify = () => {
    const found = certificates.find(c => c.certificateId.toLowerCase() === verifyId.trim().toLowerCase());

    if (found) {
      setVerified(found);
      setToast({ msg:"Certificate verified!", type:"success" });
    } else {
      setVerified(null);
      setToast({ msg:"Certificate not found.", type:"error" });
    }
  };

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={S.pageTitle}>Certificate Management</h1>
          <p style={S.pageSub}>Templates, bulk generation, QR verification, and issuance tracking</p>
        </div>
        <button onClick={()=>setBulkModal(true)} style={S.primaryBtn}>+ Bulk Generate</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:16, marginBottom:20 }}>
        <StatCard icon="🏅" label="Certificates" val={certificates.length} color="#f59e0b" bg="#fef3c7" />
        <StatCard icon="✅" label="Issued" val={certificates.filter(c=>c.status==="issued").length} color="#10b981" bg="#d1fae5" />
        <StatCard icon="⏳" label="Queued" val={certificates.filter(c=>c.status==="queued").length} color="#f59e0b" bg="#fef3c7" />
        <StatCard icon="🔐" label="Verified" val={certificates.filter(c=>c.qrStatus==="verified").length} color="#3b82f6" bg="#dbeafe" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        <SectionCard title="🎨 Certificate Templates">
          <div style={{ display:"grid", gap:12 }}>
            {templates.map((t,i)=>(
              <div key={i} style={{ border:`1px solid ${t.color}40`, borderRadius:14, padding:"16px", background:"white" }}>
                <div style={{ fontSize:14, fontWeight:800, color:"#1c1917" }}>{t.name}</div>
                <div style={{ fontSize:12, color:"#6b7280", marginTop:4 }}>{t.style}</div>
                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  <button style={S.tblBtn} onClick={()=>setToast({ msg:`Previewing ${t.name}`, type:"success" })}>Preview</button>
                  <button style={S.tblBtn} onClick={()=>setToast({ msg:`${t.name} selected as default`, type:"success" })}>Set Default</button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="🔍 QR / Certificate Verification">
          <label style={S.label}>Certificate ID</label>
          <div style={{ display:"flex", gap:10, marginBottom:16 }}>
            <input
              style={{ ...S.input, marginBottom:0 }}
              value={verifyId}
              onChange={e=>setVerifyId(e.target.value)}
              placeholder="e.g. SPC-2026-001"
            />
            <button onClick={handleVerify} style={S.primaryBtn}>Verify</button>
          </div>

          {verified && (
            <div style={{ background:"#f9fafb", border:"1px solid #f1f5f9", borderRadius:12, padding:"16px" }}>
              <div style={{ fontSize:14, fontWeight:800, color:"#1c1917", marginBottom:8 }}>Certificate Verified ✅</div>
              <div style={{ fontSize:12, color:"#6b7280", lineHeight:1.7 }}>
                Learner: <b>{verified.learner}</b><br/>
                Course: <b>{verified.course}</b><br/>
                Certificate ID: <b>{verified.certificateId}</b><br/>
                Issued On: <b>{verified.issuedOn}</b>
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="📄 Issuance Register">
        <div style={{ background:"white", borderRadius:16, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f9fafb", borderBottom:"1px solid #f1f5f9" }}>
                {["Certificate ID","Learner","Course","Template","Issued On","Status"].map(h=>(
                  <th key={h} style={{ padding:"12px 16px", fontSize:11, fontWeight:700, color:"#9ca3af", textAlign:"left", textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {certificates.map((c,i)=>(
                <tr key={c.id} style={{ borderBottom:"1px solid #f9fafb", background:i%2===0?"white":"#fafafa" }}>
                  <td style={{ padding:"12px 16px", fontSize:12, fontWeight:700, color:"#374151" }}>{c.certificateId}</td>
                  <td style={{ padding:"12px 16px", fontSize:12, color:"#374151" }}>{c.learner}</td>
                  <td style={{ padding:"12px 16px", fontSize:12, color:"#374151" }}>{c.course}</td>
                  <td style={{ padding:"12px 16px", fontSize:12, color:"#374151" }}>{c.template}</td>
                  <td style={{ padding:"12px 16px", fontSize:12, color:"#6b7280" }}>{c.issuedOn}</td>
                  <td style={{ padding:"12px 16px" }}><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {bulkModal && (
        <Modal title="Bulk Certificate Generation" onClose={()=>setBulkModal(false)}>
          <form onSubmit={handleBulkGenerate}>
            <label style={S.label}>Course *</label>
            <input style={{ ...S.input, marginBottom:12 }} value={bulk.course} onChange={e=>setBulk({...bulk,course:e.target.value})} placeholder="Course name" />

            <label style={S.label}>Batch</label>
            <input style={{ ...S.input, marginBottom:12 }} value={bulk.batch} onChange={e=>setBulk({...bulk,batch:e.target.value})} placeholder="Batch name" />

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
              <div>
                <label style={S.label}>Count</label>
                <input style={S.input} type="number" min="1" value={bulk.count} onChange={e=>setBulk({...bulk,count:e.target.value})} />
              </div>
              <div>
                <label style={S.label}>Template</label>
                <select style={S.input} value={bulk.template} onChange={e=>setBulk({...bulk,template:e.target.value})}>
                  {templates.map(t=><option key={t.name}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" style={{ ...S.primaryBtn, width:"100%" }}>Generate Certificates →</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function FeedbackManagementTab({ feedbacks, setFeedbacks, setToast }) {
  const [activeTab,     setActiveTab]     = useState("reviews");
  const [search,        setSearch]        = useState("");
  const [ratingFilter,  setRatingFilter]  = useState("all");
  const [courseFilter,  setCourseFilter]  = useState("all");
  const [batchFilter,   setBatchFilter]   = useState("all");
  const [dateFrom,      setDateFrom]      = useState("");
  const [dateTo,        setDateTo]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [tagFilter,     setTagFilter]     = useState("all");
  const [responseModal, setResponseModal] = useState(null);
  const [shareModal,    setShareModal]    = useState(null);
  const [responseText,  setResponseText]  = useState("");

  const TAGS = ["Content Quality", "Platform UX", "Trainer", "Schedule", "Price"];
  const TAG_COLOR = {
    "Content Quality": { bg:"#dbeafe", color:"#1d4ed8" },
    "Platform UX":     { bg:"#ede9fe", color:"#6d28d9" },
    "Trainer":         { bg:"#d1fae5", color:"#065f46" },
    "Schedule":        { bg:"#fef3c7", color:"#92400e" },
    "Price":           { bg:"#fee2e2", color:"#991b1b" },
  };

  const allCourses = ["all", ...new Set(feedbacks.map(f => f.course))];
  const allBatches = ["all", ...new Set(feedbacks.map(f => f.batch))];

  // ── Filtered ──
  const filtered = feedbacks.filter(f => {
    const q = search.toLowerCase();
    const matchSearch  = f.learner.toLowerCase().includes(q) || f.course.toLowerCase().includes(q) || f.suggestion.toLowerCase().includes(q);
    const matchRating  = ratingFilter === "all" || f.rating === Number(ratingFilter);
    const matchCourse  = courseFilter === "all" || f.course === courseFilter;
    const matchBatch   = batchFilter  === "all" || f.batch  === batchFilter;
    const matchStatus  = statusFilter === "all" || f.status === statusFilter;
    const matchTag     = tagFilter    === "all" || f.tag    === tagFilter;
    const matchFrom    = !dateFrom || new Date(f.date.split("/").reverse().join("-")) >= new Date(dateFrom);
    const matchTo      = !dateTo   || new Date(f.date.split("/").reverse().join("-")) <= new Date(dateTo);
    return matchSearch && matchRating && matchCourse && matchBatch && matchStatus && matchTag && matchFrom && matchTo;
  });

  // ── Actions ──
  const updateFeedback = (id, changes) =>
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, ...changes } : f));

  const approve = id => { updateFeedback(id, { status:"approved" }); setToast({ msg:"Review approved!", type:"success" }); };
  const reject  = id => { updateFeedback(id, { status:"rejected" }); setToast({ msg:"Review rejected.", type:"error" }); };

  const submitResponse = (id) => {
    if (!responseText.trim()) { setToast({ msg:"Response cannot be empty.", type:"error" }); return; }
    updateFeedback(id, { adminResponse: responseText });
    setToast({ msg:"Response saved!", type:"success" });
    setResponseModal(null);
    setResponseText("");
  };

  const shareWithTrainer = (id) => {
    updateFeedback(id, { sharedWithTrainer: true });
    setToast({ msg:"Review shared with trainer as motivation!", type:"success" });
    setShareModal(null);
  };

  // ── Weighted average ──
  const weightedAvg = (arr) => {
    if (!arr.length) return 0;
    const weights = { 5:5, 4:4, 3:3, 2:2, 1:1 };
    const total   = arr.reduce((a, f) => a + weights[f.rating], 0);
    return (total / arr.length).toFixed(1);
  };

  // ── Per-course aggregates ──
  const courseStats = [...new Set(feedbacks.map(f => f.course))].map(course => {
    const cf      = feedbacks.filter(f => f.course === course);
    const avg     = weightedAvg(cf);
    const dist    = [5,4,3,2,1].map(r => ({ star:r, count:cf.filter(f=>f.rating===r).length }));
    const approved= cf.filter(f=>f.status==="approved").length;
    return { course, avg, dist, total:cf.length, approved };
  });

  // ── Per-trainer NPS ──
  const trainerStats = [...new Set(feedbacks.map(f => f.trainer))].map(trainer => {
    const tf        = feedbacks.filter(f => f.trainer === trainer);
    const avg       = (tf.reduce((a,f)=>a+f.trainerRating,0)/tf.length).toFixed(1);
    const promoters = tf.filter(f=>f.trainerRating>=4).length;
    const detractors= tf.filter(f=>f.trainerRating<=2).length;
    const nps       = Math.round(((promoters - detractors) / tf.length) * 100);
    const byCourse  = [...new Set(tf.map(f=>f.course))].map(c => ({
      course: c,
      avg: (tf.filter(f=>f.course===c).reduce((a,f)=>a+f.trainerRating,0) / tf.filter(f=>f.course===c).length).toFixed(1),
      count: tf.filter(f=>f.course===c).length,
    }));
    const positives = tf.filter(f=>f.trainerRating>=4 && f.tag==="Trainer");
    return { trainer, avg, nps, total:tf.length, promoters, detractors, byCourse, positives };
  });

  // ── Tag frequency for priority matrix ──
  const tagStats = TAGS.map(tag => {
    const tagged = feedbacks.filter(f => f.tag === tag);
    const freq   = tagged.length;
    const impact = Math.round(tagged.reduce((a,f)=>a+f.rating,0) / Math.max(1,tagged.length) * 20);
    return { tag, freq, impact, items: tagged };
  }).sort((a,b) => b.freq - a.freq);

  // ── Export ──
  const exportCSV = () => {
    const headers = ["Learner","Course","Batch","Trainer","Rating","Trainer Rating","Tag","Suggestion","Status","Date","Anonymous"];
    const rows = feedbacks.map(f => [f.anonymous?"Anonymous":f.learner, f.course, f.batch, f.trainer, f.rating, f.trainerRating, f.tag, `"${f.suggestion}"`, f.status, f.date, f.anonymous?"Yes":"No"]);
    const csv  = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href=url; a.download="feedback_export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const stars = (n, size=13) => Array.from({length:5},(_,i)=>(
    <span key={i} style={{ fontSize:size, color:i<n?"#f59e0b":"#e5e7eb" }}>★</span>
  ));

  const tabs = [
    { key:"reviews",     label:"⭐ Course Reviews"         },
    { key:"trainers",    label:"🎓 Trainer Ratings"        },
    { key:"suggestions", label:"💡 Improvement Suggestions"},
  ];

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>

      {/* Response Modal */}
      {responseModal && (
        <Modal title={`💬 Admin Response — ${responseModal.learner}`} onClose={()=>{ setResponseModal(null); setResponseText(""); }}>
          <div style={{ background:"#f9fafb", borderRadius:10, padding:"12px 14px", marginBottom:14, fontSize:12, color:"#6b7280" }}>
            <div style={{ fontWeight:700, marginBottom:4 }}>Review:</div>
            <div style={{ fontStyle:"italic" }}>"{responseModal.suggestion}"</div>
          </div>
          <label style={S.label}>Your Response *</label>
          <textarea
            style={{ ...S.input, height:100, resize:"none", marginBottom:16 }}
            value={responseText}
            onChange={e=>setResponseText(e.target.value)}
            placeholder="Write a public response to this review..."
          />
          {/* Quick templates */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
            {[
              "Thank you for your feedback! We will work on this.",
              "We appreciate your suggestion and have noted it.",
              "This has been forwarded to the course team.",
            ].map((t,i)=>(
              <button key={i} onClick={()=>setResponseText(t)}
                style={{ ...S.tblBtn, fontSize:10 }}>{t.substring(0,30)}...</button>
            ))}
          </div>
          <button onClick={()=>submitResponse(responseModal.id)} style={{ ...S.primaryBtn, width:"100%" }}>
            📤 Post Response
          </button>
        </Modal>
      )}

      {/* Share Modal */}
      {shareModal && (
        <Modal title={`🌟 Share with Trainer — ${shareModal.trainer}`} onClose={()=>setShareModal(null)}>
          <div style={{ background:"#d1fae5", border:"1px solid #6ee7b7", borderRadius:10, padding:"12px 14px", marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#065f46", marginBottom:6 }}>Positive Review to Share:</div>
            <div style={{ display:"flex", gap:4, marginBottom:6 }}>{stars(shareModal.rating)}</div>
            <div style={{ fontSize:12, color:"#065f46", fontStyle:"italic" }}>"{shareModal.suggestion}"</div>
            <div style={{ fontSize:11, color:"#9ca3af", marginTop:6 }}>— {shareModal.anonymous ? "Anonymous" : shareModal.learner}</div>
          </div>
          <div style={{ fontSize:12, color:"#6b7280", marginBottom:16 }}>
            This review will be sent to <b>{shareModal.trainer}</b> as motivational feedback via in-app notification.
          </div>
          <button onClick={()=>shareWithTrainer(shareModal.id)} style={{ ...S.primaryBtn, width:"100%" }}>
            🌟 Share as Motivation
          </button>
        </Modal>
      )}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={S.pageTitle}>Feedback Management</h1>
          <p style={S.pageSub}>Course reviews · Trainer ratings · Improvement suggestions</p>
        </div>
        <button onClick={exportCSV} style={S.exportBtn}>⬇ Export CSV</button>
      </div>

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:14, marginBottom:20 }}>
        <StatCard icon="💬" label="Total Reviews"   val={feedbacks.length}                                             color="#f59e0b" bg="#fef3c7"/>
        <StatCard icon="⭐" label="Weighted Avg"    val={weightedAvg(feedbacks)}                                       color="#10b981" bg="#d1fae5"/>
        <StatCard icon="⏳" label="Pending Approval" val={feedbacks.filter(f=>f.status==="pending").length}            color="#f59e0b" bg="#fef3c7"/>
        <StatCard icon="✅" label="Approved"         val={feedbacks.filter(f=>f.status==="approved").length}           color="#10b981" bg="#d1fae5"/>
        <StatCard icon="🚫" label="Rejected"         val={feedbacks.filter(f=>f.status==="rejected").length}           color="#ef4444" bg="#fee2e2"/>
        <StatCard icon="🔒" label="Anonymous"        val={feedbacks.filter(f=>f.anonymous).length}                     color="#6366f1" bg="#ede9fe"/>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:18, borderBottom:"2px solid #f3f4f6" }}>
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setActiveTab(t.key)}
            style={{ padding:"10px 18px", border:"none", borderBottom:`2px solid ${activeTab===t.key?"#f59e0b":"transparent"}`, background:"none", color:activeTab===t.key?"#92400e":"#9ca3af", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginBottom:-2 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ TAB: COURSE REVIEWS (A14.1) ══ */}
      {activeTab === "reviews" && (
        <div>
          {/* Filters */}
          <div style={{ background:"white", borderRadius:14, padding:"14px 18px", border:"1px solid #f1f5f9", marginBottom:16, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:10 }}>
              <div style={{ flex:1, minWidth:200, position:"relative" }}>
                <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:14 }}>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search learner, course, review text..."
                  style={{ ...S.input, paddingLeft:34, marginBottom:0 }}/>
              </div>
              {/* Rating filter */}
              <div style={{ display:"flex", gap:6 }}>
                {["all","5","4","3","2","1"].map(r=>(
                  <button key={r} onClick={()=>setRatingFilter(r)}
                    style={{ padding:"7px 12px", borderRadius:8, border:`1.5px solid ${ratingFilter===r?"#f59e0b":"#e5e7eb"}`, background:ratingFilter===r?"#fef3c7":"white", color:ratingFilter===r?"#92400e":"#6b7280", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                    {r==="all"?"All":r==="5"?"⭐⭐⭐⭐⭐":r==="4"?"⭐⭐⭐⭐":r==="3"?"⭐⭐⭐":r==="2"?"⭐⭐":"⭐"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
              <select value={courseFilter} onChange={e=>setCourseFilter(e.target.value)} style={{ ...S.input, width:220, marginBottom:0 }}>
                {allCourses.map(c=><option key={c} value={c}>{c==="all"?"All Courses":c.substring(0,30)}</option>)}
              </select>
              <select value={batchFilter} onChange={e=>setBatchFilter(e.target.value)} style={{ ...S.input, width:150, marginBottom:0 }}>
                {allBatches.map(b=><option key={b} value={b}>{b==="all"?"All Batches":b}</option>)}
              </select>
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{ ...S.input, width:150, marginBottom:0 }}>
                {["all","pending","approved","rejected"].map(s=><option key={s} value={s}>{s==="all"?"All Status":s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <span style={{ fontSize:12, color:"#6b7280", fontWeight:600 }}>From:</span>
                <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{ ...S.input, width:140, marginBottom:0 }}/>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <span style={{ fontSize:12, color:"#6b7280", fontWeight:600 }}>To:</span>
                <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{ ...S.input, width:140, marginBottom:0 }}/>
              </div>
              {(search||ratingFilter!=="all"||courseFilter!=="all"||batchFilter!=="all"||statusFilter!=="all"||dateFrom||dateTo) && (
                <button onClick={()=>{ setSearch(""); setRatingFilter("all"); setCourseFilter("all"); setBatchFilter("all"); setStatusFilter("all"); setDateFrom(""); setDateTo(""); }}
                  style={{ ...S.tblBtn, color:"#ef4444", borderColor:"#fca5a5" }}>✕ Clear</button>
              )}
            </div>
          </div>

          {/* Aggregate rating per course */}
          <SectionCard title="📊 Aggregate Ratings by Course">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
              {courseStats.map((cs,i)=>(
                <div key={i} style={{ background:"#f9fafb", borderRadius:14, padding:"14px 16px", border:"1px solid #f3f4f6" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#1c1917", marginBottom:6, lineHeight:1.3 }}>{cs.course.substring(0,35)}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <span style={{ fontSize:28, fontWeight:900, color:"#f59e0b" }}>{cs.avg}</span>
                    <div>
                      <div style={{ display:"flex", gap:2 }}>{stars(Math.round(Number(cs.avg)))}</div>
                      <div style={{ fontSize:10, color:"#9ca3af" }}>{cs.total} reviews · {cs.approved} approved</div>
                    </div>
                  </div>
                  {/* Star distribution bars */}
                  {cs.dist.map(d=>(
                    <div key={d.star} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                      <span style={{ fontSize:10, color:"#9ca3af", width:12 }}>{d.star}★</span>
                      <div style={{ flex:1, height:5, background:"#e5e7eb", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${cs.total>0?(d.count/cs.total)*100:0}%`, background:"#f59e0b", borderRadius:3 }}/>
                      </div>
                      <span style={{ fontSize:10, color:"#9ca3af", width:14 }}>{d.count}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Reviews inbox */}
          <div style={{ fontSize:12, color:"#9ca3af", marginBottom:10 }}>Showing {filtered.length} of {feedbacks.length} reviews</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map(f=>(
              <div key={f.id} style={{ background:"white", borderRadius:14, padding:"16px 20px", border:`1px solid ${f.status==="pending"?"#fbbf24":f.status==="rejected"?"#fca5a5":"#f1f5f9"}`, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                  {/* Avatar */}
                  <div style={{ width:40, height:40, borderRadius:11, background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, color:"white", flexShrink:0 }}>
                    {f.anonymous ? "?" : f.learner[0]}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap" }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:800, color:"#1c1917" }}>
                          {f.anonymous ? "Anonymous Learner" : f.learner}
                          {f.anonymous && <span style={{ marginLeft:8, fontSize:10, fontWeight:700, color:"#6366f1", background:"#ede9fe", padding:"2px 8px", borderRadius:20 }}>🔒 Anonymous</span>}
                        </div>
                        <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{f.course} · {f.batch} · {f.date}</div>
                      </div>
                      <StatusBadge status={f.status}/>
                    </div>

                    {/* Ratings row */}
                    <div style={{ display:"flex", gap:16, marginTop:8, flexWrap:"wrap" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:11, color:"#6b7280" }}>Course:</span>
                        <div style={{ display:"flex", gap:2 }}>{stars(f.rating)}</div>
                        <span style={{ fontSize:12, fontWeight:700, color:"#f59e0b" }}>({f.rating})</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:11, color:"#6b7280" }}>Trainer:</span>
                        <div style={{ display:"flex", gap:2 }}>{stars(f.trainerRating)}</div>
                        <span style={{ fontSize:12, fontWeight:700, color:"#f59e0b" }}>({f.trainerRating})</span>
                      </div>
                      <span style={{ padding:"2px 10px", borderRadius:20, fontSize:10, fontWeight:700,
                        background:TAG_COLOR[f.tag]?.bg||"#f3f4f6", color:TAG_COLOR[f.tag]?.color||"#6b7280" }}>
                        {f.tag}
                      </span>
                      {f.sharedWithTrainer && <span style={{ fontSize:10, color:"#059669", fontWeight:700 }}>🌟 Shared with trainer</span>}
                    </div>

                    {/* Review text */}
                    <p style={{ fontSize:13, color:"#374151", margin:"10px 0 0", lineHeight:1.6, fontStyle:"italic" }}>
                      "{f.suggestion}"
                    </p>

                    {/* Admin response */}
                    {f.adminResponse && (
                      <div style={{ marginTop:10, padding:"10px 14px", background:"#f0f9ff", borderRadius:10, border:"1px solid #bae6fd" }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"#0369a1", marginBottom:4 }}>💬 Admin Response:</div>
                        <div style={{ fontSize:12, color:"#0369a1" }}>{f.adminResponse}</div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
                      {f.status === "pending" && <>
                        <button onClick={()=>approve(f.id)} style={{ ...S.btnGreen, fontSize:11, padding:"5px 12px" }}>✓ Approve</button>
                        <button onClick={()=>reject(f.id)}  style={{ ...S.btnRed,   fontSize:11, padding:"5px 12px" }}>✕ Reject</button>
                      </>}
                      {f.status === "approved" && (
                        <button onClick={()=>reject(f.id)} style={{ ...S.tblBtn, color:"#dc2626", borderColor:"#fca5a5", fontSize:11 }}>Unpublish</button>
                      )}
                      <button onClick={()=>{ setResponseModal(f); setResponseText(f.adminResponse||""); }}
                        style={{ ...S.tblBtn, color:"#2563eb", borderColor:"#93c5fd", fontSize:11 }}>
                        💬 {f.adminResponse ? "Edit Response" : "Respond"}
                      </button>
                      {f.rating >= 4 && (
                        <button onClick={()=>setShareModal(f)}
                          style={{ ...S.tblBtn, color:"#059669", borderColor:"#6ee7b7", fontSize:11 }}>
                          🌟 Share with Trainer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign:"center", padding:50, color:"#9ca3af" }}>
                <div style={{ fontSize:36, marginBottom:10 }}>💬</div>
                <div style={{ fontSize:14, fontWeight:700 }}>No reviews found</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ TAB: TRAINER RATINGS (A14.2) ══ */}
      {activeTab === "trainers" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {trainerStats.map((t,i)=>(
              <div key={i} style={{ background:"white", borderRadius:18, padding:"20px", border:"1px solid #f1f5f9", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                {/* Trainer header */}
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, paddingBottom:14, borderBottom:"1px solid #f3f4f6" }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#6366f1,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:"white", flexShrink:0 }}>
                    {t.trainer[0]}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:800, color:"#1c1917" }}>{t.trainer}</div>
                    <div style={{ fontSize:11, color:"#9ca3af" }}>{t.total} reviews total</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:22, fontWeight:900, color:"#f59e0b" }}>{t.avg}</div>
                    <div style={{ display:"flex", gap:2 }}>{stars(Math.round(Number(t.avg)))}</div>
                  </div>
                </div>

                {/* NPS Score */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
                  <div style={{ textAlign:"center", padding:"10px 8px", background:`${t.nps>=50?"#d1fae5":t.nps>=0?"#fef3c7":"#fee2e2"}`, borderRadius:10 }}>
                    <div style={{ fontSize:18, fontWeight:900, color:t.nps>=50?"#059669":t.nps>=0?"#d97706":"#dc2626" }}>{t.nps}</div>
                    <div style={{ fontSize:9, fontWeight:700, color:"#6b7280", textTransform:"uppercase" }}>NPS Score</div>
                  </div>
                  <div style={{ textAlign:"center", padding:"10px 8px", background:"#d1fae5", borderRadius:10 }}>
                    <div style={{ fontSize:18, fontWeight:900, color:"#059669" }}>{t.promoters}</div>
                    <div style={{ fontSize:9, fontWeight:700, color:"#6b7280", textTransform:"uppercase" }}>Promoters</div>
                  </div>
                  <div style={{ textAlign:"center", padding:"10px 8px", background:"#fee2e2", borderRadius:10 }}>
                    <div style={{ fontSize:18, fontWeight:900, color:"#dc2626" }}>{t.detractors}</div>
                    <div style={{ fontSize:9, fontWeight:700, color:"#6b7280", textTransform:"uppercase" }}>Detractors</div>
                  </div>
                </div>

                {/* NPS bar */}
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#9ca3af", marginBottom:4 }}>
                    <span>NPS: {t.nps >= 50 ? "Excellent" : t.nps >= 0 ? "Good" : "Needs Work"}</span>
                    <span>{t.nps >= 0 ? "+" : ""}{t.nps}</span>
                  </div>
                  <div style={{ height:6, background:"#f3f4f6", borderRadius:4, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${Math.min(100, Math.max(0, t.nps + 50))}%`, background:t.nps>=50?"#10b981":t.nps>=0?"#f59e0b":"#ef4444", borderRadius:4 }}/>
                  </div>
                </div>

                {/* Breakdown by course */}
                <div style={{ fontSize:12, fontWeight:700, color:"#374151", marginBottom:8 }}>By Course</div>
                {t.byCourse.map((bc,j)=>(
                  <div key={j} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 10px", background:"#f9fafb", borderRadius:8, marginBottom:5, border:"1px solid #f3f4f6" }}>
                    <span style={{ fontSize:11, color:"#374151", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{bc.course.substring(0,28)}</span>
                    <div style={{ display:"flex", gap:4, alignItems:"center", flexShrink:0 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:"#f59e0b" }}>⭐ {bc.avg}</span>
                      <span style={{ fontSize:10, color:"#9ca3af" }}>({bc.count})</span>
                    </div>
                  </div>
                ))}

                {/* Anonymous note */}
                <div style={{ marginTop:10, padding:"8px 12px", background:"#ede9fe", borderRadius:8, fontSize:11, color:"#6d28d9", border:"1px solid #c4b5fd" }}>
                  🔒 Anonymous reviews included in stats — visible to admin only
                </div>

                {/* Share positive reviews */}
                {t.positives.length > 0 && (
                  <div style={{ marginTop:10 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#374151", marginBottom:6 }}>🌟 Positive Reviews to Share</div>
                    {t.positives.slice(0,2).map((p,j)=>(
                      <div key={j} style={{ padding:"8px 10px", background:"#ecfdf5", borderRadius:8, marginBottom:6, border:"1px solid #6ee7b7" }}>
                        <div style={{ fontSize:11, color:"#065f46", fontStyle:"italic", marginBottom:4 }}>"{p.suggestion.substring(0,70)}..."</div>
                        <button onClick={()=>setShareModal(p)} style={{ ...S.btnGreen, fontSize:10, padding:"3px 10px" }}>
                          🌟 Share as Motivation
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAB: IMPROVEMENT SUGGESTIONS (A14.3) ══ */}
      {activeTab === "suggestions" && (
        <div>
          {/* Tag filter */}
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            <button onClick={()=>setTagFilter("all")}
              style={{ padding:"7px 14px", borderRadius:8, border:`1.5px solid ${tagFilter==="all"?"#f59e0b":"#e5e7eb"}`, background:tagFilter==="all"?"#fef3c7":"white", color:tagFilter==="all"?"#92400e":"#6b7280", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              All Tags
            </button>
            {TAGS.map(tag=>(
              <button key={tag} onClick={()=>setTagFilter(tag)}
                style={{ padding:"7px 14px", borderRadius:8, border:`1.5px solid ${tagFilter===tag?TAG_COLOR[tag]?.color||"#f59e0b":"#e5e7eb"}`, background:tagFilter===tag?TAG_COLOR[tag]?.bg||"#fef3c7":"white", color:tagFilter===tag?TAG_COLOR[tag]?.color||"#92400e":"#6b7280", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                {tag}
              </button>
            ))}
          </div>

          {/* Priority Matrix */}
          <SectionCard title="🎯 Priority Matrix — Frequency vs Impact">
            <div style={{ fontSize:12, color:"#6b7280", marginBottom:14 }}>
              Bubble size = number of suggestions · Position = frequency (x) vs impact (y)
            </div>
            <div style={{ position:"relative", height:220, background:"#f9fafb", borderRadius:12, border:"1px solid #f3f4f6", overflow:"hidden" }}>
              {/* Quadrant labels */}
              <div style={{ position:"absolute", top:8,  left:8,  fontSize:10, color:"#d1d5db", fontWeight:700 }}>HIGH IMPACT · LOW FREQUENCY</div>
              <div style={{ position:"absolute", top:8,  right:8, fontSize:10, color:"#d1d5db", fontWeight:700 }}>HIGH IMPACT · HIGH FREQUENCY</div>
              <div style={{ position:"absolute", bottom:8, left:8,  fontSize:10, color:"#d1d5db", fontWeight:700 }}>LOW IMPACT · LOW FREQUENCY</div>
              <div style={{ position:"absolute", bottom:8, right:8, fontSize:10, color:"#d1d5db", fontWeight:700 }}>LOW IMPACT · HIGH FREQUENCY</div>
              {/* Center lines */}
              <div style={{ position:"absolute", top:"50%", left:0, right:0, height:1, background:"#e5e7eb" }}/>
              <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:1, background:"#e5e7eb" }}/>
              {/* Bubbles */}
              {tagStats.map((ts,i)=>{
                const maxFreq = Math.max(...tagStats.map(x=>x.freq));
                const x = maxFreq > 0 ? (ts.freq / maxFreq) * 75 + 5 : 5;
                const y = 85 - ((ts.impact / 100) * 75);
                const size = 24 + (ts.freq / maxFreq) * 32;
                return (
                  <div key={i} style={{ position:"absolute", left:`${x}%`, top:`${y}%`, transform:"translate(-50%,-50%)", width:size, height:size, borderRadius:"50%", background:TAG_COLOR[ts.tag]?.bg||"#fef3c7", border:`2px solid ${TAG_COLOR[ts.tag]?.color||"#f59e0b"}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", zIndex:2 }}
                    title={`${ts.tag}: ${ts.freq} suggestions`}>
                    <span style={{ fontSize:9, fontWeight:800, color:TAG_COLOR[ts.tag]?.color||"#92400e", textAlign:"center", lineHeight:1.2 }}>{ts.freq}</span>
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div style={{ display:"flex", gap:12, marginTop:12, flexWrap:"wrap" }}>
              {tagStats.map((ts,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:12, height:12, borderRadius:"50%", background:TAG_COLOR[ts.tag]?.bg, border:`1.5px solid ${TAG_COLOR[ts.tag]?.color}` }}/>
                  <span style={{ fontSize:11, color:"#6b7280" }}>{ts.tag} ({ts.freq})</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Tag breakdown cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14, marginBottom:20 }}>
            {tagStats.filter(ts=>tagFilter==="all"||ts.tag===tagFilter).map((ts,i)=>(
              <div key={i} style={{ background:"white", borderRadius:14, padding:"16px", border:`1px solid ${TAG_COLOR[ts.tag]?.color||"#e5e7eb"}30`, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <span style={{ padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700, background:TAG_COLOR[ts.tag]?.bg||"#f3f4f6", color:TAG_COLOR[ts.tag]?.color||"#6b7280" }}>{ts.tag}</span>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:20, fontWeight:900, color:TAG_COLOR[ts.tag]?.color||"#6b7280" }}>{ts.freq}</div>
                    <div style={{ fontSize:10, color:"#9ca3af" }}>suggestions</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:12, marginBottom:12, fontSize:12 }}>
                  <div style={{ background:"#f9fafb", borderRadius:8, padding:"6px 10px", flex:1, textAlign:"center" }}>
                    <div style={{ fontWeight:700, color:"#1c1917" }}>{ts.impact}%</div>
                    <div style={{ fontSize:10, color:"#9ca3af" }}>Impact Score</div>
                  </div>
                  <div style={{ background:"#f9fafb", borderRadius:8, padding:"6px 10px", flex:1, textAlign:"center" }}>
                    <div style={{ fontWeight:700, color:"#1c1917" }}>{ts.items.filter(x=>x.status==="pending").length}</div>
                    <div style={{ fontSize:10, color:"#9ca3af" }}>Pending</div>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {ts.items.slice(0,3).map((item,j)=>(
                    <div key={j} style={{ fontSize:11, color:"#6b7280", padding:"6px 8px", background:"#f9fafb", borderRadius:6, lineHeight:1.4 }}>
                      "{item.suggestion.substring(0,65)}..."
                    </div>
                  ))}
                </div>
                {/* Export to backlog */}
                <button onClick={()=>setToast({ msg:`${ts.tag} suggestions exported to backlog!`, type:"success" })}
                  style={{ ...S.exportBtn, width:"100%", marginTop:10, fontSize:11 }}>
                  📋 Export to Backlog
                </button>
              </div>
            ))}
          </div>

          {/* Jira integration note */}
          <div style={{ background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:22 }}>🔗</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#0369a1" }}>Jira / Product Backlog Integration</div>
              <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>Connect your Jira workspace to automatically push tagged suggestions as tickets.</div>
            </div>
            <button onClick={()=>setToast({ msg:"Jira integration coming soon!", type:"success" })} style={S.primaryBtn}>
              Connect Jira →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */

/* local S overrides already imported from Shared */