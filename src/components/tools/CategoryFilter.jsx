import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelectCategory('')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === ''
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Tools
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelectCategory(cat._id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === cat._id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
