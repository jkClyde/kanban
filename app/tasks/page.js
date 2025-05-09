// File: app/projects/page.js
// This is the main server component that fetches data

import connectDB from "@/config/database"
import Task from "@/models/Tasks"
import Project from "@/models/Project"
import TasksTable from "@/components/Tasks/TasksTable"
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  title: 'Tasks',
  description: 'View and manage your projects'
}

async function getTasks() {
  await connectDB()

    // Get user session
    const session = await getServerSession(authOptions);
  
    // Fetch projects owned by the current user
    const currentUser = await User.findOne({ email: session.user.email }).lean();
    const projects = await Project.find({ owner: currentUser._id }).lean();

     // Extract project IDs for task filtering
     const projectIds = projects.map(project => project._id);

  return await Task.find({ projectId: { $in: projectIds }}).lean()
}

export default async function ProjectsPage() {
  // Fetch data on the server
  const tasks = await getTasks()
  const projects = await Project.find({}).lean()
  
  return (
    <div className="w-full h-full mx-auto  bg-gray-100 py-4 md:py-8 p-3 md:p-8 rounded-xl">
      <h1 className="text-2xl font-bold text-header mb-4">Tasks</h1>
      <TasksTable tasks={tasks} projects={projects} />
    </div>
  )
}