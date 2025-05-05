'use client'

import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaTag, FaSpinner } from 'react-icons/fa';
import { updateTaskStatus } from '@/app/actions/updateTask';

export default function TaskModal({ task, project, isOpen, onClose, showProjectName=true }) {
  const [status, setStatus] = useState(task?.status || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef(null);
  
  // Log task object for debugging
  useEffect(() => {
    if (task) {
      console.log('Task object:', task);
      setStatus(task.status);
    }
  }, [task]);

  // Close modal when clicking on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // Re-enable body scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Status options
  const statusOptions = ['To Do', 'In Progress', 'In Review', 'Completed', 'Blocked'];

  // Handle status change
  const handleStatusChange = async (e) => {
    e.preventDefault();
    const newStatus = e.target.value;
    
    // Update local state immediately for better UX
    setStatus(newStatus);
    
    if (!task._id) {
      setError("Task ID is missing");
      return;
    }
    
    // Prepare formData
    const formData = new FormData();
    formData.append('id', task._id); // Use task._id instead of task.id
    formData.append('status', newStatus);
    
    try {
      setIsUpdating(true);
      setError('');

      // Call server action to update task status
      const result = await updateTaskStatus(formData);
      
      if (!result.success) {
        setError(result.error);
        // Revert to previous status on error
        setStatus(task.status);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError('Failed to update status. Please try again.');
      setStatus(task.status);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !task) return null;

  // Format the due date if it exists
  const formattedDueDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'No due date';

  // Function to get status style
  const getStatusStyle = (statusValue) => {
    switch(statusValue) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'To Do':
        return 'bg-blue-100 text-blue-800';
      case 'In Review':
        return 'bg-purple-100 text-purple-800';
      case 'Blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Project Info */}
         {showProjectName && 
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Project</h3>
            <p className="text-md font-medium text-gray-900">{project ? project.name : 'Unknown Project'}</p>
          </div>}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p className="text-md text-gray-800 whitespace-pre-wrap">{task.description || 'No description provided'}</p>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <form ref={formRef} action={updateTaskStatus}>
                <input type="hidden" name="id" value={task._id || ''} />
                <div className="relative">
                  <select
                    name="status"
                    value={status}
                    onChange={handleStatusChange}
                    disabled={isUpdating}
                    className={`px-3 py-1 pr-8 text-sm font-semibold rounded-md appearance-none cursor-pointer ${getStatusStyle(status)} border border-transparent focus:border-gray-300 focus:outline-none`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    {isUpdating ? (
                      <FaSpinner className="animate-spin h-4 w-4 text-gray-500" />
                    ) : (
                      <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M10 17a.75.75 0 01-.55-.24l-3.25-3.5a.75.75 0 111.1-1.02L10 15.148l2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5A.75.75 0 0110 17z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </form>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-md ${
                task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                task.priority === 'Low' ? 'bg-blue-100 text-blue-800' :
                task.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
            </div>
          </div>

          {/* Due Date & Assignee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
              <p className="text-md text-gray-800">{formattedDueDate}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned To</h3>
              <p className="text-md text-gray-800">{task.assignedTo || 'Unassigned'}</p>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    <FaTag className="mr-1 text-gray-500" size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}