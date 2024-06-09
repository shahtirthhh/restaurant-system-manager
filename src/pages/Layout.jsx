import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";

function Layout() {
  return (
    <main className="flex flex-col lg:flex-row justify-between h-full w-full">
      <Navigation />
      <Outlet />
    </main>
  );
}

export default Layout;
