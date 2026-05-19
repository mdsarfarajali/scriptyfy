import React from 'react';
import ScriptCard from './ScriptCard';

export default function ScriptShowcase({ scripts }) {
  if (scripts.length === 0) {
    return (
      <div className="showcase-empty glass-panel">
        <span className="empty-icon">📁</span>
        <h4>No scripts found in this category</h4>
        <p>Stay tuned! We are currently analyzing more 2026 medical journals.</p>
        <style dangerouslySetInnerHTML={{ __html: `
          .showcase-empty {
            padding: 4rem 2rem;
            text-align: center;
            margin-top: 1.5rem;
          }
          .empty-icon {
            font-size: 3rem;
            display: block;
            margin-bottom: 1rem;
            opacity: 0.6;
          }
          .showcase-empty h4 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }
          .showcase-empty p {
            color: var(--text-secondary);
            font-size: 1rem;
          }
        `}} />
      </div>
    );
  }

  return (
    <section className="showcase-grid">
      {scripts.map((script) => (
        <ScriptCard key={script.id} script={script} />
      ))}

      <style dangerouslySetInnerHTML={{ __html: `
        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        @media (max-width: 1024px) {
          .showcase-grid {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </section>
  );
}
