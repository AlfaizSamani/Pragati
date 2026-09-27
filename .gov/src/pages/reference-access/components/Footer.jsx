import emblem from '../../../assets/ashoka-emblem.svg'

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr__brand">
        <b>PRAGATI</b>
        <span className="ftr__rule" />
        <span>National Infrastructure Intelligence</span>
      </div>

      <div className="ftr__mid">
        <em>Predictive Risk &amp; Governance</em>
        <span className="ftr__rule" />
        <em>Stronger Projects</em>
        <span className="ftr__rule" />
        <em>A More Resilient India</em>
      </div>

      <div className="ftr__end">
        <div className="ftr__links">
          {['Privacy', 'Terms', 'Accessibility', 'Help'].map((l) => (
            <a key={l} href="#" onClick={(e) => e.preventDefault()}>{l}</a>
          ))}
        </div>
        <span className="ftr__rule" />
        <div className="ftr__gov">
          <img src={emblem} alt="Government of India" />
          <span>Government of India</span>
          <span className="ftr__rule" />
          <span>MoSPI</span>
        </div>
      </div>
    </footer>
  )
}
