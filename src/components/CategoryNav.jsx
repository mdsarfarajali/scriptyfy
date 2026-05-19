import React from 'react';

export default function CategoryNav({ categories, activeCategory, setActiveCategory, scriptsCount }) {
  // Map category to a class or inline brand color
  const getCategoryColorClass = (cat) => {
    switch (cat) {
      case "Health & Science": return "cat-health";
      case "Motivational": return "cat-motivation";
      default: return "cat-all";
    }
  };

  return (
    <div className="nav-container glass-panel">
      <div className="nav-header">
        <h3 className="nav-title">📁 Showcase Library</h3>
        <span className="total-badge">{scriptsCount} scripts total</span>
      </div>
      <div className="nav-pills">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = cat === "All" ? scriptsCount : 0;
          
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`nav-pill ${isActive ? 'active' : ''} ${getCategoryColorClass(cat)}`}
            >
              <span className="pill-name">{cat}</span>
              <span className="pill-count">{count}</span>
            </button>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .nav-container {
          padding: 1rem 0;
          margin-bottom: 3.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          background: transparent;
          border-bottom: 1px solid var(--border-color);
        }

        .nav-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-primary);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .total-badge {
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: #FFFFFF;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 500;
          border: 1px solid var(--border-color);
        }

        .nav-pills {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .nav-pills::-webkit-scrollbar {
          height: 3px;
        }

        .nav-pill {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          transition: var(--transition-smooth);
        }

        .nav-pill:hover {
          color: var(--text-primary);
          border-color: var(--border-hover);
        }

        .pill-count {
          font-size: 0.7rem;
          background: rgba(9, 9, 11, 0.05);
          padding: 2px 6px;
          border-radius: 50px;
          color: var(--text-secondary);
          transition: var(--transition-smooth);
        }

        /* Luxurious Forest Green active states */
        .nav-pill.active {
          background: var(--accent-green);
          border-color: var(--accent-green);
          color: #FFFFFF;
        }

        .nav-pill.active .pill-count {
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          font-weight: 600;
        }

        .nav-pill.active.cat-all {
          background: var(--accent-green);
          border-color: var(--accent-green);
        }

        .nav-pill.active.cat-health {
          background: var(--accent-green);
          border-color: var(--accent-green);
        }

        .nav-pill.active.cat-motivation {
          background: var(--accent-green);
          border-color: var(--accent-green);
        }

        @media (max-width: 768px) {
          .nav-container {
            flex-direction: column;
            align-items: flex-start;
            padding: 1rem 0;
          }
          .nav-pills {
            width: 100%;
          }
        }
      `}} />
    </div>
  );
}
