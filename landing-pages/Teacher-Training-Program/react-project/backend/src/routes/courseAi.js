import express from "express";

const router = express.Router();

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

const SAMPLE_VIDEO_IDS = [
  "8nz2dtv--ok",
  "IhcgYgx7aAA",
  "PzyXGUCngoU",
  "128Ts5r9NRE",
  "YcQg1EshfIE",
  "P3bSCtiNqlQ",
  "d3qaJbROexs",
  "5kURNcaROE0",
  "lomyb0VkGd0"
];

function buildPrompt({ title, category, level, format, duration, description }) {
  const isVideo = format === "Video";
  return `Create an early childhood education teacher-training course.

Return only valid JSON with this shape:
{
  "description": "Two sentence course description",
  "objectives": "One sentence with learning outcomes",
  "modules": [
    {
      "title": "Module title",
      "description": "Short module summary",
      "contents": [
        { "title": "Content title", "type": "${isVideo ? "video" : "document"}", "externalUrl": "${isVideo ? "https://www.youtube.com/watch?v=YOUTUBE_ID" : ""}", "order": 1, "isRequired": true }
      ]
    }
  ]
}

Rules:
- Create exactly 3 modules.
- ${isVideo ? "Each module must contain 3 video contents. Use real public YouTube URLs when possible." : "Each module must contain 1 document content with rich study material in the module description."}
- Keep it practical for teachers.
- Do not include markdown fences.

Course:
Title: ${title}
Category: ${category}
Level: ${level}
Format: ${format}
Duration: ${duration}
Extra context: ${description || "None"}`;
}

function fallbackCourse({ title, category, level, format, duration, description }) {
  const isVideo = format === "Video";
  const modules = [1, 2, 3].map((moduleNumber) => ({
    title: `${title} - Module ${moduleNumber}`,
    description: description || `Practical training material for ${title}.`,
    contents: Array.from({ length: isVideo ? 3 : 1 }, (_, index) => {
      const videoId = SAMPLE_VIDEO_IDS[((moduleNumber - 1) * 3 + index) % SAMPLE_VIDEO_IDS.length];
      return {
        title: isVideo ? `${title} video ${moduleNumber}.${index + 1}` : `${title} study guide ${moduleNumber}`,
        type: isVideo ? "video" : "document",
        externalUrl: isVideo ? `https://www.youtube.com/watch?v=${videoId}` : "",
        order: index + 1,
        isRequired: true
      };
    })
  }));

  return {
    description: description || `${title} is a ${duration || "short"} teacher-training course for ${level || "all"} educators.`,
    objectives: `Teachers will understand, plan, and apply ${title.toLowerCase()} in their classrooms.`,
    modules
  };
}

router.post("/generate", async (req, res, next) => {
  try {
    // Accept both 'topic' (from frontend) and 'title' (internal)
    const { topic, title, category, level, format = "Video", duration, description } = req.body || {};
    const courseTitle = title || topic || "";

    if (!courseTitle || !duration) {
      return res.status(400).json({ message: "Course topic/title and duration are required." });
    }

    let generated;
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 4000,
          messages: [{ role: "user", content: buildPrompt({ title, category, level, format, duration, description }) }]
        })
      });

      if (!response.ok) {
        const detail = await response.text();
        return res.status(502).json({ message: "Anthropic API request failed.", detail });
      }

      const data = await response.json();
      const raw = (data.content || [])
        .map((part) => part.text || "")
        .join("")
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      generated = JSON.parse(raw);
    } else {
      generated = fallbackCourse({ title: courseTitle, category, level, format, duration, description });
    }

    res.json({
      course: {
        title: courseTitle,
        category,
        level,
        duration,
        durationText: duration,
        description: generated.description || description || "",
        objectives: generated.objectives || "",
        contentType: format,
        status: "published",
        modules: (generated.modules || []).map((module, moduleIndex) => ({
          title: module.title || `Module ${moduleIndex + 1}`,
          order: moduleIndex + 1,
          description: module.description || "",
          contents: (module.contents || []).map((content, contentIndex) => ({
            title: content.title || `Content ${contentIndex + 1}`,
            type: content.type || (format === "Video" ? "video" : "document"),
            externalUrl: content.externalUrl || "",
            order: content.order || contentIndex + 1,
            isRequired: content.isRequired !== false
          }))
        }))
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
