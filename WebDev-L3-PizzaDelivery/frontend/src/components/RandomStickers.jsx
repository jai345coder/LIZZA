import React, { useState, useEffect } from 'react';
import StickerBadge from './StickerBadge.jsx';

// Available sticker content presets
const STICKER_PRESETS = [
  { text: '🍕 100% CHAOS GUARANTEED', variant: 'lime' },
  { text: '⚡ HOT & READY 24/7', variant: 'pink' },
  { text: '🔥 NO RULES. JUST DOUGH.', variant: 'yellow' },
  { text: '🧀 CHEESE OVERLOAD!', variant: 'orange' },
  { text: '🌶️ SPICY VIBE', variant: 'pink' },
  { text: '🥤 ICE COLD DRINKS', variant: 'dark' },
  { text: '📦 CRUST HQ', variant: 'lime' },
  { text: '⭐ 5-STAR PIZZA', variant: 'yellow' },
  { text: '💥 BOOM! FRESH OVEN', variant: 'orange' },
  { text: '😋 EXTRA CHEESY', variant: 'white' },
  { text: '🚀 SPEEDY DELIVERY', variant: 'lime' },
  { text: '🍕 SLICE OF HEAVEN', variant: 'pink' },
];

/**
 * Check if candidate rectangle overlaps with a target bounding box (with optional padding)
 */
function rectsOverlap(cand, target, padding = 20) {
  if (!target) return false;
  const targetLeft = target.left - padding;
  const targetRight = target.right + padding;
  const targetTop = target.top - padding;
  const targetBottom = target.bottom + padding;

  return !(
    cand.right < targetLeft ||
    cand.left > targetRight ||
    cand.bottom < targetTop ||
    cand.top > targetBottom
  );
}

export default function RandomStickers({ logoRef, boxRef }) {
  const [stickers, setStickers] = useState([]);

  useEffect(() => {
    // Helper to attempt spawning a new sticker in valid space
    const spawnSticker = () => {
      if (typeof window === 'undefined') return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Estimated max sticker dimensions for collision detection
      const stickerW = 200;
      const stickerH = 50;

      // Get bounding boxes of logo and login box
      const logoRect = logoRef?.current?.getBoundingClientRect();
      const boxRect = boxRef?.current?.getBoundingClientRect();

      let validPos = null;
      let attempts = 0;

      while (attempts < 50) {
        attempts++;

        const candidateX = Math.floor(Math.random() * (viewportWidth - stickerW - 30)) + 15;
        const candidateY = Math.floor(Math.random() * (viewportHeight - stickerH - 30)) + 15;

        const candidateRect = {
          left: candidateX,
          top: candidateY,
          right: candidateX + stickerW,
          bottom: candidateY + stickerH,
        };

        // Check if candidate overlaps with logo OR login box
        const overlapsLogo = rectsOverlap(candidateRect, logoRect, 25);
        const overlapsBox = rectsOverlap(candidateRect, boxRect, 25);

        if (!overlapsLogo && !overlapsBox) {
          validPos = { x: candidateX, y: candidateY };
          break;
        }
      }

      // If a valid non-overlapping position was found
      if (validPos) {
        const preset = STICKER_PRESETS[Math.floor(Math.random() * STICKER_PRESETS.length)];
        const rotation = Math.floor(Math.random() * 30) - 15; // Random angle between -15deg and +15deg
        const id = Date.now() + '-' + Math.random().toString(36).substring(2, 9);

        const newSticker = {
          id,
          x: validPos.x,
          y: validPos.y,
          rotation,
          text: preset.text,
          variant: preset.variant,
        };

        setStickers((prev) => [...prev.slice(-12), newSticker]); // Keep max 12 active

        // Automatically remove sticker after 2000ms (2 seconds fade duration)
        setTimeout(() => {
          setStickers((prev) => prev.filter((s) => s.id !== id));
        }, 2000);
      }
    };

    // Spawn first sticker quickly
    const initialTimer = setTimeout(spawnSticker, 300);

    // Periodically spawn new random stickers every 800ms
    const interval = setInterval(spawnSticker, 800);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [logoRef, boxRef]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className="fixed pointer-events-none transition-all duration-300 animate-sticker-fade"
          style={{
            left: `${sticker.x}px`,
            top: `${sticker.y}px`,
            transform: `rotate(${sticker.rotation}deg)`,
          }}
        >
          <StickerBadge text={sticker.text} variant={sticker.variant} size="md" />
        </div>
      ))}
    </div>
  );
}
