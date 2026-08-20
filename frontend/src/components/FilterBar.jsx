const FilterBar = ({ filters, setFilters, meta }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-slate-700 bg-slate-950/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_24px_rgba(2,6,23,0.5)]">
      <div className="min-w-[180px] flex-1">
        <label className="mb-1 block text-xs font-medium text-slate-300">Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          placeholder="Search by title..."
          className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="min-w-[160px]">
        <label className="mb-1 block text-xs font-medium text-slate-300">Company</label>
        <select
          value={filters.company}
          onChange={(e) => handleChange('company', e.target.value)}
          className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">All Companies</option>
          {meta.companies?.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[160px]">
        <label className="mb-1 block text-xs font-medium text-slate-300">Topic</label>
        <select
          value={filters.topic}
          onChange={(e) => handleChange('topic', e.target.value)}
          className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">All Topics</option>
          {meta.topics?.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[140px]">
        <label className="mb-1 block text-xs font-medium text-slate-300">Difficulty</label>
        <select
          value={filters.difficulty}
          onChange={(e) => handleChange('difficulty', e.target.value)}
          className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">All Levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
