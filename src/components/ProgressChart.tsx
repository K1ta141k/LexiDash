import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HistoryItem } from '../types';

interface ProgressChartProps {
  history: HistoryItem[];
}

const ProgressChart = ({ history }: ProgressChartProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">WPM & Accuracy History</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="firstFiveWords" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="wpm" stroke="#4f46e5" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="accuracy" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart; 