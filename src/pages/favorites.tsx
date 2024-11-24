// src/pages/favorites.tsx
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  Button,
  ListItemIcon,
} from "@mui/material";
import { Stop } from "../types/Stop";
import { Favorite, Home, Star } from "@mui/icons-material";

const iconMap: { [key: string]: JSX.Element } = {
  Favorite: <Favorite />,
  Home: <Home />,
  Star: <Star />,
};

const FavoritesPage = () => {
  const [savedStops, setSavedStops] = useState<Stop[]>([]);

  useEffect(() => {
    const savedStops = JSON.parse(localStorage.getItem("savedStops") || "[]");
    setSavedStops(savedStops);
  }, []);

  const handleRemoveStop = (stopId: string) => {
    const updatedStops = savedStops.filter((stop) => stop.stop_id !== stopId);
    setSavedStops(updatedStops);
    localStorage.setItem("savedStops", JSON.stringify(updatedStops));
  };

  return (
    <Container>
      <Typography variant="h1">Favorited Bus Stops</Typography>
      <List>
        {savedStops.map((stop) => (
          <ListItem key={stop.stop_id}>
            <ListItemIcon>{iconMap[stop.icon]}</ListItemIcon>
            <Typography>
              {stop.name} (Stop ID: {stop.stop_id}, Stop Name: {stop.stop_name})
            </Typography>
            <Button onClick={() => handleRemoveStop(stop.stop_id)}>
              Remove
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default FavoritesPage;
