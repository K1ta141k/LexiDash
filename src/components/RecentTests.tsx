import { HistoryItem } from '../types';

interface RecentTestsProps {
  history: HistoryItem[];
}

const RecentTests = ({ history }: RecentTestsProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Tests</h3>
      <div className="space-y-3">
        {history.slice(-3).map((test, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div className="text-left">
              <div className="font-medium text-gray-800">{test.firstFiveWords}</div>
              <div className="text-sm text-gray-600">
                {test.wpm} WPM • {test.accuracy}% accuracy
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-indigo-700">{test.wpm} WPM</div>
              <div className="text-sm text-gray-600">{test.accuracy}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTests; 