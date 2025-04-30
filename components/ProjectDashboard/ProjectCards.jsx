export default function ProjectCards({ filteredProjects }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? filteredProjects.map((project) => (
          <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                  project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  project.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'On Hold' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <p className="text-gray-600 mt-2">{project.description}</p>
              
              <div className="mt-4">
                <div className="text-sm text-gray-600 flex justify-between mb-1">
                  <span>Completion: {project.completion || 0}%</span>
                  {project.tasks && (
                    <span>{project.completedTasks || 0}/{project.tasks} tasks</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (project.completion || 0) >= 90 ? 'bg-green-500' :
                      (project.completion || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${project.completion || 0}%` }}
                  ></div>
                </div>
              </div>
              
              {(project.budget || project.startDate) && (
                <div className="mt-4 flex justify-between text-sm">
                  {project.budget && (
                    <>
                      <div>
                        <div className="text-gray-500">Budget</div>
                        <div className="font-medium">${project.budget.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Spent</div>
                        <div className="font-medium">${(project.spent || 0).toLocaleString()}</div>
                      </div>
                    </>
                  )}
                  {project.startDate && (
                    <div>
                      <div className="text-gray-500">Timeline</div>
                      <div className="font-medium">
                        {new Date(project.startDate).toLocaleDateString().split('/').slice(0, 2).join('/')}
                        {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString().split('/').slice(0, 2).join('/')}`}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {project.tags && project.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 px-2.5 py-0.5 rounded-full text-xs text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="mt-6 flex justify-between items-center">
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
                  <div></div>
                )}
                
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Details
                  </button>
                  <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-3 bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No projects found matching your criteria</p>
          </div>
        )}
      </div>
    );
  }