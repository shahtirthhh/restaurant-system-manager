import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();

  const isActive = (pathname) => {
    return location.pathname === pathname
      ? "shadow-md scale-[1.002]"
      : "hover:shadow-md hover:scale-[1.002]";
  };

  return (
    <nav className="flex flex-row h-auto w-full lg:flex-col lg:h-screen justify-center gap-8 p-4 lg:w-[14%]">
      <Link
        to="live-orders"
        className={`font-primary bg-secondary text-center p-3 text-xl rounded-xl transition-all ${isActive(
          "/live-orders"
        )}`}
      >
        Live Orders
      </Link>
      <Link
        to="food-items"
        className={`font-primary bg-secondary text-center p-3 text-xl rounded-xl transition-all ${isActive(
          "/previous-orders"
        )}`}
      >
        Previous Orders
      </Link>
      <Link
        to="food-items"
        className={`font-primary bg-secondary text-center p-3 text-xl rounded-xl transition-all ${isActive(
          "/food-items"
        )}`}
      >
        Food Items
      </Link>
    </nav>
  );
}

export default Navigation;
