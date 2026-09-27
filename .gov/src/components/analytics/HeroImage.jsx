import { HERO_SVG } from "./heroIllustration";

/**
 * Right-hand hero backdrop. By default it is the soft sky gradient (as in the approved layout).
 * Pass `illustration` to draw the landscape / expressway artwork on top of it.
 */
/*export default function HeroImage({ illustration = false }) {
  return (
    <div
      className="hero-img"
      {...(illustration ? { dangerouslySetInnerHTML: { __html: HERO_SVG } } : {})}
    />
  );
}*/
/*import heroHighway from "../assets/hero-highway.jpg";

export default function HeroImage() {
  return (
    <div
      className="hero-img"
      style={{
        backgroundImage: `url(${heroHighway})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}*/

/*export default function HeroImage() {
  return (
    <svg
      className="hero-img"
      viewBox="0 0 1000 200"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DCE9F5" />
          <stop offset="55%" stopColor="#EAF1F8" />
          <stop offset="100%" stopColor="#F3EDE3" />
        </linearGradient>
        <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B9CFE0" />
          <stop offset="100%" stopColor="#A8C2D6" />
        </linearGradient>
        <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8FAF8C" />
          <stop offset="100%" stopColor="#6F9A6E" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="200" fill="url(#sky)" />

      <path d="M0,120 Q150,90 300,110 T600,100 T1000,115 L1000,200 L0,200 Z" fill="url(#hillFar)" opacity="0.6" />
      <path d="M0,150 Q200,110 400,140 T800,130 T1000,145 L1000,200 L0,200 Z" fill="url(#hillNear)" />

      <path
        d="M50,190 C180,150 220,170 300,150 C400,125 450,160 560,140 C660,122 700,150 800,120 C880,96 920,110 970,80"
        fill="none"
        stroke="#C9CFD6"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M50,190 C180,150 220,170 300,150 C400,125 450,160 560,140 C660,122 700,150 800,120 C880,96 920,110 970,80"
        fill="none"
        stroke="#E4E9ED"
        strokeWidth="3"
        strokeDasharray="14 12"
        strokeLinecap="round"
      />

      <circle cx="860" cy="55" r="34" fill="#F6C87A" opacity="0.85" />
    </svg>
  );
}*/
import heroHighway from "../../assets/hero-highway.png";

export default function HeroImage() {
  return (
    <div
      className="hero-img"
      style={{
        backgroundImage: `url(${heroHighway})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}