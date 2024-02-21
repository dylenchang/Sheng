"use client";
import React from "react";

import cn from "classnames";
import NormalForm from "./normalForm";

const Forms = () => {
  return (
    <div
      className={cn(
        "flex flex-col w-full grow items-center justify-center",
        "px-6",
        "md:px-[108px]"
      )}
    >
      <div className="flex flex-col md:w-[400px]">
        <NormalForm />
      </div>
    </div>
  );
};

export default Forms;
