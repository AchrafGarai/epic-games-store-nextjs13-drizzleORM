import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div className="w-full flex justify-center items-center py-12">
    <UserProfile path="/user-profile" routing="path" />
  </div>
);

export default UserProfilePage;
