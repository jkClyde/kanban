import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const statusColors = {
  'Completed': '#81C784',
  'In Progress': '#FFB74D',
  'Planning': '#64B5F6',
  'On Hold': '#BA68C8',
  'Canceled': '#EF5350'
};

export default function StatusChart({ projects }) {
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});
  
  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status],
    color: statusColors[status] || '#9E9E9E'
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Status Distribution</h3>
      <div className="h-64">
        {statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No status data available</p>
          </div>
        )}
      </div>
    </div>
  );
}