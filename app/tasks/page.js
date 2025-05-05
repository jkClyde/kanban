// File: app/projects/page.js
// This is the main server component that fetches data

import connectDB from "@/config/database"
import Task from "@/models/Tasks"
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
  
  return (
    <div className="w-full h-full mx-auto px-4 md:px-8 py-8 bg-white">
      <TasksTable tasks={tasks} />
    </div>
  )
}