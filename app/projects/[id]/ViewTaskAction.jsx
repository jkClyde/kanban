'use client'

import { useState } from "react";
import { FaEye } from "react-icons/fa";
import TaskModal from "@/components/Tasks/TaskModal";

const ViewTaskAction = ({ task, project, getProject }) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle opening the task modal
  const openTaskModal = () => {
    setIsModalOpen(true);
  };

  // Handle closing the task modal
  const closeTaskModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button 
        onClick={openTaskModal}
        className="text-purple_bg hover:text-indigo-900 focus:outline-none"
      >
        <FaEye style={{ fontSize: '24px' }} />
      </button>

      {/* Task Detail Modal */}
      <TaskModal 
        task={task}
        project={project || (task && getProject ? getProject(task.projectId) : null)}
        isOpen={isModalOpen}
        onClose={closeTaskModal}
        showProjectName={false} 
      />
    </>
  );
};

export default ViewTaskAction;