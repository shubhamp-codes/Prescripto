"use client";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const Signup = () => {
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  const minDate = new Date(
    today.getFullYear() - 150,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleManualSignup(e) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const phone = formData.get("phone");
    const dob = formData.get("dob");
    const email = formData.get("email");
    const password = formData.get("password");
    const userType = `patient`;

    try {
      const response = await fetch(`/api/register`, {
        method: `POST`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          dob,
          email,
          password,
          userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message || "Registration failed. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (signInResult?.error) {
        setErrorMessage(signInResult.error);
        console.error("Login Failed:", signInResult.error);
        setIsSubmitting(false);
      } else {
        router.push(`/dashboard/patient`);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "A network error occurred.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create an Account
          </h2>
          <p className="text-gray-500 text-sm">Join us as a patient today</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleManualSignup}>
          <div>
            <label
              htmlFor="signupName"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="signupName"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="signupPhone"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="signupPhone"
                required
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit mobile number"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="signupDob"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                id="signupDob"
                required
                max={maxDate}
                min={minDate}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signupEmail"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="signupEmail"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="signupPassword"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="signupPassword"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-3 rounded-full font-medium shadow-md transition-all mt-2 
              ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"}`}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
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

        <GoogleSignInButton callbackUrl={`/signup/onboarding`} />

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline transition-all"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
