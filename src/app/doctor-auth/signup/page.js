import prisma from "@/lib/prisma";
import DoctorSignupForm from "./DoctorSignupForm";

export default async function DoctorSignupPage() {
  // Fetch specialities to populate the dropdown
  const specialities = await prisma.speciality.findMany({
    orderBy: { name: "asc" },
  });

  return <DoctorSignupForm specialities={specialities} />;
}
