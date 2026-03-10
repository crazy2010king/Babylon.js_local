import * as React from 'react';
import { ExampleDetail } from '../types/exampleTypes';
import { RouteService } from '../services/routeService';
import './exampleDetail.scss';

interface ExampleDescriptionProps {
  example: ExampleDetail;
}

export const ExampleDescriptionComponent: React.FC<ExampleDescriptionProps> = ({ example }) => {
  const routeService = RouteService.Instance;

  const handleBackClick = () => {
    routeService.navigateToHome();
  };

  const handleEditClick = () => {
    routeService.navigateToPlayground(example.snippetId);
  };

  return (
    <div className="example-description">
      <div className="description-header">
        <button className="back-button" onClick={handleBackClick}>
          <span className="material-icons">arrow_back</span>
          Back to Examples
        </button>
        <button className="edit-button" onClick={handleEditClick}>
          <span className="material-icons">edit</span>
          Edit in Playground
        </button>
      </div>

      <div className="description-content">
        <h1 className="example-title">{example.name}</h1>

        <div className="example-meta">
          <span className={`difficulty-badge ${example.difficulty}`}>
            {example.difficulty}
          </span>
          {example.featured && (
            <span className="featured-badge">
              <span className="material-icons">star</span>
              Featured
            </span>
          )}
          <span className="category-badge">
            <span className="material-icons">folder</span>
            {example.category}
          </span>
          <span className="date-badge">
            <span className="material-icons">update</span>
            Updated {new Date(example.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <p className="example-description-text">{example.description}</p>

        <div className="example-tags">
          <h3>Tags</h3>
          <div className="tags-list">
            {example.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        {example.author && (
          <div className="example-author">
            <h3>Author</h3>
            <p>{example.author}</p>
          </div>
        )}
      </div>
    </div>
  );
};
