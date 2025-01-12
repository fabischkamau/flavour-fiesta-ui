import React from "react";

/**
 * RecipeIcon - A delightful SVG icon inspired by the charm of recipe books.
 * Perfect for adding a splash of flavor to your app.
 */
const RecipeIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width="36"
      height="36"
      role="img"
      aria-label="Recipe Icon"
    >
      {/* Background Gradient for a warm, rustic recipe vibe */}
      <defs>
        <linearGradient id="recipeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffdc7d" />
          <stop offset="100%" stopColor="#c1694f" />
        </linearGradient>
      </defs>

      {/* Rounded book-like rectangle */}
      <rect
        x="5"
        y="5"
        width="54"
        height="54"
        rx="6"
        fill="url(#recipeGradient)"
        stroke="#e97d19"
        strokeWidth="2.5"
      />

      {/* Recipe lines - the "steps" */}
      <line
        x1="16"
        y1="20"
        x2="48"
        y2="20"
        stroke="#fff2cc"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="28"
        x2="38"
        y2="28"
        stroke="#fff2cc"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="44" cy="28" r="3" fill="#fff2cc" />

      <line
        x1="16"
        y1="36"
        x2="38"
        y2="36"
        stroke="#fff2cc"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="44" cy="36" r="3" fill="#fff2cc" />

      {/* Decorative accent at the bottom */}
      <line
        x1="16"
        y1="44"
        x2="48"
        y2="44"
        stroke="#fff2cc"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3,2"
      />
    </svg>
  );
};

export default RecipeIcon;
