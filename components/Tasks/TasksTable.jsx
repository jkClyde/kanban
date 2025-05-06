'use client'

import { FaEye, FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import TaskModal from "./TaskModal"; // Import the TaskModal component

export default function TasksTable({ tasks, projects }) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    project: '',
    status: '',
    priority: '',
    assignedTo: ''
  });
  
  // Filter options
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique values for filter dropdowns
  const statusOptions = [...new Set(tasks.map(task => task.status))];
  const priorityOptions = [...new Set(tasks.map(task => task.priority))];
  const assigneeOptions = [...new Set(tasks.filter(task => task.assignedTo).map(task => task.assignedTo))];

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    return (
      (filters.project === '' || task.projectId === filters.project) &&
      (filters.status === '' || task.status === filters.status) &&
      (filters.priority === '' || task.priority === filters.priority) &&
      (filters.assignedTo === '' || task.assignedTo === filters.assignedTo)
    );
  });

  // Get current tasks
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Reset to first page when filters or tasks change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, tasks]);
  
  // Reference for table container
  const tableRef = useRef(null);
  
  // Page change handler with smooth scroll to top of table
  const paginate = (pageNumber) => {
    // Ensure page number is within valid range
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      
      // Smooth scroll to the top of the table
      if (tableRef.current) {
        tableRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      project: '',
      status: '',
      priority: '',
      assignedTo: ''
    });
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle opening the task modal
  const openTaskModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Handle closing the task modal
  const closeTaskModal = () => {
    setIsModalOpen(false);
  };

  // Check if any tasks have a dueDate
  const showDueDate = tasks.some(task => task.dueDate);
  // Check if any tasks have assignedTo
  const showAssignedTo = tasks.some(task => task.assignedTo);

  // Function to get project name by projectId
  const getProjectName = (projectId) => {
    const project = projects.find(p => p._id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  // Function to get project object by projectId
  const getProject = (projectId) => {
    return projects.find(p => p._id === projectId);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
      {/* Filter Toggle Button */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        {/* <h2 className="text-lg font-semibold text-gray-800">Tasks</h2> */}
        <button 
          onClick={toggleFilters}
          className="flex items-center px-3 py-2 bg-purple_bg text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <FaFilter className="mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Project Filter */}
            <div>
              <label htmlFor="project-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                id="project-filter"
                value={filters.project}
                onChange={(e) => handleFilterChange('project', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Projects</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority-filter"
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Priorities</option>
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee Filter */}
            {showAssignedTo && (
              <div>
                <label htmlFor="assignee-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee
                </label>
                <select
                  id="assignee-filter"
                  value={filters.assignedTo}
                  onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All Assignees</option>
                  <option value="Unassigned">Unassigned</option>
                  {assigneeOptions.map((assignee) => (
                    <option key={assignee} value={assignee}>
                      {assignee}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Reset Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <div ref={tableRef} className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-sidebar text-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Project</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Priority</th>
              {showDueDate && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Due Date</th>
              )}
              {showAssignedTo && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Assigned To</th>
              )}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          {/* Contents */}
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTasks.length > 0 ? currentTasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50">
                {/* Title */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-md font-medium text-gray-900">{task.title}</div>
                  </div>
                </td>
                
                {/* Project */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <Link className="flex items-center" href={`/projects/${task.projectId}`}>   
                      <div className="text-sm text-gray-900">{getProjectName(task.projectId)}</div>
                    </Link>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-[5px] ${
                    task.status === 'Completed' ? 'bg-green_bg text-green-100' : 
                    task.status === 'In Progress' ? 'bg-yellow_bg text-yellow-100' :
                    task.status === 'To Do' ? 'bg-blue_bg text-blue-100' :
                    task.status === 'In Review' ? 'bg-purple_bg text-purple-100' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                  
                {/* Priority */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-[5px] ${
                    task.priority === 'High' ? 'bg-red_bg text-red-100' : 
                    task.priority === 'Medium' ? 'bg-yellow_bg text-yellow-100' :
                    task.priority === 'Low' ? 'bg-blue_bg text-blue-100' :
                    task.priority === 'Urgent' ? 'bg-red_bg text-red-100' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </td>

                {/* Due date */}
                {showDueDate && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                  </td>
                )}

                {/* Assigned To */}
                {showAssignedTo && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.assignedTo || 'Unassigned'}
                  </td>
                )}

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center">
                  <button 
                    onClick={() => openTaskModal(task)}
                    className="text-purple_bg hover:text-indigo-900 focus:outline-none"
                  >
                    <FaEye style={{ fontSize: '24px' }} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No Tasks Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredTasks.length > tasksPerPage && (
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstTask + 1}</span> to{" "}
                <span className="font-medium">
                  {indexOfLastTask > filteredTasks.length ? filteredTasks.length : indexOfLastTask}
                </span>{" "}
                of <span className="font-medium">{filteredTasks.length}</span> tasks
                {filteredTasks.length !== tasks.length && (
                  <span className="ml-1">(filtered from {tasks.length} total)</span>
                )}
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === i + 1
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <FaChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskModal 
        task={selectedTask}
        project={selectedTask ? getProject(selectedTask.projectId) : null}
        isOpen={isModalOpen}
        onClose={closeTaskModal}
      />
    </div>
  );
}