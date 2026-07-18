export default function AppIcon({ size = 24, className = '' }) {
  const sealColor = '#8C3B2E'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle with irregular notches for hand-stamped effect */}
      <g>
        {/* Main circle outline with notches */}
        <circle cx="60" cy="60" r="54" fill="none" stroke={sealColor} strokeWidth="3" />

        {/* Irregular notches on outer edge for stamp impression effect */}
        <circle
          cx="60"
          cy="5"
          r="2.5"
          fill={sealColor}
          opacity="0.6"
        />
        <circle
          cx="103"
          cy="22"
          r="2"
          fill={sealColor}
          opacity="0.5"
        />
        <circle
          cx="115"
          cy="65"
          r="2.5"
          fill={sealColor}
          opacity="0.6"
        />
        <circle
          cx="100"
          cy="105"
          r="2"
          fill={sealColor}
          opacity="0.5"
        />
        <circle
          cx="55"
          cy="116"
          r="2.5"
          fill={sealColor}
          opacity="0.6"
        />
        <circle
          cx="15"
          cy="105"
          r="2"
          fill={sealColor}
          opacity="0.5"
        />
        <circle
          cx="5"
          cy="60"
          r="2.5"
          fill={sealColor}
          opacity="0.6"
        />
        <circle
          cx="18"
          cy="20"
          r="2"
          fill={sealColor}
          opacity="0.5"
        />
      </g>

      {/* Inner circle */}
      <circle cx="60" cy="60" r="48" fill="none" stroke={sealColor} strokeWidth="1.5" opacity="0.5" />

      {/* Soundwave bars forming a checkmark-like pattern (for small sizes) */}
      {size > 20 ? (
        <g>
          {/* Bar 1 - short left */}
          <rect x="42" y="54" width="3" height="12" fill={sealColor} rx="1.5" />

          {/* Bar 2 - medium middle (longest, forms the check) */}
          <rect x="48" y="48" width="3" height="24" fill={sealColor} rx="1.5" />

          {/* Bar 3 - tall right */}
          <rect x="54" y="42" width="3" height="36" fill={sealColor} rx="1.5" />

          {/* Bar 4 - descending check mark effect */}
          <rect x="60" y="52" width="3" height="16" fill={sealColor} rx="1.5" />
        </g>
      ) : (
        /* Simpler design for small sizes - just the "V" */
        <text
          x="60"
          y="70"
          textAnchor="middle"
          fontSize={size * 0.6}
          fontWeight="bold"
          fontFamily="'Source Serif 4', serif"
          fill={sealColor}
        >
          V
        </text>
      )}
    </svg>
  )
}
