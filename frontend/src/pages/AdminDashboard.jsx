import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import QuestionForm from '../components/QuestionForm';

const difficultyStyles = {
  Easy: 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
  Medium: 'border border-amber-500/30 bg-amber-500/15 text-amber-300',
  Hard: 'border border-rose-500/30 bg-rose-500/15 text-rose-300',
};

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null); // question object being edited, or null
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const res = await api.get('/questions', { params: { page, limit: 15 } });
    setQuestions(res.data.data);
    setTotalPages(res.data.totalPages);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
    setError('');
  };

  const handleEdit = (q) => {
    setEditing(q);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question permanently?')) return;
    try {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      if (editing) {
        await api.put(`/questions/${editing._id}`, data);
      } else {
        await api.post('/questions', data);
      }
      setShowForm(false);
      setEditing(null);
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Admin Console</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">Manage Questions</h1>
          <p className="mt-1 text-sm text-slate-400">Add, edit, or remove interview questions from the catalog.</p>
        </div>
        {!showForm && (
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(124,58,237,0.35)] transition hover:-translate-y-0.5 hover:from-violet-400 hover:to-violet-600"
          >
            + Add Question
          </button>
        )}
      </div>

      {error && <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div>}

      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4 shadow-[0_18px_40px_rgba(2,6,23,0.65)]">
          <QuestionForm
            initialData={editing}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 py-12 text-center text-slate-300 shadow-[0_18px_40px_rgba(2,6,23,0.65)]">
          Loading questions...
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/70 shadow-[0_18px_40px_rgba(2,6,23,0.65)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm text-slate-200">
              <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.15em] text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Difficulty</th>
                  <th className="px-4 py-3 text-left">Companies</th>
                  <th className="px-4 py-3 text-left">Topics</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/80">
                {questions.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-800/60">
                    <td className="px-4 py-3 font-medium text-white">{q.title}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${difficultyStyles[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{(q.companies || []).join(', ')}</td>
                    <td className="px-4 py-3 text-slate-300">{(q.topics || []).join(', ')}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(q)} className="rounded-md border border-slate-600 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(q._id)} className="rounded-md border border-rose-500/40 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-500/20">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-md text-sm font-medium ${
                page === p ? 'bg-violet-600 text-white shadow-[0_8px_18px_rgba(124,58,237,0.35)]' : 'border border-slate-600 bg-slate-800 text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
