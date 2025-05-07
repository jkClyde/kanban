import UserProfilePage from "@/components/UserProfilePage"

// Dummy user matching the provided schema
const dummyUser = {
    email: 'john.doe@example.com',
    username: 'johndoe',
    image: '/api/placeholder/100/100',
    bookmarks: ['1', '3'], // IDs of bookmarked projects
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-04-22')
  };

const page = () => {
  return (
    <UserProfilePage user={dummyUser} />

  )
}

export default page