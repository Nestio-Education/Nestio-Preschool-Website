/**
 * AI Lesson Planner — port of Testing/api.py
 * Generates a structured lesson plan from age group, topic, and duration.
 */

import { callGroq, stripCodeFences } from "./groqClient.js";

const SYSTEM_PROMPT = `You are a lesson planning assistant for teachers.
Given an age group, topic, and duration, return ONLY a JSON object,
no markdown, no extra text, with exactly these keys:
"objective" (string), "activities" (list of strings), "materials" (list of strings).`;

function aiLog(event, details = {}) {
  console.log(`[ai-lesson-planner] ${event}`, JSON.stringify(details));
}

function buildLocalDraft({ ageGroup, topic, duration }) {
  return {
    objective: `By the end of this ${duration} lesson, children in the ${ageGroup} age group will demonstrate understanding of ${topic} through guided play and participation.`,
    activities: [
      `Warm-up circle: introduce ${topic} with a short story or song (5 min).`,
      `Main activity: hands-on exploration of ${topic} suited to ${ageGroup} (majority of ${duration}).`,
      `Guided practice: small-group discussion or demonstration related to ${topic}.`,
      `Closing circle: children share one thing they learned about ${topic}.`,
    ],
    materials: [
      "Chart paper / whiteboard",
      "Markers or crayons",
      `Age-appropriate props related to ${topic}`,
      "Storybook or flashcards (optional)",
    ],
  };
}



function parseLessonJson(raw) {
  const cleaned = stripCodeFences(raw);
  const draft = JSON.parse(cleaned);
  if (!draft || typeof draft.objective !== "string") {
    throw new Error("Invalid lesson plan JSON: missing objective.");
  }
  if (!Array.isArray(draft.activities)) draft.activities = [];
  if (!Array.isArray(draft.materials)) draft.materials = [];
  return {
    objective: draft.objective.trim(),
    activities: draft.activities.map((a) => String(a).trim()).filter(Boolean),
    materials: draft.materials.map((m) => String(m).trim()).filter(Boolean),
  };
}

function formatDraftText({ ageGroup, topic, duration, draft }) {
  const lines = [
    `LESSON PLAN - ${topic}`,
    `Age group: ${ageGroup}`,
    `Duration: ${duration}`,
    "",
    "OBJECTIVE",
    draft.objective,
    "",
    "ACTIVITIES",
  ];
  draft.activities.forEach((a, i) => lines.push(`  ${i + 1}. ${a}`));
  lines.push("", "MATERIALS");
  draft.materials.forEach((m) => lines.push(`  - ${m}`));
  return lines.join("\n");
}

async function callGroqLesson({ ageGroup, topic, duration }) {
  const userPrompt = `Age group: ${ageGroup}\nTopic: ${topic}\nDuration: ${duration}`;
  const raw = await callGroq({ systemPrompt: SYSTEM_PROMPT, userPrompt, temperature: 0.3 });
  return parseLessonJson(raw);
}

function isUsableKey(key) {
  if (!key) return false;
  if (/^YOUR_/i.test(key) || /placeholder/i.test(key) || key === "your_api_key_here") return false;
  return true;
}

/**
 * Generate a lesson plan draft.
 * @param {{ ageGroup: string, topic: string, duration: string }} input
 */
export async function generateAILessonPlan(input = {}) {
  const ageGroup = String(input.ageGroup || input.age_group || "").trim();
  const topic = String(input.topic || "").trim();
  const duration = String(input.duration || "").trim();

  if (!ageGroup || !topic || !duration) {
    const err = new Error("Age group, topic, and duration are required.");
    err.status = 400;
    throw err;
  }

  const groqKey = process.env.GROQ_API_KEY;

  let draft = null;
  let provider = "local";

  if (isUsableKey(groqKey)) {
    try {
      aiLog("groq_start", { ageGroup, topic, duration });
      draft = await callGroqLesson({ ageGroup, topic, duration });
      provider = "groq";
    } catch (err) {
      aiLog("groq_failed", { message: err.message });
    }
  }

  if (!draft) {
    aiLog("local_fallback", { ageGroup, topic, duration });
    draft = buildLocalDraft({ ageGroup, topic, duration });
    provider = "local";
  }

  const draftText = formatDraftText({ ageGroup, topic, duration, draft });

  return {
    ageGroup,
    topic,
    duration,
    objective: draft.objective,
    activities: draft.activities,
    materials: draft.materials,
    draftText,
    provider,
    isLocalFallback: provider === "local",
  };
}

const SCHEDULE_SYSTEM_PROMPT = `You are an early-childhood-education activity planner.
Given an activity type, developmental level, a starting topic, a number of weeks, and how many
activities to schedule per day, return ONLY a JSON object, no markdown, no extra text, with
exactly this shape:
{
  "activities": [
    {
      "contentTitle": string,
      "contentType": string,
      "durationMinutes": number,
      "materials": string,
      "purpose": string,
      "howToConduct": string,
      "facilitatorRole": string,
      "expectedOutcomes": string
    }
  ]
}
Return one entry per distinct activity idea appropriate for the given type/level/topic — enough
variety to fill (weeks * 5 working days * activitiesPerDay) slots without excessive repetition.
Do not include dates; scheduling is handled separately.`;

export async function generateAIActivityPool({ type, level, topic, activitiesPerDay, durationWeeks }) {
  const userPrompt = `Activity type: ${type}\nLevel: ${level}\nStarting topic: ${topic}\nActivities per day: ${activitiesPerDay}\nDuration weeks: ${durationWeeks}`;
  const raw = await callGroq({ systemPrompt: SCHEDULE_SYSTEM_PROMPT, userPrompt, temperature: 0.5 });
  const cleaned = stripCodeFences(raw);
  const parsed = JSON.parse(cleaned);
  if (!parsed || !Array.isArray(parsed.activities) || parsed.activities.length === 0) {
    throw new Error("Invalid activity schedule JSON from Groq.");
  }
  return parsed.activities;
}

/**
 * Builds the same schedule shape generateScheduleFromDataset produces client-side,
 * so it can be posted straight to POST /api/mentor/lesson-plans/auto-publish unchanged.
 */
export function buildScheduleFromPool({ pool, type, level, topic, startDate, durationWeeks, activitiesPerDay }) {
  const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = [];
  const cur = new Date(startDate);
  const totalWorkingDays = durationWeeks * 5;
  while (days.length < totalWorkingDays) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }

  let cursor = 0;
  const schedule = days.map((d) => {
    const activities = [];
    for (let i = 0; i < activitiesPerDay; i++) {
      const a = pool[cursor % pool.length];
      cursor++;
      activities.push({
        order: i + 1,
        contentTitle: a.contentTitle,
        moduleTitle: `${type} · ${level}`,
        contentType: a.contentType,
        durationMinutes: a.durationMinutes,
        materials: a.materials,
        purpose: a.purpose,
        howToConduct: a.howToConduct,
        facilitatorRole: a.facilitatorRole,
        expectedOutcomes: a.expectedOutcomes,
        instructions: `How to conduct:\n${a.howToConduct}\n\nFacilitator role: ${a.facilitatorRole}`,
        objectives: a.expectedOutcomes || a.purpose,
      });
    }
    return { date: d.toISOString().split("T")[0], dayOfWeek: WEEKDAY_NAMES[d.getDay()], activities };
  });

  const totalActivities = schedule.reduce((sum, day) => sum + day.activities.length, 0);
  return { course: { title: topic }, totalActivities, totalDays: schedule.length, durationWeeks, schedule };
}

export async function generateAIActivitySchedule(input = {}) {
  const type = String(input.type || "").trim();
  const level = String(input.level || "").trim();
  const topic = String(input.topic || "").trim();
  const startDate = input.startDate;
  const durationWeeks = Number(input.durationWeeks) || 1;
  const activitiesPerDay = Number(input.maxActivitiesPerDay) || 1;

  if (!type || !level || !topic || !startDate) {
    const err = new Error("type, level, topic, and startDate are required.");
    err.status = 400;
    throw err;
  }

  const pool = await generateAIActivityPool({ type, level, topic, activitiesPerDay, durationWeeks });
  return buildScheduleFromPool({ pool, type, level, topic, startDate, durationWeeks, activitiesPerDay });
}
