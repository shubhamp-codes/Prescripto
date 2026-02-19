import Image from "next/image";
import Link from "next/link";
import logoSrc from "@/assets/icons/logo.svg";

const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center pt-20 pb-5 px-6">
      <hr className="w-full max-w-5xl border-gray-200 mb-10" />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10">
        <div className="flex flex-col gap-4">
          <Image src={logoSrc} alt="Prescripto" width={108} height={30} />
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            Simply browse through our extensive list of trusted doctors,
            schedule your appointment hassle-free.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-gray-900 tracking-wide text-sm">
            COMPANY
          </h3>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors w-max"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-600 transition-colors w-max"
            >
              About Us
            </Link>
            <span className="hover:text-blue-600 transition-colors w-max hover:cursor-pointer">
              Privacy Policy
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-gray-900 tracking-wide text-sm">
            GET IN TOUCH
          </h3>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <span className="hover:text-blue-600 transition-colors cursor-pointer w-max">
              +91-9905884542
            </span>
            <span className="hover:text-blue-600 transition-colors cursor-pointer w-max">
              shubhampathaksp2003@gmail.com
            </span>
          </div>
        </div>
      </div>

      <hr className="w-full max-w-5xl border-gray-200 mt-16 mb-6" />

      <div className="text-center text-sm text-gray-500">
        Copyright © 2026 Shubham Pathak. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
