import { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <input
      type="text"
      placeholder="Поиск курсов..."
      value={query}
      onChange={handleSearch}
      className="search-input"
    />
  );
}

export default SearchBar;
