import React, { useEffect, useRef, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";

import burgerLoading from "../../assests/burger_loading.gif";
import empty_plate from "../../assests/empty_plate.png";
import Error from "../../components/Error";
import edit_food from "../../assests/edit.png";
import cancel_edit from "../../assests/cancel.png";

function FoodItems() {
  const { data, loading, error } = useFetch(
    process.env.REACT_APP_REST_API + "/foods"
  );
  const [categories, setCategories] = useState(undefined);
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(undefined);

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
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(0);

  return (
    <div className="flex flex-wrap gap-10 p-4 overflow-y-auto justify-center items-center border border-neutral-400 m-4 rounded-xl bg-secondary  h-[90%] lg:h-[90%]  lg:w-[86%]">
      {error && <Error msg={error.message} />}
      {loading && (
        <div className="flex flex-col justify-center items-center">
          <img className="w-20 h-20" src={burgerLoading} alt="Loading..." />
          <h4 className="text-center text-xl font-bold font-primary text-primary_font">
            Fetching menu...
          </h4>
        </div>
      )}
      {data && data.foodItems.length < 1 && (
        <div className="flex flex-col justify-center items-center gap-7">
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
      {data &&
        data.foodItems.map((foodItem) => {
          return (
            <div
              key={foodItem._id}
              className="flex flex-col items-center gap-5 w-[21rem] rounded-xl shadow-md p-4"
            >
              {/* Food image */}
              <div className="relative rounded-md bg-cover overflow-hidden sm:w-[20rem] w-[10rem] sm:h-[15rem] h-[10rem]">
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
                  <h1 className=" w-full font-primary text-3xl text-primary_font font-bold">
                    {foodItem.name}
                  </h1>
                )}
                {editMode && currentId === foodItem._id && (
                  <input
                    className=" border border-neutral-900 w-[80%] rounded-lg p-1 active:shadow-md font-primary text-3xl text-primary_font font-bold"
                    defaultValue={foodItem.name}
                  />
                )}
                {!editMode && (
                  <img
                    onClick={() => {
                      setCurrentId(foodItem._id);
                      setEditMode(true);
                    }}
                    className="w-8 h-8 hover:scale-[1.1] hover:cursor-pointer transition-all"
                    src={edit_food}
                    alt="edit"
                  />
                )}
                {editMode && currentId === foodItem._id && (
                  <img
                    onClick={() => {
                      setEditMode(false);
                      setCurrentId(0);
                      setFile(null);
                      setSelectedImage(undefined);
                    }}
                    src={cancel_edit}
                    className="w-[2rem] h-[2rem] hover:cursor-pointer hover:scale-[1.1] transition-all"
                    alt="cancel"
                  />
                )}
              </div>
              <div className=" w-full gap-3 flex justify-between">
                {currentId !== foodItem._id && (
                  <h1 className="font-primary text-2xl text-primary_font font-normal">
                    {foodItem.category}
                  </h1>
                )}
                {editMode && currentId === foodItem._id && (
                  <select
                    className="border-2 border-neutral-800 rounded-xl p-1 font-primary focus:shadow-lg transition-all"
                    name="category"
                    id="category"
                    defaultValue={foodItem.category}
                    // ref={categoryRef}
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
                    className=" border border-neutral-900 w-[80%] rounded-lg p-1 active:shadow-md font-primary text-xl text-primary_font font-light"
                    defaultValue={foodItem.price}
                  />
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default FoodItems;
