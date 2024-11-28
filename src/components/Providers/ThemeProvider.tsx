import React from "react";
import { ThemeProvider as ThemeProv } from "next-themes";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProv
      attribute={"class"}
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProv>
  );
};

export default ThemeProvider;
