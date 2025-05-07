'use client'

import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaTag, FaSpinner, FaEdit, FaSave } from 'react-icons/fa';
import { updateTask } from '@/app/actions/updateTask'; 

export default function TaskModal({ task, project, isOpen, onClose, showProjectName=true }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    assignedTo: '',
    dueDate: '',
    tags: []
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');
  const formRef = useRef(null);
  
  // Initialize form data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        priority: task.priority || 'Medium',
        assignedTo: task.assignedTo || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags || []
      });
    }
  }, [task]);

  const availableCategories = ["Frontend", "Backend", "UI/UX"];


  // Status and priority options
  const statusOptions = ['To Do', 'In Progress', 'In Review', 'Completed', 'Blocked'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');
  
    try {
      // Validate required fields
      if (!formData.title || !formData.title.trim()) {
        throw new Error('Title is required');
      }
  
      // Create FormData and append all fields
      const submissionFormData = new FormData();
      submissionFormData.append('id', task._id);
      submissionFormData.append('title', formData.title);
      submissionFormData.append('description', formData.description);
      submissionFormData.append('status', formData.status);
      submissionFormData.append('priority', formData.priority);
      submissionFormData.append('assignedTo', formData.assignedTo);
      submissionFormData.append('dueDate', formData.dueDate);
      submissionFormData.append('tags', JSON.stringify(formData.tags));
  
      const result = await updateTask(submissionFormData);
      
      if (!result.success) {
        setError(result.error);
      } else {
        setIsEditing(false);
        // Optionally refresh data or close modal
      }
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };


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
        if (isEditing) {
          setIsEditing(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, isEditing]);

  if (!isOpen || !task) return null;

  // Function to get status style
  const getStatusStyle = (statusValue) => {
    switch(statusValue) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'To Do': return 'bg-blue-100 text-blue-800';
      case 'In Review': return 'bg-purple-100 text-purple-800';
      case 'Blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto text-header">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
       
            <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
        
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-500 hover:text-purple-600 transition-colors"
              title={isEditing ? 'Cancel Editing' : 'Edit Task'}
            >
              {isEditing ? '' : <FaEdit size={20} />}
            </button>


            
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form ref={formRef} onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={task._id || ''} />

            {/* Project Info */}
            {showProjectName && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Project</h3>
                <p className="text-md font-medium text-gray-900">
                  {project ? project.name : 'Unknown Project'}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              ) : (
                <p className="text-md text-gray-800 whitespace-pre-wrap">
                  {task.description || 'No description provided'}
                </p>
              )}
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`px-3 py-2 w-full rounded-md ${getStatusStyle(formData.status)} border border-transparent focus:border-gray-300 focus:outline-none`}
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-md ${getStatusStyle(formData.status)}`}>
                    {formData.status}
                  </span>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
                {isEditing ? (
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    {priorityOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-md ${
                    formData.priority === 'High' ? 'bg-red-100 text-red-800' : 
                    formData.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    formData.priority === 'Low' ? 'bg-blue-100 text-blue-800' :
                    formData.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {formData.priority}
                  </span>
                )}
              </div>
            </div>

            {/* Due Date & Assignee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
                {isEditing ? (
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-md text-gray-800">
                    {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'No due date'}
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned To</h3>
                {isEditing ? (
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-md text-gray-800">{formData.assignedTo || 'Unassigned'}</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2 flex-wrap">
                    {availableCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setFormData(prev => {
                            const newTags = prev.tags.includes(category)
                              ? prev.tags.filter(tag => tag !== category)
                              : [...prev.tags, category];
                            return { ...prev, tags: newTags };
                          });
                        }}
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                          formData.tags.includes(category)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {category}
                        {formData.tags.includes(category) && (
                          <span className="ml-1">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="tags" value={JSON.stringify(formData.tags)} />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.length > 0 ? (
                    formData.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        <FaTag className="mr-1 text-gray-500" size={12} />
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No tags selected</p>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex justify-end pt-6 border-t border-gray-200 gap-3">
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
              {!isEditing && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}