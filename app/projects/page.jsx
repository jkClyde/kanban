// File: app/projects/page.js
// This is the main server component that fetches data

import connectDB from "@/config/database"
import Project from '@/models/Project'
import ProjectsList from './ProjectList'

export const metadata = {
  title: 'Projects',
  description: 'View and manage your projects'
}

async function getProjects() {
  await connectDB()
  return await Project.find({}).lean()
}

export default async function ProjectsPage() {
  // Fetch data on the server
  const projects = await getProjects()
  
  return (
    <div className="w-full h-full mx-auto px-4 md:px-8 py-8 bg-white">
      <ProjectsList initialProjects={projects} />
    </div>
  )
}