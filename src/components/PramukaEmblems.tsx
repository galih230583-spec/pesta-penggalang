import React from 'react';

/**
 * Vector illustration of Lambang Gerakan Pramuka (Tunas Kelapa)
 * Matches the silhouette of the sprouting coconut emblem uploaded by the user.
 */
export const TunasKelapaLogo: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-12 h-12',
  color = 'currentColor',
}) => (
  <svg
    viewBox="0 0 120 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
     role="img"
    aria-label="Lambang Tunas Kelapa Gerakan Pramuka"
  >
    {/* Coconut Fruit Body */}
    <path
      d="M14 114C14 114 22 86 52 86C78 86 90 105 90 118C90 134 76 149 52 149C26 149 14 123 14 114Z"
      fill={color}
    />
    {/* Coconut Pointed Tip Left */}
    <path
      d="M11 114C11 110 18 102 25 97C20 108 20 120 25 131C18 126 11 118 11 114Z"
      fill={color}
    />
    {/* Tall Main Shoot & Twin Leaf Blades */}
    <path
      d="M84 112C88 94 78 76 70 58C63 42 66 26 71 17C74 28 77 38 78 46C80 30 82 14 87 4C89 20 98 38 99 56C100 72 93 86 95 104C96 112 94 119 88 123L84 112Z"
      fill={color}
    />
    {/* Downward Root Shoot */}
    <path
      d="M86 119C91 128 96 141 101 153C102 156 99 158 96 156C88 150 84 137 80 125L86 119Z"
      fill={color}
    />
  </svg>
);

/**
 * Vector illustration of Lambang WOSM (World Organization of the Scout Movement)
 * Purple circular rope with reef knot at the bottom and fleur-de-lis with two 5-pointed stars.
 */
export const WosmLogo: React.FC<{ className?: string }> = ({
  className = 'w-12 h-12',
}) => (
  <svg
    viewBox="0 0 140 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Lambang WOSM Kepanduan Dunia"
  >
    {/* Outer Rope Circle */}
    <circle
      cx="70"
      cy="68"
      r="58"
      stroke="#4B1E78"
      strokeWidth="6.5"
      strokeDasharray="10 4"
    />
    <circle
      cx="70"
      cy="68"
      r="55"
      stroke="#4B1E78"
      strokeWidth="2"
    />

    {/* Center Petal of Fleur-de-lis */}
    <path
      d="M70 18C70 18 89 35 88 57C87 68 81 76 78 81H62C59 76 53 68 52 57C51 35 70 18 70 18Z"
      fill="#4B1E78"
    />
    {/* Center White Needle Line */}
    <path d="M70 32V81" stroke="#FAF7F2" strokeWidth="2.5" strokeLinecap="round" />

    {/* Left Petal */}
    <path
      d="M60 80C55 71 48 63 37 64C27 65 21 73 25 82C27 77 33 75 37 78C42 81 44 88 49 81"
      fill="#4B1E78"
    />
    <path
      d="M62 79C56 64 46 50 32 51C20 52 14 63 17 75C20 84 29 88 35 83C31 80 30 74 35 71C40 68 48 73 53 81H62Z"
      fill="#4B1E78"
    />

    {/* Right Petal */}
    <path
      d="M78 79C84 64 94 50 108 51C120 52 126 63 123 75C120 84 111 88 105 83C109 80 110 74 105 71C100 68 92 73 87 81H78Z"
      fill="#4B1E78"
    />

    {/* Left 5-Point Star */}
    <polygon
      points="31,61 32.8,65 37,65.5 33.8,68.3 34.8,72.5 31,70.2 27.2,72.5 28.2,68.3 25,65.5 29.2,65"
      fill="#FAF7F2"
    />

    {/* Right 5-Point Star */}
    <polygon
      points="109,61 110.8,65 115,65.5 111.8,68.3 112.8,72.5 109,70.2 105.2,72.5 106.2,68.3 103,65.5 107.2,65"
      fill="#FAF7F2"
    />

    {/* Horizontal Binding Band */}
    <rect
      x="48"
      y="81"
      width="44"
      height="7"
      rx="3.5"
      fill="#4B1E78"
      stroke="#FAF7F2"
      strokeWidth="2"
    />

    {/* Lower Base of Fleur-de-lis */}
    <path
      d="M63 89H77L82 104L70 116L58 104L63 89Z"
      fill="#4B1E78"
    />
    <path
      d="M55 89H62C61 98 56 105 47 107C43 108 40 104 42 100C46 102 52 97 55 89Z"
      fill="#4B1E78"
    />
    <path
      d="M85 89H78C79 98 84 105 93 107C97 108 100 104 98 100C94 102 88 97 85 89Z"
      fill="#4B1E78"
    />
    <path d="M70 89V111" stroke="#FAF7F2" strokeWidth="2" />

    {/* Reef Knot (Simpul Mati) at Bottom */}
    <path
      d="M52 125C56 119 66 119 72 125C78 131 86 131 90 125"
      stroke="#4B1E78"
      strokeWidth="6.5"
      strokeLinecap="round"
    />
    <path
      d="M52 131C56 137 66 137 72 131C78 125 86 125 90 131"
      stroke="#4B1E78"
      strokeWidth="6.5"
      strokeLinecap="round"
    />
    <path
      d="M53 129L43 142M87 129L97 142"
      stroke="#4B1E78"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
);
