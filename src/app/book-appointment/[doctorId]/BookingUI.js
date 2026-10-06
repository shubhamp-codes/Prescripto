"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getAvailableSlots, createAppointment } from "./actions";
import { CheckCircle2, ChevronRight, ChevronLeft, MapPin, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

const BookingUI = ({ doctor, patient }) => {
  const router = useRouter();
  
  // State for Step 1
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // e.g. "10:30"
  
  // State for Form Submission
  const [isBooking, setIsBooking] = useState(false);
  const [success, setSuccess] = useState(false);

  // Generate the next 14 days for the Date Strip
  const next14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  // When date changes, fetch slots!
  useEffect(() => {
    if (!selectedDate) return;
    setSelectedSlot(null); // reset slot
    const fetchSlots = async () => {
      setLoadingSlots(true);
      const dateString = selectedDate.toISOString();
      const slots = await getAvailableSlots(doctor.doctorId, dateString);
      setAvailableSlots(slots);
      setLoadingSlots(false);
    };
    fetchSlots();
  }, [selectedDate, doctor.doctorId]);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot) return;
    setIsBooking(true);
    
    // Combine Date + Time
    const [hours, minutes] = selectedSlot.split(":");
    const finalDateTime = new Date(selectedDate);
    finalDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const result = await createAppointment(doctor.doctorId, patient.patientId, finalDateTime.toISOString());
    if (result.success) {
      setSuccess(true);
      // Wait 2 seconds then redirect to Patient Dashboard
      setTimeout(() => {
        router.push("/dashboard/patient");
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gray-50 p-8">
        <CheckCircle2 className="w-24 h-24 text-green-500 mb-6 animate-bounce" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h1>
        <p className="text-gray-500">Your appointment has been successfully booked.</p>
        <p className="text-sm text-gray-400 mt-4">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Banner (Doctor Info) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full overflow-hidden flex-shrink-0 border-4 border-blue-50">
            {/* If doctor has an image, render it, else placeholder */}
            {doctor.user.image ? (
                <img src={doctor.user.image} alt={doctor.user.name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-blue-200 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    {doctor.user.name.charAt(0)}
                </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{doctor.user.name}</h1>
            <p className="text-blue-600 font-medium flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              {doctor.speciality.name} • {doctor.experience || 0} Years Experience
            </p>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {doctor.city}, {doctor.state}
            </p>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-sm text-gray-500">Consultation Fee</p>
            <p className="text-2xl font-bold text-gray-900">₹{doctor.fee}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Date & Time Picker */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Date Strip */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select a Date</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {next14Days.map((d, idx) => {
                  const isSelected = selectedDate && selectedDate.toDateString() === d.toDateString();
                  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                  const dateNum = d.getDate();
                  const monthName = d.toLocaleDateString('en-US', { month: 'short' });
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(d)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-600 text-white shadow-md transform -translate-y-1' 
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <span className={`text-xs font-medium mb-1 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>{dayName}</span>
                      <span className="text-2xl font-bold">{dateNum}</span>
                      <span className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>{monthName}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[250px]">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Available Slots</h2>
              
              {!selectedDate ? (
                <div className="flex items-center justify-center h-40 text-gray-400">
                  Please select a date to see available slots.
                </div>
              ) : loadingSlots ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-red-400 font-medium bg-red-50 rounded-xl border border-red-100">
                  No slots available on this date.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 px-4 rounded-lg font-medium text-sm transition-all border ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400'
                        }`}
                      >
                        {/* Format to 12-hour AM/PM */}
                        {new Date(`2000-01-01T${slot}:00`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-4">Booking Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Date & Time</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    {selectedDate ? (
                      <>
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        {selectedSlot && (
                           <span className="text-blue-600 font-bold">
                             • {new Date(`2000-01-01T${selectedSlot}:00`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                           </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Not selected yet</span>
                    )}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Patient Details</p>
                    <a href="/dashboard/patient/profile" className="text-xs text-blue-600 hover:underline">Edit Profile</a>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="font-bold text-gray-900 mb-1">{patient.user.name}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                      <p>Age: <span className="font-medium text-gray-900">{patient.age}</span></p>
                      <p>Blood: <span className="font-medium text-gray-900">{patient.bloodGroup || "N/A"}</span></p>
                      <p>Gender: <span className="font-medium text-gray-900 capitalize">{patient.gender || "N/A"}</span></p>
                      <p>Phone: <span className="font-medium text-gray-900">{patient.user.phone || "N/A"}</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <p className="font-medium text-gray-500">Total Fee</p>
                  <p className="text-2xl font-bold text-blue-600">₹{doctor.fee}</p>
                </div>
              </div>

              <button
                disabled={!selectedDate || !selectedSlot || isBooking}
                onClick={handleBookAppointment}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 ${
                  !selectedDate || !selectedSlot 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                    : isBooking
                    ? "bg-blue-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg"
                }`}
              >
                {isBooking ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Confirm & Book <ChevronRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Tiny CSS snippet for custom scrollbar hidden inside component for ease */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
};

export default BookingUI;
