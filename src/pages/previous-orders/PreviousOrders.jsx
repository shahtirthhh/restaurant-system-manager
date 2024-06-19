import React, { useState, useEffect } from "react";

function PreviousOrders() {
  const [orders, setOrders] = useState([]);
  const [startId, setStartId] = useState(1);
  const [endId, setEndId] = useState(20);
  const [filter, setFilter] = useState({ tableNumber: "", status: "" });
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("latest"); // "latest" or "oldest"
  const [searchId, setSearchId] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(true); // State to manage filter menu open/close

  const fetchOrders = async (start, end) => {
    setLoading(true);
    try {
      const response = await fetch(
        process.env.REACT_APP_REST_API + "/orders/previous-orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ startingId: start, endId: end }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setOrders((prevOrders) => [...prevOrders, ...data.orders]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(startId, endId);
  }, [startId, endId]);

  const handleLoadMore = () => {
    setStartId(endId + 1);
    setEndId(endId + recordsPerPage);
  };

  const filteredOrders = orders
    .filter((order) => {
      const tableNumberMatch = filter.tableNumber
        ? order.tableNumber.toString().includes(filter.tableNumber)
        : true;
      const statusMatch =
        filter.status === "served"
          ? order.served
          : filter.status === "canceled"
          ? order.canceled
          : true;
      const idMatch = searchId ? order._id.toString().includes(searchId) : true;
      const dateMatch =
        selectedDate && order.date
          ? new Date(order.date).toDateString() === selectedDate.toDateString()
          : true;
      return tableNumberMatch && statusMatch && idMatch && dateMatch;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return b._id - a._id;
      } else {
        return a._id - b._id;
      }
    });

  const handleSearch = (e) => {
    setSearchId(e.target.value);
  };

  const handleDateChange = (e) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setSelectedDate(date);
  };

  const toggleSortOrder = () => {
    setSortBy(sortBy === "latest" ? "oldest" : "latest");
  };

  const toggleFilterMenu = () => {
    setFilterMenuOpen(!filterMenuOpen);
  };

  return (
    <div className="overflow-y-auto  custom_scrollbar h-auto m-4 rounded-xl bg-secondary  p-10 w-full flex flex-col gap-5">
      <div className="flex z-[49] sticky top-0 justify-end mb-4">
        <button
          onClick={toggleFilterMenu}
          className={`px-10 py-4  text-white font-primary transition-all font-medium rounded-lg ${
            !filterMenuOpen
              ? " bg-sky-600 hover:bg-blue-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {filterMenuOpen ? "Close" : "📁 Filters"}
        </button>
      </div>

      {filterMenuOpen && (
        <div className="flex p-3 bg-primary rounded-lg shadow-lg sticky top-12 md:flex-row flex-wrap flex-col gap-4">
          <input
            type="number"
            placeholder="Table Number"
            value={filter.tableNumber}
            onChange={(e) =>
              setFilter({ ...filter, tableNumber: e.target.value })
            }
            className="p-2 rounded-lg border border-gray-300 font-primary font-medium"
          />
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="p-2 rounded-lg border border-gray-300 font-primary font-medium"
          >
            <option value="">All</option>
            <option value="served">Served</option>
            <option value="canceled">Canceled</option>
          </select>
          <input
            type="text"
            placeholder="Search by Order ID"
            value={searchId}
            onChange={handleSearch}
            className="p-2 rounded-lg border border-gray-300 font-primary font-medium"
          />
          <input
            type="date"
            onChange={handleDateChange}
            className="p-2 rounded-lg border border-gray-300 font-primary font-medium"
          />
          <select
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(Number(e.target.value))}
            className="p-2 rounded-lg border border-gray-300 font-primary font-medium"
          >
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={60}>60</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className={`px-4 py-2  text-neutral-600 transition-all rounded-lg ${
              sortBy === "latest"
                ? "bg-sky-400 hover:bg-sky-200"
                : "bg-yellow-200 hover:bg-yellow-400"
            }  font-primary font-medium`}
          >
            {sortBy === "latest" ? "Sort by Oldest" : "Sort by Latest"}
          </button>
        </div>
      )}

      {filteredOrders.length === 0 && (
        <div className="flex font-primary text-xl font-semibold text-neutral-600 items-center justify-center h-40">
          📦 No orders found matching the criteria
        </div>
      )}

      {filteredOrders.map((order) => (
        <>
          <div
            key={order._id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all hover:bg-slate-100"
            onClick={() =>
              setExpandedOrderId(
                expandedOrderId === order._id ? null : order._id
              )
            }
          >
            <span className="w-full font-primary font-semibold text-neutral-600 text-left">
              Order ID: {order._id}
            </span>
            <span className="w-full font-primary font-medium text-neutral-600 text-center">
              ${order.total}
            </span>
            <span
              className={`w-full font-primary font-medium text-center ${
                order.canceled ? "text-red-400" : "text-green-500"
              }`}
            >
              {order.canceled
                ? "Canceled"
                : order.served
                ? "Served"
                : "Pending"}
            </span>
            <span className="w-full  font-primary font-medium text-center">
              Table: {order.tableNumber}
            </span>
          </div>
          {expandedOrderId === order._id && (
            <div className="flex justify-start gap-10 mt-2 p-4 bg-gray-100 rounded-lg">
              <div>
                <h4 className="font-semibold  text-xl font-primary text-neutral-500 tracking-wide">
                  Order Details:
                </h4>
                <h4 className="font-semibold  text-lg font-primary text-neutral-700 tracking-wide">
                  {new Date(order.date).toDateString()}
                </h4>
              </div>
              <ul className="flex flex-wrap gap-5 justify-start items-start">
                {order.items.map((item, index) => (
                  <li
                    key={index}
                    className="font-primary whitespace-break-spaces text-md text-neutral-700 bg-secondary rounded-lg px-3 py-1 shadow-md"
                  >
                    {`${item.name} \tx${item.quantity}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ))}

      <div className="flex justify-center mt-4">
        <button
          onClick={handleLoadMore}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}

export default PreviousOrders;
