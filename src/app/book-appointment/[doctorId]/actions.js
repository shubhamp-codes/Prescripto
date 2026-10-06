"use server";

import prisma from "@/lib/prisma";

export async function getAvailableSlots(doctorId, dateString) {
  const selectedDate = new Date(dateString);
  const dayOfWeek = selectedDate.getDay(); // 0 (Sun) to 6 (Sat)

  // 1. Check if Doctor works on this day
  const schedule = await prisma.doctorSchedule.findUnique({
    where: {
      doctorId_dayOfWeek: {
        doctorId,
        dayOfWeek,
      },
    },
  });

  if (!schedule) {
    return []; // Doctor does not work on this day
  }

  // 2. Generate all 30-min slots based on schedule
  const [startHour, startMin] = schedule.startTime.split(":").map(Number);
  const [endHour, endMin] = schedule.endTime.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = endHour * 60 + endMin;

  let possibleSlots = [];
  for (let mins = startTotalMinutes; mins < endTotalMinutes; mins += 30) {
    const h = Math.floor(mins / 60).toString().padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    possibleSlots.push(`${h}:${m}`);
  }

  // 3. Fetch existing appointments for that specific day
  // We compare the date string directly or use date bounds
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      timeSlot: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        not: "cancelled", // Can't book over active appointments
      },
    },
  });

  // Extract the time strings ("HH:MM") of existing appointments
  const bookedTimes = existingAppointments.map((app) => {
    const d = new Date(app.timeSlot);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  });

  // 4. Fetch Unavailability blocks (Leaves/Breaks) for that day
  const unavailabilities = await prisma.doctorUnavailability.findMany({
    where: {
      doctorId,
      startTime: { lte: endOfDay },
      endTime: { gte: startOfDay },
    },
  });

  // 5. Filter the possible slots
  const availableSlots = possibleSlots.filter((slotTime) => {
    // 5a. If it's already booked, filter it out
    if (bookedTimes.includes(slotTime)) return false;

    // 5b. Check if it falls inside an unavailability block
    const [slotHour, slotMin] = slotTime.split(":").map(Number);
    const slotDateObj = new Date(selectedDate);
    slotDateObj.setHours(slotHour, slotMin, 0, 0);

    for (let block of unavailabilities) {
      if (slotDateObj >= new Date(block.startTime) && slotDateObj < new Date(block.endTime)) {
        return false;
      }
    }

    // 5c. Prevent booking in the past if it's today
    if (slotDateObj < new Date()) {
      return false;
    }

    return true;
  });

  return availableSlots;
}

export async function createAppointment(doctorId, patientId, dateTimeString) {
    // Basic server validation could go here
    const timeSlot = new Date(dateTimeString);
    
    // Create the appointment
    const appointment = await prisma.appointment.create({
        data: {
            doctorId,
            patientId,
            timeSlot,
            status: "pending"
        }
    });

    return { success: true, appointmentId: appointment.appointmentId };
}
