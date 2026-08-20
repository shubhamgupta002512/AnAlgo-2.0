import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import QuestionCard from '../components/QuestionCard';

const Bookmarks = () => {
  const { user, setUser } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    const res = await api.get('/bookmarks');
    setBookmarks(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleToggleSolved = async (questionId) => {
    const res = await api.put(`/auth/solved/${questionId}`);
    setUser((prev) => ({ ...prev, solvedQuestions: res.data.data }));
  };

  const handleToggleBookmark = async (questionId) => {
    await api.delete(`/bookmarks/${questionId}`);
    setBookmarks((prev) => prev.filter((b) => b.question?._id !== questionId));
  };

  const solvedIds = (user?.solvedQuestions || []).map((q) => (typeof q === 'string' ? q : q._id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookmarks</h1>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading...</div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center text-gray-500 py-12">You haven't bookmarked any questions yet.</div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map(
            (b) =>
              b.question && (
                <QuestionCard
                  key={b._id}
                  question={b.question}
                  isSolved={solvedIds.includes(b.question._id)}
                  isBookmarked={true}
                  onToggleSolved={handleToggleSolved}
                  onToggleBookmark={handleToggleBookmark}
                />
              )
          )}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
