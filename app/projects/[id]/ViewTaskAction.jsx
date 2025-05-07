'use client'

import { useState } from "react";
import { FaEye } from "react-icons/fa";
import TaskModal from "@/components/Tasks/TaskModal";
import deleteTask from "@/app/actions/deleteTask";
import { useToast } from "@/components/ToastProvider";
import { useRouter } from "next/navigation";

const ViewTaskAction = ({ task, project, getProject,  }) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast(); 
  const router = useRouter();



  const openTaskModal = () => {
    setIsModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTask(task._id);
      
      if (result.success) {
        router.refresh();
        showToast('Task deleted successfully', 'error');

      } else {
        console.error('Failed to delete project:', result.error);
        showToast('Failed to delete project. Please try again.', 'error');
      }

    } catch (error) {
      console.error('Error deleting project:', error);
      showToast('An error occurred while deleting the project.', 'error');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
    <div className="flex gap-3">
      <button 
          onClick={openTaskModal}
          className="text-purple_bg hover:text-indigo-900 focus:outline-none"
        >
          <FaEye style={{ fontSize: '24px' }} />
        </button>

        <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
            className="inline-flex items-center px-2 py-2 border border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none"
          >
          <svg className=" h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {/* {isDeleting ? 'Deleting...' : 'Delete'} */}
        </button>
    </div>

      {/* Task Detail Modal */}
      <TaskModal 
        task={task}
        project={project || (task && getProject ? getProject(task.projectId) : null)}
        isOpen={isModalOpen}
        onClose={closeTaskModal}
        showProjectName={false} 
      />

         {/* Delete Confirmation Modal */}
         {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Task</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this task? 
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewTaskAction;