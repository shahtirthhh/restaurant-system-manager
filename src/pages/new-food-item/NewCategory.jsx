import React, { useContext, useRef, useState } from "react";

import { Context } from "../../store/context";
import { string_validator } from "../../utils/validators";
import Categories from "./Categories";

function NewCategory({ fetch_categories, categories, loading, error }) {
  const category = useRef();

  const [categoryError, setCategoryError] = useState(undefined);

  const [submitting, setSubmitting] = useState(undefined);
  const setNotificationContext = useContext(Context).setNotification;

  const handle_category_submit = async (event) => {
    event.preventDefault();
    if (!string_validator(category.current.value, 3, 17)) {
      setCategoryError("Please enter category name");
      return;
    } else {
      try {
        setSubmitting(true);
        setCategoryError(undefined);
        const response = await fetch(
          process.env.REACT_APP_REST_API + "/foods/categories",
          {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ category: category.current.value }),
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        if (jsonData.saved) {
          setSubmitting(false);
          setNotificationContext({
            visible: true,
            color: "green",
            data: "Category saved !",
          });
          category.current.value = "";
          fetch_categories();
        }
      } catch (error) {
        setNotificationContext({
          visible: true,
          color: "red",
          data: error.message,
        });
        setSubmitting(false);
      }
    }
  };
  return (
    <div className="flex flex-wrap">
      <form
        onSubmit={handle_category_submit}
        className="p-2 flex flex-col gap-9 w-full md:w-3/5"
      >
        <h1 className="font-primary bg-primary p-2 rounded-md font-extrabold text-4xl text-primary_font text-center">
          New Category
        </h1>
        <div className="flex flex-col items-start">
          <label
            className="font-primary font-semibold text-primary_font text-lg"
            htmlFor="category_name"
          >
            Item name
          </label>
          <input
            ref={category}
            className="border-2 border-neutral-800 rounded-xl p-1 font-primary focus:shadow-lg transition-all"
            type="text"
            name="category_name"
            id="category_name"
          />

          {categoryError && (
            <span className="font-primary font-bold text-lg text-red-400">
              {categoryError}
            </span>
          )}
        </div>
        <button
          className="border border-green-700 bg-green-300 text-lg font-primary font-medium text-primary_font rounded-lg w-min px-8 py-[0.1rem] hover:bg-green-600 disabled:bg-slate-400 disabled:cursor-not-allowed"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
      <Categories
        categories={categories}
        loading={loading}
        fetch_categories={fetch_categories}
        error={error}
      />
    </div>
  );
}

export default NewCategory;
