import UserProfilePage from "@/components/UserProfilePage"
import connectDB from "@/config/database";
import User from "@/models/User";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const page = async () => {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  const currentUser = await User.findOne({ email: session.user.email }).lean();
  const userProjects = await Project.find({ owner: currentUser._id}).sort({ createdAt: -1 }).lean();
  
  return (
    <UserProfilePage userData={currentUser} userProjects={userProjects}/>

  )
}

export default page