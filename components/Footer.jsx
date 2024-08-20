import React from "react";
import Fot1 from "./SVG/Fot1";
import Fot2 from "./SVG/Fot2";
import Image from "next/image";
import images from "../Images/index";

const Footer = () => {
  const footerNavs = [
    {
      href: "#",
      name: "Terms & Conditions",
    },
    {
      href: "#",
      name: "License",
    },
    {
      href: "#",
      name: "Privacy",
    },
    {
      href: "#",
      name: "About Us",
    },
  ];
  return (
    <footer className="pt-10">
      <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
        <div className="justify-between sm:flex">
          <div className="space-y-6">
            <Image src={images.logo} className="w-32" />
            <p className="max-w-md">
              Welcome to Parcly, overseas shipments made easy
            </p>

            <ul className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
              {footerNavs.map((item, index) => (
                <li
                  key={index}
                  className="text-gray-800 hover:text-gray-500 duration-150"
                >
                  <a href={item.href}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <p className="text-gray-700 font-semibold">Get the App</p>
            <div className="flex items-center gap-3 mt-3 sm:block">
              <a href="#">
                <Fot1 />
              </a>
              <a href="#" className="mt-0 block sm:mt-3">
                <Fot2 />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 py-10 border-t md:text-center">
          <p>
            &copy; 2024{" "}
            <a
              href="https://deeptiranjanswain.netlify.app/"
              target="_blank"
              className="text-blue-400 font-bold"
            >
              DEEPTIRANJAN SWAIN
            </a>
            . All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
