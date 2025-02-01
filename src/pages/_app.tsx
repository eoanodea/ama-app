// src/pages/_app.tsx
import { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import "react-leaflet-markercluster/dist/styles.min.css"; // Import MarkerCluster CSS
import "../styles/leaflet-custom.css"; // Import custom Leaflet styles
import moment from "moment";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#121212",
                  paper: "#1d1d1d",
                },
                text: {
                  primary: "#ffffff",
                  secondary: "#b0b0b0",
                },
              }
            : {
                background: {
                  default: "#ffffff",
                  paper: "#f5f5f5",
                },
                text: {
                  primary: "#000000",
                  secondary: "#4f4f4f",
                },
              }),
        },
        typography: {
          fontFamily: "'Inter', sans-serif",
          h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
          },
          h2: {
            fontSize: "2rem",
            fontWeight: 600,
          },
          body1: {
            fontSize: "1rem",
            lineHeight: 1.5,
          },
          button: {
            textTransform: "none",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "8px",
                padding: "8px 16px",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: "8px",
                padding: "16px",
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };

  const now = moment()
    .startOf("week")
    .add(1, "days")
    .hour(9)
    .minute(0)
    .second(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar toggleTheme={toggleTheme} mode={mode} />
      Time: {now.format("dddd, MMMM Do YYYY, h:mm:ss a")}
      <Component {...pageProps} toggleTheme={toggleTheme} mode={mode} />
    </ThemeProvider>
  );
};

export default MyApp;
