import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FanGallery from './FanGallery';
import CategoryList from './CategoryList';
import { categories } from '../data/emotions';
import './GalleryManager.css';

export default function GalleryManager({ 
  emotions, 
  align = 'left', 
  selectedEmotionId, 
  onSelectEmotion 
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Filter categories that have at least one unlocked emotion
  const activeCategories = categories.filter(cat => 
    emotions.some(e => e.categoryId === cat.id)
  );

  const handleCategorySelect = (category) => {
    setSelectedCategoryId(prev => prev === category.id ? null : category.id);
  };

  const currentCategoryEmotions = emotions.filter(e => e.categoryId === selectedCategoryId);

  // Animation variants based on alignment
  const slideVariants = {
    hidden: { 
      width: 0, 
      opacity: 0,
      x: align === 'left' ? -50 : 50
    },
    visible: { 
      width: '120px', 
      opacity: 1,
      x: 0,
      transition: { type: 'spring', damping: 25, stiffness: 200 }
    },
    exit: { 
      width: 0, 
      opacity: 0,
      x: align === 'left' ? -50 : 50,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className={`gallery-manager ${align}`}>
      {/* Category Column */}
      <div className="column category-column">
        <CategoryList 
          items={activeCategories} 
          selectedId={selectedCategoryId}
          onSelect={handleCategorySelect}
          align={align}
        />
      </div>

      {/* Emotions Column (Animated) */}
      <AnimatePresence mode="wait">
        {selectedCategoryId && currentCategoryEmotions.length > 0 && (
          <motion.div 
            key={selectedCategoryId}
            className="column emotion-column"
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <FanGallery 
              items={currentCategoryEmotions} 
              selectedId={selectedEmotionId}
              onSelect={onSelectEmotion}
              align={align}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
