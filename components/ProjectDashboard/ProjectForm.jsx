'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import addProject from '@/app/actions/addProject';

export default function ProjectForm({ onClose }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Handle form submission
  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Process tags - convert comma-separated string to array
      const tagsInput = formData.get('tags');
      if (tagsInput) {
        // Remove the original single tags value
        formData.delete('tags');
        
        // Add each tag individually to support getAll('tags')
        const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        tagsArray.forEach(tag => {
          formData.append('tags', tag);
        });
      }
      
      // Call the server action
      const result = await addProject(formData);
      
      if (result.success) {
        // Close the modal
        onClose();
        
        // Redirect to the new project page
        router.push(`/projects/${result.projectId}`);
      } else {
        setError(`Failed to add project: ${result.error}`);
      }
    } catch (err) {
      console.error('Error in form submission:', err);
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form action={handleSubmit}>
        <div className="grid grid-cols-1 gap-y-4">
          {/* Basic Info */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Project Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full border border-gray-300 text-header rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              className="text-header mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
              required
            />
          </div>
          
          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                className=" text-header mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
                required

              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="text-header mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
                required

              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          
          {/* Tech Stack */}
          <div>
            <label htmlFor="techStack" className="block text-sm font-medium text-gray-700">
              Tech Stack
            </label>
            <input
              type="text"
              name="techStack"
              placeholder="React, Node.js, MongoDB, etc."
              className="text-header mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
            />
          </div>
          
          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gitRepo" className="block text-sm font-medium text-gray-700">
                Git Repository
              </label>
              <input
                type="url"
                name="gitRepo"
                placeholder="https://github.com/username/repo"
                className="text-header mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
              />
            </div>
            
            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                Live Domain
              </label>
              <input
                type="url"
                name="domain"
                placeholder="https://yourproject.com"
                className="text-header mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
              />
            </div>
          </div>
          
          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
              />
            </div>
            
            <div>
              <label htmlFor="targetEndDate" className="block text-sm font-medium text-gray-700">
                Target End Date
              </label>
              <input
                type="date"
                name="targetEndDate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
              />
            </div>
          </div>
          
          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              placeholder="portfolio, client, personal (comma separated)"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
            />
          </div>
          
          {/* Completion percentage */}
          {/* <div>
            <label htmlFor="completion" className="block text-sm font-medium text-gray-700">
              Completion (%)
            </label>
            <input
              type="number"
              name="completion"
              min="0"
              max="100"
              defaultValue="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
            />
          </div> */}
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-purple_bg border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Project'}
          </button>
        </div>
      </form>
    </>
  );
}