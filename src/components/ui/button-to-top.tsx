"use client";
import { ChevronUp } from "lucide-react";
import React from "react";

const ButtonScrollTop = () => {
  const [showButton, setShowButton] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowButton(scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!showButton) {
    return null;
  }

  return (
    <div className="fixed right-2 bottom-16 sm:bottom-5 sm:right-2 z-50">
      <button
        type="button"
        title="Kembali ke atas"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="text-white focus:ring-4 focus:outline-none focus:ring-violet-500 font-medium rounded-full text-sm p-2 bg-black/50 hover:bg-black-80  text-center inline-flex items-center"
      >
        <ChevronUp size={16} />
      </button>
    </div>
  );
};

export default ButtonScrollTop;
