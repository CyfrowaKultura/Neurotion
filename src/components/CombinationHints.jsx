import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { combinations } from '../data/emotions'; // To filter only combinations

export default function CombinationHints({ leftEmotion, rightEmotion, unlockedEmotionIds, allEmotionsMap }) {
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
    <div style={{
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      marginBottom: '16px',
      height: '32px' // Fixed height so it doesn't jump
    }}>
      <AnimatePresence mode="popLayout">
        {hints.map((hint, i) => {
          const isUnlocked = unlockedEmotionIds.includes(hint.id);

          return (
            <motion.div
              key={hint.id}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '4px 12px',
                borderRadius: '16px',
                color: isUnlocked ? '#333' : '#888',
                fontSize: '0.8rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: hint.color,
                boxShadow: `0 0 5px ${hint.color}88`
              }} />
              {isUnlocked ? (
                <span style={{ fontWeight: 500 }}>{hint.name}</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {hint.name} <Lock size={10} style={{ opacity: 0.5, marginLeft: '2px' }} />
                </span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
