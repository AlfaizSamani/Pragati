import {
  LOGO_VIEWBOX,
  LOGO_TEXT_D,
  LOGO_BAR_D,
  LOGO_LINE_D,
  LOGO_ORANGE,
} from "./logoPaths";

/**
 * PRAGATI wordmark: bold serif letters with the orange "growth line"
 * (A crossbar + rising trend line through A-T-I).
 * Letters use `currentColor`, so colour comes from CSS (navy in the header, white in the footer).
 */
export default function Logo({ className = "logo" }) {
  return (
    <svg
      className={className}
      viewBox={LOGO_VIEWBOX}
      role="img"
      aria-label="PRAGATI"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="26"
        strokeLinejoin="miter"
        strokeMiterlimit="3"
        d={LOGO_TEXT_D}
      />
      <path fill={LOGO_ORANGE} d={LOGO_BAR_D} />
      <path
        fill="none"
        stroke={LOGO_ORANGE}
        strokeWidth="64"
        strokeLinecap="round"
        strokeLinejoin="round"
        d={LOGO_LINE_D}
      />
    </svg>
  );
}
