import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Home, Favorite } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material";

const BottomNavbar = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={router.pathname}
        onChange={(event, newValue) => {
          router.push(newValue);
        }}
        sx={{ backgroundColor: theme.palette.background.paper }}
      >
        <BottomNavigationAction label="Home" value="/" icon={<Home />} />
        <BottomNavigationAction
          label="Favorites"
          value="/favorites"
          icon={<Favorite />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavbar;
