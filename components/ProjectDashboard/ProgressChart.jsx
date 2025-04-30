import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProgressChart({ projects }) {
  const getMonthlyProgress = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    
    // Initialize monthly data
    const monthlyData = {};
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentDate.getMonth() - 5 + i + 12) % 12;
      monthlyData[months[monthIndex]] = { month: months[monthIndex], progress: 0, count: 0 };
    }
    
    // Calculate progress for each month
    projects.forEach(project => {
      if (!project.startDate || !project.completion) return;
      
      const startDate = new Date(project.startDate);
      const startMonth = startDate.getMonth();
      const startMonthName = months[startMonth];
      
      if (monthlyData[startMonthName]) {
        monthlyData[startMonthName].progress += project.completion || 0;
        monthlyData[startMonthName].count += 1;
      }
    });
    
    return Object.values(monthlyData).map(item => ({
      month: item.month,
      progress: item.count > 0 ? Math.round(item.progress / item.count) : 0
    }));
  };
  
  const progressData = getMonthlyProgress();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Over Time</h3>
      <div className="h-64">
        {progressData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={progressData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="progress" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No progress data available</p>
          </div>
        )}
      </div>
    </div>
  );
}