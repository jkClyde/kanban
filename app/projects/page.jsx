import connectDB from "@/config/database"
import Project from '@/models/Project'
import User from "@/models/User";
import Service from "@/models/Services";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";



import ProjectsList from './ProjectList'

export const metadata = {
  title: 'Projects',
  description: 'View and manage your projects'
}

async function getProjects() {
  await connectDB()
  const session = await getServerSession(authOptions);
  const currentUser = await User.findOne({ email: session.user.email }).lean();
  return await  Project.find({ owner: currentUser._id }).lean();
}

async function getServices(){
  await connectDB()
  const session = await getServerSession(authOptions);
  const currentUser = await User.findOne({ email: session.user.email }).lean();
  return await  Service.find({ owner: currentUser._id }).lean();

}

export default async function ProjectsPage() {
  // Fetch data on the server
  const projects = await getProjects()
  const services = await getServices()

  
  return (
    <div className="w-full h-full mx-auto  bg-gray-100 py-4 md:py-8 p-3 md:p-8 rounded-xl">
      <ProjectsList initialProjects={projects} services={services}/>
    </div>
  )
}