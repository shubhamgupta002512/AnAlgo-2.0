import { useState, useEffect } from 'react';

const emptyForm = {
  title: '',
  description: '',
  companies: '',
  topics: '',
  difficulty: 'Easy',
  link: '',
  frequency: 0,
};

const QuestionForm = ({ initialData, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        companies: (initialData.companies || []).join(', '),
        topics: (initialData.topics || []).join(', '),
        difficulty: initialData.difficulty || 'Easy',
        link: initialData.link || '',
        frequency: initialData.frequency || 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      companies: form.companies.split(',').map((c) => c.trim()).filter(Boolean),
      topics: form.topics.split(',').map((t) => t.trim()).filter(Boolean),
      difficulty: form.difficulty,
      link: form.link.trim(),
      frequency: Number(form.frequency) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-slate-400">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-slate-400">Description</label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-slate-400">Companies</label>
          <input
            value={form.companies}
            onChange={(e) => handleChange('companies', e.target.value)}
            placeholder="Google, Amazon"
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-slate-400">Topics</label>
          <input
            value={form.topics}
            onChange={(e) => handleChange('topics', e.target.value)}
            placeholder="Array, DP"
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-slate-400">Difficulty</label>
          <select
            value={form.difficulty}
            onChange={(e) => handleChange('difficulty', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-slate-400">Link</label>
          <input
            value={form.link}
            onChange={(e) => handleChange('link', e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-[0.15em] text-slate-400">Frequency</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gradient-to-b from-violet-500 to-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(124,58,237,0.35)] transition hover:-translate-y-0.5 hover:from-violet-400 hover:to-violet-600 disabled:opacity-60"
        >
          {submitting ? 'Saving...' : initialData ? 'Update Question' : 'Add Question'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default QuestionForm;
