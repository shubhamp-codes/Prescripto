import prisma from "@/lib/prisma";
import Link from "next/link";
import { GraduationCap, MapPin } from "lucide-react";

export default async function AllDoctors() {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      speciality: true,
    }
  });

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Trusted Doctors</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.doctorId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
              
              <div className="h-48 bg-blue-50 flex items-center justify-center border-b border-gray-100">
                {doctor.user.image ? (
                   <img src={doctor.user.image} alt={doctor.user.name} className="h-full w-full object-cover" />
                ) : (
                   <div className="text-4xl font-bold text-blue-300">
                     {doctor.user.name.charAt(0)}
                   </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-green-500 text-xs font-semibold mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Available
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {doctor.user.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4">{doctor.speciality.name}</p>
                
                <div className="mt-auto space-y-2 mb-4 text-sm text-gray-600">
                  <p className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-gray-400" /> {doctor.experience} Years Exp.</p>
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {doctor.city}</p>
                </div>

                <Link 
                  href={`/book-appointment/${doctor.doctorId}`}
                  className="w-full block text-center py-2.5 rounded-lg border border-blue-200 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
