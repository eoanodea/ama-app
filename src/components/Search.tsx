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
import { Close, Search as SearchIcon } from "@mui/icons-material";
import styled from "@emotion/styled";

const StyledOuterContainer = styled.div`
  position: absolute;
  width: 90%;
  margin: 0 auto;
`;

const StyledSearchContainer = styled(Paper)`
  position: relative;
  top: 50px;
  z-index: 1;
  width: 90%;
  margin: 0 auto;
  justify-self: anchor-center;
  display: flex;
  align-items: center;
  padding: 2px 4px;
`;

const StyledResultsContainer = styled(Paper)`
  position: absolute;
  left: 0;
  top: 100px;
  width: 100%
  max-height: 300px;
  overflow-y: auto;
  z-index: 1;
  margin-top: 4px;
  border-radius: 0 0 4px 4px;
`;

interface IProps {
  setMapCenter: (center: [number, number, number]) => void;
}

const Search = ({ setMapCenter }: IProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();

      setSearchResults(data ? data.slice(0, 3) : []); // Limit to 3 results
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
    setMapCenter([parseFloat(lat), parseFloat(lon), 12]);
    setSearchResults([]);
  };

  const handleButtonClick = () => {
    if (searchResults.length > 0) {
      const { lat, lon } = searchResults[0];
      setMapCenter([parseFloat(lat), parseFloat(lon), 12]);
      setSearchResults([]);
    }
  };

  const debouncedHandleSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length >= 5) {
        handleSearch(query);
      } else {
        setSearchResults([]);
      }
    }, 500),
    [handleSearch, setSearchResults]
  );

  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <StyledOuterContainer>
      <StyledSearchContainer
        sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search"
          inputProps={{ "aria-label": "search google maps" }}
          value={searchQuery}
          onChange={handleChange}
        />
        {searchResults.length > 0 && (
          <>
            <IconButton
              sx={{ p: "10px" }}
              aria-label="clear search results"
              onClick={clearSearchResults}
            >
              <Close />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          </>
        )}
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={handleButtonClick}
        >
          <SearchIcon />
        </IconButton>
      </StyledSearchContainer>
      {searchResults.length > 0 && (
        <StyledResultsContainer>
          {searchResults.map((result) => (
            <ListItemButton
              key={result.place_id}
              onClick={() => handleResultClick(result.lat, result.lon)}
            >
              <ListItemText primary={result.display_name} />
            </ListItemButton>
          ))}
        </StyledResultsContainer>
      )}
    </StyledOuterContainer>
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
