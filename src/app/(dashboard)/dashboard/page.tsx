import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();
  if (!session) {
    return;
  }
  const role = session.user.role;

  if (session.user) {
    if (role === "ADMIN" || role === "SUPERADMIN") {
      return redirect("/dashboard/admin");
    } else {
      return redirect(`/dashboard/${role.toLowerCase()}`);
    }
  }
  return <div>page</div>;
};

export default page;
