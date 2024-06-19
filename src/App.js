import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Layout from "./pages/Layout";
import LiveOrders from "./pages/live-orders/LiveOrders";
import FoodItems from "./pages/food-items/FoodItems";
import NewFoodItem from "./pages/new-food-item/NewFoodItem";
import HomePage from "./pages/home-page/HomePage";

import Notification from "./components/Notification";

import io from "socket.io-client";
import { useContext, useEffect } from "react";

import { Context } from "./store/context";
import PreviousOrders from "./pages/previous-orders/PreviousOrders";

const SOCKET = io(process.env.REACT_APP_SOCKET_SERVER);

const ROUTER = createBrowserRouter([
  // Homepage paths
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "live-orders",
        element: <LiveOrders />,
      },
      {
        path: "previous-orders",
        element: <PreviousOrders />,
      },

      {
        path: "food-items",
        element: <FoodItems />,
      },
      {
        path: "new-food-item",
        element: <NewFoodItem />,
      },
    ],
  },
]);

function App() {
  const setSocketContext = useContext(Context).setSocket;
  const setNotificationContext = useContext(Context).setNotification;

  useEffect(() => {
    SOCKET.on("connection_sucess", () => {
      setSocketContext(SOCKET);
    });
    SOCKET.on("update_orders", () => {
      setNotificationContext({
        visible: true,
        color: "yellow",
        data: "🍔 New order placed !",
      });
    });
    SOCKET.on("check_for_order_served", () => {
      setNotificationContext({
        visible: true,
        color: "green",
        data: "🥳  An order served !",
      });
    });
  }, [SOCKET]);
  return (
    <div className="bg-primary h-screen overflow-hidden relative">
      <Notification />
      <RouterProvider router={ROUTER}></RouterProvider>
      {!SOCKET.connected && (
        <div className=" backdrop-blur-lg fixed bottom-0 z-50 w-full  bg-black/75 flex items-center justify-center">
          <span className="px-2 py-4 font-primary flex tracking-wide flex-row items-center gap-2 text-zinc-100 font-semibold text-lg">
            <span className="spinner"></span>
            Please wait for socket connection... (dev purpose only)
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
