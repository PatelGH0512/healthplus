import { redirect } from "next/navigation";

import ProfileForm from "@/components/forms/ProfileForm";
import { Navigation } from "@/components/Navigation";
import { getPatient, getUser } from "@/lib/actions/patient.actions";

const Profile = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);
  const patient = await getPatient(userId);

  if (!patient) {
    redirect(`/patients/${userId}/register`);
  }

  return (
    <div className="ml-5 flex h-screen max-h-screen flex-col">
      <Navigation userId={userId} />

      <section className="remove-scrollbar container flex-1">
        <div className="sub-container max-w-[860px] flex-1 py-12">
          <div className="mb-8">
            <h1 className="text-dark-900 mb-2 text-3xl font-bold">
              My Profile
            </h1>
            <p className="text-dark-700">
              Manage your personal and medical information
            </p>
          </div>

          <ProfileForm patient={patient} />
        </div>
      </section>

      <footer>
        <div className="copyright mt-10 items-center justify-center py-12">
          © 2024 HealthPlus
        </div>
      </footer>
    </div>
  );
};

export default Profile;
