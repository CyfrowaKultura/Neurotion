import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { combinations, categories } from '../data/emotions';
import './EmotionListModal.css';

export default function EmotionListModal({ 
  isOpen, 
  onClose, 
  unlockedEmotionIds, 
  allEmotionsMap, 
  onEmotionClick 
}) {
  if (!isOpen) return null;

  const isMobile = window.innerWidth <= 768;

  // Group unlocked emotions by category
  const groupedEmotions = {};
  unlockedEmotionIds.forEach(id => {
    const emotion = allEmotionsMap.get(id);
    if (!emotion) return;
    
    if (!groupedEmotions[emotion.categoryId]) {
      groupedEmotions[emotion.categoryId] = [];
    }
    groupedEmotions[emotion.categoryId].push(emotion);
  });

  return (
    <AnimatePresence>
      <motion.div 
        className="emotion-list-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button 
          className="global-close-btn" 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: isMobile ? '15px' : '45px',
            right: isMobile ? '15px' : '65px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: isMobile ? '40px' : '48px',
            height: isMobile ? '40px' : '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 100
          }}
        >
          <X size={28} color="#555" />
        </button>

        <motion.div 
          className="emotion-list-content"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="emotion-list-header">
            <h2>Księga Emocji</h2>
          </div>

          <div className="emotion-list-body">
            {categories.map(category => {
              const categoryEmotions = groupedEmotions[category.id];
              if (!categoryEmotions || categoryEmotions.length === 0) return null;

              return (
                <div key={category.id} className="emotion-category-group">
                  <div className="category-title" style={{ borderColor: category.color, color: category.color }}>
                    {category.name}
                  </div>
                  
                  {categoryEmotions.map(emotion => {
                    const combo = combinations.find(c => c.result.id === emotion.id);
                    const isBaseEmotion = !combo;

                    return (
                      <div 
                        key={emotion.id} 
                        className="emotion-item"
                        onClick={() => onEmotionClick(emotion)}
                      >
                        <div className="emotion-item-header">
                          <div className="emotion-color-dot" style={{ background: emotion.color }}></div>
                          <span className="emotion-item-name">{emotion.name}</span>
                        </div>
                        
                        {!isBaseEmotion && (
                          <div className="emotion-item-ingredients" onClick={(e) => e.stopPropagation()}>
                            <span style={{ marginRight: '4px' }}>Z:</span>
                            {combo.ingredients.map((ingId, idx) => {
                              const ing = allEmotionsMap.get(ingId);
                              const isUnlocked = unlockedEmotionIds.includes(ingId);
                              return (
                                <React.Fragment key={idx}>
                                  {idx > 0 && <span>+</span>}
                                  <span 
                                    className="ingredient-tag" 
                                    style={{ opacity: isUnlocked ? 1 : 0.5 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isUnlocked && ing) onEmotionClick(ing);
                                    }}
                                  >
                                    {isUnlocked && ing ? ing.name : '???'}
                                  </span>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
