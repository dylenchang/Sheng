import React from "react";

import "./style.css";
type ILoadingProps = {
  type?: "area" | "app";
};
const Loading = ({ type = "area" }: ILoadingProps = { type: "area" }) => {
  return (
    <div
      className={`flex w-full justify-center items-center ${
        type === "app" ? "h-full" : ""
      }`}
    >
      <div className="hash-loader">
        <div className="hash-box"></div>
      </div>
    </div>
  );
};
export default Loading;
