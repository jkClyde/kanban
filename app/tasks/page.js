// File: app/projects/page.js
// This is the main server component that fetches data

import connectDB from "@/config/database"
import Task from "@/models/Tasks"
import Project from "@/models/Project"
import TasksTable from "@/components/Tasks/TasksTable"

export const metadata = {
  title: 'Tasks',
  description: 'View and manage your projects'
}

async function getTasks() {
  await connectDB()
  return await Task.find({}).lean()
}

export default async function ProjectsPage() {
  // Fetch data on the server
  const tasks = await getTasks()
  const projects = await Project.find({}).lean()
  
  return (
    <div className="w-full h-full mx-auto  bg-gray-100 py-4 md:py-0 p-3 md:p-8 rounded-xl">
      <TasksTable tasks={tasks} projects={projects} />
    </div>
  )
}