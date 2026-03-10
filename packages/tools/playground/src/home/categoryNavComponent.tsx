import * as React from 'react';
import { useState, useEffect } from 'react';
import { ExampleCategory } from '../types/exampleTypes';
import { ExampleService } from '../services/exampleService';
import './home.scss';

interface CategoryNavComponentProps {
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategory?: string | null;
}

export const CategoryNavComponent: React.FC<CategoryNavComponentProps> = ({
  onCategorySelect,
  selectedCategory
}) => {
  const [categories, setCategories] = useState<ExampleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const exampleService = ExampleService.Instance;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await exampleService.getCategories();
        setCategories(categories);
      } catch (error) {
        console.error('Failed to load categories', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(selectedCategory === categoryId ? null : categoryId);
  };

  const handleAllClick = () => {
    onCategorySelect(null);
  };

  if (loading) {
    return (
      <div className="category-nav">
        <div className="category-nav-loading">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="category-nav">
      <h2 className="category-nav-title">Categories</h2>
      <div className="category-list">
        <div
          className={`category-item ${selectedCategory === null ? 'active' : ''}`}
          onClick={handleAllClick}
        >
          <span className="material-icons">apps</span>
          All Examples
        </div>
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <span className="material-icons">folder</span>
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
};
