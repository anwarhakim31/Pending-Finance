"use client";

import clsx from "clsx";
import React, { useEffect, useState } from "react";

// Mendefinisikan tipe untuk gaya meteor
type MeteorStyle = {
  top: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
};

export const Meteors = ({ number }: { number?: number }) => {
  const [meteorStyles, setMeteorStyles] = useState<MeteorStyle[]>([]);
  const meteors = new Array(number || 20).fill(true);

  useEffect(() => {
    const styles = meteors.map(() => ({
      top: "0", // atau bisa diubah sesuai kebutuhan
      left: `${Math.floor(Math.random() * (400 - -400) + -400)}px`,
      animationDelay: `${Math.random() * (0.8 - 0.2) + 0.2}s`,
      animationDuration: `${Math.floor(Math.random() * (10 - 2) + 2)}s`,
    }));
    setMeteorStyles(styles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {meteors.map((el, idx) => (
        <span
          key={"meteor" + idx}
          className={clsx(
            "z-[-1] animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-yellow-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#d8dde6] before:to-transparent"
          )}
          style={meteorStyles[idx]}
        ></span>
      ))}
    </>
  );
};
