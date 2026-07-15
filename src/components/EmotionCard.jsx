import React from 'react';
import { categories } from '../data/emotions';
import './EmotionCard.css';

export default function EmotionCard({ 
  emotion, 
  onClick, 
  isSelected = false,
  isCategoryMode = false
}) {
  const { name, color, categoryId } = emotion;
  
  // Find color: If it is a category itself, use its color. Otherwise find its parent category color.
  const catColor = isCategoryMode ? color : categories.find(c => c.id === categoryId)?.color;
  
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', emotion.id);
  };

  return (
    <div 
      className={`emotion-card-wrapper ${isSelected ? 'selected' : ''} ${isCategoryMode ? 'is-category' : ''}`}
      style={{ '--card-color': color || '#aaaaaa' }}
      draggable={true}
      onDragStart={handleDragStart}
      onClick={() => onClick(emotion)}
    >
      <div 
        className="emotion-card-inner" 
        style={{ borderColor: isCategoryMode ? catColor : undefined }}
      >
        <div className="card-content">
          <h3 className="card-name">{name}</h3>
        </div>
      </div>
    </div>
  );
}
