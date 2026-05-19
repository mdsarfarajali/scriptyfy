import React, { useState } from 'react';

export default function ScriptCard({ script }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getAccentColor = (cat) => {
    return cat === "Health & Science" ? "var(--accent-health)" : "var(--accent-motivation)";
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    // Format full script as text
    const textToCopy = script.scriptContent.map(step => 
      `[${step.time}] VISUAL: ${step.visual}\nVOICEOVER: ${step.audio}\nOVERLAY: ${step.text}\n`
    ).join('\n');
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article 
      className={`script-card glass-panel ${isOpen ? 'expanded' : ''}`}
      style={{ '--border-glow': getAccentColor(script.category) }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <header className="card-header">
        <span className="card-badge" style={{ color: getAccentColor(script.category), borderColor: getAccentColor(script.category) + '33', background: getAccentColor(script.category) + '11' }}>
          {script.category}
        </span>
      </header>

      <h3 className="card-title">{script.title}</h3>

      {script.coverImage && script.coverImage !== '/placeholder.png' && (
        <div className="card-cover-container">
          <img src={`http://localhost:3001${script.coverImage}`} alt={script.title} className="card-cover-image" />
        </div>
      )}

      {script.researchSource && (
        <div className="card-research">
          <span className="research-icon">🔬</span>
          <div className="research-details">
            <span className="research-label">Supporting Research:</span>
            <span className="research-source">{script.researchSource}</span>
          </div>
        </div>
      )}

      {/* Accordion / Expandable content */}
      {isOpen && (
        <div className="script-body" onClick={(e) => e.stopPropagation()}>
          <div className="script-divider-line"></div>
          
          <h4 className="body-heading">📜 Visual Script Outline:</h4>
          
          <div className="timeline">
            {script.scriptContent.map((step, idx) => (
              <div className="timeline-item" key={idx}>
                <div className="timeline-badge" style={{ background: getAccentColor(script.category) }}>
                  {step.time}
                </div>
                <div className="timeline-content glass-panel">
                  <div className="content-block">
                    <span className="block-label visual-lbl">🎬 VISUAL CUE / B-ROLL</span>
                    <p className="block-text">{step.visual}</p>
                  </div>
                  <div className="content-block">
                    <span className="block-label audio-lbl">🎙️ VOICEOVER (VO)</span>
                    <p className="block-text voiceover-text">"{step.audio}"</p>
                  </div>
                  {step.text && (
                    <div className="content-block">
                      <span className="block-label text-lbl">💬 ON-SCREEN CAPTION</span>
                      <code className="block-code">{step.text}</code>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>



          <div className="card-actions">
            {script.researchUrl && (
              <a 
                href={script.researchUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-text-link"
              >
                Open Full Paper →
              </a>
            )}
            <button className={`btn-text-link ${copied ? 'copied' : ''}`} onClick={handleCopy}>
              {copied ? '✓ Copied' : 'Copy Raw Script →'}
            </button>
          </div>
        </div>
      )}

      <div className="card-footer">
        <span className="expand-hint">
          {isOpen ? 'Click to collapse script ▲' : 'Click to view full video script ▼'}
        </span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .script-card {
          padding: 2.5rem;
          cursor: pointer;
          position: relative;
          text-align: left;
          background: #F4F4F5;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          transition: var(--transition-smooth);
        }

        .script-card:hover {
          border-color: var(--accent-green);
          background: #FFFFFF;
        }

        .script-card.expanded {
          cursor: default;
          background: #FFFFFF;
          border-color: var(--accent-green);
        }

        .card-cover-container {
          width: 100%;
          height: 240px;
          overflow: hidden;
          border-radius: 6px;
          margin-bottom: 2rem;
          border: 1px solid var(--border-color);
          background: #F4F4F5;
        }

        .card-cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .script-card:hover .card-cover-image {
          transform: scale(1.03);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .card-badge {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: #FFFFFF !important;
        }

        .card-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: var(--font-heading);
        }

        .card-title {
          font-size: 1.6rem;
          line-height: 1.25;
          margin-bottom: 1.25rem;
          font-weight: 300;
          color: var(--text-primary);
        }

        .card-hook-container {
          position: relative;
          background: #FFFFFF;
          border-left: 2px solid var(--accent-green);
          padding: 16px 20px 16px 24px;
          margin-bottom: 1.5rem;
        }

        .hook-quote {
          display: none; /* Strip away emoji/decorative quotes for clean editorial look */
        }

        .card-hook {
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-weight: 400;
          font-style: italic;
          line-height: 1.6;
        }

        .card-research {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          padding: 14px 16px;
          border-radius: 6px;
          margin-bottom: 1.5rem;
        }

        .research-icon {
          font-size: 1rem;
          margin-top: 2px;
          color: var(--accent-green);
        }

        .research-details {
          display: flex;
          flex-direction: column;
        }

        .research-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
          font-family: var(--font-heading);
        }

        .research-source {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          font-weight: 400;
        }

        .script-divider-line {
          height: 1px;
          background: var(--border-color);
          margin: 2.5rem 0;
        }

        .body-heading {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          font-family: var(--font-heading);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-primary);
        }

        /* Minimalist expanded script output details */
        .timeline {
          position: relative;
          padding-left: 20px;
          border-left: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }

        .timeline-item {
          position: relative;
        }

        .timeline-badge {
          position: absolute;
          left: -42px;
          top: 0px;
          width: 42px;
          height: 20px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 500;
          color: var(--text-secondary);
          font-family: var(--font-heading);
          border: 1px solid var(--border-color);
          background: #FFFFFF;
        }

        .timeline-content {
          padding: 1.5rem;
          background: #F4F4F5;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .content-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .block-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: var(--font-heading);
        }

        .visual-lbl { color: var(--accent-green); }
        .audio-lbl { color: var(--text-secondary); }
        .text-lbl { color: var(--text-muted); }

        .block-text {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .voiceover-text {
          color: var(--text-primary);
          font-weight: 500;
        }

        .block-code {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.85rem;
          color: var(--text-primary);
          display: inline-block;
          font-family: var(--font-body);
        }

        .creator-notes-box {
          display: flex;
          gap: 10px;
          background: #FAF9F6;
          border: 1px solid var(--border-color);
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 2.5rem;
        }

        .notes-icon {
          font-size: 1.1rem;
          color: var(--accent-green);
        }

        .notes-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .card-actions {
          display: flex;
          gap: 2.5rem;
          justify-content: flex-start;
          align-items: center;
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
          margin-top: 1rem;
        }

        .card-footer {
          margin-top: 2rem;
          display: flex;
          justify-content: center;
          border-top: 1px solid var(--border-color);
          padding-top: 1.25rem;
        }

        .expand-hint {
          font-size: 0.8rem;
          font-family: var(--font-heading);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
          transition: var(--transition-smooth);
        }

        .script-card:hover .expand-hint {
          color: var(--accent-green);
        }
      `}} />
    </article>
  );
}
