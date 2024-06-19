import React, { useContext, useState } from "react";

import delete_image_static from "../../assests/delete_static.png";
import dots_loading from "../../assests/dots_loading.gif";
import { Context } from "../../store/context";

function Categories({ fetch_categories, categories, loading, error }) {
  const [submitting, setSubmitting] = useState(undefined);
  const [currentId, setCurrentId] = useState(0);
  const setNotificationContext = useContext(Context).setNotification;

  const delete_category = async (category) => {
    setCurrentId(category._id);
    try {
      setSubmitting(true);
      const response = await fetch(
        process.env.REACT_APP_REST_API + "/foods/categories",
        {
          headers: { "Content-Type": "application/json" },
          method: "DELETE",
          body: JSON.stringify({ category }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setCurrentId(0);
      if (jsonData.deleted) {
        setSubmitting(false);
        setNotificationContext({
          visible: true,
          color: "green",
          data: `${category.category} deleted !`,
        });
        fetch_categories();
      }
    } catch (error) {
      setCurrentId(0);
      setNotificationContext({
        visible: true,
        color: "red",
        data: error.message,
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="p-2 flex flex-col items-center w-full md:w-2/5">
      <h1 className="font-primary bg-primary p-2 rounded-md font-extrabold text-4xl text-primary_font text-center w-full">
        Categories
      </h1>
      {categories && categories.length < 1 && (
        <div>
          <span className="font-primary font-bold text-lg text-red-400 text-center">
            No food categories, please add some!
          </span>
        </div>
      )}
      {loading && (
        <div className="flex gap-2 items-center mt-5">
          <span className="spinner"></span>
          <span className="font-primary font-bold text-lg text-blue-400 text-center">
            Getting food categories...
          </span>
        </div>
      )}
      {error && (
        <div>
          <span className="font-primary font-bold text-lg text-blue-400 text-center">
            Error getting food categories...
          </span>
        </div>
      )}
      {!loading && (
        <div className="w-full h-56 overflow-auto  custom_scrollbar">
          <table className="min-w-full border-collapse">
            <tbody>
              {categories &&
                categories.map((category) => {
                  return (
                    <tr
                      className="border-b border-gray-200 flex justify-between px-6"
                      key={category._id}
                    >
                      <td className="px-4 py-2 font-bold text-xl font-primary text-neutral-600">
                        {category.category}
                      </td>
                      <td className="px-4 py-2 ">
                        {currentId === category._id && submitting && (
                          <img
                            src={dots_loading}
                            alt="Animated GIF"
                            class="w-8 h-8"
                          ></img>
                        )}
                        {currentId !== category._id && (
                          <img
                            onClick={() => delete_category(category)}
                            src={delete_image_static}
                            alt="Animated GIF"
                            className="w-8 h-8  hover:scale-[1.1] hover:cursor-pointer hover:drop-shadow-lg transition-all "
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Categories;
