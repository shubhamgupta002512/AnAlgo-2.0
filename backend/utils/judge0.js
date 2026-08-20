const axios = require('axios');

// Free public Judge0 CE instance by default. For higher limits, sign up for
// Judge0 CE on RapidAPI (free tier) and set JUDGE0_API_URL / JUDGE0_API_KEY.
const JUDGE0_URL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
const JUDGE0_KEY = process.env.JUDGE0_API_KEY || '';

// Java (OpenJDK 13.0.1) language id on Judge0 CE
const JAVA_LANGUAGE_ID = 62;

/**
 * Submits Java source code to Judge0 and waits for the result.
 * If expectedOutput is provided, Judge0 will compare stdout against it
 * and set status to "Accepted" / "Wrong Answer" accordingly.
 */
const runCode = async (sourceCode, stdin = '', expectedOutput = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (JUDGE0_KEY) {
    headers['X-RapidAPI-Key'] = JUDGE0_KEY;
    headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
  }

  const body = {
    source_code: sourceCode,
    language_id: JAVA_LANGUAGE_ID,
    stdin,
  };
  if (expectedOutput !== null) {
    body.expected_output = expectedOutput;
  }

  const { data } = await axios.post(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
    body,
    { headers, timeout: 25000 }
  );

  return data;
};

const formatResult = (raw) => ({
  stdout: raw.stdout || '',
  stderr: raw.stderr || '',
  compileOutput: raw.compile_output || '',
  status: raw.status ? raw.status.description : 'Unknown',
  time: raw.time,
  memory: raw.memory,
});

module.exports = { runCode, formatResult, JAVA_LANGUAGE_ID };
