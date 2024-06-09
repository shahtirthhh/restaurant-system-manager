import React, { useState } from "react";

export const Context = React.createContext({
  socket: null,
  setSocket: (socket) => {},
  socketObject: null,
  setSocketObject: (socket) => {},

  notification: { color: null, data: null },
  setNotification: ({ visible, color, data, loading = false }) => {},
});
// eslint-disable-next-line
export default (props) => {
  const [socketObjectValue, setSocketObjectValue] = useState(null);
  const [socketValue, setSocketValue] = useState(null);

  const [notificationValue, setNotificationValue] = useState({
    color: "null",
    data: "null",
    visible: false,
    loading: false,
  });
  return (
    <Context.Provider
      value={{
        socket: socketValue,
        socketObject: socketObjectValue,
        notification: notificationValue,
        setSocket: setSocketValue,
        setNotification: setNotificationValue,
        setSocketObject: setSocketObjectValue,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
