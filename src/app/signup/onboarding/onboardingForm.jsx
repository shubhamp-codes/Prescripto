"use client";
import { useState } from "react";
import { updateUserProfile } from "@/actions/userActions";
import { useRouter } from "next/navigation";

const OnboardingForm = () => {
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  const minDate = new Date(
    today.getFullYear() - 150,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorOccurred(false);
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const phone = formData.get("phone");
    const dob = formData.get("dob");

    try {
      const isSuccessful = await updateUserProfile(phone, dob);
      if (!isSuccessful) {
        throw new Error();
      }
      setIsSubmitting(false);
      router.push("/dashboard/patient");
    } catch (error) {
      setErrorOccurred(true);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Almost Done!
          </h2>
          <p className="text-gray-500 text-sm">
            We just need a little more information to complete your profile.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="onboardingPhone"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="onboardingPhone"
              required
              pattern="[0-9]{10}"
              title="Enter a valid 10-digit mobile number"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="e.g. 9876543210"
            />
          </div>

          <div>
            <label
              htmlFor="onboardingDob"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              id="onboardingDob"
              required
              max={maxDate}
              min={minDate}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-3 rounded-full font-medium shadow-md transition-all mt-4 
              ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"}`}
          >
            {isSubmitting ? "Saving..." : "Continue to Dashboard"}
          </button>
        </form>

        {errorOccurred && (
          <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg text-center animate-pulse">
            <span className="text-red-600 text-sm font-medium">
              Failed to save information. Please try again.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingForm;
