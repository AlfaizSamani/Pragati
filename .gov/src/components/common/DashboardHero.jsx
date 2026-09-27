import { Calendar, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './dashboardHero.css';

export default function DashboardHero({ title, subtitle, detail, image, breadcrumb = 'Home', quote, quoteLines, quoteLayout, cycle = 'April 2026' }) {
  const { t } = useLanguage();
  const monthParts = /^(\d{4})-(\d{2})$/.exec(cycle);
  const cycleLabel = monthParts
    ? new Date(`${cycle}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    : cycle;

  return (
    <section className="dashboard-hero">
      <div className="dashboard-hero-photo" aria-hidden="true">
        <img src={image} alt="" draggable="false" />
      </div>
      <div className="dashboard-hero-cloud" aria-hidden="true" />
      <div className="dashboard-hero-copy">
        <div className="dashboard-hero-crumb"><Home size={12} /><span>/</span><span>{t(breadcrumb)}</span></div>
        <h1>{t(title)}</h1>
        <p>{t(subtitle)}</p>
        {detail && <p className="dashboard-hero-detail">{t(detail)}</p>}
      </div>
      <blockquote className={`dashboard-hero-quote ${quoteLayout === 'analytics' ? 'dashboard-hero-quote--analytics' : ''}`}>
        <p>{quoteLines ? quoteLines.map((line) => <span key={line}>{t(line)}</span>) : t(quote)}</p>
        <cite>— PRAGATI</cite>
      </blockquote>
      <div className="dashboard-hero-cycle">
        <Calendar size={15} />
        <div><strong>{cycleLabel}</strong><span>{t('Reporting Cycle')}</span></div>
      </div>
    </section>
  );
}