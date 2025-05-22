'use client'

import { useState } from 'react';
import TaskForm from '@/components/Tasks/TaskForm';

const statusColors = {
  'To Do': 'bg-blue_bg text-white',
  'In Progress': 'bg-yellow_bg text-white',
  'In Review': 'bg-purple_bg text-white',
  'Completed': 'bg-green_bg text-white',
  // add other status-color mappings as needed
};

const priorityColors = {
  'Low': 'bg-green_bg text-white',
  'Medium': 'bg-yellow_bg text-white',
  'High': 'bg-red_bg text-white',
  'Urgent': 'bg-black text-red-500',
  // add other priority-color mappings as needed
};

const TasksTable = ({ tasks, projectId, ViewTaskAction }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showAddForm, setshowAddForm] = useState(false);

  const filteredTasks = tasks.filter(task => 
    task.projectId === projectId && 
    (statusFilter === 'all' || task.status === statusFilter) &&
    (priorityFilter === 'all' || task.priority === priorityFilter)
  );

  return (
    <div className="bg-[#f1f0f0] shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-header">Tasks</h2>

        <div className="flex items-center gap-4">
          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-700">
              Status:
            </label>
            <select
              id="status-filter"
              className="rounded-md text-gray-700 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              onChange={(e) => setStatusFilter(e.target.value)}
              value={statusFilter}
            >
              <option value="all">All </option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label htmlFor="priority-filter" className="mr-2 text-sm font-medium text-gray-700">
              Priority:
            </label>
            <select
              id="priority-filter"
              className="rounded-md text-gray-700 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              onChange={(e) => setPriorityFilter(e.target.value)}
              value={priorityFilter}
            >
              <option value="all">All </option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setshowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-purple_bg text-white text-sm font-medium rounded-md shadow-sm hover:bg-purple-950 focus:outline-none"
          >
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Task
          </button>
        </div>
      </div>

      <div className="px-6 py-3 overflow-x-auto">
        {filteredTasks.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-sidebar text-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Assigned To
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks
                .sort((a, b) => {
                  const order = {
                    'To Do': 1,
                    'In Progress': 2,
                    'In Review': 3,
                    'Completed': 4,
                  };
                  return (order[a.status] || 99) - (order[b.status] || 99);
                })
                .map((task) => (
                <tr key={task._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-[5px] ${statusColors[task.status] || 'bg-gray-100 text-gray-800'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-[5px] ${priorityColors[task.priority] || 'bg-gray-100 text-gray-800'}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.assignedTo || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <ViewTaskAction task={task} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No tasks found matching the selected filters.</p>
        )}
      </div>

      {/* Task modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-header text-xl font-semibold mb-4">Add New Task</h2>
            <TaskForm 
              projectId={projectId}
              onClose={() => setshowAddForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksTable;