import {
  Paper,
  InputBase,
  IconButton,
  Divider,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";
import { Directions, Search as SearchIcon } from "@mui/icons-material";
import styled from "@emotion/styled";

const StyledSearchContainer = styled(Paper)`
  position: absolute;
  top: 50px;
  z-index: 1;
  width: 90%;
  margin: 0 auto;
  justify-self: anchor-center;
`;

interface IProps {
  setMapCenter: (center: [number, number]) => void;
}

const Search = ({ setMapCenter }: IProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=it&viewbox=13.28539,42.39621,13.51267,42.32289&bounded=1&format=json`
      );

      const data = await response.json();
      setSearchResults(data.slice(0, 3)); // Limit to 3 results
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedHandleSearch(query);
  };

  const handleResultClick = (lat: string, lon: string) => {
    setMapCenter([parseFloat(lat), parseFloat(lon)]);
    setSearchResults([]);
  };

  const handleButtonClick = () => {
    if (searchResults.length > 0) {
      const { lat, lon } = searchResults[0];
      setMapCenter([parseFloat(lat), parseFloat(lon)]);
      setSearchResults([]);
    }
  };

  const debouncedHandleSearch = useCallback(
    debounce((query: string) => handleSearch(query), 500),
    [handleSearch]
  );

  return (
    <StyledSearchContainer
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Google Maps"
        inputProps={{ "aria-label": "search google maps" }}
        value={searchQuery}
        onChange={handleChange}
      />
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={handleButtonClick}
      >
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
        <Directions />
      </IconButton>
      {searchResults.map((result) => (
        <ListItemButton
          // button
          key={result.place_id}
          onClick={() => handleResultClick(result.lat, result.lon)}
        >
          <ListItemText primary={result.display_name} />
        </ListItemButton>
      ))}
    </StyledSearchContainer>
  );
};

export default Search;

{
  /* <>
<TextField
  label="Search for an address"
  value={searchQuery}
  onChange={handleChange}
  fullWidth
  margin="normal"
/>
<List>
  {searchResults.map((result) => (
    <ListItemButton
      // button
      key={result.place_id}
      onClick={() => handleResultClick(result.lat, result.lon)}
    >
      <ListItemText primary={result.display_name} />
    </ListItemButton>
  ))}
</List>
<Button variant="contained" color="primary" onClick={handleButtonClick}>
  Search
</Button>
</> */
}
