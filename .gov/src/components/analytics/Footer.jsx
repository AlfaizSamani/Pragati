import emblem from "../../assets/emblem.png";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <span className="fb">
        <Logo />
      </span>
      <span className="fsep">|</span>
      <span className="fs">National Infrastructure Intelligence</span>
      <div className="fmid">
        <span>Predictive Risk &amp; Governance</span>
        <span className="fsep">|</span>
        <span>Stronger Projects</span>
        <span className="fsep">|</span>
        <span>A More Resilient India</span>
      </div>
      <div className="fright">
        <a href="#">Privacy</a>
        <span className="fsep">|</span>
        <a href="#">Terms</a>
        <span className="fsep">|</span>
        <a href="#">Accessibility</a>
        <span className="fsep">|</span>
        <a href="#">Help</a>
        <span className="fsep">|</span>
        <img className="femb" alt="Government of India emblem" src={emblem} style={{ objectFit: "contain" }} />
        <span>Government of India</span>
        <span className="fsep">|</span>
        <span>MoSPI</span>
      </div>
    </footer>
  );
}
