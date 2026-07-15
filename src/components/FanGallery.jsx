import React, { useRef, useEffect, useState } from 'react';
import EmotionCard from './EmotionCard';
import './FanGallery.css';

export default function FanGallery({ items, onSelect, selectedId, align = 'left' }) {
  const containerRef = useRef(null);
  const virtualScrollRef = useRef(0);
  const targetVirtualScrollRef = useRef(0);
  const scrollSpeedRef = useRef(0);
  const rafRef = useRef(null);
  const itemRefs = useRef([]);

  const [layout, setLayout] = useState({
    containerHeight: 800,
    itemHeight: 120
  });

  const [displayItems, setDisplayItems] = useState([]);

  useEffect(() => {
    let duplicated = [...items];
    const itemH = window.innerWidth <= 768 ? 100 : 120;
    
    if (items.length > 0) {
      const minHeightRequired = 2000; // Increased to ensure it covers even huge monitors
      while (duplicated.length * itemH < minHeightRequired) {
        duplicated = [...duplicated, ...items];
      }
    }
    
    virtualScrollRef.current = 0;
    targetVirtualScrollRef.current = 0;
    scrollSpeedRef.current = 0;
    
    setDisplayItems(duplicated.map((item, i) => ({ ...item, uniqueKey: `${item.id}-${i}` })));
  }, [items]);

  const calculateHeights = () => {
    if (containerRef.current) {
      const isMobile = window.innerWidth <= 768;
      setLayout({
        containerHeight: containerRef.current.clientHeight,
        itemHeight: isMobile ? 100 : 120
      });
    }
  };

  useEffect(() => {
    calculateHeights();
    window.addEventListener('resize', calculateHeights);
    const timeout = setTimeout(calculateHeights, 150);

    const loop = () => {
      // 1. Apply velocity to target
      targetVirtualScrollRef.current += scrollSpeedRef.current;
      
      // 2. Lerp current virtual scroll to target
      const current = virtualScrollRef.current;
      const target = targetVirtualScrollRef.current;
      const diff = target - current;
      
      if (Math.abs(diff) > 0.1) {
        virtualScrollRef.current = current + (diff * 0.1);
      }

      // 3. Render 3D Cylinder
      const totalHeight = displayItems.length * layout.itemHeight;
      if (totalHeight > 0) {
        itemRefs.current.forEach((el, index) => {
          if (!el) return;
          
          // Raw Y position on the infinite tape
          const rawY = (index * layout.itemHeight) - virtualScrollRef.current;
          
          // Modulo wrap to find shortest distance to Center Y (0)
          let distance = ((rawY % totalHeight) + totalHeight) % totalHeight;
          if (distance > totalHeight / 2) {
            distance -= totalHeight;
          }
          
          // Calculate scale & opacity based on absolute distance from center
          const maxDistance = layout.containerHeight / 1.8; 
          let normalizedDist = Math.abs(distance) / maxDistance;
          if (normalizedDist > 1) normalizedDist = 1;
          
          let scale = 1.1 - (normalizedDist * 0.8);
          if (scale < 0.2) scale = 0.2;

          let opacity = 1 - (normalizedDist * 0.9);
          if (opacity < 0.05) opacity = 0.05;

          // Apply translations. Elements are pre-positioned at top:50% via CSS
          el.style.transform = `translateY(${distance}px) scale(${scale})`;
          el.style.opacity = opacity;
          el.style.visibility = opacity <= 0.05 ? 'hidden' : 'visible';
          el.style.pointerEvents = opacity <= 0.05 ? 'none' : 'auto';
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', calculateHeights);
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [displayItems.length, layout.containerHeight, layout.itemHeight]);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const mouseY = e.clientY;
      const windowHeight = window.innerHeight;
      
      const zoneHeight = windowHeight * 0.35;
      const maxSpeed = 12;

      // Only respond if the mouse is reasonably close to the fan (left half of screen)
      // or if you prefer it globally, we just check vertical.
      // We will check vertical globally for a fluid experience.
      if (mouseY < zoneHeight) {
        const intensity = (zoneHeight - mouseY) / zoneHeight;
        scrollSpeedRef.current = intensity * maxSpeed;
      } else if (mouseY > windowHeight - zoneHeight) {
        const intensity = (mouseY - (windowHeight - zoneHeight)) / zoneHeight;
        scrollSpeedRef.current = -intensity * maxSpeed;
      } else {
        scrollSpeedRef.current = 0;
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  return (
    <div 
      className={`fan-gallery-container ${align}`} 
      ref={containerRef}
    >
      <div className="fan-scroll-area virtual">
        {displayItems.map((item, index) => (
          <div 
            key={item.uniqueKey} 
            className="fan-item-wrapper virtual-item" 
            style={{ height: layout.itemHeight, marginTop: -(layout.itemHeight / 2) }}
          >
            <div 
              ref={el => itemRefs.current[index] = el}
              style={{ willChange: 'transform, opacity, visibility' }}
            >
              <EmotionCard 
                emotion={item}
                isSelected={selectedId === item.id}
                onClick={onSelect}
                isCategoryMode={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
