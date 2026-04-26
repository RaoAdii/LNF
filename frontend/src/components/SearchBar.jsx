import React, { useMemo, useState } from 'react';
import { ListFilter, Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, onTypeChange, onCategoryChange, className = '' }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');

  const activeFilterCount = useMemo(() => {
    return [query, type, category].filter(Boolean).length;
  }, [query, type, category]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleTypeChange = (event) => {
    const value = event.target.value;
    setType(value);
    onTypeChange(value);
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
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
    <div className={`card card-glass mb-10 ${className}`.trim()}>
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-2 text-sm font-dm text-ink-secondary">
          <ListFilter size={16} />
          <span>Search and filters</span>
        </div>
        {activeFilterCount > 0 && (
          <span className="text-xs font-dm text-accent">{activeFilterCount} active</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-3 items-end">
        <div className="input-wrapper sm:col-span-2 xl:col-span-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by keyword, title or location"
              value={query}
              onChange={handleSearch}
              className="input pl-10"
              aria-label="Search listings"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          </div>
        </div>

        <div className="xl:col-span-3">
          <label className="text-xs font-dm text-ink-secondary mb-1 block">Type</label>
          <select value={type} onChange={handleTypeChange} className="input h-[44px]" aria-label="Filter by type">
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        <div className="xl:col-span-3">
          <label className="text-xs font-dm text-ink-secondary mb-1 block">Category</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="input h-[44px]"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            <option value="Keys">Keys</option>
            <option value="Wallet">Wallet</option>
            <option value="Pet">Pet</option>
            <option value="Phone">Phone</option>
            <option value="Documents">Documents</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="sm:col-span-2 xl:col-span-1">
          <button onClick={handleClearFilters} className="btn btn-secondary w-full h-[44px]" aria-label="Clear all filters">
            <span className="inline-flex items-center justify-center gap-2">
              <X size={14} />
              <span className="xl:hidden">Clear</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
