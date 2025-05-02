import { FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function ProjectsTable({ projects, filteredProjects }) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(10);
  
  // Get current projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const rawTagColors = [
    { name: "WordPress", color: "#21759B" },
    { name: "Next.js", color: "#000000" },
    { name: "React", color: "#61DAFB" },
    { name: "Laravel", color: "#FF2D20" },
    { name: "Static Website", color: "#A0AEC0" },
    { name: "GoHighLevel", color: "#F6A609" },
    { name: "E-Commerce", color: "#38B2AC" },
    { name: "Mobile Development - React Native", color: "#61DAFB" },
    { name: "PHP", color: "#777BB4" },
    { name: "JavaScript", color: "#F7DF1E" }
  ];
  
  // Create a normalized map for matching
  const tagColors = rawTagColors.reduce((acc, tag) => {
    acc[tag.name.toLowerCase()] = tag.color;
    return acc;
  }, {});
  
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  
  // Reset to first page when filteredProjects changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProjects]);
  
  // Reference for table container
  const tableRef = useRef(null);
  
  // Page change handler with smooth scroll to top of table
  const paginate = (pageNumber) => {
    // Ensure page number is within valid range
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      
      // Smooth scroll to the top of the table
      if (tableRef.current) {
        tableRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <div ref={tableRef} className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-sidebar text-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Project</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Priority</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Completion</th>
              {projects.some(p => p.startDate) && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Timeline</th>
              )}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          {/* Contents */}
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProjects.length > 0 ? currentProjects.map((project) => (
              <tr key={project._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {project.tags.map((tag, index) => {
                          const tagKey = tag.toLowerCase().trim();
                          const bgColor = tagColors[tagKey] || "#E2E8F0";
                          const isDarkBg = ["#000000", "#21759B", "#777BB4"].includes(bgColor);
                          const textColor = isDarkBg ? "#FFFFFF" : "#000000";

                          return (
                            <span
                              key={index}
                              style={{ backgroundColor: bgColor, color: textColor }}
                              className="px-2 py-0.5 rounded-[5px] text-xs font-medium"
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>

                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-[5px] ${
                    project.status === 'Completed' ? 'bg-green_bg text-green-100' : 
                    project.status === 'In Progress' ? 'bg-yellow_bg text-yellow-100' :
                    project.status === 'Planning' ? 'bg-blue_bg text-blue-100' :
                    project.status === 'On Hold' ? 'bg-purple_bg text-purple-100' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-[5px] ${
                      project.priority === 'High' ? 'bg-red_bg text-red-100' : 
                      project.priority === 'Medium' ? 'bg-yellow_bg text-yellow-100' :
                      project.priority === 'Low' ? 'bg-blue_bg text-blue-100' :
                      project.priority === 'Normal' ? 'bg-purple_bg text-purple-100' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {project.priority}
                    </span>
                </td>

              
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 mr-2">{project.completion || 0}%</span>
                    <div className="w-24 bg-gray-200 rounded-[5px] h-2">
                      <div 
                        className={`h-2 rounded-[5px] ${
                          (project.completion || 0) >= 90 ? 'bg-green_bg' :
                          (project.completion || 0) >= 50 ? 'bg-yellow_bg' : 'bg-red_bg'
                        }`}
                        style={{ width: `${project.completion || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
         
           
                {projects.some(p => p.startDate) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.startDate ? (
                      <>
                        <div className="font-bold">Start: <span className="font-normal"> {new Date(project.startDate).toLocaleDateString()}</span></div>
                        {project.targetEndDate && (
                          <div className="font-bold">Target: <span className="font-normal">{new Date(project.targetEndDate).toLocaleDateString()}</span></div>
                        )}
                        
                        {project.endDate && (
                          <div>End: {new Date(project.endDate).toLocaleDateString()}</div>
                        )}
                      </>
                    ) : (
                      <span>No dates specified</span>
                    )}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <Link href={`/projects/${project._id}`} className="text-purple_bg hover:text-indigo-900 "><FaEye style={{ fontSize: '24px' }} /></Link>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No projects found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredProjects.length > 0 && (
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-sidebar">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white">
                Showing <span className="font-medium">{indexOfFirstProject + 1}</span> to{" "}
                <span className="font-medium">
                  {indexOfLastProject > filteredProjects.length ? filteredProjects.length : indexOfLastProject}
                </span>{" "}
                of <span className="font-medium">{filteredProjects.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {/* Page Numbers */}
                {[...Array(totalPages).keys()].map(number => {
                  // For larger page sets, show limited page numbers with ellipsis
                  if (totalPages <= 7 || 
                      number === 0 || 
                      number === totalPages - 1 || 
                      Math.abs(currentPage - (number + 1)) <= 1) {
                    return (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number + 1
                            ? 'z-10 bg-indigo-50 border-purple_bg text-purple_bg'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {number + 1}
                      </button>
                    );
                  } else if (
                    (currentPage < 5 && number === 5) || 
                    (currentPage > totalPages - 4 && number === totalPages - 6) ||
                    (currentPage >= 5 && currentPage <= totalPages - 4 && (number === currentPage - 3 || number === currentPage + 1))
                  ) {
                    return (
                      <span
                        key={number + 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}