'use client';

import { useState, useEffect } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { updateCurrent } from '@/app/actions/updateCurrent';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CurrentProject = ({ CurrentProject, allProjects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(CurrentProject);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = async (project) => {
    setIsUpdating(true);
    setError(null);
    
    try {      
      // Extract the project ID first
      const projectId = getProjectId(project);
      
      if (!projectId) {
        throw new Error('Invalid project ID');
      }
      
      // Create form data
      const formData = new FormData();
      formData.append('name', project.name);
      formData.append('project_id', projectId);
      
      const result = await updateCurrent(formData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update current project');
      }

      // Ensure project has the correct ID property before updating selected state
      const updatedProject = {
        ...project,
        project_id: projectId // Ensure project_id is correctly set
      };
            
      // Update local state
      setSelected(updatedProject);
      setIsOpen(false);
      
      // Force router refresh to update the page with new project data
      router.refresh();
    } catch (error) {
      console.error('Error updating current project:', error);
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const getProjectId = (project) => {
    if (!project) return '';
        
    const projectId = project.project_id || 
      (project._id ? (typeof project._id === 'string' ? project._id : project._id.toString()) : '') || 
      (project.id ? (typeof project.id === 'string' ? project.id : project.id.toString()) : '');
    
    return projectId;
  };


  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-indigo-100 to-blue-50 p-5 rounded-xl shadow-sm mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue_bg w-2 h-14 rounded-full hidden md:block"></div>
         <div className='flex flex-col gap-1'>
            <p className='text-gray-600 text-sm'>Currently Working on</p>
            {getProjectId(selected) ? (
              <Link href={`/projects/${getProjectId(selected)}`} className="flex items-center gap-2">
                {selected.name && (
                  <h1 className="text-2xl font-bold text-header">{selected.name}</h1>
                )}
              </Link>
            ) : (
              <h1 className="text-2xl font-bold text-header">{selected?.name || 'No project selected'}</h1>
            )}
         </div>
      </div>
      
      <div className="relative min-w-[200px]">
        <button 
          onClick={toggleDropdown}
          disabled={isUpdating}
          className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        >
          <span>{isUpdating ? 'Updating...' : 'Switch Project'}</span>
          <ChevronDownIcon className={`w-5 h-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {error && (
          <div className="mt-2 text-sm text-red-600">
            Error: {error}
          </div>
        )}
        
        {isOpen && (
          <div className="absolute right-0 z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {allProjects && allProjects.map((project) => {
              const projectId = getProjectId(project);
              const selectedId = getProjectId(selected);
              
              return (
                <div
                  key={projectId || Math.random().toString()}
                  onClick={() => handleSelect(project)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                >
                  <span>{project.name}</span>
                  {projectId === selectedId && (
                    <span className="text-blue-600">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentProject;