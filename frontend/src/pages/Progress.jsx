import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import api from '../api/axios';

const DIFFICULTY_COLORS = { Easy: '#16a34a', Medium: '#ca8a04', Hard: '#dc2626' };
const TOPIC_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

const Progress = () => {
  const [solved, setSolved] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [meRes, totalRes] = await Promise.all([api.get('/auth/me'), api.get('/questions', { params: { limit: 1 } })]);
      setSolved(meRes.data.data.solvedQuestions || []);
      setTotalCount(totalRes.data.total || 0);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 py-24">Loading progress...</div>;
  }

  const difficultyCounts = ['Easy', 'Medium', 'Hard'].map((d) => ({
    name: d,
    solved: solved.filter((q) => q.difficulty === d).length,
  }));

  const topicMap = {};
  solved.forEach((q) => {
    (q.topics || []).forEach((t) => {
      topicMap[t] = (topicMap[t] || 0) + 1;
    });
  });
  const topicData = Object.entries(topicMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const percentSolved = totalCount ? Math.round((solved.length / totalCount) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Progress</h1>
      <p className="text-sm text-gray-500 mb-6">
        {solved.length} of {totalCount} questions solved ({percentSolved}%)
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Solved by Difficulty</h2>
          {solved.length === 0 ? (
            <p className="text-sm text-gray-400 py-12 text-center">No questions solved yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={difficultyCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="solved" radius={[4, 4, 0, 0]}>
                  {difficultyCounts.map((entry) => (
                    <Cell key={entry.name} fill={DIFFICULTY_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Solved by Topic (Top 8)</h2>
          {topicData.length === 0 ? (
            <p className="text-sm text-gray-400 py-12 text-center">No questions solved yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={topicData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {topicData.map((entry, index) => (
                    <Cell key={entry.name} fill={TOPIC_COLORS[index % TOPIC_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
