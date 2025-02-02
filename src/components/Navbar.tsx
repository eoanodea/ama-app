// src/components/Navbar.tsx
import { AppBar, Toolbar, Typography, Switch, Button } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import Link from "next/link";
import BottomNavbar from "./BottomNavbar";

const Navbar = ({
  toggleTheme,
  mode,
}: {
  toggleTheme: () => void;
  mode: "light" | "dark";
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return isMobile ? (
    <BottomNavbar
    // toggleTheme={toggleTheme} mode={mode}
    />
  ) : (
    <AppBar
      position="static"
      color="default"
      style={{ backgroundColor: theme.palette.background.paper }}
    >
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Link href="/" passHref>
          <Button color="inherit">Home</Button>
        </Link>
        <Link href="/favorites" passHref>
          <Button color="inherit">Favorites</Button>
        </Link>
        <Switch checked={mode === "dark"} onChange={toggleTheme} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
