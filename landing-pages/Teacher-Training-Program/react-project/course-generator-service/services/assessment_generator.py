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


def _call_groq(system_prompt: str, user_content: str, temperature: float = 0.3, max_tokens: int = 3000) -> str:
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
            if "rate_limit" in error_str or "429" in error_str or "413" in error_str:
                wait = 5 * (attempt + 1)
                print(f"[assessment_generator] Groq Rate limited. Waiting {wait}s before retry {attempt+1}/2...")
                time.sleep(wait)
            else:
                break
    
    # Fallback to Cerebras API if Groq fails due to rate limits
    cerebras_key = os.environ.get("CEREBRAS_API_KEY")
    if cerebras_key:
        print("[assessment_generator] Groq limit reached. Falling back to Cerebras API...")
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
            print(f"[assessment_generator] Cerebras fallback failed: {ce}")
            
    raise RuntimeError("Groq rate limit exceeded and Cerebras fallback failed. Please wait a minute and try again.")


def _condense_course_for_assessment(course_data: dict) -> str:
    """Create a compact summary of the course for assessment generation, keeping only what's needed."""
    condensed = {
        "course_title": course_data.get("course_title", course_data.get("title", "")),
        "modules": []
    }
    for mod in course_data.get("modules", []):
        condensed_mod = {
            "module_title": mod.get("module_title", mod.get("title", "")),
            "lessons": []
        }
        for lesson in mod.get("lessons", mod.get("contents", [])):
            # Only include title and objectives — skip the long content_summary
            condensed_mod["lessons"].append({
                "title": lesson.get("title", ""),
                "objectives": lesson.get("learning_objectives", 
                    lesson.get("key_takeaways", []))[:3],  # max 3 objectives
                "brief": (lesson.get("content_summary", lesson.get("description", "")))[:150],  # first 150 chars only
            })
        condensed["modules"].append(condensed_mod)
    return json.dumps(condensed)


def generate_assessment_from_course(course_data: dict) -> dict:
    condensed = _condense_course_for_assessment(course_data)
    
    system_prompt = """You are an expert assessment designer. Given the following condensed course structure, generate an assessment.
Generate 1 MCQ and 1 short_answer question per module (NOT per lesson — per MODULE).
MCQs need exactly 4 options with correct_answer matching one option exactly.
short_answer questions need 2-3 expected_answer_points.
Tag every question with its linked_module title.

Return ONLY valid JSON (no markdown fences, no preamble):
{
  "assessment_title": "String",
  "questions": [
    {
      "type": "MCQ",
      "question": "String",
      "options": ["String", "String", "String", "String"],
      "correct_answer": "String",
      "linked_module": "String"
    },
    {
      "type": "short_answer",
      "question": "String",
      "expected_answer_points": ["String", "String"],
      "linked_module": "String"
    }
  ]
}
"""
    raw = _call_groq(system_prompt, condensed, temperature=0.3, max_tokens=3000)
    
    try:
        return json.loads(_clean_json(raw))
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse assessment JSON from model response: {e}\nResponse: {raw}")

def auto_grade_short_answers(short_answers: list) -> list:
    if not short_answers:
        return []
        
    system_prompt = """You are an expert evaluator grading short answers.
You will be provided a JSON array of answer objects. Each object contains:
- question
- expected_answer_points
- user_answer

For each answer, evaluate if the user_answer covers the expected points.
Assign a score from 0 to 5 for each. 0 means completely wrong/empty, 5 means covers all key points.
Return a valid JSON array of objects with this exact schema (no markdown, no extra keys):
[
  {
    "question": "String",
    "is_correct": Boolean (True if score >= 3),
    "score": Integer,
    "max_score": 5,
    "feedback": "String (Constructive feedback explaining what was missed or praising good points)"
  }
]
"""
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": json.dumps(short_answers)}
            ],
            temperature=0.2
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
            
        graded = json.loads(content.strip())
        return graded
    except Exception as e:
        print(f"Error in AI grading: {e}")
        # Fallback
        results = []
        for sa in short_answers:
            results.append({
                "question": sa.get("question"),
                "is_correct": False,
                "score": 0,
                "max_score": 5,
                "feedback": "AI grading failed to process this answer."
            })
        return results
