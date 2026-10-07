"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import logoSrc from "@/assets/icons/logo.svg";
import {
  Menu,
  X,
  House,
  Stethoscope,
  CircleAlert,
  UserRound,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navigationLinks = [
    { name: "HOME", src: "/", icon: House },
    { name: "ALL DOCTORS", src: "/all-doctors", icon: Stethoscope },
    { name: "ABOUT", src: "/about", icon: CircleAlert },
    { name: "CONTACT", src: "/contact", icon: UserRound },
  ];

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-200 shadow-sm text-sm sticky top-0 z-50 bg-white">
        <div className="flex items-center gap-12">
          <Link href="/" className="cursor-pointer">
            <Image
              src={logoSrc}
              alt="Prescripto"
              width={160}
              height={44}
              className="w-40 h-auto"
            />
          </Link>
          <ul className="hidden lg:flex gap-8 font-medium">
            {navigationLinks.map((link) => (
              <li key={link.name} className="relative group">
                <Link
                  href={link.src}
                  className={`py-2 transition-colors duration-300 ${
                    pathname === link.src
                      ? "text-blue-600 font-bold"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                </Link>
                <span
                  className={`absolute bottom-0 left-0 right-0 mx-auto h-0.5 bg-blue-600 w-2/3 transition-opacity duration-300 ${
                    pathname === link.src
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                ></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4">
            {status === "authenticated" && session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-full transition-colors border border-transparent hover:border-gray-200"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-600 overflow-hidden flex items-center justify-center">
                    {session.user.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-blue-700 font-bold text-sm">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{session.user.userType}</p>
                    </div>
                    <Link
                      href={session.user.userType === "doctor" ? "/dashboard/doctor" : "/dashboard/patient"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/doctor-auth/login"
                  className="text-sm font-medium text-gray-500 underline hover:text-blue-600 transition-colors mr-2"
                >
                  Are you a doctor?
                </Link>
                <Link
                  href="/login"
                  className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden text-gray-600 hover:text-blue-600"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-[75vw] sm:w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center p-5.5 justify-end border-b">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex flex-col p-6 gap-6 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="flex flex-col gap-4">
            {status === "authenticated" && session?.user ? (
              <>
                <div className="flex items-center gap-4 mb-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-600 overflow-hidden flex items-center justify-center">
                    {session.user.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-blue-700 font-bold text-lg">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-bold text-gray-900 truncate">{session.user.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{session.user.userType}</span>
                  </div>
                </div>
                <Link
                  href={session.user.userType === "doctor" ? "/dashboard/doctor" : "/dashboard/patient"}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-blue-50 text-blue-700 py-3 rounded-xl font-semibold shadow-sm hover:bg-blue-100 transition-colors text-center"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full text-center py-3 font-semibold text-red-600 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-full font-medium shadow-sm hover:bg-blue-700 transition-colors text-center"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className="w-full text-center py-2 font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/doctor-auth/login"
                  className="text-center text-xs text-gray-400 underline hover:text-gray-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Are you a doctor?
                </Link>
              </>
            )}
          </div>

          <div className="h-px bg-gray-200"></div>

          <ul className="flex flex-col gap-4">
            {navigationLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.src}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                    pathname === link.src
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-10 text-sm text-gray-400">
            <Link
              href="#"
              className="block hover:text-gray-600 mb-2 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="block hover:text-gray-600 transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
