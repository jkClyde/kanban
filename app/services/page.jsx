import connectDB from "@/config/database"
import Service from "@/models/Services";  
import ServicesPage from "./ServicePage";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  title: 'Services',
  description: 'View and manage your projects'
}

async function getProjects() {
  await connectDB()

  const session = await getServerSession(authOptions);

  // Fetch projects owned by the current user
  const currentUser = await User.findOne({ email: session.user.email }).lean();

  return await Service.find({ owner: currentUser._id}).sort({ createdAt: -1 }).lean();
}

export default async function Services() {
  const services = await getProjects()
  
  return (
    <div className="w-full h-full mx-auto  bg-gray-100 py-4 md:py-8 p-3 md:p-8 rounded-xl">
      <ServicesPage services={services} />
    </div>
  )
}