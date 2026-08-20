import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../api/axios';

const DEFAULT_TEMPLATE = `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read input and write your solution here

    }
}
`;

const difficultyStyles = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
};

const Practice = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState(DEFAULT_TEMPLATE);
  const [customInput, setCustomInput] = useState('');
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState('run');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    api
      .get(`/questions/${id}`)
      .then((res) => {
        setQuestion(res.data.data);
        if (res.data.data.starterCode?.java) {
          setCode(res.data.data.starterCode.java);
        }
      })
      .catch(() => setLoadError('Could not load this question.'));
  }, [id]);

  const handleRun = async () => {
    setRunning(true);
    setRunResult(null);
    setTab('run');
    try {
      const res = await api.post('/compiler/run', { code, input: customInput });
      setRunResult(res.data.data);
    } catch (err) {
      setRunResult({ status: 'Error', stderr: err.response?.data?.message || 'Run failed. Please try again.' });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitResult(null);
    setTab('submit');
    try {
      const res = await api.post(`/compiler/submit/${id}`, { code });
      setSubmitResult(res.data.data);
    } catch (err) {
      setSubmitResult({ error: err.response?.data?.message || 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    return <div className="text-center text-red-500 py-24">{loadError}</div>;
  }

  if (!question) {
    return <div className="text-center text-gray-500 py-24">Loading question...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link to="/" className="text-sm text-brand-600 hover:underline">
        &larr; Back to Questions
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-xl font-bold text-gray-900">{question.title}</h1>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyStyles[question.difficulty]}`}>
              {question.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {question.companies?.map((c) => (
              <span key={c} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                {c}
              </span>
            ))}
          </div>

          <p className="text-sm text-gray-700 whitespace-pre-line mb-4">{question.description}</p>

          {question.testCases?.some((tc) => tc.isSample) && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Sample Test Cases</h3>
              {question.testCases
                .filter((tc) => tc.isSample)
                .map((tc, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs font-mono whitespace-pre-wrap">
                    <div>
                      <span className="text-gray-500">Input:</span> {tc.input || '(none)'}
                    </div>
                    <div>
                      <span className="text-gray-500">Expected Output:</span> {tc.expectedOutput}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {(!question.testCases || question.testCases.length === 0) && (
            <p className="text-xs text-gray-400 mt-4">
              This question doesn't have test cases yet — you can still use "Run" with custom input, but "Submit" needs
              an admin to add test cases first (via the Admin Dashboard).
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-900 text-gray-300 text-xs px-3 py-2 flex items-center justify-between">
              <span>Main.java</span>
              <span className="text-gray-500">Java</span>
            </div>
            <Editor
              height="360px"
              defaultLanguage="java"
              value={code}
              onChange={(v) => setCode(v || '')}
              theme="vs-dark"
              options={{ fontSize: 14, minimap: { enabled: false } }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Custom Input (stdin)</label>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              rows={2}
              placeholder="e.g. 4&#10;2 7 11 15&#10;9"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRun}
              disabled={running}
              className="border border-gray-300 text-gray-700 font-medium text-sm px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-60"
            >
              {running ? 'Running...' : 'Run'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-brand-600 text-white font-medium text-sm px-4 py-2 rounded-md hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[140px]">
            {tab === 'run' && runResult && (
              <div className="text-sm space-y-1">
                <div
                  className={`font-semibold ${
                    runResult.status === 'Accepted' || runResult.status === 'Successful' ? 'text-green-600' : 'text-gray-700'
                  }`}
                >
                  Status: {runResult.status}
                </div>
                {runResult.stdout && (
                  <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded text-xs font-mono">{runResult.stdout}</pre>
                )}
                {runResult.stderr && (
                  <pre className="whitespace-pre-wrap bg-red-50 text-red-700 p-2 rounded text-xs font-mono">{runResult.stderr}</pre>
                )}
                {runResult.compileOutput && (
                  <pre className="whitespace-pre-wrap bg-red-50 text-red-700 p-2 rounded text-xs font-mono">{runResult.compileOutput}</pre>
                )}
                {(runResult.time || runResult.memory) && (
                  <div className="text-xs text-gray-400">
                    Time: {runResult.time || '-'}s &middot; Memory: {runResult.memory || '-'}KB
                  </div>
                )}
              </div>
            )}

            {tab === 'submit' && submitResult && (
              <div className="text-sm space-y-2">
                {submitResult.error ? (
                  <div className="text-red-600">{submitResult.error}</div>
                ) : (
                  <>
                    <div className={`font-semibold ${submitResult.verdict === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>
                      {submitResult.verdict} &mdash; {submitResult.passedCount}/{submitResult.totalCount} test cases passed
                    </div>
                    {submitResult.firstFailure && (
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs font-mono space-y-1 whitespace-pre-wrap">
                        <div className="text-gray-500">Failed on test case #{submitResult.firstFailure.index}</div>
                        <div>Input: {submitResult.firstFailure.input || '(none)'}</div>
                        <div>Expected: {submitResult.firstFailure.expected}</div>
                        <div>Got: {submitResult.firstFailure.actual}</div>
                        {submitResult.firstFailure.stderr && (
                          <div className="text-red-600">Error: {submitResult.firstFailure.stderr}</div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {!runResult && !submitResult && (
              <div className="text-sm text-gray-400">Run or submit your code to see output here.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
