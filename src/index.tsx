import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactBoopGame from './app/ui/game'

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<ReactBoopGame />);