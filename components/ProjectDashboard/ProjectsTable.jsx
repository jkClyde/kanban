export default function ProjectsTable({ projects, filteredProjects }) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                {projects.some(p => p.team) && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                )}
                {projects.some(p => p.startDate) && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                )}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500">{project.description}</div>
                        {project.tags && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.tags.map((tag, index) => (
                              <span key={index} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      project.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      project.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'On Hold' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">{project.completion || 0}%</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (project.completion || 0) >= 90 ? 'bg-green-500' :
                            (project.completion || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${project.completion || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {project.budget ? (
                      <>
                        <div className="text-sm text-gray-900">
                          ${(project.spent || 0).toLocaleString()} / ${project.budget.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {project.budget > 0 ? Math.round(((project.spent || 0) / project.budget) * 100) : 0}% used
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Not specified</span>
                    )}
                  </td>
                  {projects.some(p => p.team) && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.team && project.team.length > 0 ? (
                        <div className="flex -space-x-2">
                          {project.team.map((member, index) => (
                            <div key={index} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center">
                              <span className="text-xs font-medium text-indigo-800">
                                {typeof member === 'string' ? member.charAt(0) : index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No team assigned</span>
                      )}
                    </td>
                  )}
                  {projects.some(p => p.startDate) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.startDate ? (
                        <>
                          <div>Start: {new Date(project.startDate).toLocaleDateString()}</div>
                          {project.endDate && (
                            <div>End: {new Date(project.endDate).toLocaleDateString()}</div>
                          )}
                        </>
                      ) : (
                        <span>No dates specified</span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
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
      </div>
    );
  }