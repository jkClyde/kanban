'use client';
import { useState } from 'react';
import ProjectForm from './ProjectForm'; 

export default function DashboardFilters({
  filterStatus,
  setFilterStatus,
  searchTerm,
  setSearchTerm,
  statusCounts,
  services
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  console.log("Services in DashboardFilters:", services); // Debugging line
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div>
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 block md:inline-block md:mr-2">Filter by Status:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 md:mt-0 block w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-purple_bg focus:ring-purple_bg text-sm text-gray-500 p-2"
            >
              <option value="All">All Projects</option>
              {Object.keys(statusCounts).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-64">
            <label htmlFor="search" className="sr-only">Search Projects</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple_bg focus:border-purple_bg sm:text-sm"
                placeholder="Search projects"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div>
          <button 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple_bg hover:bg-indigo-700 focus:outline-none"
            onClick={() => setIsModalOpen(true)}
          >
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Project
          </button>
        </div>
      </div>

      {/* Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl md:max-w-4xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Add New Project</h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <ProjectForm onClose={closeModal} services={services}/>
          </div>
        </div>
      )}
    </>
  );
}