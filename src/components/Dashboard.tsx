import ProgressChart from './ProgressChart';
import RecentTests from './RecentTests';
import ReadingTips from './ReadingTips';
import { HistoryItem } from '../types';

interface DashboardProps {
  history: HistoryItem[];
}

const Dashboard = ({ history }: DashboardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Progress</h2>

      <ProgressChart history={history} />
      <RecentTests history={history} />
      <ReadingTips />
    </div>
  );
};

export default Dashboard; 