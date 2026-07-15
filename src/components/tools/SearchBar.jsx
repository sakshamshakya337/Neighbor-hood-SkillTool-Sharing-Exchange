import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md relative">
      <input
        type="text"
        placeholder="Search for tools..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </div>
    </form>
  );
};

export default SearchBar;
