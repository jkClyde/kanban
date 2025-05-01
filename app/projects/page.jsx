'use server'
import connectDB from "@/config/database"
import Project from '@/models/Project'
import Link from "next/link"

export const Projects = async () => { 
  await connectDB();
  
  // Fetch projects from the database
  const projects = await Project.find({}).lean();
  
  return (
    <div className="w-full mx-auto px-8 py-8 back bg-white">
      <h1 className="text-2xl font-bold mb-6 text-header">Projects</h1>
      
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Link key={project._id} href={`/projects/${project._id}`} className="w-full">
                <div  className="bg-white p-4 rounded-lg shadow-lg border-solid border-header">
              <div className="flex justify-between">
                <h2 className="text-xl  text-header font-semibold">{project.name}</h2>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === 'Completed' ? 'bg-green_bg text-green-100' : 
                  project.status === 'In Progress' ? 'bg-yellow_bg text-yellow-100' :
                  project.status === 'Planning' ? 'bg-blue_bg text-blue-100' :
                  project.status === 'On Hold' ? 'bg-purple_bg text-purple-100' :
                  'bg-red-100 text-red-800'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <p className="text-header mt-2">{project.description}</p>
              
              <div className="mt-4">
                <div className="text-sm text-header">Completion: {project.completion}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue_bg h-2 rounded-full" 
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
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects