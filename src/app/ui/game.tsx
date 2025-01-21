import React from 'react';
import './Grid.css';

const Grid = () => {
  return (
    <div className="grid-container">
      {[...Array(36)].map((_, index) => (
        <div key={index} className="grid-item"></div>
      ))}
    </div>
  );
};

export default Grid;