import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { number_validator, string_validator } from "../../utils/validators";
import { Context } from "../../store/context";
import burgerLoading from "../../assests/burger_loading.gif";
import empty_plate from "../../assests/empty_plate.png";
import Error from "../../components/Error";
import edit_food from "../../assests/edit.png";
import cancel_edit from "../../assests/cancel.png";
import add_sign from "../../assests/add_sign.png";
import tick_mark from "../../assests/tick_mark.png";
import empty_box from "../../assests/empty_box.png";
import delete_img from "../../assests/delete.png";

import Modal from "../../components/Modal";
function FoodItems() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetch_food_items = async () => {
    setLoading(true);
    try {
      const response = await fetch(process.env.REACT_APP_REST_API + "/foods/", {
        method: "GET",
      });
      if (!response.ok) {
        setLoading(false);
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setData(jsonData);
      setFilteredFoodItems(jsonData.foodItems);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async () => {
    setIsModalOpen(false);
    setNotificationContext({
      visible: true,
      color: "blue",
      loading: true,
      data: "Deleting...",
    });

    try {
      const response = await fetch(process.env.REACT_APP_REST_API + "/foods/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteId }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      if (jsonData.deleted) {
        fetch_food_items();
        setNotificationContext({
          visible: true,
          color: "green",
          data: "Deleted !",
        });
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
        data: "Delete failed !",
      });
    }
  };

  useEffect(() => {
    fetch_food_items();
  }, []);

  const [categories, setCategories] = useState(undefined);

  // Filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filteredFoodItems, setFilteredFoodItems] = useState(null);
  const filterItems = () => {
    if (data) {
      if (search.length === 0) {
        const temp = data.foodItems.filter((item) =>
          filterCategory === "All" ? true : item.category === filterCategory
        );
        setFilteredFoodItems(temp);
      } else {
        const temp = data.foodItems.filter((item) =>
          search.length >= 1
            ? item.name.toLowerCase().includes(search.toLowerCase())
            : true && item.category === filterCategory
        );
        setFilteredFoodItems(temp);
      }
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(filterItems, [search, filterCategory]);

  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(undefined);

  const [editErrors, setEditErrors] = useState({
    name: undefined,
    price: undefined,
    category: undefined,
    image: undefined,
  });

  const setNotificationContext = useContext(Context).setNotification;

  const nameRef = useRef();
  const priceRef = useRef();
  const categoryRef = useRef();

  const hidden_img_btn = useRef();

  useEffect(() => {
    const fetch_categories = async () => {
      const response = await fetch(
        process.env.REACT_APP_REST_API + "/foods/categories"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setCategories(jsonData.categories);
    };
    fetch_categories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const validate_inputs = () => {
    let errors = false;

    if (!string_validator(nameRef.current.value, 3, 23)) {
      setEditErrors((prevState) => ({
        ...prevState,
        name: "Enter a valid name",
      }));
      errors = true;
    } else {
      setEditErrors((prevState) => ({
        ...prevState,
        name: undefined,
      }));
    }

    if (!number_validator(priceRef.current.value, 0.1, 999)) {
      setEditErrors((prevState) => ({
        ...prevState,
        price: "Enter a price",
      }));
      errors = true;
    } else {
      setEditErrors((prevState) => ({
        ...prevState,
        price: undefined,
      }));
    }

    if (
      categories &&
      !categories.find(
        (category) => category.category === categoryRef.current.value
      )
    ) {
      setEditErrors((prevState) => ({
        ...prevState,
        category: "Select a valid category",
      }));
      errors = true;
    } else {
      setEditErrors((prevState) => ({
        ...prevState,
        category: undefined,
      }));
    }
    if (file && !data.foodItems.find((item) => item.image === file.name)) {
      if (!file || file.size >= 3 * 1024 * 1024) {
        setEditErrors((prevState) => ({
          ...prevState,
          image: "Please select an image with size < 3MB",
        }));
        errors = true;
      } else {
        setEditErrors((prevState) => ({
          ...prevState,
          image: undefined,
        }));
      }
    } else {
      setEditErrors((prevState) => ({
        ...prevState,
        image: undefined,
      }));
    }

    return errors;
  };
  const update_food_item = async () => {
    if (validate_inputs()) return false;
    setNotificationContext({
      visible: true,
      color: "blue",
      loading: true,
      data: "Updating...",
    });
    const formData = new FormData();

    formData.append("_id", currentId);
    formData.append("name", nameRef.current.value);
    formData.append("price", priceRef.current.value);
    formData.append("category", categoryRef.current.value);
    formData.append("image", file);
    formData.append(
      "old_image",
      data.foodItems.find((item) => item._id === currentId).image
    );

    try {
      const response = await fetch(process.env.REACT_APP_REST_API + "/foods/", {
        method: "PATCH",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      if (jsonData.saved) {
        setNotificationContext({
          visible: true,
          color: "green",
          data: "Updated !",
        });
        return true;
      } else {
        setNotificationContext({
          visible: true,
          color: "red",
          data: jsonData.message,
        });
        return false;
      }
    } catch (error) {
      setNotificationContext({
        visible: true,
        color: "red",
        data: "Update failed !",
      });
      return false;
    }
  };
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(0);

  return (
    <div className=" m-4 rounded-xl bg-secondary p-2 w-full flex flex-col items-center gap-2 ">
      {data && data.foodItems.length > 0 && (
        <div className="onView w-full flex justify-center gap-8 flex-wrap shadow-lg p-3 rounded-md">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Find item here..."
            className="rounded-lg border p-1 text-neutral-600 font-primary focus:shadow-lg"
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            name="filterCategory"
            id="filterCategory"
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border hover:cursor-pointer hover:shadow-lg rounded-lg p-1 font-primary focus:shadow-lg transition-all"
          >
            <option value="All">All</option>
            {categories &&
              categories.map((category) => (
                <option key={category._id} value={category.category}>
                  {category.category}
                </option>
              ))}
          </select>
          <Link
            to="/new-food-item"
            className="w-32 gap-2 transition-all hover:cursor-pointer flex items-center border hover:shadow-md px-2 py-1 rounded-lg"
          >
            <img className="w-8 h-8" src={add_sign} alt="add_" />
            <span className="font-primary font-semibold text-neutral-600">
              Add new
            </span>
          </Link>
        </div>
      )}
      <div className="flex flex-wrap gap-10 p-2 lg:h-auto h-[35rem] overflow-y-auto  justify-center items-center  custom_scrollbar relative w-full">
        {error && <Error msg={error.message} />}
        {loading && (
          <div className="onView flex flex-col w-full h-full justify-center items-center snap-center">
            <img className="w-20 h-20" src={burgerLoading} alt="Loading..." />
            <h4 className="text-center text-xl font-bold font-primary text-primary_font">
              Fetching menu...
            </h4>
          </div>
        )}
        {data && data.foodItems.length < 1 && (
          <div className="onView flex flex-col justify-center items-center gap-7 snap-center">
            <img className="w-20 h-20" src={empty_plate} alt="Empty plate..." />
            <h4 className="whitespace-pre-line text-center text-xl font-bold font-primary text-primary_font">
              {"No Items !\nTry adding some "}
              <Link
                className="underline underline-offset-2 text-blue-600"
                to="/new-food-item"
              >
                here
              </Link>
            </h4>
          </div>
        )}
        {filteredFoodItems &&
          filteredFoodItems.map((foodItem) => {
            return (
              <div
                key={foodItem._id}
                className="flex flex-col items-center gap-5 w-[21rem] rounded-xl shadow-md p-4 onView snap-center"
              >
                {/* Food image */}
                <div className="relative rounded-md bg-cover overflow-hidden sm:w-[20rem] w-full shadow-lg sm:h-[15rem] h-[15rem]">
                  <img
                    className="absolute z-10 w-full h-full object-cover"
                    src={
                      editMode && currentId === foodItem._id && selectedImage
                        ? selectedImage
                        : process.env.REACT_APP_REST_API +
                          `/food-images/${foodItem.image}`
                    }
                    alt={foodItem.name}
                  />
                  {editMode && currentId === foodItem._id && (
                    <button
                      onClick={() => hidden_img_btn.current.click()}
                      className="absolute z-20 w-full h-full bg-black/70 text-slate-300 text-2xl p-1 font-primary focus:shadow-lg transition-all hover:bg-black/85 hover:text-white"
                      type="button"
                    >
                      Pick new image
                    </button>
                  )}
                  <input
                    hidden
                    ref={hidden_img_btn}
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="flex justify-between w-full gap-4 items-center">
                  {currentId !== foodItem._id && (
                    <h1 className="w-full font-primary text-3xl text-primary_font font-bold">
                      {foodItem.name}
                    </h1>
                  )}
                  {editMode && currentId === foodItem._id && (
                    <input
                      className={`w-[80%] rounded-lg p-1 active:shadow-md font-primary text-3xl text-primary_font font-bold ${
                        editErrors.name
                          ? "border-2 border-red-500"
                          : "border border-neutral-900"
                      }`}
                      ref={nameRef}
                      defaultValue={foodItem.name}
                    />
                  )}
                  {!editMode && (
                    <div className="flex gap-5 px-3">
                      <img
                        onClick={() => {
                          setCurrentId(foodItem._id);
                          setEditMode(true);
                        }}
                        className="w-8 h-8 hover:scale-[1.1] hover:cursor-pointer transition-all"
                        src={edit_food}
                        alt="edit"
                      />
                      <img
                        onClick={() => {
                          setDeleteId(foodItem._id);
                          setIsModalOpen(true);
                        }}
                        className="w-8 h-8 hover:scale-[1.1] hover:cursor-pointer transition-all"
                        src={delete_img}
                        alt="delete"
                      />
                    </div>
                  )}
                  {editMode && currentId === foodItem._id && (
                    <img
                      onClick={() => {
                        setEditMode(false);
                        setCurrentId(0);
                        setFile(null);
                        setSelectedImage(undefined);
                        setEditErrors(() => ({
                          name: undefined,
                          price: undefined,
                          category: undefined,
                          image: undefined,
                        }));
                      }}
                      src={cancel_edit}
                      className="w-[2rem] h-[2rem] hover:cursor-pointer hover:scale-[1.1] transition-all"
                      alt="cancel"
                    />
                  )}
                  {editMode && currentId === foodItem._id && (
                    <img
                      onClick={async () => {
                        const status = await update_food_item();
                        if (status) {
                          fetch_food_items();
                          setEditMode(false);
                          setCurrentId(0);
                          setFile(null);
                          setSelectedImage(undefined);
                          setEditErrors(() => ({
                            name: undefined,
                            price: undefined,
                            category: undefined,
                            image: undefined,
                          }));
                        }
                      }}
                      src={tick_mark}
                      className="w-[1.7rem] h-[1.7rem] hover:cursor-pointer hover:scale-[1.1] transition-all"
                      alt="right"
                    />
                  )}
                </div>
                <div className="w-full gap-3 flex justify-between">
                  {currentId !== foodItem._id && (
                    <h1 className="font-primary text-2xl text-primary_font font-normal">
                      {foodItem.category}
                    </h1>
                  )}
                  {editMode && currentId === foodItem._id && (
                    <select
                      className={`rounded-xl p-1 font-primary focus:shadow-lg transition-all ${
                        editErrors.category
                          ? "border-2 border-red-500"
                          : "border border-neutral-900"
                      }`}
                      name="category"
                      id="category"
                      defaultValue={foodItem.category}
                      ref={categoryRef}
                    >
                      {categories &&
                        categories.map((category) => (
                          <option key={category._id} value={category.category}>
                            {category.category}
                          </option>
                        ))}
                    </select>
                  )}
                  {currentId !== foodItem._id && (
                    <h1 className="font-primary text-xl text-primary_font font-normal">
                      ${foodItem.price}
                    </h1>
                  )}
                  {editMode && currentId === foodItem._id && (
                    <input
                      className={`w-[80%] rounded-lg p-1 active:shadow-md font-primary text-xl text-primary_font font-light ${
                        editErrors.price
                          ? "border-2 border-red-500"
                          : "border border-neutral-900"
                      }`}
                      defaultValue={foodItem.price}
                      inputMode="numeric"
                      pattern="[0-9]*[.]?[0-9]+"
                      ref={priceRef}
                    />
                  )}
                </div>
              </div>
            );
          })}
        {filteredFoodItems && filteredFoodItems.length < 1 && (
          <div className="onView flex flex-col justify-center items-center gap-7 snap-center">
            <img src={empty_box} alt="noFood" className="w-20 h-20" />
            <h4 className="whitespace-pre-line text-center text-xl font-bold font-primary text-primary_font">
              {"No Items !"}
            </h4>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Confirm Delete"
        type="delete"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default FoodItems;
