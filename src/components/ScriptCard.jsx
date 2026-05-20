import React from "react";

export default function ScriptCard({ script }) {
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

  const handleCardClick = () => {
    window.location.hash = `#script/${script.id}`;
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  return (
    <article
      className="script-card glass-panel"
      style={{ "--border-glow": getAccentColor(script.category) }}
      onClick={handleCardClick}
    >
      <header className="card-header">
        <span
          className="card-badge"
          style={{
            color: getAccentColor(script.category),
            borderColor: getAccentColor(script.category) + "33",
            background: getAccentColor(script.category) + "11",
          }}
        >
          {script.category}
        </span>
      </header>

      <h3 className="card-title">{script.title}</h3>

      {script.coverImage && script.coverImage !== "/placeholder.png" && (
        <div className="card-cover-container">
          <img
            src={
              script.coverImage.startsWith("/uploads/")
                ? `${API_URL}${script.coverImage}`
                : script.coverImage
            }
            alt={script.title}
            className="card-cover-image"
          />
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .script-card {
          padding: 2.5rem;
          cursor: pointer;
          position: relative;
          text-align: left;
          background: #F4F4F5;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          transition: var(--transition-smooth);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .script-card:hover {
          border-color: var(--accent-green);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.04), 0 1px 1px rgba(0, 0, 0, 0.02);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-badge {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          border: 1px solid;
          border-radius: 4px;
        }

        .card-title {
          font-size: 1.8rem;
          font-weight: 300;
          line-height: 1.25;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .card-cover-container {
          width: 100%;
          aspect-ratio: 9 / 16;
          overflow: hidden;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background: #E4E4E7;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .script-card:hover .card-cover-image {
          transform: scale(1.03);
        }

        @media (max-width: 768px) {
          .script-card {
            padding: 1.5rem;
          }
          .card-title {
            font-size: 1.5rem;
          }
        }
      `,
        }}
      />
    </article>
  );
}
