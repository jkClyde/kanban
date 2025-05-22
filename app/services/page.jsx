import connectDB from "@/config/database"
import Service from "@/models/Services";  
import ServicesPage from "./ServicePage";

export const metadata = {
  title: 'Services',
  description: 'View and manage your projects'
}

async function getProjects() {
  await connectDB()
  return await Service.find({}).sort({ createdAt: -1 }).lean();
}

export default async function Services() {
  const services = await getProjects()
  
  return (
    <div className="w-full h-full mx-auto  bg-gray-100 py-4 md:py-8 p-3 md:p-8 rounded-xl">
      <ServicesPage services={services} />
    </div>
  )
}