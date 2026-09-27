import { Users, ShieldCheck, BarChart3 } from 'lucide-react'
import FeatureItem from './FeatureItem.jsx'
import StatisticsBar from './StatisticsBar.jsx'
import hero from '../assets/hero.jpg'
import NB from './NB.jsx'

export default function LeftHeroPanel() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${hero})` }}>
      <div className="hero__body">
        <div className="eyebrow">
          <i />
          <span>JOIN PRAGATI</span>
        </div>

        <h1>Access for a<br />More Resilient India.</h1>

        <p className="hero__lede">
          Request access to PRAGATI and be part of a unified<NB />
          effort to monitor, de-risk and accelerate India&rsquo;s<NB />
          infrastructure development.
        </p>

        <div className="features">
          <FeatureItem icon={Users} title="Role-based Access">
            Secure, role-specific access for government<NB />officials and authorized partners.
          </FeatureItem>
          <FeatureItem icon={ShieldCheck} title="Trusted &amp; Secure">
            Built on Government of India security standards<NB />and data governance frameworks.
          </FeatureItem>
          <FeatureItem icon={BarChart3} title="Enable Better Decisions">
            Access real-time data, analytics and intelligence<NB />to drive impactful outcomes.
          </FeatureItem>
        </div>
      </div>

      <div className="hero__spacer" />

      <figure className="quote">
        <p>
          &ldquo;Better data.<br />
          Stronger decisions.<br />
          A more resilient India.&rdquo;
        </p>
        <figcaption className="quote__sig"><i />PRAGATI</figcaption>
      </figure>

      <StatisticsBar />
    </section>
  )
}
