import { motion as m } from "framer-motion";

const circlePath = {
  x: [0, 200, 0, 100, 0, 200, 0, 300, 0],
  y: [0, 0, -100, -50, 0, 50, 250, 200, 0],
};
const BubbleComponent = () => {
  return (
    <m.div
      animate={circlePath}
      transition={{
        duration: 10,
        ease: "linear",
        repeat: Infinity,
      }}
      className="absolute z-0 top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-orange-400 rounded-full  blur-3xl "
    ></m.div>
  );
};

export default BubbleComponent;
