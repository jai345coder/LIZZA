import React from 'react';

/**
 * PizzaLogoIcon - Transparent Cartoon Pizza Slice Vector Logo
 */
export default function PizzaLogoIcon({ className = 'w-8 h-8' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transform -rotate-12 hover:rotate-0 transition-transform`}
    >
      {/* Outer Crust Shadow / Base */}
      <path
        d="M 40 18 C 58 20 82 36 88 56 C 88 64 78 68 70 62 C 55 42 40 26 40 18 Z"
        fill="#D68443"
        stroke="#1E1E1E"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Main Outer Crust */}
      <path
        d="M 38 18 C 54 18 80 32 86 52 C 87 58 80 62 72 58 C 58 40 40 24 38 18 Z"
        fill="#E59A5C"
        stroke="#1E1E1E"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main Cheese Body */}
      <path
        d="M 34 26 L 72 58 L 22 84 Z"
        fill="#FFC107"
        stroke="#1E1E1E"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dripping Cheese Melts along bottom edge */}
      <path
        d="M 22 84 C 23 91 29 91 30 84 C 31 82 36 78 37 77 C 39 84 45 86 46 78 C 47 75 52 71 54 70 C 56 75 61 77 62 70 L 72 58"
        fill="#FFCA28"
        stroke="#1E1E1E"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pepperoni Slice 1 (Top Left) */}
      <ellipse
        cx="38"
        cy="44"
        rx="7.5"
        ry="9"
        fill="#E53935"
        stroke="#1E1E1E"
        strokeWidth="3.5"
      />

      {/* Pepperoni Slice 2 (Top Right) */}
      <ellipse
        cx="56"
        cy="43"
        rx="7.5"
        ry="7"
        fill="#E53935"
        stroke="#1E1E1E"
        strokeWidth="3.5"
      />

      {/* Pepperoni Slice 3 (Center Bottom) */}
      <ellipse
        cx="56"
        cy="58"
        rx="7.5"
        ry="7"
        fill="#E53935"
        stroke="#1E1E1E"
        strokeWidth="3.5"
      />

      {/* Pepperoni Slice 4 (Bottom Left) */}
      <ellipse
        cx="33"
        cy="68"
        rx="7.5"
        ry="9"
        fill="#E53935"
        stroke="#1E1E1E"
        strokeWidth="3.5"
      />
    </svg>
  );
}
