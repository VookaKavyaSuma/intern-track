/**
 * AI Service — Pluggable Stub
 *
 * Currently returns hardcoded mock data.
 * To integrate a real AI API (e.g., OpenAI, Gemini), replace the
 * implementation of the `analyze` function below.
 * No other file in the codebase needs to change.
 */

const analyze = async (jobDescription) => {
  // Simulate a small delay to mimic an API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    atsKeywords: [
      'React',
      'Node.js',
      'MongoDB',
      'REST API',
      'Agile',
      'JavaScript',
      'TypeScript',
      'Git',
      'CI/CD',
      'Problem Solving',
    ],
    interviewQuestions: [
      'Explain the virtual DOM in React and how it improves performance.',
      'How do you handle authentication and authorization in a Node.js app?',
      'Describe RESTful API design principles and best practices.',
      'What is the difference between SQL and NoSQL databases?',
      'How do you manage state in a large React application?',
    ],
    fitScore: 78,
    suggestions: [
      'Add more quantifiable achievements to your resume',
      'Mention specific project management tools (Jira, Trello)',
      'Highlight experience with cloud services (AWS, GCP)',
      'Include relevant certifications or coursework',
    ],
  };
};

module.exports = { analyze };
