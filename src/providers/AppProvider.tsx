import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Stop } from "../types/Stop";

interface AppContextProps {
  favorites: Stop[];
  addFavorite: (stop: Stop, name: string, icon: string) => void;
  removeFavorite: (stopId: string) => void;
  isFavorite: (stopId: string) => boolean;
  mode: "light" | "dark";
  toggleMode: () => void;
}

export const AppContext = createContext<AppContextProps>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
  mode: "light",
  toggleMode: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [favorites, setFavorites] = useState<Stop[]>([]);
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Load from localStorage
  useEffect(() => {
    const savedStops = JSON.parse(localStorage.getItem("savedStops") || "[]");
    setFavorites(savedStops);

    const savedMode = localStorage.getItem("mode");
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  // Persist favorites changes
  useEffect(() => {
    localStorage.setItem("savedStops", JSON.stringify(favorites));
  }, [favorites]);

  // Persist mode change
  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  const addFavorite = (stop: Stop, name: string, icon: string) => {
    if (!favorites.some((fav) => fav.stop_id === stop.stop_id)) {
      setFavorites((prev) => [...prev, { ...stop, name, icon }]);
    }
  };

  const removeFavorite = (stopId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.stop_id !== stopId));
  };

  const isFavorite = (stopId: string): boolean => {
    return favorites.some((fav) => fav.stop_id === stopId);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        mode,
        toggleMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
