import React from "react";

const Loader = () => {
  return (
    <div className="bounce w-full justify-center mt-24 flex gap-4 align-items-center">
      <div className="h-4 w-4 rounded-full border border-gray-300 bg-violet-600"></div>
      <div className="h-4 w-4 rounded-full border border-gray-300 bg-violet-600  "></div>
      <div className="h-4 w-4 rounded-full border border-gray-300 bg-violet-600"></div>
    </div>
  );
};

export default Loader;
