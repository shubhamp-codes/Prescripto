"use client";
import { signIn } from "next-auth/react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Stethoscope } from "lucide-react";
const DoctorLogin = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleManualLogin(e) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await signIn("credentials", {
      email: email,
      password: password,
      userType: "doctor",
      redirect: false,
    });

    if (result?.error) {
      setErrorMessage(result.error);
      setIsSubmitting(false);
      console.error("Login Failed:", result.error);
    } else {
      router.push(`/dashboard/doctor`);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 mb-4 border border-blue-200">
            <Stethoscope className="w-4 h-4" />
            For Doctors
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back, Doctor
          </h2>
          <p className="text-gray-500 text-sm">
            Log in to manage your appointments and patients.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleManualLogin}>
          <div>
            <label
              htmlFor="loginEmail"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="loginEmail"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label
              htmlFor="loginPassword"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="loginPassword"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-3 rounded-full font-medium shadow-md transition-all mt-2 
              ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 hover:cursor-pointer"}`}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg text-center animate-pulse">
            <span className="text-red-600 text-sm font-medium">
              {errorMessage}
            </span>
          </div>
        )}

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <GoogleSignInButton callbackUrl={"/dashboard/doctor"} />

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/doctor-auth/signup"
            className="text-blue-600 font-medium hover:underline transition-all"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DoctorLogin;
