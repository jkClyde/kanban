import UserProfilePage from "@/components/UserProfilePage"
import connectDB from "@/config/database";
import User from "@/models/User";

// Dummy user matching the provided schema
const dummyUser = {
    email: 'john.doe@example.com',
    username: 'johndoe',
    image: '/api/placeholder/100/100',
    bookmarks: ['1', '3'], // IDs of bookmarked projects
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-04-22')
  };

const page = async () => {
  await connectDB();
  const user = await User.find({}).lean();
  
  return (
    <UserProfilePage userData={user[0]} />

  )
}

export default page