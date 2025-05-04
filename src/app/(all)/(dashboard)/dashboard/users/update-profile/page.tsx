import { auth } from "@/auth";
import { getUserById } from "@/lib/data";
import UpdateProfileForm from "../../_components/UpdateProfileForm";

const UpdateProfile = async () => {
  const session = await auth();
  const currentUser = await getUserById(session?.user.id!);

  return (
    <div className="p-4 px-16">
      <h1 className="text-2xl py-4">Update Profile</h1>
      <UpdateProfileForm user={currentUser!} />
    </div>
  );
};

export default UpdateProfile;
