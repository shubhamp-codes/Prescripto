import React from "react";
import Image from "next/image";
import logoSrc from "@/components/icons/logo.svg";
const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-blue-100 px-[4vw] py-[1vh] text-sm">
        <Image
          src={logoSrc}
          alt="Not available"
          width={180}
          height={50}
          className="logo w-[13vw] h-auto"
        />
      <ul className=" flex gap-[4vw]">
        <li>HOME</li>
        <li>ALL DOCTORS</li>
        <li>ABOUT</li>
        <li>CONTACT</li>
      </ul>
      <ul className="flex gap-[3vw]">
        <li>Log In</li>
        <li>Sign Up</li>
      </ul>
    </nav>
  );
};

export default Navbar;
