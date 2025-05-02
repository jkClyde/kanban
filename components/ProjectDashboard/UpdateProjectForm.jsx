'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import updateProject from '@/app/actions/updateProject';

export default function EditProjectModal({ project, isOpen, setIsOpen }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Planning',
    completion: 0,
    priority: 'Medium',
    gitRepo: '',
    domain: '',
    startDate: '',
    targetEndDate: '',
    actualEndDate: '',
    tags: [],
    techStack: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

 

  useEffect(() => {
    if (project) {
      // Format dates for input fields
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'Planning',
        completion: project.completion || 0,
        priority: project.priority || 'Medium',
        gitRepo: project.gitRepo || '',
        domain: project.domain || '',
        startDate: formatDate(project.startDate),
        targetEndDate: formatDate(project.targetEndDate),
        actualEndDate: formatDate(project.actualEndDate),
        tags: project.tags || [],
        techStack: project.techStack || ''
      });
    }
  }, [project, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData object
      const formDataObj = new FormData();
      
      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') {
          // Add each tag individually to support array fields
          value.forEach(tag => {
            formDataObj.append('tags', tag);
          });
        } else {
          formDataObj.append(key, value);
        }
      });

      const result = await updateProject(project._id, formDataObj);
      
      if (result.success) {
        setIsOpen(false);
        router.refresh(); // Refresh the page data
      } else {
        setError(result.error || 'Failed to update project');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b bg-sidebar border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Edit Project</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 text-header">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 r">
            {/* Project Name */}
            <div>
              <label className="block text-sm  font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple_bg focus:border-purple_bg"
              />
            </div>
            
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple_bg focus:border-purple_bg"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple_bg focus:border-purple_bg"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Completion */}
           
            
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple_bg focus:border-purple_bg"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          
          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple_bg focus:border-purple_bg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target End Date
              </label>
              <input
                type="date"
                name="targetEndDate"
                value={formData.targetEndDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple_bg focus:border-purple_bg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual End Date
              </label>
              <input
                type="date"
                name="actualEndDate"
                value={formData.actualEndDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple_bg focus:border-purple_bg"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Git Repo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Git Repository URL
              </label>
              <input
                type="url"
                name="gitRepo"
                value={formData.gitRepo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple_bg focus:border-purple_bg"
              />
            </div> 
            
            {/* Live Site */}
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Live Site URL
              </label>
              <input
                type="url"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple_bg focus:border-purple_bg"
              />
            </div>
          </div>
          
     
          
          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-purple_bg focus:border-purple_bg"
                placeholder="Add a tag and press Enter or click Add"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-purple_bg text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple_bg hover:bg-indigo-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}