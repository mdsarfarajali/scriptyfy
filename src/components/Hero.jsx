import React from 'react';

export default function Hero({ onExploreClick }) {
  return (
    <section className="hero-section glass-panel">
      <div className="hero-badge">
        <span className="badge-dot"></span>
        <span className="badge-text">Science-Backed Content Engine</span>
      </div>
      
      <h1 className="hero-title">
        Turning Deep Research Into <span className="gradient-text">Viral Script Masterpieces</span>
      </h1>
      
      <p className="hero-description">
        We dissect complex medical journals, neuroscience papers, and behavioral mechanics to draft high-engagement, authority-building short-form scripts for creators and coaches. No fluff. Just absolute scientific integrity and viral hooks.
      </p>
      
      <div className="hero-cta-group">
        <button className="btn-text-link" onClick={onExploreClick}>
          Explore Speeches Portfolio →
        </button>
      </div>

      <div className="hero-stats">
        <div className="stat-item">
          <div className="stat-num">10+</div>
          <div className="stat-label">2026 Journals Dissected</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-num">100%</div>
          <div className="stat-label">Scientific Accuracy</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-num">45s</div>
          <div className="stat-label">Optimized Retention</div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hero-section {
          padding: 8rem 0 6rem;
          margin-bottom: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          background: transparent;
        }

        .hero-badge {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          padding: 6px 14px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2.5rem;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: var(--accent-green);
          border-radius: 50%;
        }

        .badge-text {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .hero-title {
          font-size: 4.8rem;
          font-weight: 300;
          line-height: 1.1;
          margin-bottom: 2rem;
          max-width: 900px;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .hero-description {
          font-size: 1.15rem;
          color: var(--text-secondary);
          max-width: 700px;
          margin-bottom: 3.5rem;
          line-height: 1.7;
          font-weight: 300;
        }

        .hero-cta-group {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 6rem;
          z-index: 10;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5rem;
          width: 100%;
          border-top: 1px solid var(--border-color);
          padding-top: 4rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-num {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          font-weight: 300;
          color: var(--text-primary);
          margin-bottom: 4px;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 45px;
          background: var(--border-color);
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 0.6; }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 5rem 0 3rem;
          }
          .hero-title {
            font-size: 3rem;
          }
          .hero-description {
            font-size: 1rem;
            margin-bottom: 2rem;
          }
          .hero-cta-group {
            margin-bottom: 4rem;
          }
          .hero-stats {
            flex-direction: column;
            gap: 2.5rem;
            padding-top: 3rem;
          }
          .stat-divider {
            display: none;
          }
        }
      `}} />
    </section>
  );
}
