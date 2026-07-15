import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import { combinations, categories } from '../data/emotions';
import './EmotionListModal.css';

export default function EmotionListModal({ 
  isOpen, 
  onClose, 
  unlockedEmotionIds, 
  allEmotionsMap, 
  onEmotionClick 
}) {
  const [showUnlocked, setShowUnlocked] = useState(true);

  if (!isOpen) return null;

  const isMobile = window.innerWidth <= 768;

  const allEmotionIds = Array.from(allEmotionsMap.keys());
  const lockedEmotionIds = allEmotionIds.filter(id => !unlockedEmotionIds.includes(id));

  const currentIds = showUnlocked ? unlockedEmotionIds : lockedEmotionIds;

  // Group current emotions by category
  const groupedEmotions = {};
  currentIds.forEach(id => {
    const emotion = allEmotionsMap.get(id);
    if (!emotion) return;
    
    // Fallback to primary category if base emotion or unknown
    const categoryId = emotion.categoryId || (categories.find(c => c.id === emotion.id) ? emotion.id : 'unknown');
    
    if (!groupedEmotions[categoryId]) {
      groupedEmotions[categoryId] = [];
    }
    groupedEmotions[categoryId].push(emotion);
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
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button 
                onClick={() => setShowUnlocked(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: showUnlocked ? '#333' : '#e0e0e0',
                  color: showUnlocked ? '#fff' : '#666',
                  cursor: 'pointer',
                  fontWeight: showUnlocked ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                Odkryte ({unlockedEmotionIds.length})
              </button>
              <button 
                onClick={() => setShowUnlocked(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: !showUnlocked ? '#333' : '#e0e0e0',
                  color: !showUnlocked ? '#fff' : '#666',
                  cursor: 'pointer',
                  fontWeight: !showUnlocked ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                Nieodkryte ({lockedEmotionIds.length})
              </button>
            </div>
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
                        onClick={() => {
                          if (showUnlocked) onEmotionClick(emotion);
                        }}
                        style={{ cursor: showUnlocked ? 'pointer' : 'default', opacity: showUnlocked ? 1 : 0.7 }}
                      >
                        <div className="emotion-item-header">
                          <div className="emotion-color-dot" style={{ background: emotion.color }}></div>
                          <span className="emotion-item-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {emotion.name} {!showUnlocked && <Lock size={14} color="#888" />}
                          </span>
                        </div>
                        
                        {showUnlocked && !isBaseEmotion && (
                          <div className="emotion-item-ingredients" onClick={(e) => e.stopPropagation()}>
                            <span style={{ marginRight: '4px' }}>Z:</span>
                            {combo.ingredients.map((ingId, idx) => {
                              const ing = allEmotionsMap.get(ingId);
                              const isIngredientUnlocked = unlockedEmotionIds.includes(ingId);
                              return (
                                <React.Fragment key={idx}>
                                  {idx > 0 && <span>+</span>}
                                  <span 
                                    className="ingredient-tag" 
                                    style={{ 
                                      opacity: isIngredientUnlocked ? 1 : 0.5,
                                      cursor: isIngredientUnlocked ? 'pointer' : 'default',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isIngredientUnlocked && ing) onEmotionClick(ing);
                                    }}
                                  >
                                    {isIngredientUnlocked ? (
                                      ing ? ing.name : '???'
                                    ) : (
                                      <>
                                        {ing ? ing.name : '???'} <Lock size={10} color="#888" />
                                      </>
                                    )}
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
