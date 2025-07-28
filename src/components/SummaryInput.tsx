
interface SummaryInputProps {
  summary: string;
  setSummary: (summary: string) => void;
  submitSummary: () => void;
}

const SummaryInput = ({ summary, setSummary, submitSummary }: SummaryInputProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Summarize what you read</h3>
      <textarea
        value={summary}
        onChange={e => setSummary(e.target.value)}
        placeholder="Write a brief summary of the text you just read..."
        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
      />
      <button
        onClick={submitSummary}
        disabled={!summary.trim()}
        className={`mt-3 px-6 py-3 font-medium rounded-lg transition duration-200 ${
          summary.trim()
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Submit Summary
      </button>
    </div>
  );
};

export default SummaryInput; 