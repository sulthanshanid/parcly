import React, { useContext, useEffect, useState } from "react";
import { TrackingContext } from "@/contexts/Tracking";
import Nav1 from "./SVG/Nav1";
import Nav2 from "./SVG/Nav2";
import Nav3 from "./SVG/Nav3";
import images from "../Images/index";
import Image from "next/image";

const NavBar = () => {
  const [state, setState] = useState(false);
  const { currentUser, connectWallet } = useContext(TrackingContext);

  const navigation = [
    { title: "Home", path: "#" },
    {
      title: "Services",
      path: "https://www.linkedin.com/services/page/594149327a8b384472/",
    },
    { title: "Contact Us", path: "https://deeptiranjanswain.netlify.app/" },
    { title: "Erc20", path: "https://github.com/DeeptiranjanSwain79" },
  ];

  useEffect(() => {
    document.onclick = (e) => {
      const target = e.target;
      if (!target.closest(".menu-btn")) setState(false);
    };
  }, []);
  return (
    <nav
      className={`bg-white pb-5 md:text-sm ${
        state
          ? "shadow-lg rounded-xl border mx-2 mt-2 md:shadow-none md:border-none md:mx-2 md:mt-0"
          : ""
      }`}
    >
      <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
        <div className="flex items-center justify-between py-5 md:block">
          <a href="/">
            <Image
              src={images.logo}
              alt="Float UI Logo"
              width={120}
              height={50}
            />
          </a>
          <div className="md:hidden">
            <button
              className="menu-btn text-gray-500 hover:text-gray-800"
              onClick={() => setState(!state)}
            >
              {state ? <Nav1 /> : <Nav2 />}
            </button>
          </div>
        </div>

        <div
          className={`flex-1 items-center mt-8 md:mt-0 md:flex ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
            {navigation.map((item, index) => (
              <li
                key={index}
                className="text-base font-semibold text-gray-700 hover:text-gray-400"
              >
                <a
                  href={item.path}
                  className="block"
                  target={index !== 0 ? "_blank" : "_self"}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex-1 gap-x-6 items-center justify-end space-y-6 md:flex md:space-y-0 md:mt-0">
            {currentUser ? (
              <p
                onClick={connectWallet}
                className="flex cursor-pointer items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex"
              >
                {currentUser?.slice(0, 25)}...
              </p>
            ) : (
              <button
                onClick={connectWallet}
                className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 rounded-full md:inline-flex"
              >
                Connect Wallet <Nav3 />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
