import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Layout from "./pages/Layout";
import LiveOrders from "./pages/live-orders/LiveOrders";
import FoodItems from "./pages/food-items/FoodItems";
import NewFoodItem from "./pages/new-food-item/NewFoodItem";
import Notification from "./components/Notification";

const ROUTER = createBrowserRouter([
  // Homepage paths
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "live-orders",
        element: <LiveOrders />,
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
  return (
    <div className="bg-primary h-screen overflow-hidden relative">
      <RouterProvider router={ROUTER}></RouterProvider>
      <Notification />
    </div>
  );
}

export default App;
