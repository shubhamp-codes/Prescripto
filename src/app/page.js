import BookAppointmentCard from "@/components/BookAppointmentCard";
import FindBySpecialityCard from "@/components/FindBySpecialityCard";
export default function Home() {
  return (
    <div className="flex items-center pt-8 flex-col gap-10">
      <BookAppointmentCard/>
      <FindBySpecialityCard/>
    </div>
  );
}
