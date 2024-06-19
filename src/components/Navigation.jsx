import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import menu_open from "../assests/menu_open.png";
import menu_close from "../assests/menu_close.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => (location.pathname === path ? "shadow-lg " : "");
  const isActiveLg = (path) =>
    location.pathname === path ? "text-neutral-600 " : "text-primary";

  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-secondary text-white ">
        {
          <button className=" text-3xl lg:hidden" onClick={toggleMenu}>
            <img src={menu_open} className="w-12 h-12" alt="" />
          </button>
        }
        {
          <Link to="/" className={"lg:hidden"}>
            <span
              className={`  text-lg rounded-md bg-primary font-semibold font-primary text-neutral-600 whitespace-nowrap  px-4 py-2  transition-all text-center ${isActive(
                "/"
              )}`}
            >
              Home
            </span>{" "}
          </Link>
        }
        <div className="hidden lg:flex flex-col h-screen justify-center gap-8 w-[14%]">
          <Link to="/" className={" transition-al"}>
            <span
              className={`  text-lg rounded-md bg-primary font-semibold font-primary text-neutral-600 whitespace-nowrap  px-4 py-2  transition-all text-center ${isActive(
                "/"
              )}`}
            >
              Home
            </span>{" "}
          </Link>
          <Link to="/live-orders" className={" "}>
            <span
              className={` text-lg rounded-md bg-primary font-semibold font-primary text-neutral-600 whitespace-nowrap  px-4 py-2  transition-all text-center ${isActive(
                "/live-orders"
              )}`}
            >
              Live Orders
            </span>{" "}
          </Link>
          <Link to="/previous-orders" className={""}>
            <span
              className={` text-lg rounded-md bg-primary font-semibold font-primary text-neutral-600 whitespace-nowrap  px-4 py-2  transition-all text-center ${isActive(
                "/previous-orders"
              )}`}
            >
              Previous Orders
            </span>{" "}
          </Link>
          <Link to="/food-items" className={""}>
            <span
              className={` text-lg rounded-md bg-primary font-semibold font-primary text-neutral-600 whitespace-nowrap px-4 py-2   transition-all text-center ${isActive(
                "/food-items"
              )}`}
            >
              Food Items
            </span>{" "}
          </Link>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-md flex flex-col justify-center items-center z-50 lg:hidden">
          <Link
            to="/"
            onClick={toggleMenu}
            className={`font-primary font-semibold   text-2xl p-4 ${isActiveLg(
              "/"
            )}`}
          >
            Home
          </Link>
          <Link
            to="/live-orders"
            onClick={toggleMenu}
            className={`font-primary font-semibold  text-2xl p-4 ${isActiveLg(
              "/live-orders"
            )}`}
          >
            Live Orders
          </Link>
          <Link
            to="/previous-orders"
            onClick={toggleMenu}
            className={`font-primary font-semibold  text-2xl p-4 ${isActiveLg(
              "/previous-orders"
            )}`}
          >
            Previous Orders
          </Link>
          <Link
            to="/food-items"
            onClick={toggleMenu}
            className={`font-primary font-semibold  text-2xl p-4 ${isActiveLg(
              "/food-items"
            )}`}
          >
            Food Items
          </Link>
          <button onClick={toggleMenu}>
            <img src={menu_close} className="z-[51] w-10  h-10" alt="" />
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
