import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import EmotionChart from './EmotionChart';
import './EmotionChartModal.css';

export default function EmotionChartModal({ isOpen, onClose, allEmotionsMap, onDotClick, unlockedEmotionIds }) {
  const [hoveredEmotion, setHoveredEmotion] = useState(null);

  const dots = useMemo(() => {
    if (!allEmotionsMap) return [];
    return Array.from(allEmotionsMap.values());
  }, [allEmotionsMap]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="chart-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="chart-modal-content glass-panel"
          initial={{ scale: 0.95, y: 10, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 10, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="chart-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
          
          <h2 className="chart-title">Mapa Emocji</h2>
          <EmotionChart 
            allEmotionsMap={allEmotionsMap} 
            unlockedEmotionIds={unlockedEmotionIds}
            onDotClick={onDotClick}
          />
          
          <div className="chart-legend">
            <div className="legend-item">
              <strong>Energia (Oś pionowa):</strong> Poziom pobudzenia. Wysoka = gotowość do działania, Niska = wyciszenie/zmęczenie.
            </div>
            <div className="legend-item">
              <strong>Przyjemność (Oś pozioma):</strong> Zabarwienie emocji. Po prawej = pozytywne/satysfakcja, Po lewej = negatywne/dyskomfort.
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
