import React, { useContext, useEffect, useRef, useState } from "react";

import spinner_orders from "../../assests/spinner_orders.gif";
import error_image from "../../assests/error.png";
import no_orders from "../../assests/no_orders.gif";
import next from "../../assests/next.png";
import previous from "../../assests/previous.png";
import payment_done from "../../assests/payment_done.png";
import cooking from "../../assests/cooking.gif";
import served from "../../assests/served.png";

import { Context } from "../../store/context";
import Modal from "../../components/Modal";

function LiveOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState(null);
  const socketContext = useContext(Context).socket;

  const [groupedOrders, setGroupedOrders] = useState(null);
  const [filteredGroupedOrders, setFilteredGroupedOrders] = useState(null);

  const fetch_orders = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        process.env.REACT_APP_REST_API + "/orders/",
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        setLoading(false);
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setOrders(jsonData.orders);
      const groupedOrders = jsonData.orders.reduce((acc, order) => {
        if (!acc[order.tableNumber]) {
          acc[order.tableNumber] = [];
        }
        acc[order.tableNumber].push(order);
        return acc;
      }, {});
      setGroupedOrders(groupedOrders);
      setFilteredGroupedOrders(groupedOrders);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch_orders();

    socketContext?.on("update_orders", () => {
      fetch_orders();
    });
    socketContext?.on("check_for_order_served", () => {
      fetch_orders();
    });
  }, [socketContext]);
  return (
    <div className="overflow-y-auto  custom_scrollbar h-auto m-4  rounded-xl bg-secondary p-5 w-full flex flex-col  gap-2 ">
      {/* {orders && orders.length >= 2 && (
        <div className="sticky top-0 shadow-lg rounded-lg mb-5 p-4 flex flex-wrap sm:gap-10 justify-center gap-3 items-center">
          <select
            className="border-2 border-neutral-800 rounded-xl p-1 font-primary focus:shadow-lg transition-all"
            name="table"
            id="table"
            defaultValue="Table Number"
            ref={tableRef}
          >
            <option value="Table number" disabled>
              Table Number
            </option>
            {Object.keys(filteredGroupedOrders).map((tableNumber) => (
              <option value={tableNumber}>{tableNumber}</option>
            ))}
          </select>
          <div className="flex flex-row items-center gap-2">
            <input
              ref={paidFilter}
              type="checkbox"
              name="paid_mark"
              id="paid_mark"
            />
            <label
              className="font-primary text-neutral-700 font-semibold"
              htmlFor="paid_mark"
            >
              Mark as paid
            </label>
          </div>
          <div className="flex flex-row items-center gap-2">
            <input
              ref={cancelFilter}
              type="checkbox"
              name="canceled"
              id="canceled"
            />
            <label
              className="font-primary text-neutral-700 font-semibold"
              htmlFor="canceled"
            >
              Canceled Orders
            </label>
          </div>
        </div>
      )} */}
      {loading && (
        <div className="flex flex-col gap-3 items-center justify-center">
          <img
            className="w-24 h-24"
            src={spinner_orders}
            alt="loading_orders"
          />
          <span className="font-primary text-neutral-600  font-semibold text-2xl ">
            Getting latest orders ...
          </span>
        </div>
      )}
      {error && (
        <div className="flex flex-col gap-3 items-center justify-center">
          <img className="w-28 h-28" src={error_image} alt="error" />
          <span className="font-primary text-red-500  font-semibold text-2xl ">
            An error occured !
          </span>
        </div>
      )}
      {orders && orders.length < 1 && (
        <div className="flex flex-col gap-3 items-center justify-center">
          <img className="w-36" src={no_orders} alt="error" />
          <span className="font-primary text-neutral-700  font-semibold text-2xl ">
            Waiting for new orders...
          </span>
        </div>
      )}
      {orders && orders.length > 0 && (
        <div className="flex flex-wrap gap-16 justify-evenly ">
          {Object.keys(filteredGroupedOrders).map((tableNumber) => (
            <div
              key={tableNumber}
              className=" bg-primary rounded-xl shadow-lg p-3 w-96 "
            >
              <Card
                fetch_orders={fetch_orders}
                key={tableNumber}
                orders={filteredGroupedOrders[tableNumber]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Card = ({ orders, fetch_orders }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const setNotificationContext = useContext(Context).setNotification;
  const socketContext = useContext(Context).socket;

  const nextOrder = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % orders.length);
  };

  const prevOrder = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + orders.length) % orders.length
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);

  const handleCancel = () => {
    setIsModalOpen(false);
    setMarking(false);
    setCanceling(false);
    setActiveOrderId(null);
  };

  const [marking, setMarking] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const set_as_paid = async (_id) => {
    setMarking(true);
    setIsModalOpen(false);
    try {
      const response = await fetch(
        process.env.REACT_APP_REST_API + "/orders/mark_as_paid",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify({ _id }),
        }
      );
      setMarking(false);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      if (jsonData.marked) {
        socketContext.emit("order_marked_as_paid", _id);
        fetch_orders();
      } else {
        setNotificationContext({
          visible: true,
          color: "red",
          data: jsonData.message,
        });
      }
    } catch (error) {
      setNotificationContext({
        visible: true,
        color: "red",
        data: "Operation failed !",
      });
    }
  };
  const cancel_order = async (_id) => {
    setCanceling(true);
    setIsModalOpen(false);
    try {
      const response = await fetch(
        process.env.REACT_APP_REST_API + "/orders/cancel_order",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify({ _id }),
        }
      );
      setCanceling(false);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      if (jsonData.canceled) {
        setCurrentIndex(0);
        socketContext.emit("order_canceled", _id);
        fetch_orders();
      } else {
        setNotificationContext({
          visible: true,
          color: "red",
          data: jsonData.message,
        });
      }
    } catch (error) {
      setNotificationContext({
        visible: true,
        color: "red",
        data: "Operation failed !",
      });
    }
  };
  const [activeFunction, setActiveFunction] = useState(null);
  return (
    orders[currentIndex] && (
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 bg-secondary p-2 rounded-lg justify-between items-center">
          <h2 className="text-2xl font-primary text-neutral-700 font-semibold ">
            Table {orders[currentIndex].tableNumber}
          </h2>
          <div className="flex gap-4  items-center">
            {
              orders[currentIndex].payment_done && (
                <img className="w-9 h-9" src={payment_done} alt="done" />
              )
              // : (
              //   <img className="w-12 h-12" src={payment_pending} alt="pending" />
              // )
            }
            {orders[currentIndex].served
              ? !orders[currentIndex].canceled && (
                  <img className="w-9 h-9" src={served} alt="done" />
                )
              : !orders[currentIndex].canceled && (
                  <img className="w-10 h-10" src={cooking} alt="pending" />
                )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {orders.length > 1 && (
            <button
              onClick={prevOrder}
              className="hover:scale-[1.05] transition-all"
            >
              <img className="w-8 h-8" src={previous} alt="" />
            </button>
          )}
          {!orders[currentIndex].payment_done &&
            !orders[currentIndex].canceled && (
              <button
                disabled={marking}
                onClick={() => {
                  setMarking(true);
                  setActiveOrderId(orders[currentIndex]._id);
                  setIsModalOpen(true);
                  setActiveFunction(() => set_as_paid);
                }}
                className="disabled:bg-slate-400 px-2 py-1 font-primary text-neutral-700 font-semibold transition-all rounded-lg bg-green-400 hover:bg-green-600"
              >
                {orders[currentIndex]._id === activeOrderId && marking
                  ? "Marking..."
                  : "Mark as paid"}
              </button>
            )}
          {!orders[currentIndex].payment_done &&
            !orders[currentIndex].canceled && (
              <button
                disabled={canceling}
                onClick={() => {
                  setCanceling(true);
                  setActiveOrderId(orders[currentIndex]._id);
                  setIsModalOpen(true);
                  setActiveFunction(() => cancel_order);
                }}
                className="disabled:bg-slate-400 px-2 py-1 font-primary text-neutral-700 font-semibold transition-all rounded-lg bg-red-400 hover:bg-red-600"
              >
                {orders[currentIndex]._id === activeOrderId && canceling
                  ? "Canceling..."
                  : "Cancel order"}
              </button>
            )}
          {orders[currentIndex].canceled && (
            <span className="text-center font-primary font-semibold text-md text-red-500 ">
              Order canceled
            </span>
          )}

          {orders.length > 1 && (
            <button
              onClick={nextOrder}
              className="hover:scale-[1.05] transition-all"
            >
              <img className="w-8 h-8" src={next} alt="" />
            </button>
          )}
        </div>
        <div className="flex flex-row gap-3 ">
          <table className="w-[60%]">
            {orders[currentIndex].items.map((item) => {
              return (
                <tr className="border-b">
                  <td className="font-primary font-medium text-neutral-500 ">
                    {item.name}
                  </td>
                  <td className="pl-2 font-primary font-medium text-neutral-500 ">
                    x{item.quantity}
                  </td>
                </tr>
              );
            })}
          </table>
          <div className="w-[40%] flex flex-col justify-start  gap-4">
            <span className=" font-primary font-bold text-md text-neutral-500 ">
              Order ID: {orders[currentIndex]._id}
            </span>
            <span className=" font-primary font-bold text-md text-neutral-500 ">
              {orders.length > 1 ? "Order amount: " : "Bill: "} $
              {orders[currentIndex].total}
            </span>
            {orders.length > 1 && (
              <span className=" font-primary font-bold text-md text-neutral-500 ">
                Bill: $
                {orders.reduce((sum, order) => sum + order.total, 0).toFixed(1)}
              </span>
            )}
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          activeFunction={activeFunction}
          activeOrderId={activeOrderId}
          title={marking ? "Change payment status ?" : "Cancel order ?"}
          type={marking ? "confirm" : "delete"}
          message={
            marking
              ? "Are you sure to mark this order as paid ?"
              : "Are you sure to cancel the order ?"
          }
          confirmText={marking ? "🤑 Set as paid" : "😦 Cancel order"}
          cancelText={marking ? "No" : "No"}
          onCancel={handleCancel}
        />
      </div>
    )
  );
};
export default LiveOrders;
