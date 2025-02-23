import { useState, useEffect } from 'react';

const CategorySelector = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedTags([]);
  };

  const handleTagChange = (e) => {
    const tag = e.target.value;
    if (e.target.checked) {
      setSelectedTags((prev) => [...prev, tag]);
    } else {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    }
  };

  const selectedCategoryData = categories.find((cat) => cat._id === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Category Selector */}
      <div className="flex items-center gap-4">
        <label className="text-white">Category:</label>
        <select
          className="w-auto px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
          onChange={handleCategoryChange}
          value={selectedCategory || ''}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Selection (Horizontal) */}
      {selectedCategoryData && (
        <div>
          <h3 className="text-white">Select Tags:</h3>
          <div className="mt-2 p-2 bg-gray-800 text-white border border-gray-600 rounded-md flex flex-wrap gap-4">
            {selectedCategoryData.tags.map((tag) => (
              <label key={tag} className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={handleTagChange}
                  className="accent-purple-500"
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
