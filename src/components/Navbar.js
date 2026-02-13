"use client";
import Image from "next/image";
import logoSrc from "@/components/icons/logo.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const navigationLinks = [
    { name: "HOME", src: "/" },
    { name: "ALL DOCTORS", src: "/all-doctors" },
    { name: "ABOUT", src: "/about" },
    { name: "CONTACT", src: "/contact" },
  ];
  const pathname = usePathname();

  return (
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
        <ul className="flex gap-8 font-medium">
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

      <div className="flex items-center gap-6">
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
        <Link
          href="/doctor-auth"
          className="text-xs font-medium text-gray-500 hover:text-gray-800 underline decoration-gray-300 underline-offset-4"
        >
          Are you a doctor?
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
