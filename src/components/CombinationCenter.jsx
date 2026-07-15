import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Pencil, Info } from 'lucide-react';
import './CombinationCenter.css';
import CombinationHints from './CombinationHints';

export default function CombinationCenter({ isMobile, leftEmotion, rightEmotion, onCombine, onDrop, onClearSlot, onInfoClick, isFailed, editMode, onToggleEdit, unlockedEmotionIds, allEmotionsMap, failedHintId, onHintClick }) {
  const [isCombining, setIsCombining] = useState(false);
  const [dragOverLeft, setDragOverLeft] = useState(false);
  const [dragOverRight, setDragOverRight] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isFailed) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isFailed]);

  const handleCombineClick = () => {
    if (!leftEmotion || !rightEmotion) return;
    setIsCombining(true);
    
    setTimeout(() => {
      onCombine();
      setIsCombining(false);
    }, 1200); 
  };

  const handleDragOver = (e, position) => {
    e.preventDefault();
    if (position === 'left') setDragOverLeft(true);
    if (position === 'right') setDragOverRight(true);
  };

  const handleDragLeave = (e, position) => {
    if (position === 'left') setDragOverLeft(false);
    if (position === 'right') setDragOverRight(false);
  };

  const handleDropEvent = (e, position) => {
    e.preventDefault();
    if (position === 'left') setDragOverLeft(false);
    if (position === 'right') setDragOverRight(false);

    const emotionId = e.dataTransfer.getData('text/plain');
    if (emotionId && onDrop) {
      onDrop(emotionId, position);
    }
  };

  const renderSlot = (emotion, position) => {
    const isDragOver = position === 'left' ? dragOverLeft : dragOverRight;
    
    return (
      <motion.div 
        animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`combo-slot ${position} ${emotion ? 'filled' : 'empty'} ${isDragOver ? 'drag-over' : ''} ${isFailed ? 'failed' : ''}`}
        onDragOver={(e) => handleDragOver(e, position)}
        onDragLeave={(e) => handleDragLeave(e, position)}
        onDrop={(e) => handleDropEvent(e, position)}
      >
        <AnimatePresence mode="popLayout">
          {emotion ? (
            <motion.div
              key={emotion.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="slot-content minimal-panel"
              style={{ '--slot-color': emotion.color }}
              onClick={() => onInfoClick && onInfoClick(emotion)}
            >
              <button 
                className="info-slot-btn" 
                onClick={(e) => { e.stopPropagation(); onInfoClick && onInfoClick(emotion); }}
                title="Informacje o emocji"
              >
                <Info size={14} />
              </button>
              <button 
                className="clear-slot-btn" 
                onClick={(e) => { e.stopPropagation(); onClearSlot(position); }}
                title="Usuń ze slotu"
              >
                <X size={14} />
              </button>
              <span className="slot-name">{emotion.name}</span>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="slot-placeholder"
            >
              {isMobile ? "Wybierz z grafu" : "Przeciągnij kartę tutaj"}
            </motion.div>
          )}
        </AnimatePresence>

    </motion.div>
    );
  };

  return (
    <div className="combination-center">
      <CombinationHints 
        leftEmotion={leftEmotion} 
        rightEmotion={rightEmotion} 
        unlockedEmotionIds={unlockedEmotionIds} 
        allEmotionsMap={allEmotionsMap} 
        failedHintId={failedHintId}
        onHintClick={onHintClick}
        isMobile={isMobile}
      />

      <div className="slots-container">
        {renderSlot(leftEmotion, 'left')}
        
        <div className="combine-action-area">
          <button 
            className={`combine-btn ${leftEmotion && rightEmotion && !isCombining ? 'active' : ''} ${isCombining ? 'combining' : ''}`}
            onClick={handleCombineClick}
            disabled={!leftEmotion || !rightEmotion || isCombining}
          >
            {isCombining ? <Sparkles className="spin-icon" size={24} color="#555" /> : <span className="plus-sign">+</span>}
          </button>
        </div>

        {renderSlot(rightEmotion, 'right')}
      </div>

      {isCombining && (
        <div className="fusion-effect">
          <div className="fusion-core"></div>
        </div>
      )}
    </div>
  );
}
