import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch, onTypeChange, onCategoryChange }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setType(value);
    onTypeChange(value);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    onCategoryChange(value);
  };

  const handleClearFilters = () => {
    setQuery('');
    setType('');
    setCategory('');
    onSearch('');
    onTypeChange('');
    onCategoryChange('');
  };

  return (
    <motion.div
      className="card card-glass mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Search by keyword..."
            value={query}
            onChange={handleSearch}
            className="input"
          />
          <label className="input-label">Search</label>
        </div>

        {/* Type Filter */}
        <select
          value={type}
          onChange={handleTypeChange}
          className="input"
        >
          <option value="">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        {/* Category Filter */}
        <select
          value={category}
          onChange={handleCategoryChange}
          className="input"
        >
          <option value="">All Categories</option>
          <option value="Keys">Keys</option>
          <option value="Wallet">Wallet</option>
          <option value="Pet">Pet</option>
          <option value="Phone">Phone</option>
          <option value="Documents">Documents</option>
          <option value="Other">Other</option>
        </select>

        {/* Clear Button */}
        <button
          onClick={handleClearFilters}
          className="btn btn-secondary"
        >
          Clear Filters
        </button>
      </div>
    </motion.div>
  );
};

export default SearchBar;
