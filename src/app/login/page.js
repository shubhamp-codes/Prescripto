"use client";
import { signIn } from "next-auth/react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function handleManualLogin(e) {
    e.preventDefault();
    setErrorMessage("");
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    if (result?.error) {
      setErrorMessage(result.error);
      console.error("Login Failed:", result.error);
    } else {
      router.push(`/dashboard/patient`);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm">Please log in to your account</p>
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
            className="w-full bg-blue-600 text-white py-3 rounded-full font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-2 hover:cursor-pointer"
          >
            Log In
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

        <GoogleSignInButton />

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 font-medium hover:underline transition-all"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
