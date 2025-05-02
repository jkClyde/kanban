'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditProjectModal from '@/components/ProjectDashboard/UpdateProjectForm';

export default function ProjectActions({ project }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setIsDeleting(true);
      
      try {
        const res = await fetch(`/api/projects/${project._id}`, {
          method: 'DELETE',
        });
        
        if (res.ok) {
          router.push('/projects');
          router.refresh();
        } else {
          const data = await res.json();
          console.error('Failed to delete project:', data.message);
          alert('Failed to delete project. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('An error occurred while deleting the project.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none"
        >
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {/* Edit Project Modal */}
      <EditProjectModal 
        project={project} 
        isOpen={isEditModalOpen} 
        setIsOpen={setIsEditModalOpen} 
      />
    </>
  );
}