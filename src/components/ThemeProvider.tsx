// src/components/ThemeProvider.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { Global, css } from "@emotion/react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const darkTheme = {
  background: "#121212",
  color: "#ffffff",
};

const lightTheme = {
  background: "#ffffff",
  color: "#000000",
};

const GlobalStyles = ({ theme }: { theme: any }) => (
  <Global
    styles={css`
      body {
        background-color: ${theme.background};
        color: ${theme.color};
        transition: background-color 0.3s, color 0.3s;
      }
    `}
  />
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const themeObject = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <EmotionThemeProvider theme={themeObject}>
        <GlobalStyles theme={themeObject} />
        {children}
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};
