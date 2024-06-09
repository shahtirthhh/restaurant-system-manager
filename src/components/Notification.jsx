import { Context } from "../store/context";
import React, { useContext, useEffect } from "react";

import spinner_done from "../assests/spinner_done.gif";
import spinner_error from "../assests/spinner_error.gif";

export default function Notification() {
  const { notification, setNotification } = useContext(Context);

  useEffect(() => {
    let timeout;
    if (!notification.loading && notification.visible) {
      timeout = setTimeout(() => {
        setNotification({
          ...notification,
          visible: false,
        });
      }, 2500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [notification, setNotification]);

  return (
    <div
      className={`rounded-2xl items-center bg-white absolute left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-in-out flex z-20 w-auto ${
        notification.visible
          ? "top-20 lg:top-16  opacity-100"
          : "-top-10 opacity-0"
      } px-4 py-2 items-center gap-4 font-semibold text-center`}
    >
      {notification.color === "blue" ? (
        <>
          <span className="spinner"></span>
          <h2 className="text-lg font-primary font-bold text-blue-600">
            {notification.data}
          </h2>
        </>
      ) : notification.color === "green" ? (
        <>
          <img src={spinner_done} alt="spinner" />
          <h2 className="text-lg font-primary font-bold text-green-600">
            {notification.data}
          </h2>
        </>
      ) : (
        <>
          <img src={spinner_error} alt="spinner" />
          <h2 className="text-lg font-primary font-bold text-red-600">
            {notification.data}
          </h2>
        </>
      )}
    </div>
  );
}
