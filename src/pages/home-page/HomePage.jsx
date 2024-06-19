import React from "react";

import illustration from "../../assests/homepage_illustration.png";
import students from "../../assests/students.png";

const customerLink = "";
const chefLink = "";
const managerLink = "";

const tirth = "https://www.linkedin.com/in/shahtirthh/";
const devanshe = "https://www.linkedin.com/in/devanshee-ramanuj/";

function HomePage() {
  return (
    <div className="w-full flex flex-col  justify-start overflow-y-auto overflow-x-hidden items-center p-4 rounded-lg">
      <h1 className=" italic text-center  font-primary tracking-wide font-bold text-6xl text-neutral-600">
        Online Restaurant System
      </h1>
      <div className="flex sm:flex-row mt-7 border-b border-neutral-600 mb-4 pb-4 items-center flex-col justify-evenly ">
        <img src={illustration} className="w-64 h-64" alt="illu" />
        <ul className="sm:w-[60%] w-full flex gap-3 flex-col">
          <li className="pb-5 font-primary font-medium text-neutral-700 text-xl">
            🌟 Whole system consists 3 interconnected modules
          </li>
          <li className="font-primary  text-neutral-700 text-lg">
            🍴
            <a
              className="text-blue-400 font-medium  underline transition-all underline-offset-2 hover:text-blue-500"
              href={customerLink}
            >
              Customer module
            </a>{" "}
            : Customer could see the menu managed by the restaurant and order
            food which will be directly sent to the manager.
          </li>
          <li className="font-primary  text-neutral-700 text-lg">
            👨🏻‍💼
            <a
              className="text-blue-400 font-medium transition-all underline-offset-2 hover:text-blue-500 underline "
              href={managerLink}
            >
              Manager module
            </a>{" "}
            : Manager processes the payment and verify the order details such as
            table number and food, then forward it to the chef.
          </li>
          <li className="font-primary  text-neutral-700 text-lg">
            👩🏻‍🍳
            <a
              className="text-blue-400 font-medium transition-all underline-offset-2 hover:text-blue-500 underline "
              href={chefLink}
            >
              Chef module
            </a>{" "}
            : Chefs could see the whole details including table number, order
            details and special notes sent by the customer. Once order is sent
            to the customer, it will be reflected in customer application as
            well as manager's dashboard.
          </li>
        </ul>
      </div>

      <div className="flex flex-row  justify-evenly gap-2 sm:gap-11 items-center ">
        <div className="flex flex-col justify-start items-start sm:ml-28 ">
          <h1 className="text-center font-primary tracking-wide font-semibold text-4xl text-neutral-600">
            Creators,
          </h1>
          <a
            className="text-blue-400   mt-7 text-xl font-medium  underline transition-all underline-offset-2 hover:text-blue-500"
            href={tirth}
          >
            Shah Tirth
          </a>
          <a
            className="text-blue-400  mt-7 text-xl  font-medium  underline transition-all underline-offset-2 hover:text-blue-500"
            href={devanshe}
          >
            Devanshee Ramanuj
          </a>
        </div>

        <img src={students} className="sm:w-64 w-52 sm:h-64 h-52" alt="illu" />
      </div>
    </div>
  );
}

export default HomePage;
