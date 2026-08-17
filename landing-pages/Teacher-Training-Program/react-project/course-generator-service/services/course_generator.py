import os
import json
import time
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")


def _clean_json(content: str) -> str:
    """Strip markdown fences from model output."""
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    return content.strip()


def _call_groq(system_prompt: str, user_content: str, temperature: float = 0.3, max_tokens: int = 4096) -> str:
    """Make a Groq API call with built-in retry and fallback to Cerebras on rate limits."""
    for attempt in range(2):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            error_str = str(e).lower()
            if "rate_limit" in error_str or "429" in error_str:
                wait = 5 * (attempt + 1)
                print(f"[course_generator] Groq Rate limited. Waiting {wait}s before retry {attempt+1}/2...")
                time.sleep(wait)
            else:
                break
    
    # Fallback to Cerebras API if Groq fails due to rate limits
    cerebras_key = os.environ.get("CEREBRAS_API_KEY")
    if cerebras_key:
        print("[course_generator] Groq limit reached. Falling back to Cerebras API...")
        try:
            import urllib.request
            import json as _json
            payload = _json.dumps({
                "model": "llama3.1-8b",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content},
                ],
                "temperature": temperature,
                "max_tokens": max_tokens
            }).encode("utf-8")
            req = urllib.request.Request(
                "https://api.cerebras.ai/v1/chat/completions",
                data=payload,
                headers={
                    "Authorization": f"Bearer {cerebras_key}",
                    "Content-Type": "application/json",
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=120) as resp:
                body = _json.loads(resp.read().decode("utf-8"))
                return body["choices"][0]["message"]["content"].strip()
        except Exception as ce:
            print(f"[course_generator] Cerebras fallback failed: {ce}")
            
    raise RuntimeError("Groq rate limit exceeded and Cerebras fallback failed. Please wait a minute and try again.")


def generate_course_from_text(text: str) -> dict:
    """
    Two-phase generation:
      Phase 1 — Generate course structure (titles + short summaries) in one small call.
      Phase 2 — For each module, expand all its lessons into detailed content in one call per module.
    This keeps each individual API call well within free-tier limits while producing rich content.
    """

    # ── Phase 1: Generate course skeleton ────────────────────────────────
    # Limit source material to ~20,000 chars to leave room for the prompt
    trimmed_text = text[:20000]

    skeleton_prompt = """You are an expert curriculum designer for early childhood education (ECE) teacher training.
Given the source material below, design a well-structured course.
You MUST base the course ONLY on the provided material. Do not invent facts.
Create 3-6 modules with 2-5 lessons each. Keep content_summary to 1-2 sentences for now — it will be expanded later.

Return ONLY valid JSON (no markdown fences, no preamble):
{
  "course_title": "string",
  "course_summary": "A 3-4 sentence overview of the full course",
  "modules": [
    {
      "module_title": "string",
      "lessons": [
        {
          "title": "string",
          "content_summary": "1-2 sentence brief summary",
          "learning_objectives": ["objective 1", "objective 2", "objective 3"]
        }
      ]
    }
  ]
}
"""
    raw = _call_groq(skeleton_prompt, trimmed_text, temperature=0.3, max_tokens=2048)
    skeleton = json.loads(_clean_json(raw))

    # ── Phase 2: Expand each module's lessons with detailed content ───────
    expanded_modules = []

    for module in skeleton.get("modules", []):
        # Build a compact representation of the module for the expansion prompt
        lesson_titles = []
        for lesson in module.get("lessons", []):
            lesson_titles.append({
                "title": lesson.get("title", ""),
                "brief": lesson.get("content_summary", ""),
                "objectives": lesson.get("learning_objectives", []),
            })

        expand_prompt = f"""You are an expert ECE curriculum writer. 
Expand each lesson below into DETAILED educational content for a teacher training course.
The course is: "{skeleton.get('course_title', '')}"
The module is: "{module.get('module_title', '')}"

For EACH lesson, write:
- "content_summary": A thorough 8-15 sentence explanation covering the topic in depth. Include definitions, importance, real-world classroom applications, practical examples, and best practices. Write as if you are teaching the reader.
- "learning_objectives": 3-5 clear, actionable objectives starting with verbs (Understand, Apply, Demonstrate, etc.)
- "key_takeaways": 3-5 bullet-point takeaways a teacher should remember
- "practical_examples": 2-3 concrete classroom examples or activities

Use the source material context provided. Be educational and specific, not generic.

Return ONLY valid JSON array (no markdown fences):
[
  {{
    "title": "lesson title",
    "content_summary": "detailed 8-15 sentence content...",
    "learning_objectives": ["obj1", "obj2", "obj3"],
    "key_takeaways": ["takeaway1", "takeaway2", "takeaway3"],
    "practical_examples": ["example1", "example2"]
  }}
]

Here are the lessons to expand:
{json.dumps(lesson_titles, indent=2)}

Source material excerpt for reference:
{trimmed_text[:6000]}
"""

        # Small delay between module calls to respect rate limits
        if expanded_modules:
            time.sleep(2)

        raw_expanded = _call_groq(
            "You are an expert curriculum content writer. Return only valid JSON.",
            expand_prompt,
            temperature=0.35,
            max_tokens=4096,
        )

        try:
            expanded_lessons = json.loads(_clean_json(raw_expanded))
        except json.JSONDecodeError:
            # Fallback: keep original brief lessons if expansion fails
            print(f"[course_generator] Warning: Failed to expand module '{module.get('module_title')}'. Using skeleton.")
            expanded_lessons = module.get("lessons", [])

        # Merge expanded content back, preserving original titles
        final_lessons = []
        original_lessons = module.get("lessons", [])
        for i, orig in enumerate(original_lessons):
            if i < len(expanded_lessons):
                exp = expanded_lessons[i]
                final_lessons.append({
                    "title": orig.get("title", exp.get("title", "")),
                    "content_summary": exp.get("content_summary", orig.get("content_summary", "")),
                    "learning_objectives": exp.get("learning_objectives", orig.get("learning_objectives", [])),
                    "key_takeaways": exp.get("key_takeaways", []),
                    "practical_examples": exp.get("practical_examples", []),
                })
            else:
                final_lessons.append(orig)

        expanded_modules.append({
            "module_title": module.get("module_title", ""),
            "lessons": final_lessons,
        })

    skeleton["modules"] = expanded_modules
    return skeleton
