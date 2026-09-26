import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.upsert({
      where: { email: "admin@prescripto.com" },
      update: {},
      create: {
        name: "System Admin",
        email: "admin@prescripto.com",
        password: hashedPassword,
        userType: "admin",
      },
    });

    return NextResponse.json({
      message: "Admin created successfully!",
      email: admin.email,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
