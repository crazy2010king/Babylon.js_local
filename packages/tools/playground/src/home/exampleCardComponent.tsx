import * as React from 'react';
import { ExampleMetadata } from '../types/exampleTypes';
import { RouteService } from '../services/routeService';
import './home.scss';

interface ExampleCardProps {
  example: ExampleMetadata;
}

export const ExampleCardComponent: React.FC<ExampleCardProps> = ({ example }) => {
  const routeService = RouteService.Instance;

  const handleClick = () => {
    routeService.navigateToExample(example.snippetId);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    routeService.navigateToPlayground(example.snippetId);
  };

  return (
    <div className="example-card" onClick={handleClick}>
      <div className="example-card-thumbnail">
        {example.thumbnailUrl ? (
          <img src={example.thumbnailUrl} alt={example.name} />
        ) : (
          <div className="example-card-placeholder">
            <span className="material-icons">preview</span>
          </div>
        )}
        <div className="example-card-overlay">
          <button
            className="edit-button"
            onClick={handleEditClick}
            title="Open in Playground Editor"
          >
            <span className="material-icons">edit</span>
            Edit
          </button>
        </div>
      </div>
      <div className="example-card-content">
        <h3 className="example-card-title">{example.name}</h3>
        <p className="example-card-description">{example.description}</p>
        <div className="example-card-meta">
          <span className={`difficulty-badge ${example.difficulty}`}>
            {example.difficulty}
          </span>
          {example.featured && (
            <span className="featured-badge">
              <span className="material-icons">star</span>
              Featured
            </span>
          )}
        </div>
        <div className="example-card-tags">
          {example.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
          {example.tags.length > 3 && (
            <span className="tag-more">+{example.tags.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};
