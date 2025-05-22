import Project from "@/models/Project";
import Service from "@/models/Services";
import Current from "@/models/Current";
import Task from "@/models/Tasks";
import connectDB from "@/config/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProjectDashboard } from "@/components/ProjectDashboard/ProjectDashboard";
import User from "@/models/User";

// This disables caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const page = async () => {
  await connectDB();
  
  // Get user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>Please log in to view your projects</div>;
  }

  // Fetch projects owned by the current user
  const currentUser = await User.findOne({ email: session.user.email }).lean();
  const projects = await Project.find({ owner: currentUser._id }).lean();
  const projectIds = projects.map(project => project._id);
  const services = await Service.find({}).lean();
  const tasks = await Task.find({ status: "To Do", projectId: { $in: projectIds } }).lean();
  const currentProject = await Current.find({}).lean();
  const sanitizedProjects = JSON.parse(JSON.stringify(projects));

  return (
    <ProjectDashboard 
      initialProjects={sanitizedProjects} 
      services={services} 
      currentProject={currentProject} 
      tasks={tasks}
    />
  );
}

export default page;