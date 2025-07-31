"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useWindowSize } from "@uidotdev/usehooks";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const { width = 0, height = 0 } = useWindowSize();
  const [randomBoxes, setRandomBoxes] = React.useState<{
    [key: string]: string;
  }>({});

  // Calculate number of rows and columns based on screen size
  const boxSize = 35; // 16 * 4 = 64px (size-16 class)
  const rows = new Array(Math.ceil(height! / boxSize)).fill(1);
  const cols = new Array(Math.ceil(width! / boxSize)).fill(1);
  let colors = ["#fafafa", "#fef3c7", "#dcfce7", "#dbeafe", "#fee2e2"];
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Update random boxes every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      const totalBoxes = rows.length * cols.length;
      const numBoxesToColor = Math.floor(totalBoxes * 0.05); // Color 5% of boxes
      const newRandomBoxes: { [key: string]: string } = {};

      for (let i = 0; i < numBoxesToColor / 2; i++) {
        const randomRow = Math.floor(Math.random() * rows.length);
        const randomCol = Math.floor(Math.random() * cols.length);
        const key = `${randomRow}-${randomCol}`;
        newRandomBoxes[key] = getRandomColor();
      }

      setRandomBoxes(newRandomBoxes);
    }, 3000);

    return () => clearInterval(interval);
  }, [rows.length, cols.length]);

  return (
    <div className="relative w-full flex items-center justify-center">
      <div
        className={cn(
          "absolute z-0 flex min-h-[calc(100vh-10px)] w-full p-4 rounded-3xl overflow-hidden top-0",
          className
        )}
        {...rest}
      >
        {rows.map((_, i) => (
          <motion.div
            key={`row` + i}
            className="relative h-8 w-16 border-l border-slate-700/5"
          >
            {cols.map((_, j) => {
              const boxKey = `${i}-${j}`;
              const hasRandomColor = boxKey in randomBoxes;

              return (
                <motion.div
                  whileHover={{
                    backgroundColor: `${getRandomColor()}`,
                    transition: { duration: 0 },
                  }}
                  animate={{
                    backgroundColor: hasRandomColor
                      ? randomBoxes[boxKey]
                      : undefined,
                    transition: { duration: 0.5 },
                  }}
                  key={`col` + j}
                  className="relative size-16 border-t border-r border-slate-700/10"
                />
              );
            })}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
