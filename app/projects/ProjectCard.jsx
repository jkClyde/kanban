'use client'
// File: components/projects/ProjectCard.js

import Link from "next/link"

export default function ProjectCard({ project, activeTagFilter }) {
  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green_bg text-white'
      case 'In Progress': return 'bg-yellow-500 text-white'
      case 'Planning': return 'bg-blue_bg text-white'
      case 'On Hold': return 'bg-purple_bg text-white'
      case 'Canceled': return 'bg-red_bg text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <Link href={`/projects/${project._id}`} className="block w-full hover:shadow-md transition-shadow">
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:border-blue-300">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h2 className="text-xl text-header font-semibold">{project.name}</h2>
          <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
        
        <p className="text-header mt-2 line-clamp-2">{project.description}</p>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-header mb-1">
            <span>Completion:</span>
            <span className="font-medium">{project.completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`${project.completion >= 100 ? 'bg-green_bg' : 'bg-blue_bg'} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${project.completion}%` }}
            ></div>
          </div>
        </div>
        
        {project.tags && project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span 
                key={index} 
                className={`px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 ${
                  activeTagFilter === tag ? 'ring-2 ring-blue_bg' : ''
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}