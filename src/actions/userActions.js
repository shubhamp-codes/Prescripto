"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
export async function updateUserProfile(phone, dob) {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) {
    return false;
  }
  try {
      const response = await Promise.all([
        prisma.user.update({ where: { id: id }, data: { phone: phone } }),
        prisma.patient.upsert({
          where: { patientId: id },
          update: { dob: new Date(dob) },
          create: { patientId: id, dob: new Date(dob) },
        }),
      ]);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}
