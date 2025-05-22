'use client'

import { useState } from 'react';
import { Globe, Calendar, Mail } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';




export default function UserProfilePage({ userData , userProjects }) {
  const [activeTab, setActiveTab] = useState('projects');
  
 
  
  return (
    <div className="bg-gray-100 min-h-screen pb-10 w-full rounded-[15px]">
      {/* Header */}
      <div className="bg-sidebar h-16 md:h-32"></div>
      
      {/* User Info Card */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <img 
                  className="h-24 w-24 rounded-full border-4 border-white" 
                  src={userData.image} 
                  alt={userData.username} 
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-xl font-bold text-gray-900">@{userData.username}</h1>
                <div className="flex items-center justify-center sm:justify-ce mt-2 text-gray-500">
                  <Mail size={16} className="mr-1" />
                  <span className="text-sm">{userData.email}</span>
                </div>
                {/* <div className="flex items-center justify-center sm:justify-start mt-1 text-gray-500">
                  <Bookmark size={16} className="mr-1" />
                  <span className="text-sm">{userData.bookmarks.length} bookmarks</span>
                </div> */}
              </div>
            </div>
            
            {/* Navigation */}
            <div className="mt-6 border-t border-gray-200">
              <div className="flex justify-center md:justify-start space-x-8 mt-4">
                <button 
                  className={`${
                    activeTab === 'projects' 
                      ? 'border-blue_bg text-blue_bg' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('projects')}
                >
                  Projects
                </button>
                {/* <button 
                  className={`${
                    activeTab === 'bookmarks' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('bookmarks')}
                >
                  Bookmarks
                </button> */}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="mt-8">
          {activeTab === 'projects' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">All Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'bookmarks' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Bookmarked Projects</h2>
              {bookmarkedProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No bookmarked projects yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {project.status}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{project.description}</p>

        <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-2">
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
            Priority: {project.priority}
          </span>
          {project.tags?.length > 0 && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              Tags: {project.tags.join(', ')}
            </span>
          )}
        </div>

        <div className="mt-3 text-xs text-gray-500 space-y-1">
          {project.domain && (
            <div className="flex items-center gap-2">
              <Globe size={14} /> <a href={project.domain} className="hover:underline">{project.domain}</a>
            </div>
          )}
          {project.gitRepo && (
            <div className="flex items-center gap-2">
              <Github size={14} /> <a href={project.gitRepo} className="hover:underline">{project.gitRepo}</a>
            </div>
          )}
          {project.startDate && (
            <div className="flex items-center gap-2">
              <Calendar size={14} /> Start: {moment(project.startDate).format('MMM D, YYYY')}
            </div>
          )}
          {project.targetEndDate && (
            <div className="flex items-center gap-2">
              <Calendar size={14} /> Target End: {moment(project.targetEndDate).format('MMM D, YYYY')}
            </div>
          )}
          {project.actualEndDate && (
            <div className="flex items-center gap-2">
              <Calendar size={14} /> Ended: {moment(project.actualEndDate).format('MMM D, YYYY')}
            </div>
          )}
        </div>
        

      <Link href={`/projects/${project._id}`}>
        <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded text-sm transition-colors duration-300">
          View Details
        </button>
      </Link>

      </div>
    </div>
  );
}