// src/pages/_app.tsx
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import "leaflet/dist/leaflet.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
