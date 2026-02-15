import { ArrowRight } from "lucide-react";
import Image from "next/image";
import groupProfileSrc from "@/assets/images/group_profiles.png";
import doctorTeamSrc from "@/assets/images/doctors_team.png"
import Link from "next/link";
const BookAppointmentCard = () => {
  return (
    <div className="w-[80%] h-auto bg-blue-600 flex items-center flex-col rounded-2xl text-white px-3">
      <h1 className="flex flex-col text-3xl items-center font-bold ">
        <span className="py-3 text-center">Book Appointment</span>
        <span className="pb-3 text-center">with Trusted Doctors</span>
      </h1>
      <Image
        src={groupProfileSrc}
        alt="Trusted by patients"
        className="py-3 w-28"
      />
      <span className=" text-sm py-3 text-center">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </span>
      <Link
        href="/book-appointment"
        className=" bg-white text-gray-800 my-3 py-3 px-5 rounded-2xl flex gap-2 hover:-translate-y-1 duration-300 shadow-lg "
      >
        Book appointment <ArrowRight className="w-5 pt-0.5" />
      </Link>
      <Image
        src={doctorTeamSrc}
        alt="Team of doctors"
        className="pt-4 w-full"
      />
    </div>
  );
};

export default BookAppointmentCard;
