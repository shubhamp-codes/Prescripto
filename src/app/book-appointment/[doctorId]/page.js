import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import BookingUI from "./BookingUI";

export default async function BookAppointmentPage({ params }) {
  const { doctorId } = await params;

  const session = await getServerSession(authOptions);

  const patient = await prisma.patient.findUnique({
    where: { patientId: session.user.id },
    include: { user: true },
  });

  if (!patient || !patient.dob) {
    redirect(`/signup/onboarding`);
  }

  const today = new Date();
  const birthDate = new Date(patient.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const doctor = await prisma.doctor.findUnique({
    where: { doctorId },
    include: {
      user: true,
      speciality: true,
      schedules: true,
      unavailability: true,
    },
  });

  if (!doctor) {
    return (
      <div className="text-center p-10 text-xl font-bold text-red-500">
        Doctor not found.
      </div>
    );
  }

  return <BookingUI doctor={doctor} patient={{ ...patient, age }} />;
}
