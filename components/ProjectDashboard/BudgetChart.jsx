import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BudgetChart({ budgetData }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget vs Actual Spending</h3>
      <div className="h-64">
        {budgetData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={budgetData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Budget" fill="#64B5F6" />
              <Bar dataKey="Spent" fill="#81C784" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No budget data available</p>
          </div>
        )}
      </div>
    </div>
  );
}