'use server'
import connectDB from "@/config/database"
import Project from '@/models/Project'
import Card from "@/models/Card"

export const Projects = async () => { 
  await connectDB();
  
  // Fetch projects from the database
  const projects = await Project.find({}).lean();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project._id} className="bg-[#303030] p-4 rounded-lg shadow">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">{project.name}</h2>
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
              
              <p className="text-white mt-2">{project.description}</p>
              
              <div className="mt-4">
                <div className="text-sm text-white">Completion: {project.completion}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${project.completion}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags && project.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 px-2.5 py-0.5 rounded-full text-xs text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects