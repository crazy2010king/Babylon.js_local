import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import './scss/main.scss';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export * from "./playground";
export * from "./app";
