import { useState, useEffect } from 'react';

const CategoryTagSelector = () => {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState({});
  const [expanded, setExpanded] = useState(new Set());
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [allSelected, setAllSelected] = useState(true); // New state for "Select All" toggle

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        selectAllCategories(data); // Auto-select everything on mount
      })
      .catch(console.error);
  }, []);

  // Select all categories and their tags
  const selectAllCategories = (data) => {
    const allSelected = data.reduce((acc, { _id, tags }) => {
      acc[_id] = new Set(tags);
      return acc;
    }, {});
    setSelected(allSelected);
    setAllSelected(true);
  };

  const toggleCategory = (categoryId) => {
    setSelected((prev) => {
      const newSelected = { ...prev };
      if (newSelected[categoryId]) {
        delete newSelected[categoryId]; // Uncheck category
      } else {
        newSelected[categoryId] = new Set(categories.find((c) => c._id === categoryId)?.tags || []);
      }
      return newSelected;
    });
  };

  const toggleTag = (categoryId, tag) => {
    setSelected((prev) => ({
      ...prev,
      [categoryId]: new Set(prev[categoryId]?.has(tag) ? [...prev[categoryId]].filter((t) => t !== tag) : [...(prev[categoryId] || []), tag]),
    }));
  };

  const toggleExpand = (categoryId) => {
    setExpanded((prev) => {
      const newExpanded = new Set(prev);
      newExpanded.has(categoryId) ? newExpanded.delete(categoryId) : newExpanded.add(categoryId);
      return newExpanded;
    });
  };

  // Toggle Select All
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected({});
    } else {
      selectAllCategories(categories);
    }
    setAllSelected(!allSelected);
  };

  return (
    <div>
      {!isCollapsed && (
        <div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories.map(({ _id, name, tags }) => (
              <div key={_id} className="p-2 px-6 border border-gray-700 rounded-md">
                <div className="flex justify-between items-center">
                  <input type="checkbox" checked={_id in selected} onChange={() => toggleCategory(_id)} />
                  <label>{name}</label>
                  <button
                    className="text-gray-200 hover:text-white p-2 rounded-full bg-gray-600/50 hover:bg-gray-700 transition-all"
                    onClick={() => toggleExpand(_id)}
                  >
                    {expanded.has(_id) ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                {selected[_id] && expanded.has(_id) && (
                  <div className="mt-2 p-2 text-left bg-gray-800 text-white border border-gray-600 rounded-md">
                    {tags.map((tag) => (
                      <div key={tag} className="mb-2">
                        <input type="checkbox" checked={selected[_id]?.has(tag) || false} onChange={() => toggleTag(_id, tag)} />
                        <label>{tag}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              className="text-gray-200 hover:text-white p-2 rounded-full bg-gray-600/50 hover:bg-gray-700 transition-all mr-2"
              onClick={toggleSelectAll}
            >
              {allSelected ? 'Clear All' : 'Select All'}
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mt-6 text-gray-200 hover:text-white p-2 rounded-full bg-gray-600/50 hover:bg-gray-700 transition-all"
      >
        {isCollapsed ? 'Show Filters' : 'Hide Filters'}
      </button>
    </div>
  );
};

export default CategoryTagSelector;
