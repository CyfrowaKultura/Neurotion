import React, { useState, useEffect } from 'react';
import MolecularGraph from './components/MolecularGraph';
import CombinationCenter from './components/CombinationCenter';
import MaximizedModal from './components/MaximizedModal';
import { initialEmotions, getCombination, getAllEmotionsMap, combinations } from './data/emotions';
import EmotionChartModal from './components/EmotionChartModal';
import EmotionListModal from './components/EmotionListModal';
import { Pencil, Grid, BookOpen } from 'lucide-react';
import './App.css';

function App() {
  const [unlockedEmotionIds, setUnlockedEmotionIds] = useState(() => {
    const saved = localStorage.getItem('unlockedEmotionsV2');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all initial emotions are always unlocked (in case localStorage is corrupted or out of date)
      const merged = Array.from(new Set([...initialEmotions, ...parsed]));
      return merged;
    }
    return initialEmotions;
  });

  const [leftSelectedId, setLeftSelectedId] = useState(null);
  const [rightSelectedId, setRightSelectedId] = useState(null);
  const [maximizedEmotions, setMaximizedEmotions] = useState(null);
  const [isFailed, setIsFailed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [editMode, setEditMode] = useState(false); // Manual arrangement mode
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [hintedEmotion, setHintedEmotion] = useState(null);
  const [focusEmotionId, setFocusEmotionId] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track emotions that have been used at least once (no longer "new")
  const [usedEmotionIds, setUsedEmotionIds] = useState(() => {
    const saved = localStorage.getItem('usedEmotions');
    if (saved) return JSON.parse(saved);
    return [...initialEmotions]; // Base emotions start as "used"
  });
  
  const allEmotions = getAllEmotionsMap();
  const totalEmotions = allEmotions.size;

  useEffect(() => {
    localStorage.setItem('unlockedEmotionsV2', JSON.stringify(unlockedEmotionIds));
  }, [unlockedEmotionIds]);

  useEffect(() => {
    localStorage.setItem('usedEmotions', JSON.stringify(usedEmotionIds));
  }, [usedEmotionIds]);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const unlockedEmotionsList = unlockedEmotionIds
    .map(id => allEmotions.get(id))
    .filter(Boolean);

  const markUsed = (id) => {
    if (id && !usedEmotionIds.includes(id)) {
      setUsedEmotionIds(prev => [...prev, id]);
    }
  };

  const handleNodeClick = (id, side) => {
    setFocusEmotionId(null);
    markUsed(id);
    if (id === hintedEmotion) {
      setHintedEmotion(null);
      setFailedAttempts(0);
    }
    if (side === 'mobile') {
      if (!leftSelectedId) {
        setLeftSelectedId(id);
      } else if (!rightSelectedId && leftSelectedId !== id) {
        setRightSelectedId(id);
      } else if (leftSelectedId === id || rightSelectedId === id) {
        setMaximizedEmotions([allEmotions.get(id)]);
      } else {
        setLeftSelectedId(id);
        setRightSelectedId(null);
      }
    } else if (side === 'left') {
      if (leftSelectedId === id) {
        setMaximizedEmotions([allEmotions.get(id)]);
      } else {
        setLeftSelectedId(id);
      }
    } else if (side === 'right') {
      if (rightSelectedId === id) {
        setMaximizedEmotions([allEmotions.get(id)]);
      } else {
        setRightSelectedId(id);
      }
    }
  };

  const handleDrop = (emotionId, position) => {
    if (position === 'left') {
      setLeftSelectedId(emotionId);
    } else {
      setRightSelectedId(emotionId);
    }
  };

  const handleClearSlot = (position) => {
    if (position === 'left') setLeftSelectedId(null);
    else setRightSelectedId(null);
  };
  const [failedHintId, setFailedHintId] = useState(null);

  const handleCombine = () => {
    if (!leftSelectedId || !rightSelectedId) return;

    const matchedCombinations = getCombination(leftSelectedId, rightSelectedId);
    
    const predefined = matchedCombinations.filter(c => !c.isDynamic);
    const dynamic = matchedCombinations.filter(c => c.isDynamic);

    if (predefined.length > 0) {
      setIsFailed(false);
      setFailedAttempts(0);
      setHintedEmotion(null);
      setFailedHintId(null);
      
      const newEmotions = predefined.map(c => c.result);
      const newIds = newEmotions.map(e => e.id);
      
      setUnlockedEmotionIds(prev => {
        const toAdd = newIds.filter(id => !prev.includes(id));
        if (toAdd.length > 0) return [...prev, ...toAdd];
        return prev;
      });
      
      setMaximizedEmotions(newEmotions);
      
      setLeftSelectedId(null);
      setRightSelectedId(null);
      
    } else {
      setIsFailed(true);
      if (navigator.vibrate) navigator.vibrate([200]); // vibrate on error

      if (dynamic.length > 0) {
        setFailedHintId(dynamic[0].result.id);
      } else {
        setFailedHintId(null);
      }

      setTimeout(() => {
        setIsFailed(false);
        // We do NOT clear leftSelectedId and rightSelectedId so user can see the hints
      }, 500);
    }
  };

  return (
    <div className="app-container" onMouseMove={handleMouseMove}>
      
      <div className="progress-header">
        <h1 className="progress-title">Odkryto Emocji</h1>
        <div className="discovery-stats">
          <span className="stats-number">{unlockedEmotionsList.length}</span>
          <span className="stats-divider">/</span>
          <span className="stats-total">{totalEmotions}</span>
          <span className="stats-label">odkrytych emocji</span>
        </div>
        <div className="header-actions">
          <button 
            className={`edit-mode-btn ${editMode ? 'active' : ''}`}
            onClick={() => setEditMode(!editMode)}
            title="Tryb manualnej edycji układu"
          >
            <Pencil size={18} />
          </button>
          <button 
            className="chart-mode-btn"
            onClick={() => setIsListModalOpen(true)}
            title="Księga Emocji (Lista)"
          >
            <BookOpen size={18} />
          </button>
          <button 
            className="chart-mode-btn"
            onClick={() => setIsChartModalOpen(true)}
            title="Wykres wszystkich emocji"
          >
            <Grid size={18} />
          </button>
        </div>
      </div>

      {isMobile ? (
        <MolecularGraph 
          unlockedEmotions={unlockedEmotionIds}
          allEmotionsMap={allEmotions}
          onNodeClick={handleNodeClick}
          usedEmotionIds={usedEmotionIds}
          side="mobile"
          editMode={editMode}
          hintedEmotion={hintedEmotion}
          selectedIds={[leftSelectedId, rightSelectedId]}
          focusEmotionId={focusEmotionId}
          onMapInteraction={() => setFocusEmotionId(null)}
        />
      ) : (
        <>
          <MolecularGraph 
            unlockedEmotions={unlockedEmotionIds}
            allEmotionsMap={allEmotions}
            onNodeClick={handleNodeClick}
            usedEmotionIds={usedEmotionIds}
            side="left"
            editMode={editMode}
            hintedEmotion={hintedEmotion}
            selectedIds={[leftSelectedId, rightSelectedId]}
            focusEmotionId={focusEmotionId}
            onMapInteraction={() => setFocusEmotionId(null)}
          />
          <MolecularGraph 
            unlockedEmotions={unlockedEmotionIds}
            allEmotionsMap={allEmotions}
            onNodeClick={handleNodeClick}
            usedEmotionIds={usedEmotionIds}
            side="right"
            editMode={editMode}
            hintedEmotion={hintedEmotion}
            selectedIds={[leftSelectedId, rightSelectedId]}
            focusEmotionId={focusEmotionId}
            onMapInteraction={() => setFocusEmotionId(null)}
          />
        </>
      )}
      
      <div className="dock-section">
        <CombinationCenter 
          isMobile={isMobile}
          leftEmotion={allEmotions.get(leftSelectedId)}
          rightEmotion={allEmotions.get(rightSelectedId)}
          onCombine={handleCombine}
          onDrop={handleDrop}
          onClearSlot={handleClearSlot}
          onInfoClick={(emotion) => setMaximizedEmotions([emotion])}
          isFailed={isFailed}
          unlockedEmotionIds={unlockedEmotionIds}
          allEmotionsMap={allEmotions}
          failedHintId={failedHintId}
          onHintClick={(emotion) => setMaximizedEmotions([emotion])}
        />
      </div>

      <MaximizedModal 
        emotions={maximizedEmotions} 
        isOpen={!!maximizedEmotions && maximizedEmotions.length > 0} 
        onClose={() => setMaximizedEmotions(null)} 
        unlockedEmotionIds={unlockedEmotionIds}
        allEmotionsMap={allEmotions}
        onShowOnMap={(emotion) => {
          setMaximizedEmotions(null);
          setFocusEmotionId(emotion.id);
        }}
        onAssignSlot1={(id) => {
          setLeftSelectedId(id);
          setMaximizedEmotions(null);
        }}
        onAssignSlot2={(id) => {
          setRightSelectedId(id);
          setMaximizedEmotions(null);
        }}
      />

      <EmotionChartModal 
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        allEmotionsMap={allEmotions}
        onDotClick={(e) => setMaximizedEmotions([e])}
        unlockedEmotionIds={unlockedEmotionIds}
      />

      <EmotionListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        unlockedEmotionIds={unlockedEmotionIds}
        allEmotionsMap={allEmotions}
        onEmotionClick={(e) => {
          setIsListModalOpen(false);
          setMaximizedEmotions([e]);
        }}
      />
    </div>
  );
}

export default App;
