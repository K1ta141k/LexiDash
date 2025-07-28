import { AIFeedbackData } from '../types';

interface AIFeedbackProps {
  aiFeedback: AIFeedbackData;
}

const AIFeedback = ({ aiFeedback }: AIFeedbackProps) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Feedback</h3>

      <div className="mb-4 p-4 bg-white rounded-lg border border-blue-100">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-700">Accuracy Score</span>
          <span className="text-2xl font-bold text-indigo-700">{aiFeedback.accuracy_score}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: `${aiFeedback.accuracy_score}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2 flex items-center text-left">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2" />
            Correct Points
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-green-700 text-left">
            {aiFeedback.correct_points.map((point: string, index: number) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2 flex items-center text-left">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
            Missed Points
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-yellow-700 text-left">
            {aiFeedback.missed_points.map((point: string, index: number) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-2 flex items-center text-left">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2" />
            Wrong Points
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-red-700 text-left">
            {aiFeedback.wrong_points.map((point: string, index: number) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIFeedback; 