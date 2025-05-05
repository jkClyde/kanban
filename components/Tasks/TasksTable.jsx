'use client'

import { FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function TasksTable({ tasks }) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);

  // Get current tasks
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  // Calculate total pages
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  // Reset to first page when tasks changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tasks]);
  
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

  // Check if any tasks have a dueDate
  const showDueDate = tasks.some(task => task.dueDate);
  // Check if any tasks have assignedTo
  const showAssignedTo = tasks.some(task => task.assignedTo);

  return (
    <div ref={tableRef} className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-sidebar text-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
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
                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-[5px] ${
                    task.status === 'Completed' ? 'bg-green_bg text-green-100' : 
                    task.status === 'In Progress' ? 'bg-yellow_bg text-yellow-100' :
                    task.status === 'Planning' ? 'bg-blue_bg text-blue-100' :
                    task.status === 'On Hold' ? 'bg-purple_bg text-purple-100' :
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
                    task.priority === 'Normal' ? 'bg-purple_bg text-purple-100' :
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
                  <Link href={`/tasks/${task._id}`} className="text-purple_bg hover:text-indigo-900">
                    <FaEye style={{ fontSize: '24px' }} />
                  </Link>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No Tasks Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {tasks.length > tasksPerPage && (
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
                  {indexOfLastTask > tasks.length ? tasks.length : indexOfLastTask}
                </span>{" "}
                of <span className="font-medium">{tasks.length}</span> tasks
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
    </div>
  );
}