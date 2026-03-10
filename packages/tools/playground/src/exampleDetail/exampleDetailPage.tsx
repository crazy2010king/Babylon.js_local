import * as React from 'react';
import { useState, useEffect } from 'react';
import { ExampleDetail } from '../types/exampleTypes';
import { ExampleService } from '../services/exampleService';
import { RouteService } from '../services/routeService';
import { ExampleDescriptionComponent } from './exampleDescriptionComponent';
import { RendererComponent } from '../components/rendererComponent';
import { MonacoComponent } from '../components/editor/monacoComponent';
import { GlobalState } from '../globalState';
import './exampleDetail.scss';

export const ExampleDetailPage: React.FC = () => {
  const [example, setExample] = useState<ExampleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<'split' | 'preview' | 'code'>('split');
  const exampleService = ExampleService.Instance;
  const routeService = RouteService.Instance;

  useEffect(() => {
    const loadExample = async () => {
      const snippetId = routeService.getSnippetIdFromUrl();
      if (!snippetId) {
        setError('Example not found');
        setLoading(false);
        return;
      }

      try {
        const example = await exampleService.getExampleBySnippetId(snippetId);
        if (!example) {
          setError('Failed to load example');
          return;
        }

        setExample(example);

        // Update global state with the example code
        if (GlobalState.Instance.filesManager) {
          GlobalState.Instance.filesManager.setMainCode(example.code);
        }
      } catch (err) {
        console.error('Failed to load example', err);
        setError('Failed to load example');
      } finally {
        setLoading(false);
      }
    };

    loadExample();
  }, []);

  if (loading) {
    return (
      <div className="example-detail-loading">
        <div className="spinner"></div>
        <p>Loading example...</p>
      </div>
    );
  }

  if (error || !example) {
    return (
      <div className="example-detail-error">
        <span className="material-icons">error</span>
        <h1>{error || 'Example not found'}</h1>
        <button onClick={() => routeService.navigateToHome()}>
          Back to Examples
        </button>
      </div>
    );
  }

  return (
    <div className="example-detail-page">
      <div className="detail-header">
        <ExampleDescriptionComponent example={example} />
        <div className="layout-controls">
          <button
            className={`layout-button ${layout === 'preview' ? 'active' : ''}`}
            onClick={() => setLayout('preview')}
            title="Preview only"
          >
            <span className="material-icons">desktop_windows</span>
          </button>
          <button
            className={`layout-button ${layout === 'split' ? 'active' : ''}`}
            onClick={() => setLayout('split')}
            title="Split view"
          >
            <span className="material-icons">dashboard</span>
          </button>
          <button
            className={`layout-button ${layout === 'code' ? 'active' : ''}`}
            onClick={() => setLayout('code')}
            title="Code only"
          >
            <span className="material-icons">code</span>
          </button>
        </div>
      </div>

      <div className={`detail-content layout-${layout}`}>
        {(layout === 'split' || layout === 'preview') && (
          <div className="preview-panel">
            <RendererComponent />
          </div>
        )}
        {(layout === 'split' || layout === 'code') && (
          <div className="code-panel">
            <MonacoComponent readOnly={true} />
          </div>
        )}
      </div>
    </div>
  );
};
