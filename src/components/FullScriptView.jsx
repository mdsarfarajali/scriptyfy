import React, { useState } from "react";

export default function FullScriptView({ script, onBack }) {
  const [copied, setCopied] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  if (!script) {
    return (
      <div className="not-found-container">
        <h2>Script Not Found</h2>
        <button className="btn-text-link" onClick={onBack}>
          ← Back to Portfolio
        </button>
      </div>
    );
  }

  const getAccentColor = (category) => {
    switch (category) {
      case "Health & Science":
        return "#10B981"; // Emerald Green
      case "Motivational":
        return "#F59E0B"; // Warm Gold
      default:
        return "#10B981";
    }
  };

  const handleCopy = () => {
    if (script.rawScriptText) {
      navigator.clipboard.writeText(script.rawScriptText);
    } else {
      // Fallback if raw text isn't saved, reconstruct from array
      const text = script.scriptContent
        .map(
          (step) =>
            `${step.time}\nVisual: ${step.visual}\nVO: ${step.audio}\nText: ${step.text || ""}`,
        )
        .join("\n\n");
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="script-view-container">
      <header className="script-view-header">
        <button className="btn-text-link back-btn" onClick={onBack}>
          ← Back to Portfolio Showcase
        </button>
        <span
          className="script-category-badge"
          style={{
            color: getAccentColor(script.category),
            borderColor: getAccentColor(script.category) + "33",
            background: getAccentColor(script.category) + "11",
          }}
        >
          {script.category}
        </span>
        <h1 className="script-view-title">{script.title}</h1>
      </header>

      <div className="script-view-content">
        {/* Cover Art Poster (Luxe presentation) */}
        {script.coverImage && script.coverImage !== "/placeholder.png" && (
          <div className="script-view-cover-wrapper">
            <img
              src={
                script.coverImage.startsWith("/uploads/")
                  ? `${API_URL}${script.coverImage}`
                  : script.coverImage
              }
              alt={script.title}
              className="script-view-cover"
            />
          </div>
        )}

        {/* Research Banner */}
        {script.researchSource && (
          <div className="script-view-research">
            <span className="research-icon">🔬</span>
            <div className="research-details">
              <span className="research-label">SUPPORTING CLINICAL STUDY</span>
              <span className="research-source">{script.researchSource}</span>
            </div>
          </div>
        )}

        {/* Script Content Reader */}
        <div className="script-view-body">
          <h2 className="timeline-heading">
            📜 Speech & Production Transcript
          </h2>
          <div className="timeline-divider"></div>

          {script.rawScriptText ? (
            <div className="script-raw-reader-card glass-panel">
              <pre className="script-raw-content">{script.rawScriptText}</pre>
            </div>
          ) : (
            <div className="script-view-timeline">
              {script.scriptContent &&
                script.scriptContent.map((step, idx) => (
                  <div className="timeline-item" key={idx}>
                    <div
                      className="timeline-badge"
                      style={{ background: getAccentColor(script.category) }}
                    >
                      {step.time}
                    </div>
                    <div className="timeline-content-card glass-panel">
                      <div className="content-block">
                        <span className="block-label visual-lbl">
                          🎬 VISUAL DIRECTION / B-ROLL
                        </span>
                        <p className="block-text">{step.visual}</p>
                      </div>
                      <div className="content-block">
                        <span className="block-label audio-lbl">
                          🎙️ SPEECH VOICE-OVER (VO)
                        </span>
                        <p className="block-text voiceover-text">
                          "{step.audio}"
                        </p>
                      </div>
                      {step.text && (
                        <div className="content-block">
                          <span className="block-label text-lbl">
                            💬 ON-SCREEN CAPTIONS
                          </span>
                          <code className="block-code">{step.text}</code>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="script-view-actions">
          <button
            className={`btn-text-link copy-script-btn ${copied ? "copied" : ""}`}
            onClick={handleCopy}
          >
            {copied ? "✓ Transcript Copied" : "Copy Transcript to Clipboard →"}
          </button>

          {script.scriptFilePath && (
            <a
              href={
                script.scriptFilePath.startsWith("/uploads/")
                  ? `${API_URL}${script.scriptFilePath}`
                  : script.scriptFilePath
              }
              download
              className="btn-text-link download-script-btn"
              style={{ marginLeft: "3rem", color: "#4F46E5" }}
            >
              Download Raw Script (.txt) ↓
            </a>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .script-view-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 3rem 0 8rem;
          font-family: var(--font-body);
        }

        .script-view-header {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 2rem;
          margin-bottom: 3.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .back-btn {
          font-size: 0.85rem;
        }

        .script-category-badge {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 6px 12px;
          border: 1px solid;
          border-radius: 4px;
        }

        .script-view-title {
          font-size: 3.2rem;
          font-weight: 300;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .script-view-content {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        /* Raw Script Document Reader Styles */
        .script-raw-reader-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 3.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.01);
        }

        .script-raw-content {
          font-family: var(--font-body);
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--text-primary);
          white-space: pre-wrap;
          word-break: break-word;
          margin: 0;
        }

        /* Cover Image wrapper */
        .script-view-cover-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          background: #F4F4F5;
          padding: 2.5rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }

        .script-view-cover {
          max-width: 100%;
          max-height: 480px;
          border-radius: 6px;
          box-shadow: var(--shadow-subtle);
        }

        /* Research Source banner */
        .script-view-research {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: #F4F4F5;
          border: 1px solid var(--border-color);
          padding: 1.5rem 2rem;
          border-radius: 6px;
        }

        .research-icon {
          font-size: 1.6rem;
        }

        .research-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .research-label {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .research-source {
          font-size: 1rem;
          font-weight: 400;
          color: var(--text-primary);
          white-space: pre-line;
          line-height: 1.6;
        }

        /* Timeline flow */
        .timeline-heading {
          font-size: 1.5rem;
          font-weight: 400;
          letter-spacing: -0.01em;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }

        .timeline-divider {
          width: 100%;
          height: 1px;
          background: var(--border-color);
          margin-bottom: 3rem;
        }

        .script-view-timeline {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          border-left: 1px solid var(--border-color);
          padding-left: 2rem;
          margin-left: 10px;
        }

        .timeline-item {
          position: relative;
        }

        .timeline-badge {
          position: absolute;
          left: calc(-2rem - 10px);
          top: 0;
          transform: translateX(-50%);
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 600;
          color: #FFFFFF;
          padding: 6px 12px;
          border-radius: 4px;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }

        .timeline-content-card {
          padding: 2.5rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .content-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .block-label {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
        }

        .visual-lbl { color: #4B5563; }
        .audio-lbl { color: var(--accent-green); }
        .text-lbl { color: #8B5CF6; }

        .block-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-primary);
        }

        .voiceover-text {
          font-size: 1.05rem;
          font-style: italic;
          font-weight: 300;
        }

        .block-code {
          font-family: monospace;
          background: #F4F4F5;
          padding: 10px 14px;
          border-radius: 4px;
          font-size: 0.85rem;
          color: #3F3F46;
          line-height: 1.4;
          white-space: pre-line;
        }

        /* Bottom Action Buttons */
        .script-view-actions {
          border-top: 1px solid var(--border-color);
          padding-top: 3rem;
          display: flex;
          justify-content: center;
        }

        .copy-script-btn {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--accent-green);
        }

        .copy-script-btn::after {
          background: var(--accent-green);
        }

        @media (max-width: 768px) {
          .script-view-title {
            font-size: 2.4rem;
          }
          .script-view-cover-wrapper {
            padding: 1rem;
          }
          .timeline-content-card {
            padding: 1.5rem;
          }
        }
      `,
        }}
      />
    </div>
  );
}
