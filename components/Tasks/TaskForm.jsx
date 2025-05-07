'use client';
import { useState } from 'react';
import addTask from '@/app/actions/addTask'; 
import { useToast } from '@/components/ToastProvider'; 

export default function TaskForm({ onClose, projectId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { showToast } = useToast();
  
  // Hardcoded available categories
  const availableCategories = ["Frontend", "Backend", "UI/UX"];
  
  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setError('');
    
    try {
      formData.append('projectId', projectId);
      
      // Remove any existing tags fields and add the selected categories as tags
      formData.delete('tags');
      selectedCategories.forEach(category => {
        formData.append('tags', category);
      });
      
      const result = await addTask(formData);
      
      if (result.success) {
        showToast('Task added successfully', 'success');
        onClose();
      } else {
        setError(`Failed to add task: ${result.error}`);
      }
    } catch (err) {
      console.error('Error in form submission:', err);
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form action={handleSubmit}>
        <input type="hidden" name="projectId" value={projectId} />
        
        <div className="grid grid-cols-1 gap-y-4">
          {/* Task Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full border border-gray-300 text-header rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
            />
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              className="text-header mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
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
                className="text-header mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
                required
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
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
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Assigned To and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                Assigned To
              </label>
              <input
                type="text"
                name="assignedTo"
                id="assignedTo"
                className="mt-1 block w-full border border-gray-300 text-header rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
              />
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg text-header"
              />
            </div>
          </div>
          
          {/* Categories Multi-Select (will be sent as tags) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-12 bg-white">
              {availableCategories.length > 0 ? (
                availableCategories.map((category) => (
                  <div 
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`flex items-center cursor-pointer rounded-full px-3 py-1 text-sm transition-all ${
                      selectedCategories.includes(category)
                        ? 'bg-purple_bg text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category}
                    {selectedCategories.includes(category) && (
                      <span className="ml-1 font-bold">✓</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No categories available</p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Click to select/deselect categories (will be saved as tags)</p>
          </div>
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
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
    </>
  );
}