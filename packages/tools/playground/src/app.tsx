import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { HomePage } from './home/homePage';
import { ExampleDetailPage } from './exampleDetail/exampleDetailPage';
import { GlobalState } from './globalState';
import { Playground } from './playground';

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPlayground, setShowPlayground] = useState(false);

  useEffect(() => {
    // Handle legacy hash routes for backward compatibility
    if (location.hash && location.hash.length > 1) {
      const snippetId = location.hash.slice(1);
      if (snippetId && !snippetId.includes('/')) {
        // Check if we should show playground or example detail
        const urlParams = new URLSearchParams(location.search);
        if (urlParams.get('editor') === 'true') {
          setShowPlayground(true);
        } else {
          // Redirect to example detail page
          navigate(`/example/${snippetId}`, { replace: true });
        }
      }
    }

    // Initialize global state
    if (!GlobalState.Instance.isInitialized) {
      GlobalState.Instance.initialize();
    }
  }, [location, navigate]);

  // If we need to show the classic playground
  if (showPlayground) {
    return <Playground />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/example/:snippetId" element={<ExampleDetailPage />} />
      <Route path="/editor" element={<Playground />} />
      <Route path="/editor/:snippetId" element={<Playground />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};
