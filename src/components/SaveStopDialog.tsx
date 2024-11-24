// src/components/SaveStopDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import { Stop } from "../types/Stop";
import { Favorite, Home, Star } from "@mui/icons-material";

const icons = [
  { name: "Favorite", icon: <Favorite /> },
  { name: "Home", icon: <Home /> },
  { name: "Star", icon: <Star /> },
];

const SaveStopDialog = ({
  open,
  onClose,
  onSave,
  stop,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (stop: Stop, name: string, icon: string) => void;
  stop: Stop | null;
}) => {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");

  const handleSave = () => {
    if (stop) {
      onSave(stop, name, selectedIcon);
      setName("");
      setSelectedIcon("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Save Bus Stop</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Grid container spacing={2} style={{ marginTop: 16 }}>
          {icons.map((icon) => (
            <Grid item key={icon.name}>
              <IconButton
                color={selectedIcon === icon.name ? "primary" : "default"}
                onClick={() => setSelectedIcon(icon.name)}
              >
                {icon.icon}
              </IconButton>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveStopDialog;
