import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X } from 'lucide-react';
import './EmotionChartModal.css';

export default function EmotionChart({ allEmotionsMap, onDotClick, unlockedEmotionIds, highlightedEmotionId, lightTheme, staticMode }) {
  const [hoveredEmotion, setHoveredEmotion] = useState(null);
  const [closedTooltipId, setClosedTooltipId] = useState(null);

  const dots = useMemo(() => {
    if (!allEmotionsMap) return [];
    return Array.from(allEmotionsMap.values());
  }, [allEmotionsMap]);

  return (
    <div className={`chart-container ${lightTheme ? 'light-theme' : ''}`} style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '300px', 
      position: 'relative',
      background: lightTheme ? '#fff' : undefined,
      borderColor: lightTheme ? 'rgba(0,0,0,0.05)' : undefined
    }}>
      <div className="axis-label axis-y-top" style={{ color: lightTheme ? '#888' : undefined }}>Wysoka Energia</div>
      <div className="axis-label axis-y-bottom" style={{ color: lightTheme ? '#888' : undefined }}>Niska Energia</div>
      <div className="axis-label axis-x-left" style={{ color: lightTheme ? '#888' : undefined }}>Nieprzyjemne</div>
      <div className="axis-label axis-x-right" style={{ color: lightTheme ? '#888' : undefined }}>Przyjemne</div>
      
      <div className="grid-lines">
        <div className="grid-line horizontal" style={{ background: lightTheme ? 'rgba(0,0,0,0.06)' : undefined }} />
        <div className="grid-line vertical" style={{ background: lightTheme ? 'rgba(0,0,0,0.06)' : undefined }} />
      </div>

      <div className="scatter-area">
        {dots.map(emotion => {
          const px = ((emotion.x + 1) / 2) * 100;
          const py = ((1 - emotion.y) / 2) * 100;
          const isHighlighted = highlightedEmotionId === emotion.id;
          const isHovered = hoveredEmotion?.id === emotion.id || isHighlighted;
          const isUnlocked = unlockedEmotionIds.includes(emotion.id);

          // If in staticMode, don't pulse the highlighted dot
          const pulseClass = (isHighlighted && !staticMode) ? 'highlighted-pulsing' : '';
          
          return (
            <div
              key={emotion.id}
              className={`scatter-dot ${isHovered ? 'hovered' : ''} ${pulseClass}`}
              style={{
                '--pulse-color': `${emotion.color}aa`,
                left: `${px}%`,
                top: `${py}%`,
                backgroundColor: emotion.color,
                boxShadow: isHighlighted ? `0 0 15px #FFD700, 0 0 30px #FFD700aa` : `0 0 10px ${emotion.color}aa`,
                zIndex: isHovered || isHighlighted ? 10 : 1,
                transform: isHighlighted ? 'translate(-50%, -50%) scale(1.5)' : undefined,
                border: isHighlighted ? '2px solid #FFD700' : undefined,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={() => setHoveredEmotion(emotion)}
              onMouseLeave={() => setHoveredEmotion(null)}
              onClick={() => {
                setHoveredEmotion(emotion);
                if (onDotClick) onDotClick(emotion);
              }}
            >
              <AnimatePresence>
                {(isHovered || isHighlighted) && closedTooltipId !== emotion.id && (
                  <motion.div 
                    className="dot-tooltip"
                    initial={{ opacity: 0, y: py < 10 ? -5 : 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: py < 10 ? -5 : 5 }}
                    transition={{ duration: 0.15 }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '4px',
                      top: py < 10 ? '20px' : '-30px',
                      left: px < 15 ? '0' : px > 85 ? 'auto' : '50%',
                      right: px > 85 ? '0' : 'auto',
                      transform: px < 15 || px > 85 ? 'none' : 'translateX(-50%)',
                      background: lightTheme ? '#fff' : undefined,
                      color: lightTheme ? '#222' : undefined,
                      border: lightTheme ? '1px solid rgba(0,0,0,0.1)' : undefined,
                      boxShadow: lightTheme ? '0 4px 12px rgba(0,0,0,0.08)' : undefined,
                      pointerEvents: 'auto'
                    }}
                  >
                    <span style={{ padding: '0 2px' }}>{emotion.name}</span>
                    {!isUnlocked && <Lock size={12} style={{ opacity: 0.6 }} />}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setClosedTooltipId(emotion.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: lightTheme ? '#888' : '#aaa',
                        marginLeft: '4px'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
