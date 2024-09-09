import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Search = ({ query, setQuery }) => (
  <div className="search-container">
    <FaSearch className="search-icon" />
    <input
      type="text"
      placeholder="Search User"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="search-bar"
    />
  </div>
);

export default Search;
