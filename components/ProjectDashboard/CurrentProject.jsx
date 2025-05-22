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

  const getProjectId = (project) => {
    if (!project) return '';
    return (
      project.project_id ||
      (project._id ? project._id.toString?.() : '') ||
      (project.id ? project.id.toString?.() : '')
    );
  };

  // ✅ Effect: clear selected project if it's been deleted
  useEffect(() => {
    const selectedId = getProjectId(selected);
    const exists = allProjects?.some((proj) => getProjectId(proj) === selectedId);
    if (!exists) {
      setSelected(null);
    }
  }, [allProjects]);

  const handleSelect = async (project) => {
    setIsUpdating(true);
    setError(null);

    try {
      const projectId = getProjectId(project);
      if (!projectId) throw new Error('Invalid project ID');

      const formData = new FormData();
      formData.append('name', project.name);
      formData.append('project_id', projectId);

      const result = await updateCurrent(formData);
      if (!result.success) throw new Error(result.error || 'Failed to update current project');

      setSelected({ ...project, project_id: projectId });
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating current project:', error);
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const selectedId = getProjectId(selected);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-indigo-100 to-blue-50 p-5 rounded-xl shadow-sm mb-[15px] md:mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue_bg w-2 h-14 rounded-full hidden md:block"></div>
        <div className="flex flex-col gap-1">
          <p className="text-gray-600 text-sm">Currently Working on</p>

          {selectedId ? (
            <Link href={`/projects/${selectedId}`} className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-header">{selected?.name || 'Unnamed Project'}</h1>
            </Link>
          ) : (
            <h1 className="text-2xl font-bold text-header text-gray-400 italic">No project selected</h1>
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
            {allProjects?.length > 0 ? (
              allProjects.map((project) => {
                const projectId = getProjectId(project);
                return (
                  <div
                    key={projectId}
                    onClick={() => handleSelect(project)}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                  >
                    <span>{project.name}</span>
                    {projectId === selectedId && <span className="text-blue-600">✓</span>}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400">No projects available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentProject;
