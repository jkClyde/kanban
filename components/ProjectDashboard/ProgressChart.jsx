'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

export default function CompletionTrendChart({ projects }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getCompletionStats = () => {
    const currentDate = new Date();
    const monthlyData = {};

    // Track last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[key] = { month: key, completed: 0, totalDays: 0, avgDuration: 0 };
    }

    projects.forEach(project => {
      if (!project.actualEndDate || !project.startDate) return;

      const end = new Date(project.actualEndDate);
      const start = new Date(project.startDate);
      const key = `${months[end.getMonth()]} ${end.getFullYear()}`;

      if (monthlyData[key]) {
        const duration = Math.round((end - start) / (1000 * 60 * 60 * 24)); // days
        monthlyData[key].completed += 1;
        monthlyData[key].totalDays += duration;
      }
    });

    return Object.values(monthlyData).map(item => ({
      ...item,
      avgDuration: item.completed > 0 ? Math.round(item.totalDays / item.completed) : 0,
    }));
  };

  const data = getCompletionStats();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Completion Trends</h3>
      <div className="h-64">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" label={{ value: "Projects", angle: -90, position: "insideLeft" }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: "Avg Days", angle: -90, position: "insideRight" }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="completed" fill="#8884d8" name="Projects Completed" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No completion data available
          </div>
        )}
      </div>
    </div>
  );
}
