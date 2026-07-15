import React from 'react';
import EmotionCard from './EmotionCard';
import './CategoryList.css';

export default function CategoryList({ items, selectedId, onSelect, align = 'left' }) {
  return (
    <div className={`category-list-container ${align}`}>
      <div className="category-list">
        {items.map((item) => (
          <div key={item.id} className="category-item-wrapper">
            <EmotionCard 
              emotion={item}
              isSelected={selectedId === item.id}
              onClick={onSelect}
              isCategoryMode={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
