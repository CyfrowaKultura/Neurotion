import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './WatercolorAnimation.css';

export default function WatercolorAnimation({ leftColor, rightColor, isActive }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isActive && leftColor && rightColor) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [isActive, leftColor, rightColor]);

  if (!show) return null;

  return (
    <div className="watercolor-animation-layer">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="watercolor-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>
      
      <div className="watercolor-blobs" style={{ filter: 'url(#watercolor-goo)' }}>
        <div className="water-blob left-blob" style={{ background: leftColor }}></div>
        <div className="water-blob right-blob" style={{ background: rightColor }}></div>
        <div className="water-blob mix-blob" style={{ background: leftColor, mixBlendMode: 'multiply', opacity: 0.7 }}></div>
        <div className="water-blob mix-blob-2" style={{ background: rightColor, mixBlendMode: 'multiply', opacity: 0.7 }}></div>
      </div>

      <div className="bubbles-layer">
        {[...Array(10)].map((_, i) => {
          const size = 6 + Math.random() * 12;
          return (
            <div 
              key={i} 
              className="water-bubble"
              style={{
                left: `${35 + Math.random() * 30}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
