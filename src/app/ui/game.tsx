import React from 'react';
import './game.css';

const Grid = () => {
  return (
    <div className="grid-container">
      {[...Array(36)].map((_, index) => (
        <button key={index} type="button">
            <img src='/square.png'></img>
        </button>
        // <div key={index} className="grid-item">
        // </div>
      ))}
    </div>
  );
};

export default Grid;