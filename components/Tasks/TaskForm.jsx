'use client';
import { useState } from 'react';
import addTask from '@/app/actions/addTask'; 
import { useToast } from '@/components/ToastProvider'; 

export default function TaskForm({ onClose, projectId, services = [] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const { showToast } = useToast(); // Use the toast hook
  
  // Ensure services is always an array
  const availableServices = Array.isArray(services) ? services : [];
  
  // Handle form submission
  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Add the projectId to the form data
      formData.append('projectId', projectId);
      
      // Process selected services as tags
      // First, remove any existing tags entries that might be present
      formData.delete('tags');
      
      // Add each selected service as a tag
      if (selectedServices.length > 0) {
        // Find the service names for the selected IDs
        const selectedServiceNames = availableServices
          .filter(service => selectedServices.includes(service.id || service.name))
          .map(service => service.name);
          
        // Add each service name as a tag
        selectedServiceNames.forEach(name => {
          formData.append('tags', name);
        });
      }
      
      // Call the server action
      const result = await addTask(formData);
      
      if (result.success) {
        // Show toast notification
        showToast('Task added successfully', 'success');
        
        // Close the modal
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

  // Toggle service selection
  const toggleService = (serviceId) => {
    setSelectedServices(prevSelected => 
      prevSelected.includes(serviceId)
        ? prevSelected.filter(id => id !== serviceId)
        : [...prevSelected, serviceId]
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
        {/* Hidden projectId field */}
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple_bg focus:border-purple_bg"
              />
            </div>
          </div>
          
          {/* Services Multi-Select for Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-12 bg-white">
              {availableServices.length > 0 ? (
                availableServices.map((service) => (
                  <div 
                    key={service.id || service.name} // Fallback to name if id is not available
                    onClick={() => toggleService(service.id || service.name)}
                    className={`flex items-center cursor-pointer rounded-full px-3 py-1 text-sm transition-all ${
                      selectedServices.includes(service.id || service.name)
                        ? `bg-opacity-100 text-white`
                        : `bg-opacity-20 text-gray-700`
                    }`}
                    style={{ 
                      backgroundColor: selectedServices.includes(service.id || service.name) 
                        ? service.color 
                        : `${service.color}33` // Adding transparency
                    }}
                  >
                    {service.name}
                    {selectedServices.includes(service.id || service.name) && (
                      <span className="ml-1 font-bold">✓</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No tags available</p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Click to select/deselect tags</p>
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