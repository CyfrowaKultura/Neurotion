import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { combinations } from '../data/emotions';
import EmotionChart from './EmotionChart';
import './MaximizedModal.css';

export default function MaximizedModal({ emotions, isOpen, onClose, unlockedEmotionIds, allEmotionsMap, onShowOnMap, onAssignSlot1, onAssignSlot2 }) {
  const [activeView, setActiveView] = useState('info'); // 'info' or 'map'

  if (!isOpen || !emotions || emotions.length === 0) return null;

  const isSingle = emotions.length === 1;
  const isMobile = window.innerWidth <= 768;

  const getGridCols = (count) => {
    if (isMobile) return 1; // Always 1 column on mobile
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    if (count === 4) return 2; // 2x2
    return 3; // 2x3 or more
  };

  const gridCols = getGridCols(emotions.length);

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
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

        <div 
          className="multi-modal-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gap: '24px',
            maxWidth: '1400px',
            width: isMobile ? '100%' : '95%',
            margin: '0 auto',
            justifyItems: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: isMobile ? '40px 10px' : '40px 20px',
            boxSizing: 'border-box'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {emotions.map((emotion, index) => {
            const isUnlocked = unlockedEmotionIds.includes(emotion.id);
            const combo = combinations.find(c => c.result.id === emotion.id);

            return (
              <motion.div 
                key={emotion.id}
                className="modal-card"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ 
                  type: "spring", 
                  damping: 25, 
                  stiffness: 300,
                  delay: index * 0.05 
                }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  pointerEvents: 'auto',
                  '--modal-color': emotion.color, 
                  width: '100%', 
                  maxWidth: isSingle ? '1000px' : '450px',
                  aspectRatio: (isMobile && isSingle) ? '1 / 1.15' : 'auto',
                  margin: 0,
                  display: isSingle && !isMobile ? 'grid' : 'flex',
                  flexDirection: 'column',
                  gridTemplateColumns: isSingle && !isMobile ? '400px 1fr' : '1fr',
                  gap: isSingle && !isMobile ? '32px' : '0',
                  padding: isMobile ? '24px 20px' : (isSingle ? '32px' : '40px'),
                  boxShadow: `0 0 40px ${emotion.color}33`
                }}
              >
                {/* INFO PANEL */}
                {(!isMobile || activeView === 'info') && (
                  <div className="modal-left-col" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    position: 'relative',
                    height: isMobile ? '100%' : 'auto',
                    overflowY: 'auto',
                    background: (!isMobile && isSingle) ? 'rgba(255,255,255,0.05)' : 'transparent',
                    borderRadius: '16px',
                    border: (!isMobile && isSingle) ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    padding: (!isMobile && isSingle) ? '2.5rem' : '0',
                    boxSizing: 'border-box'
                  }}>
                    {/* Slot Assignment Buttons */}
                    {isUnlocked && (
                      <div style={{ position: 'absolute', top: '0px', left: '0px', zIndex: 10, display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => onAssignSlot1 && onAssignSlot1(emotion.id)}
                          style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'Outfit, sans-serif', fontWeight: 'bold', color: '#555'
                          }}
                          title="Umieść w slocie 1"
                        >
                          1
                        </button>
                        <button 
                          onClick={() => onAssignSlot2 && onAssignSlot2(emotion.id)}
                          style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'Outfit, sans-serif', fontWeight: 'bold', color: '#555'
                          }}
                          title="Umieść w slocie 2"
                        >
                          2
                        </button>
                      </div>
                    )}

                    {isMobile && isSingle && (
                      <button 
                        onClick={() => setActiveView('map')}
                        style={{ position: 'absolute', top: '0', right: '0', background: 'transparent', border: 'none', cursor: 'pointer', padding: '16px', zIndex: 10 }}
                      >
                        <ArrowRight size={28} color="#555" />
                      </button>
                    )}
                    <div className="modal-header">
                      <h2 className="modal-title" style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {emotion.name}
                        {!isUnlocked && <span style={{ fontSize: '12px', background: 'rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: '10px', color: '#666' }}>Nieodkryte</span>}
                      </h2>
                    </div>
                    
                    <div className="modal-body">
                      <p className="modal-desc" style={{ fontSize: '18px', lineHeight: '1.6' }}>{emotion.description}</p>
                      {isUnlocked && combo && allEmotionsMap && (
                        <div className="modal-source" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center' }}>
                          <div className="source-ingredients" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="ingredient-tag" style={{ background: `${allEmotionsMap.get(combo.ingredients[0])?.color}22`, color: allEmotionsMap.get(combo.ingredients[0])?.color, padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
                              {allEmotionsMap.get(combo.ingredients[0])?.name}
                            </div>
                            <span className="source-plus" style={{ color: '#aaa', fontWeight: 500 }}>+</span>
                            <div className="ingredient-tag" style={{ background: `${allEmotionsMap.get(combo.ingredients[1])?.color}22`, color: allEmotionsMap.get(combo.ingredients[1])?.color, padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
                              {allEmotionsMap.get(combo.ingredients[1])?.name}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {isSingle && (!isMobile || activeView === 'map') && (
                  <div className="modal-right-col" style={{ 
                    position: 'relative', 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: isMobile ? '40px 10px 10px 10px' : '2.5rem',
                    width: '100%',
                    height: isMobile ? '100%' : 'auto',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {isMobile && (
                      <button 
                        onClick={() => setActiveView('info')}
                        style={{ position: 'absolute', top: '0', right: '0', background: 'transparent', border: 'none', cursor: 'pointer', padding: '16px', zIndex: 10 }}
                      >
                        <ArrowLeft size={28} color="#555" />
                      </button>
                    )}
                    <div style={{ flex: 1, position: 'relative' }}>
                      <EmotionChart 
                        allEmotionsMap={allEmotionsMap}
                        unlockedEmotionIds={unlockedEmotionIds}
                        highlightedEmotionId={emotion.id}
                        lightTheme={true}
                        staticMode={true}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
