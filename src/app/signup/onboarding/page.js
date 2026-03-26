import OnboardingForm from "./onboardingForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
const Onboarding = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }
  const id = session.user.id;
  const existingPatient = await prisma.patient.findUnique({
    where: { patientId: id },
  });
  if (existingPatient?.dob) {
    redirect("/dashboard/patient");
  }
  return <OnboardingForm />;
};

export default Onboarding;
