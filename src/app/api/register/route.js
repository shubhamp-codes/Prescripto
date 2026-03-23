import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
export async function POST(req) {
  try {
    const user = await req.json();
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }
    let validSpeciality = null;
    if (user.userType === "doctor") {
      validSpeciality = await prisma.speciality.findUnique({
        where: { name: user.speciality },
      });

      if (!validSpeciality) {
        return NextResponse.json(
          { message: "Invalid speciality provided." },
          { status: 400 }, 
        );
      }
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = await prisma.user.create({
      data: {
        userType: user.userType,
        email: user.email,
        password: hashedPassword,
        name: user.name,
        phone: user.phone || null,
      },
    });
    switch (user.userType) {
      case "patient":
        const newPatient = await prisma.patient.create({
          data: {
            patientId: newUser.id,
            dob: new Date(user.dob),
          },
        });
        break;
      case "doctor":
        const newDoctor = await prisma.doctor.create({
          data: {
            doctorId: newUser.id,
            specialityId: validSpeciality.specialityId,
            qualification: user.qualification || null,
            fee: parseInt(user.fee),
            state: user.state,
            city: user.city,
            address: user.address,
          },
        });
        break;

      default:
        break;
    }
    return NextResponse.json({ message: "new user created!" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "failed to create new user!",
      },
      { status: 500 },
    );
  }
}
