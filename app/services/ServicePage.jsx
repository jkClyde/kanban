'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { addService } from '../actions/addService';
import deleteService from '../actions/deleteService';

export default function ServicesPage({ services: initialServices }) {
  // State management
  const [services, setServices] = useState(initialServices || []);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ 
    show: false, 
    message: '', 
    type: '' 
  });

  // Sync with props
  useEffect(() => {
    setServices(initialServices || []);
  }, [initialServices]);

  // Show notification helper
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Call the server action with the correct function name
      const result = await addService(formData);
      
      if (result.success) {
        // Add the new service to the state
        setServices(prev => [...prev, result.data]);
        showNotification('Service added successfully!', 'success');
        setIsFormVisible(false);
      } else {
        setError(`Failed to add service: ${result.error}`);
      }
    } catch (err) {
      console.error('Error in form submission:', err);
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDelete = async (project) => {
    setIsDeleting(true);
    try {
      const result = await deleteService(project);
      
      if (result.success) {
        router.push('/services');
        router.refresh();
        showToast('Service deleted successfully', 'error');

      } else {
        console.error('Failed to delete service:', result.error);
        alert('Failed to delete service. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('An error occurred while deleting the service.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
      <button
        type="submit"
        disabled={pending || isSubmitting}
        className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple_bg hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center"
      >
        {pending || isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Add Service'
        )}
      </button>
    );
  }

  return (
    <div className="min-h-screen w-full rounded-[15px] bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
      
      <div className="max-w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
            <p className="mt-2 text-sm text-gray-500">Manage your available services</p>
          </div>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="flex items-center px-4 py-2 bg-purple_bg text-white rounded-md hover:bg-indigo-900 transition-colors"
          >
            {isFormVisible ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Hide Form
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Service
              </>
            )}
          </button>
        </div>
        
        {/* Add Service Form */}
        {isFormVisible && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 transition-all duration-300 ease-in-out">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Add New Service</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form action={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Service Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border text-gray-500"
                    placeholder="e.g. Web Development"
                  />
                </div>
                
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                    Color*
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="color"
                      name="colorPicker"
                      id="colorPicker"
                      defaultValue="#090F13"
                      className="h-10 w-10 rounded mr-2 cursor-pointer text-gray-900"
                      onChange={(e) => {
                        document.getElementById('color').value = e.target.value;
                      }}
                    />
                    <input
                      type="text"
                      name="color"
                      id="color"
                      defaultValue="#3B82F6"
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                      placeholder="#HEX Color"
                      onChange={(e) => {
                        try {
                          document.getElementById('colorPicker').value = e.target.value;
                        } catch (err) {
                          // Handle invalid color format
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <SubmitButton />
              </div>
            </form>
          </div>
        )}
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {services && services.length > 0 ? services.map((service) => (
            <div 
              key={service._id} 
              className="bg-white overflow-hidden shadow-lg rounded-lg flex flex-col hover:shadow-xl transition-shadow duration-300"
            >
              <div 
                className="h-3" 
                style={{ backgroundColor: service.color }}
              ></div>
              <div className="px-6 py-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <div 
                    className="h-6 w-6 rounded-full mr-2" 
                    style={{ backgroundColor: service.color }}
                  ></div>
                  <button 
                    onClick={() => deleteService(service._id)} 
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete service"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{service.name}</h3>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <Link href={`/projects?tag=${service.name}`}>
                    <span className="text-indigo-600 font-medium hover:underline focus:outline-none cursor-pointer">
                      View related projects
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )) : null}
        </div>

        {/* Empty state */}
        {(!services || services.length === 0) && !isFormVisible && (
          <div className="flex flex-col items-center justify-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No services yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first service.</p>
            <button
              onClick={() => setIsFormVisible(true)}
              className="mt-4 px-4 py-2 bg-purple_bg text-white rounded-md hover:bg-indigo-900 transition-colors"
            >
              Add Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
}