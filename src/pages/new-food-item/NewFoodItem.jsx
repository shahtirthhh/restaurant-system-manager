import React, { useContext, useEffect, useRef, useState } from "react";
import NewCategory from "./NewCategory";
import { number_validator, string_validator } from "../../utils/validators";
import { Context } from "../../store/context";
import add_food from "../../assests/add_food.png";
function NewFoodItem() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const setNotificationContext = useContext(Context).setNotification;
  const hidden_img_btn = useRef();

  const nameRef = useRef();
  const priceRef = useRef();
  const categoryRef = useRef();
  const resetButton = useRef();

  const [validationErrors, setValidationErrors] = useState({
    name: undefined,
    price: undefined,
    category: undefined,
    image: undefined,
  });

  const [submitting, setSubmitting] = useState(undefined);
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);

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

  const fetch_categories = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        process.env.REACT_APP_REST_API + "/foods/categories"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const validate_inputs = () => {
    let errors = false;

    if (!string_validator(nameRef.current.value, 3, 23)) {
      setValidationErrors((prevState) => ({
        ...prevState,
        name: "Enter a valid name",
      }));
      errors = true;
    } else {
      setValidationErrors((prevState) => ({
        ...prevState,
        name: undefined,
      }));
    }

    if (!number_validator(priceRef.current.value, 0.1, 999)) {
      setValidationErrors((prevState) => ({
        ...prevState,
        price: "Enter a price",
      }));
      errors = true;
    } else {
      setValidationErrors((prevState) => ({
        ...prevState,
        price: undefined,
      }));
    }

    if (
      !data.categories.find(
        (category) => category.category === categoryRef.current.value
      )
    ) {
      setValidationErrors((prevState) => ({
        ...prevState,
        category: "Select a valid category",
      }));
      errors = true;
    } else {
      setValidationErrors((prevState) => ({
        ...prevState,
        category: undefined,
      }));
    }

    if (!file || file.size >= 3 * 1024 * 1024) {
      setValidationErrors((prevState) => ({
        ...prevState,
        image: "Please select an image with size < 3MB",
      }));
      errors = true;
    } else {
      setValidationErrors((prevState) => ({
        ...prevState,
        image: undefined,
      }));
    }

    return errors;
  };

  const reset_data = () => {
    resetButton.current.click();
    setFile(null);
    setSelectedImage(undefined);
  };

  const handle_item_submit = async (event) => {
    event.preventDefault();

    if (validate_inputs()) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("price", priceRef.current.value);
    formData.append("category", categoryRef.current.value);
    formData.append("image", file);

    try {
      const response = await fetch(process.env.REACT_APP_REST_API + "/foods/", {
        method: "POST",
        body: formData,
      });

      setSubmitting(false);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      if (jsonData.saved) {
        setNotificationContext({
          visible: true,
          color: "green",
          data: jsonData.message,
        });
      } else {
        setNotificationContext({
          visible: true,
          color: "red",
          data: jsonData.message,
        });
      }
      reset_data();
    } catch (error) {
      setError(error);
      setSubmitting(false);
      reset_data();
    }
  };

  useEffect(() => {
    fetch_categories();
  }, []);

  const handle_hidden_click = () => {
    hidden_img_btn.current.click();
  };

  return (
    <div className="p-2 overflow-y-auto  custom_scrollbar flex flex-col justify-between gap-6 border border-neutral-400 m-4 rounded-xl bg-secondary h-[90%] lg:h-[90%] lg:w-[86%]">
      <form
        onSubmit={handle_item_submit}
        className=" p-2 "
        encType="multipart/form-data"
      >
        <h1 className="font-primary bg-primary p-2 rounded-md font-extrabold text-4xl text-primary_font text-center">
          Add new Food Item
        </h1>
        <div className="flex sm:gap-7 gap-2 items-center justify-between sm:flex-row flex-col-reverse">
          <div className="flex p-2 flex-col gap-7">
            <div className="flex flex-row gap-5 flex-wrap">
              <div className="flex flex-col items-start">
                <label
                  className="font-primary font-semibold text-primary_font text-lg"
                  htmlFor="name"
                >
                  Item name
                </label>
                <input
                  className="border-2 border-neutral-800 rounded-xl p-1 font-primary focus:shadow-lg transition-all"
                  type="text"
                  name="name"
                  id="name"
                  ref={nameRef}
                />
                {validationErrors.name && (
                  <span className="font-primary font-bold text-lg text-red-400">
                    {validationErrors.name}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start">
                <label
                  className="font-primary font-semibold text-primary_font text-lg"
                  htmlFor="price"
                >
                  Price
                </label>
                <input
                  className="border-2 border-neutral-800 rounded-xl p-1 font-primary focus:shadow-lg transition-all"
                  pattern="[0-9]*[.]?[0-9]+"
                  inputMode="numeric"
                  type="text"
                  name="price"
                  id="price"
                  ref={priceRef}
                />
                {validationErrors.price && (
                  <span className="font-primary font-bold text-lg text-red-400">
                    {validationErrors.price}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start">
              <select
                className="border-2 border-neutral-800 rounded-xl p-1 font-primary focus:shadow-lg transition-all"
                name="category"
                id="category"
                defaultValue="Food Category"
                ref={categoryRef}
              >
                <option value="Food Category" disabled>
                  Food Category
                </option>
                {data &&
                  data.categories.map((category) => (
                    <option key={category._id} value={category.category}>
                      {category.category}
                    </option>
                  ))}
              </select>
              {validationErrors.category && (
                <span className="font-primary font-bold text-lg text-red-400">
                  {validationErrors.category}
                </span>
              )}
            </div>
            <div className="flex flex-col items-start">
              <input
                hidden
                ref={hidden_img_btn}
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button
                onClick={handle_hidden_click}
                className="border-2 border-neutral-800 rounded-xl p-1 font-primary focus:shadow-lg transition-all hover:bg-primary"
                type="button"
              >
                Pick an Image
              </button>
              {validationErrors.image && (
                <span className="font-primary font-bold text-lg text-red-400">
                  {validationErrors.image}
                </span>
              )}
            </div>
            {data && data.categories.length < 1 && (
              <div>
                <span className="font-primary font-bold text-lg text-red-400">
                  No food categories, please add some!
                </span>
              </div>
            )}
            {loading && (
              <div className="flex gap-2 items-center">
                <span className="spinner"></span>
                <span className="font-primary font-bold text-lg text-blue-400">
                  Getting food categories...
                </span>
              </div>
            )}
            {error && (
              <div>
                <span className="font-primary font-bold text-lg text-red-400">
                  Error getting food categories...
                </span>
              </div>
            )}
            <div className="flex gap-4">
              {data && data.categories.length > 0 && (
                <button
                  className="transition-all border border-green-700 bg-green-300 text-lg font-primary font-medium text-primary_font rounded-lg w-min px-8 py-[0.1rem] hover:bg-green-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  disabled={submitting}
                  type="submit"
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              )}
              {data && data.categories.length > 0 && (
                <button
                  className="transition-all border border-red-700 bg-red-300 text-lg font-primary font-medium text-primary_font rounded-lg w-min px-8 py-[0.1rem] hover:bg-red-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  disabled={submitting}
                  ref={resetButton}
                  type="reset"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="relative rounded-xl bg-cover overflow-hidden m-10 sm:w-[20rem] w-[10rem] sm:h-[20rem] h-[10rem]">
            <img
              className="absolute w-full h-full object-cover"
              src={selectedImage ?? add_food}
              alt="selected img"
            />
          </div>
        </div>
      </form>
      <NewCategory
        fetch_categories={fetch_categories}
        categories={data ? data.categories : undefined}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default NewFoodItem;
