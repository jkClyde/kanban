'use client'

import { useState } from 'react';

const statusColors = {
  'todo': 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'done': 'bg-green-100 text-green-800',
  // add other status-color mappings as needed
};

const TasksTable = ({ tasks, projectId, ViewTaskAction }) => {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = tasks.filter(task => 
    task.projectId === projectId && 
    (statusFilter === 'all' || task.status === statusFilter)
  );

  return (
    <div className="bg-[#f1f0f0] shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-header">Tasks</h2>

          {/* Status Filter */}
            <div className="px-6 py-3  ">
                <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-700">
                Filter by Status:
                </label>
                <select
                id="status-filter"
                className="rounded-md text-gray-700 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                onChange={(e) => setStatusFilter(e.target.value)}
                value={statusFilter}
                >
                <option value="all">All</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Progress</option>

                <option value="Completed">Completed</option>
                {/* Add other status options as needed */}
                </select>
            </div>
      </div>

    

      <div className="px-6 py-3 overflow-x-auto">
        {filteredTasks.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-sidebar text-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Assigned To
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[task.status] || 'bg-gray-100 text-gray-800'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.assignedTo || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                    <ViewTaskAction task={task} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No tasks found for this project.</p>
        )}
      </div>
    </div>
  );
};

export default TasksTable;