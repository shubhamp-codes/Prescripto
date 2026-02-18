import Image from "next/image"
const FindBySpecialityCard = () => {
    let specialities=["Physician","Gynecologist","Dermatologist","Pediatrician","Neurologist","Gastroenterologist"]
  return (
    <div className=" flex flex-col items-center">
      <h2 className="text-2xl font-semibold pb-5">Find by Speciality</h2>
      <div className="w-[80vw] overflow-auto flex scroll no-scrollbar">
        <div className="flex gap-4 m-auto">
          {specialities.map((speciality) => {
            return (
              <div
                key={speciality}
                className="h-28 w-28 min-w-28 flex flex-col items-center"
              >
                <Image
                  src={`/images-specialities/${speciality}.svg`}
                  width={80}
                  height={80}
                  alt={speciality}
                />
                <h3>{speciality}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FindBySpecialityCard
