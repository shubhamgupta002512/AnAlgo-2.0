import { Link } from 'react-router-dom';

const difficultyStyles = {
  Easy: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  Medium: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  Hard: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
};

const QuestionCard = ({ question, isSolved, isBookmarked, onToggleSolved, onToggleBookmark }) => {
  return (
    <div className="flex items-start justify-between rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900 to-slate-800/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_42px_rgba(2,6,23,0.72)] transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-500/40 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_26px_50px_rgba(76,29,149,0.24)]">
      <div className="flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <a
            href={question.link}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-white transition hover:text-violet-400"
          >
            {question.title}
          </a>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${difficultyStyles[question.difficulty]}`}>
            {question.difficulty}
          </span>
        </div>

        <div className="mb-2 flex flex-wrap gap-1.5">
          {question.companies?.map((c) => (
            <span key={c} className="rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-200 border border-violet-400/20">
              {c}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {question.topics?.map((t) => (
            <span key={t} className="rounded-full bg-slate-700/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 border border-slate-600">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="ml-4 flex flex-col items-end gap-2">
        <Link
          to={`/practice/${question._id}`}
          className="rounded-md bg-gradient-to-b from-violet-500 to-violet-700 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(124,58,237,0.45)] transition hover:-translate-y-0.5 hover:from-violet-400 hover:to-violet-600"
        >
          Solve
        </Link>
        <button
          onClick={() => onToggleSolved(question._id)}
          className={`rounded-md border px-2.5 py-1.5 text-[11px] font-semibold shadow-[0_8px_18px_rgba(15,23,42,0.40)] transition hover:-translate-y-0.5 ${
            isSolved ? 'border-emerald-500 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white' : 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          {isSolved ? 'Solved' : 'Mark Solved'}
        </button>
        <button
          onClick={() => onToggleBookmark(question._id, isBookmarked)}
          className={`rounded-md border px-2.5 py-1.5 text-[11px] font-semibold shadow-[0_8px_18px_rgba(15,23,42,0.40)] transition hover:-translate-y-0.5 ${
            isBookmarked ? 'border-violet-500 bg-gradient-to-b from-violet-500 to-violet-600 text-white' : 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
