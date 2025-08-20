import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { Navigation } from "@/components/Navigation";
import { getPatient } from "@/lib/actions/patient.actions";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  return (
    <div className="ml-5 flex h-screen max-h-screen flex-col">
      <Navigation userId={userId} />

      <section className="remove-scrollbar container flex-1">
        <div className="sub-container max-w-[860px] flex-1 justify-between py-12">
          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
            type="create"
          />
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

export default Appointment;
