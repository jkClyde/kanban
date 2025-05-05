'use client'

import { useState, useEffect } from 'react';
import { FaTimes, FaTag } from 'react-icons/fa';

export default function TaskModal({ task, project, isOpen, onClose, showProjectName=true }) {
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

  if (!isOpen || !task) return null;

  // Format the due date if it exists
  const formattedDueDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'No due date';

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
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-md ${
                task.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                task.status === 'To Do' ? 'bg-blue-100 text-blue-800' :
                task.status === 'In Review' ? 'bg-purple-100 text-purple-800' :
                'bg-red-100 text-red-800'
              }`}>
                {task.status}
              </span>
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