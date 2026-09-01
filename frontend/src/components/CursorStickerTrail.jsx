import React, { useState, useEffect, useRef } from 'react';

// Preset emojis for the cursor trail
const EMOJI_PRESETS = [
  '🍕', '🧀', '🔥', '🌶️', '🥤', '📦', '⭐', '💥', '🚀', '😋', '✨', '🍟', '🍕', '🎉', '⚡', '🍕', '😋', '🌶️'
];

export default function CursorStickerTrail({ enabled = true, boundaryRef }) {
  const [emojis, setEmojis] = useState([]);
  const lastPosRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      // Check boundary restriction: Do not spawn emojis at or after "THE LOWDOWN" section
      if (boundaryRef?.current) {
        const boundaryTop = boundaryRef.current.getBoundingClientRect().top;
        if (clientY >= boundaryTop - 20) {
          return;
        }
      }

      const dist = Math.hypot(
        clientX - lastPosRef.current.x,
        clientY - lastPosRef.current.y
      );

      // Spawn a new emoji whenever cursor moves more than 40px
      if (dist > 40) {
        lastPosRef.current = { x: clientX, y: clientY };

        const emoji = EMOJI_PRESETS[Math.floor(Math.random() * EMOJI_PRESETS.length)];
        const rotation = Math.floor(Math.random() * 40) - 20;
        const id = Date.now() + '-' + Math.random().toString(36).substring(2, 9);

        // Offset coordinates slightly from cursor tip
        const emojiX = clientX + (Math.random() * 20 - 10);
        const emojiY = clientY + 12 + (Math.random() * 10 - 5);

        const newEmojiItem = {
          id,
          x: emojiX,
          y: emojiY,
          rotation,
          emoji,
        };

        setEmojis((prev) => [...prev.slice(-20), newEmojiItem]); // Keep max 20 active

        // Remove emoji after 2 seconds (2000ms fade duration)
        setTimeout(() => {
          setEmojis((prev) => prev.filter((s) => s.id !== id));
        }, 2000);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [enabled, boundaryRef]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {emojis.map((item) => (
        <div
          key={item.id}
          className="fixed pointer-events-none animate-sticker-fade select-none"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            transform: `rotate(${item.rotation}deg)`,
          }}
        >
          <span className="text-3xl sm:text-4xl filter drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] inline-block hover:scale-125 transition-transform">
            {item.emoji}
          </span>
        </div>
      ))}
    </div>
  );
}
