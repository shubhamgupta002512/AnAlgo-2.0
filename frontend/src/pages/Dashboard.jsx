import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import FilterBar from '../components/FilterBar';
import QuestionCard from '../components/QuestionCard';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [meta, setMeta] = useState({ companies: [], topics: [] });
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ search: '', company: '', topic: '', difficulty: '', page: 1 });

  useEffect(() => {
    api.get('/questions/meta/filters').then((res) => setMeta(res.data.data));
    api.get('/bookmarks').then((res) => setBookmarkedIds(res.data.data.map((b) => b.question?._id)));
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const params = { ...filters };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    const res = await api.get('/questions', { params });
    setQuestions(res.data.data);
    setTotalPages(res.data.totalPages);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleToggleSolved = async (questionId) => {
    const res = await api.put(`/auth/solved/${questionId}`);
    setUser((prev) => ({ ...prev, solvedQuestions: res.data.data }));
  };

  const handleToggleBookmark = async (questionId, isBookmarked) => {
    if (isBookmarked) {
      await api.delete(`/bookmarks/${questionId}`);
      setBookmarkedIds((prev) => prev.filter((id) => id !== questionId));
    } else {
      await api.post(`/bookmarks/${questionId}`);
      setBookmarkedIds((prev) => [...prev, questionId]);
    }
  };

  const solvedIds = (user?.solvedQuestions || []).map((q) => (typeof q === 'string' ? q : q._id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900 to-slate-800/90 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_22px_44px_rgba(2,6,23,0.7)]">
        <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_14px_rgba(167,139,250,0.35)]">Practice Questions</h1>
        <p className="mt-1 text-sm text-slate-300">
          {solvedIds.length} solved &middot; {bookmarkedIds.length} bookmarked
        </p>
      </div>

      <div className="rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900 to-slate-800/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_36px_rgba(2,6,23,0.72)]">
        <FilterBar filters={filters} setFilters={setFilters} meta={meta} />
      </div>

      {loading ? (
        <div className="mt-6 rounded-2xl border border-slate-700/80 bg-slate-900/70 py-12 text-center text-slate-300 shadow-[0_18px_40px_rgba(15,23,42,0.45)]">
          Loading questions...
        </div>
      ) : questions.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-700/80 bg-slate-900/70 py-12 text-center text-slate-300 shadow-[0_18px_40px_rgba(15,23,42,0.45)]">
          No questions match your filters.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {questions.map((q) => (
            <QuestionCard
              key={q._id}
              question={q}
              isSolved={solvedIds.includes(q._id)}
              isBookmarked={bookmarkedIds.includes(q._id)}
              onToggleSolved={handleToggleSolved}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setFilters((prev) => ({ ...prev, page: p }))}
              className={`h-8 w-8 rounded-md text-sm font-medium ${
                filters.page === p ? 'bg-violet-600 text-white' : 'border border-slate-600 bg-slate-800 text-slate-200'
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

export default Dashboard;
