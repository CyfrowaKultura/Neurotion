import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { combinations } from '../data/emotions'; // To filter only combinations

export default function CombinationHints({ leftEmotion, rightEmotion, unlockedEmotionIds, allEmotionsMap, failedHintId, onHintClick, isMobile }) {
  const hints = useMemo(() => {
    if (!leftEmotion || !rightEmotion || !allEmotionsMap) return [];

    // Calculate midpoint
    const midX = (leftEmotion.x + rightEmotion.x) / 2;
    const midY = (leftEmotion.y + rightEmotion.y) / 2;

    // Find exact recipe results for these two
    const exactMatches = [
      ...combinations.filter(c => c.primary === leftEmotion.id && c.secondary === rightEmotion.id),
      ...combinations.filter(c => c.primary === rightEmotion.id && c.secondary === leftEmotion.id)
    ].map(c => c.result.id);

    const comboIds = new Set(combinations.map(c => c.result.id));
    const allEmotionsArray = Array.from(allEmotionsMap.values());

    const seenIds = new Set();
    const candidates = [];

    allEmotionsArray.forEach(e => {
      // Must be a combination (not base)
      if (!comboIds.has(e.id)) return;
      // Exclude the currently selected ingredients
      if (e.id === leftEmotion.id || e.id === rightEmotion.id) return;
      // Exclude duplicates
      if (seenIds.has(e.id)) return;
      
      seenIds.add(e.id);

      const dx = e.x - midX;
      const dy = e.y - midY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isRecipeResult = exactMatches.includes(e.id);

      candidates.push({ ...e, dist, isRecipeResult });
    });

    candidates.sort((a, b) => {
      if (a.isRecipeResult && !b.isRecipeResult) return -1;
      if (!a.isRecipeResult && b.isRecipeResult) return 1;
      return a.dist - b.dist;
    });

    return candidates.slice(0, 4);
  }, [leftEmotion, rightEmotion, allEmotionsMap]);

  if (!leftEmotion || !rightEmotion) return null;

  return (
      <div className="hide-scrollbar" style={{
      display: 'flex',
      width: '100%',
      overflowX: isMobile ? 'visible' : 'auto',
      overflowY: 'visible',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none', // IE/Edge
      padding: isMobile ? '0 12px' : '0 16px',
      boxSizing: 'border-box',
      marginBottom: '16px',
      minHeight: '42px',
    }}>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      <div style={{ 
        display: 'flex', 
        gap: isMobile ? '8px' : '12px', 
        width: isMobile ? '100%' : 'max-content',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        justifyContent: isMobile ? 'center' : 'flex-start',
        padding: isMobile ? '0' : '0 16px', // Removed extra padding on mobile to maximize space
        margin: '0' // explicitly remove margin auto
      }}>
      <AnimatePresence mode="popLayout">
        {hints.map((hint, i) => {
          const isUnlocked = unlockedEmotionIds.includes(hint.id);
          const isHighlighted = hint.id === failedHintId;

          return (
            <motion.div
              key={hint.id}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: isHighlighted ? 1.05 : 1,
                boxShadow: isHighlighted ? `0 0 15px ${hint.color}` : 'none',
                borderColor: isHighlighted ? hint.color : 'rgba(0,0,0,0.08)'
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onHintClick && onHintClick(hint)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: isHighlighted ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.03)',
                border: '1px solid',
                padding: isMobile ? '4px 8px' : '4px 12px',
                borderRadius: '16px',
                color: isUnlocked ? '#333' : '#888',
                fontSize: isMobile ? '0.75rem' : '0.8rem',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                fontWeight: isHighlighted ? 'bold' : 'normal',
                flexShrink: 0,
                width: isMobile ? 'calc(50% - 4px)' : 'auto',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: hint.color,
                boxShadow: `0 0 5px ${hint.color}88`,
                flexShrink: 0
              }} />
              {isUnlocked ? (
                <span style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hint.name}</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hint.name}</span>
                  <Lock size={10} style={{ opacity: 0.5, marginLeft: '2px', flexShrink: 0 }} />
                </span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
      </div>
    </div>
  );
}
