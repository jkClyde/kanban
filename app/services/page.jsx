import connectDB from "@/config/database"
import Service from "@/models/Services";  // This is your Service model

import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import ServicesPage from "./ServicePage";

export const metadata = {
  title: 'Services',
  description: 'View and manage your projects'
}

async function getProjects() {
  await connectDB()

  // Get user session
  // const session = await getServerSession(authOptions);

  // Fetch projects owned by the current user
  // const currentUser = await User.findOne({}).lean();

  return await Service.find({}).sort({ createdAt: -1 }).lean();
}

// Rename the component to avoid naming conflict
export default async function Services() {
  // Fetch data on the server
  const services = await getProjects()
  
  return (
    <div className="w-full h-full mx-auto  bg-gray-100 py-4 md:py-8 p-3 md:p-8 rounded-xl">
      <ServicesPage services={services} />
    </div>
  )
}