const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Please add your API key to the .env file.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

// @desc    Generate a tailored resume using Gemini AI
// @route   POST /api/resume/tailor
// @access  Private
const tailorResume = async (req, res) => {
  try {
    const { userProfile, jobDescription } = req.body;

    if (!userProfile || !userProfile.trim()) {
      return res.status(400).json({ message: 'Please provide your profile / skills summary' });
    }
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: 'Please provide a job description' });
    }

    const model = getModel();

    const prompt = `You are a professional resume writer and career coach. 
Given the candidate's profile and the target job description below, generate:

1. A professional resume SUMMARY (2–3 sentences) that positions the candidate as an ideal fit for the role.
2. Exactly 3 ACTION-ORIENTED bullet points that align the candidate's skills and experience with the job requirements. Each bullet should start with a strong action verb and include quantifiable impact where possible.

**Candidate Profile:**
${userProfile.trim()}

**Target Job Description:**
${jobDescription.trim()}

Respond ONLY with valid JSON in this exact format (no markdown fences, no extra text):
{
  "summary": "...",
  "bullets": ["...", "...", "..."]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Parse JSON from the response — handle possible markdown fences
    let cleaned = responseText;
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Gemini response parse error:', parseErr.message);
      console.error('Raw response:', responseText);
      return res.status(502).json({
        message: 'AI returned an invalid response. Please try again.',
      });
    }

    // Validate shape
    if (!parsed.summary || !Array.isArray(parsed.bullets) || parsed.bullets.length === 0) {
      return res.status(502).json({
        message: 'AI returned an incomplete response. Please try again.',
      });
    }

    res.json({
      summary: parsed.summary,
      bullets: parsed.bullets.slice(0, 3),
    });
  } catch (error) {
    console.error('tailorResume error:', error.message);

    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(503).json({ message: error.message });
    }

    res.status(500).json({
      message: error.message || 'Failed to generate tailored resume',
    });
  }
};

module.exports = { tailorResume };
