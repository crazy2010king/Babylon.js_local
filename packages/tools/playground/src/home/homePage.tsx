import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { ExampleMetadata } from '../types/exampleTypes';
import { ExampleService } from '../services/exampleService';
import { CategoryNavComponent } from './categoryNavComponent';
import { SearchComponent } from './searchComponent';
import { ExampleCardComponent } from './exampleCardComponent';
import './home.scss';

export const HomePage: React.FC = () => {
  const [examples, setExamples] = useState<ExampleMetadata[]>([]);
  const [featuredExamples, setFeaturedExamples] = useState<ExampleMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const exampleService = ExampleService.Instance;

  const loadExamples = useCallback(async () => {
    setLoading(true);
    try {
      const [featured, searchResults] = await Promise.all([
        exampleService.getFeaturedExamples(),
        exampleService.searchExamples(searchTerm, selectedCategory || undefined)
      ]);

      setFeaturedExamples(featured);
      setExamples(searchResults);
    } catch (error) {
      console.error('Failed to load examples', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    loadExamples();
  }, [loadExamples]);

  const handleSearch = useCallback((keyword: string) => {
    setSearchTerm(keyword);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
  }, []);

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-header-content">
          <h1 className="home-title">Babylon.js Examples</h1>
          <p className="home-subtitle">
            Explore our collection of examples to learn how to build amazing 3D experiences with Babylon.js
          </p>
          <div className="home-search-bar">
            <SearchComponent onSearch={handleSearch} placeholder="Search examples by name, description, or tag..." />
          </div>
        </div>
      </header>

      <div className="home-content">
        <aside className="home-sidebar">
          <CategoryNavComponent
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </aside>

        <main className="home-main">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading examples...</p>
            </div>
          ) : (
            <>
              {!searchTerm && !selectedCategory && featuredExamples.length > 0 && (
                <section className="featured-section">
                  <h2 className="section-title">
                    <span className="material-icons">star</span>
                    Featured Examples
                  </h2>
                  <div className="examples-grid featured-grid">
                    {featuredExamples.map((example) => (
                      <ExampleCardComponent key={example.id} example={example} />
                    ))}
                  </div>
                </section>
              )}

              <section className="examples-section">
                <h2 className="section-title">
                  {searchTerm || selectedCategory ? 'Search Results' : 'All Examples'}
                  <span className="count-badge">{examples.length}</span>
                </h2>
                {examples.length === 0 ? (
                  <div className="empty-state">
                    <span className="material-icons">search_off</span>
                    <h3>No examples found</h3>
                    <p>Try adjusting your search or category filter</p>
                  </div>
                ) : (
                  <div className="examples-grid">
                    {examples.map((example) => (
                      <ExampleCardComponent key={example.id} example={example} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
