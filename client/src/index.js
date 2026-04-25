import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


            app.use(cors({
  origin: ['http://localhost:3000', 'https://job-board-frontend-xxxx.vercel.app']
}));
