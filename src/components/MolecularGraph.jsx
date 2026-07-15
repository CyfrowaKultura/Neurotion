import React, { useEffect, useRef, useCallback } from 'react';
import { categories, combinations } from '../data/emotions';
import './MolecularGraph.css';

export default function MolecularGraph({ unlockedEmotions, allEmotionsMap, onNodeClick, usedEmotionIds = [], side = 'left', editMode = false, hintedEmotion = null, selectedIds = [], focusEmotionId = null, onMapInteraction }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const nodesRef = useRef([]);
  const linksRef = useRef([]);
  const dragRef = useRef(null);
  const rafRef = useRef(null);
  const hoveredRef = useRef(-1);
  const sizeRef = useRef({ w: 400, h: 600 });
  const mouseRef = useRef({ x: -100, y: -100 });
  const hintedEmotionRef = useRef(hintedEmotion);
  const activeCatRef = useRef(null);
  const selectedIdsRef = useRef(selectedIds);
  const cameraRef = useRef();

  useEffect(() => {
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);

  useEffect(() => {
    hintedEmotionRef.current = hintedEmotion;
  }, [hintedEmotion]);

  // Sync canvas pixel resolution with its CSS display size
  const syncSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sizeRef.current = { w: rect.width, h: rect.height };
  }, []);

  // Build graph data
  useEffect(() => {
    syncSize();

    const W = sizeRef.current.w;
    const H = sizeRef.current.h;

    const grouped = {};
    unlockedEmotions.forEach(id => {
      const e = allEmotionsMap.get(id);
      if (!e) return;
      if (!grouped[e.categoryId]) grouped[e.categoryId] = [];
      grouped[e.categoryId].push(e);
    });

    const nodes = [];
    const links = [];
    const catKeys = Object.keys(grouped);
    const catCount = catKeys.length;

    catKeys.forEach((catId, catIdx) => {
      const catData = categories.find(c => c.id === catId);
      const emotions = grouped[catId];
      if (!catData) return;

      // Spread categories in a grid-like pattern
      const cols = Math.ceil(Math.sqrt(catCount));
      const row = Math.floor(catIdx / cols);
      const col = catIdx % cols;
      const rows = Math.ceil(catCount / cols);

      const cx = W * (0.2 + (0.6 * col) / Math.max(cols - 1, 1));
      const cy = H * (0.18 + (0.55 * row) / Math.max(rows - 1, 1));

      // Try to keep previous positions
      const prev = nodesRef.current.find(n => n.id === `cat-${catId}`);

      const isMobile = window.innerWidth <= 768;
      const catNode = {
        id: `cat-${catId}`,
        type: 'category',
        label: catData.name,
        color: catData.color,
        radius: isMobile ? 20 : 30,
        x: prev ? prev.x : cx,
        y: prev ? prev.y : cy,
        vx: 0, vy: 0,
        pinned: prev?.pinned || false,
        permanentlyPinned: prev?.permanentlyPinned || false,
      };
      const catIndex = nodes.length;
      nodes.push(catNode);

      emotions.forEach((e, i) => {
        const isMobile = window.innerWidth <= 768;
        const angle = (2 * Math.PI * i) / emotions.length - Math.PI / 2;
        const dist = isMobile ? 45 + emotions.length * 9 : 70 + emotions.length * 12;
        const prevE = nodesRef.current.find(n => n.id === e.id);

        nodes.push({
          id: e.id,
          type: 'emotion',
          catId: catId,
          label: e.name,
          color: e.color,
          radius: isMobile ? 11 : 15,
          isNew: !usedEmotionIds.includes(e.id),
          x: prevE ? prevE.x : cx + Math.cos(angle) * dist,
          y: prevE ? prevE.y : cy + Math.sin(angle) * dist,
          vx: 0, vy: 0,
          pinned: prevE?.pinned || false,
          permanentlyPinned: prevE?.permanentlyPinned || false,
        });
        const emoIndex = nodes.length - 1;
        links.push({ source: catIndex, target: emoIndex });
      });
    });

    // Combination links
    unlockedEmotions.forEach(id => {
      const combo = combinations.find(c => c.result.id === id);
      if (combo) {
        combo.ingredients.forEach(ingId => {
          if (unlockedEmotions.includes(ingId)) {
            const si = nodes.findIndex(n => n.id === ingId && n.type === 'emotion');
            const ti = nodes.findIndex(n => n.id === id && n.type === 'emotion');
            if (si >= 0 && ti >= 0) links.push({ source: si, target: ti });
          }
        });
      }
    });

    nodesRef.current = nodes;
    linksRef.current = links;
  }, [unlockedEmotions, allEmotionsMap, syncSize, usedEmotionIds]);

  // Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const observer = new ResizeObserver(() => {
      syncSize();
    });
    
    observer.observe(canvas);
    
    return () => observer.disconnect();
  }, [syncSize]);



  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tick = () => {
      const ctx = canvas.getContext('2d');
      const W = sizeRef.current.w;
      const H = sizeRef.current.h;
      const nodes = nodesRef.current;
      const links = linksRef.current;

      if (nodes.length === 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const time = Date.now();

      // === PHYSICS ===
      const centerX = W * 0.5;
      const centerY = H * 0.42;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.pinned) continue;

        // Gravity to center
        node.vx += (centerX - node.x) * 0.0004;
        node.vy += (centerY - node.y) * 0.0004;

        // Repulsion
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1) dist = 1;
          const minDist = node.radius + other.radius + 35;
          if (dist < minDist) {
            const f = (minDist - dist) / dist * 0.06;
            if (!node.pinned) { node.vx += dx * f; node.vy += dy * f; }
            if (!other.pinned) { other.vx -= dx * f; other.vy -= dy * f; }
          }
        }
      }

      // Springs
      for (const link of links) {
        const a = nodes[link.source], b = nodes[link.target];
        if (!a || !b) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) dist = 1;
        const desired = a.radius + b.radius + 55;
        const f = (dist - desired) * 0.004;
        const fx = (dx / dist) * f, fy = (dy / dist) * f;
        if (!a.pinned) { a.vx += fx; a.vy += fy; }
        if (!b.pinned) { b.vx -= fx; b.vy -= fy; }
      }

      // Integrate
      for (const node of nodes) {
        if (node.pinned) continue;
        // Increase damping to prevent shaking (was 0.9)
        node.vx *= 0.82;
        node.vy *= 0.82;
        const maxV = 2.5;
        if (node.vx > maxV) node.vx = maxV;
        if (node.vx < -maxV) node.vx = -maxV;
        if (node.vy > maxV) node.vy = maxV;
        if (node.vy < -maxV) node.vy = -maxV;
        node.x += node.vx;
        node.y += node.vy;
        const m = node.radius + 2;
        if (node.x < m) node.x = m;
        if (node.x > W - m) node.x = W - m;
        if (node.y < m) node.y = m;
        if (node.y > H - m) node.y = H - m;
      }

      // === RENDER ===
      ctx.clearRect(0, 0, W, H);

      // Determine hovered context (hovering over a combination -> highlight its ingredients)
      const hIdx = hoveredRef.current;
      
      // Determine active category (only clicked)
      let activeCat = activeCatRef.current;

      let ingredientIndices = [];
      if (hIdx >= 0) {
        const hNode = nodes[hIdx];
        if (hNode.type === 'emotion') {
          // Check if it's a combination
          const hoveredCombo = combinations.find(c => c.result.id === hNode.id);
          if (hoveredCombo && hoveredCombo.ingredients) {
            ingredientIndices = hoveredCombo.ingredients
              .map(id => nodes.findIndex(nx => nx.id === id && nx.type === 'emotion'))
              .filter(idx => idx >= 0);
          }
        }
      }

      // === CAMERA LOGIC ===
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      let relevantNodes = nodes;
      
      if (activeCat) {
        relevantNodes = nodes.filter(n => n.id === `cat-${activeCat}` || n.catId === activeCat);
      }
      if (relevantNodes.length === 0) relevantNodes = nodes;
      
      for (const node of relevantNodes) {
        if (node.x - node.radius < minX) minX = node.x - node.radius;
        if (node.x + node.radius > maxX) maxX = node.x + node.radius;
        if (node.y - node.radius < minY) minY = node.y - node.radius;
        if (node.y + node.radius > maxY) maxY = node.y + node.radius;
      }
      
      const padding = 60;
      minX -= padding; maxX += padding; minY -= padding; maxY += padding;
      
      const boxW = Math.max(maxX - minX, 100);
      const boxH = Math.max(maxY - minY, 100);
      
      const scaleX = W / boxW;
      const scaleY = H / boxH;
      let targetScale = Math.min(scaleX, scaleY);
      
      if (targetScale > 2.0) targetScale = 2.0;
      if (targetScale < 0.4) targetScale = 0.4;
      
      let targetCx = (minX + maxX) / 2;
      let targetCy = (minY + maxY) / 2;

      // Override camera if we have a specific focus emotion
      if (focusEmotionId) {
        const targetNode = nodes.find(n => n.id === focusEmotionId);
        if (targetNode) {
          targetScale = 1.2; // fixed zoom for emotion focus
          targetCx = targetNode.x;
          targetCy = targetNode.y;
        }
      }
      
      if (cameraRef.current === undefined) {
         cameraRef.current = { cx: W/2, cy: H/2, scale: targetScale };
      }
      
      const cam = cameraRef.current;
      cam.cx += (targetCx - cam.cx) * 0.08;
      cam.cy += (targetCy - cam.cy) * 0.08;
      cam.scale += (targetScale - cam.scale) * 0.08;
      
      ctx.save();
      ctx.translate(W/2, H/2);
      ctx.scale(cam.scale, cam.scale);
      ctx.translate(-cam.cx, -cam.cy);

      // Links
      const isVisibleLocal = (n) => true;

      for (const link of links) {
        const a = nodes[link.source], b = nodes[link.target];
        if (!a || !b) continue;
        if (!isVisibleLocal(a) || !isVisibleLocal(b)) continue;
        
        // Highlight link if it connects the hovered combo to its ingredient
        const isHoveredPath = hIdx >= 0 && (
          (link.target === hIdx && ingredientIndices.includes(link.source)) ||
          (link.source === hIdx && ingredientIndices.includes(link.target))
        );

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) continue;

        const hash = (link.source * 31 + link.target) % 100;
        const isSCurve = hash % 2 === 0;
        const offsetMagnitude = dist * 0.35;
        const offset1 = offsetMagnitude * (hash > 50 ? 1 : -1);
        const offset2 = isSCurve ? -offset1 : offset1;
        const cp1x = a.x + dx * 0.33 - (dy / dist) * offset1;
        const cp1y = a.y + dy * 0.33 + (dx / dist) * offset1;
        const cp2x = a.x + dx * 0.66 - (dy / dist) * offset2;
        const cp2y = a.y + dy * 0.66 + (dx / dist) * offset2;

        const aActive = !activeCat || (a.type === 'category' ? a.id === `cat-${activeCat}` : a.catId === activeCat) || selectedIdsRef.current.includes(a.id);
        const bActive = !activeCat || (b.type === 'category' ? b.id === `cat-${activeCat}` : b.catId === activeCat) || selectedIdsRef.current.includes(b.id);

        let fillStyleStr;
        if (isHoveredPath) {
          fillStyleStr = 'rgba(255, 255, 255, 0.7)';
        } else if (aActive && bActive) {
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, a.color);
          grad.addColorStop(1, b.color);
          fillStyleStr = grad;
        } else {
          fillStyleStr = 'rgba(200, 200, 200, 0.15)';
        }

        ctx.fillStyle = fillStyleStr;
        if (aActive && bActive && !isHoveredPath) ctx.globalAlpha = 0.20;

        const steps = 35;
        ctx.beginPath();
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const invT = 1 - t;
          const px = invT*invT*invT*a.x + 3*invT*invT*t*cp1x + 3*invT*t*t*cp2x + t*t*t*b.x;
          const py = invT*invT*invT*a.y + 3*invT*invT*t*cp1y + 3*invT*t*t*cp2y + t*t*t*b.y;
          const taper = 4 * (t - 0.5) * (t - 0.5); 
          const maxThick = Math.min((a.radius + b.radius) * 0.45, 20);
          const stretchFactor = 400 / Math.max(dist, 10);
          const minThick = Math.min(maxThick, Math.max(1, stretchFactor));
          let rad = minThick + (maxThick - minThick) * taper;
          if (isHoveredPath) rad *= 1.3;
          ctx.moveTo(px + rad, py);
          ctx.arc(px, py, rad, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.globalAlpha = 1.0;
        if (isHoveredPath || hash % 4 === 0) {
          const tSpeed = isHoveredPath ? 0.0008 : 0.0003;
          const t = ((time * tSpeed) + (hash / 100)) % 1; 
          const invT = 1 - t;
          const bx = invT*invT*invT*a.x + 3*invT*invT*t*cp1x + 3*invT*t*t*cp2x + t*t*t*b.x;
          const by = invT*invT*invT*a.y + 3*invT*invT*t*cp1y + 3*invT*t*t*cp2y + t*t*t*b.y;
          ctx.beginPath();
          ctx.arc(bx, by, isHoveredPath ? 3 : 1.5, 0, Math.PI * 2);
          ctx.fillStyle = isHoveredPath ? '#fff' : 'rgba(120, 200, 255, 0.8)';
          ctx.fill();
        }
      }

      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!isVisibleLocal(n)) continue;

        const hovered = i === hIdx;
        const isIngredient = ingredientIndices.includes(i);
        const isSelected = selectedIdsRef.current.includes(n.id);
        let isActive = !activeCat || (n.type === 'category' ? n.id === `cat-${activeCat}` : n.catId === activeCat);
        if (isSelected) isActive = true;
        let r = n.radius;
        if (activeCat && isActive && n.type === 'emotion') r = n.radius * 1.15;
        if (isIngredient || isSelected) r = n.radius * 1.35;
        if (hovered) r = n.radius * 1.7;

        let nodeAlpha = isActive ? 1.0 : 0.25;
        if ((hovered || isIngredient || isSelected) && !isActive) nodeAlpha = 0.85; 
        ctx.globalAlpha = nodeAlpha;

        const isHinted = n.id === hintedEmotionRef.current;
        if (isHinted) {
          const pulse = Math.sin(time * 0.005) * 0.3 + 0.7; // 0.4 to 1.0
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 215, 0, ${pulse * 0.7})`;
          ctx.fill();
        } else if (hovered || isIngredient || isSelected) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 8, 0, Math.PI * 2);
          ctx.fillStyle = !isActive ? 'rgba(200,200,200,0.4)' : (hovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)');
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        if (n.type === 'category') {
          const isSelectedCat = activeCat && n.id === `cat-${activeCat}`;
          ctx.fillStyle = isSelectedCat ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.75)';
          ctx.fill();
          ctx.strokeStyle = isActive ? n.color : '#bbb';
          ctx.lineWidth = isSelectedCat ? 3.5 : 2.5;
          ctx.stroke();
        } else {
          ctx.fillStyle = (isActive || (!hovered && !isIngredient && !isSelected)) ? (isActive ? n.color : '#ccc') : '#bbb';
          ctx.fill();
          ctx.strokeStyle = ((hovered || isIngredient || isSelected) && !isActive) ? 'rgba(200,200,200,0.7)' : 'rgba(255,255,255,0.5)';
          ctx.lineWidth = (hovered || isIngredient || isSelected) ? 2 : 1.5;
          ctx.stroke();
          
          let isPrimarySelected = false;
          let markerText = 'i';
          if (side === 'mobile') {
            if (n.id === selectedIdsRef.current[0]) {
              isPrimarySelected = true; markerText = '1';
            } else if (n.id === selectedIdsRef.current[1]) {
              isPrimarySelected = true; markerText = '2';
            }
          } else {
            isPrimarySelected = side === 'left' ? n.id === selectedIdsRef.current[0] : n.id === selectedIdsRef.current[1];
          }

          if (isPrimarySelected) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(markerText, n.x, n.y);
          }
        }
        ctx.globalAlpha = 1.0;

        if (n.type === 'emotion' && n.isNew && isActive) {
          ctx.beginPath(); ctx.arc(n.x - r*0.65, n.y - r*0.65, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFD600'; ctx.fill();
        }

        if (editMode && (hovered || n.permanentlyPinned)) {
          ctx.fillStyle = n.permanentlyPinned ? '#ef4444' : 'rgba(255,255,255,0.8)';
          ctx.beginPath(); ctx.roundRect(n.x-5, n.y-4+2, 10, 8, 2); ctx.fill();
          ctx.strokeStyle = n.permanentlyPinned ? '#ef4444' : 'rgba(255,255,255,0.8)';
          ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(n.x, n.y-4+2, 3.5, Math.PI, 0); ctx.stroke();
        }
      }

      // --- 3. Draw labels on top of all nodes ---
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!isVisibleLocal(n)) continue;

        const hIdx = hoveredRef.current;
        const hovered = i === hIdx;
        const activeCat = activeCatRef.current;
        const isSelected = selectedIdsRef.current.includes(n.id);
        
        let isActive = !activeCat || (n.type === 'category' ? n.id === `cat-${activeCat}` : n.catId === activeCat);
        if (isSelected) isActive = true;

        if (n.type === 'category') {
          const isSelectedCat = activeCat && n.id === `cat-${activeCat}`;
          ctx.font = isSelectedCat ? 'bold 10px Outfit, sans-serif' : 'bold 9px Outfit, sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillStyle = isActive ? n.color : '#bbb';
          ctx.fillText(n.label, n.x, n.y);
        } else {
          const isIngredient = ingredientIndices.includes(i);
          const isHintedLabel = n.id === hintedEmotionRef.current;
          const showLabel = (hovered || isIngredient || isSelected || (activeCat && isActive) || isHintedLabel);
          
          if (showLabel) {
            let r = n.radius;
            if (activeCat && isActive) r = n.radius * 1.15;
            if (isIngredient || isSelected) r = n.radius * 1.35;
            if (hovered) r = n.radius * 1.7;

            ctx.font = '600 11px Outfit, sans-serif';
            ctx.textAlign = 'center';
            const tw = ctx.measureText(n.label).width;
            const px = n.x - tw / 2 - 8;
            const py = n.y + r + 6;
            ctx.fillStyle = 'rgba(255,255,255,0.92)';
            ctx.beginPath(); ctx.roundRect(px, py, tw + 16, 20, 10); ctx.fill();
            ctx.fillStyle = '#222'; ctx.textBaseline = 'top';
            ctx.fillText(n.label, n.x, py + 4);
          }
        }
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [editMode]);

  const getXY = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (cameraRef.current) {
      const W = rect.width;
      const H = rect.height;
      const cam = cameraRef.current;
      const worldX = (mouseX - W/2) / cam.scale + cam.cx;
      const worldY = (mouseY - H/2) / cam.scale + cam.cy;
      return { x: worldX, y: worldY };
    }
    return { x: mouseX, y: mouseY };
  }, []);

  const isNodeVisible = useCallback((n) => true, []);

  const findNode = useCallback((x, y) => {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (!isNodeVisible(n)) continue;
      const dx = x - n.x, dy = y - n.y;
      if (dx * dx + dy * dy <= (n.radius + 8) ** 2) return i;
    }
    return -1;
  }, [isNodeVisible]);

  const onDown = useCallback((e) => {
    if (onMapInteraction) onMapInteraction();
    const { x, y } = getXY(e);
    const idx = findNode(x, y);
    if (idx >= 0) {
      const n = nodesRef.current[idx];
      if (!n) return;
      n.pinned = true;
      n.vx = 0; n.vy = 0;
      dragRef.current = { idx, startX: n.x, startY: n.y, moved: false };
    } else {
      dragRef.current = null;
      activeCatRef.current = null;
    }
  }, [getXY, findNode, onMapInteraction]);

  const onMove = useCallback((e) => {
    const { x, y } = getXY(e);
    mouseRef.current = { x, y }; // Update visual debug cursor

    if (dragRef.current && editMode) {
      const n = nodesRef.current[dragRef.current.idx];
      if (n) {
        n.x = x; n.y = y;
        const dx = x - dragRef.current.startX, dy = y - dragRef.current.startY;
        if (dx * dx + dy * dy > 16) dragRef.current.moved = true;
      }
    } else {
      const idx = findNode(x, y);
      hoveredRef.current = idx;
      canvasRef.current.style.cursor = idx >= 0 ? (editMode ? 'grab' : 'pointer') : 'default';
    }
  }, [getXY, findNode, editMode]);

  const onUp = useCallback(() => {
    if (dragRef.current) {
      const n = nodesRef.current[dragRef.current.idx];
      if (n) {
        if (editMode) {
          if (dragRef.current.moved) {
            n.permanentlyPinned = true;
          } else {
            n.permanentlyPinned = !n.permanentlyPinned;
          }
          n.pinned = !!n.permanentlyPinned;
        } else {
          n.pinned = false;
        }

        if (!dragRef.current.moved && !editMode) {
          if (n.type === 'category') {
            const catId = n.id.replace('cat-', '');
            activeCatRef.current = activeCatRef.current === catId ? null : catId;
          } else if (n.type === 'emotion') {
            const activeCat = activeCatRef.current;
            const isActive = !activeCat || n.catId === activeCat;
            if (isActive) onNodeClick && onNodeClick(n.id, side);
          }
        }
      }
      dragRef.current = null;
    }
    canvasRef.current.style.cursor = 'default';
  }, [onNodeClick, side, editMode]);

  const onLeave = useCallback(() => {
    if (dragRef.current) {
      const n = nodesRef.current[dragRef.current.idx];
      if (n) n.pinned = !!n.permanentlyPinned;
      dragRef.current = null;
    }
    hoveredRef.current = -1;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`molecular-canvas ${side}`}
      style={{ touchAction: 'none' }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
    />
  );
}
