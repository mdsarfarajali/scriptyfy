import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import ScriptShowcase from './components/ScriptShowcase';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [scripts, setScripts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');

  // Listen to hash changes for simple routing
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch scripts dynamically from local backend server
  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/scripts');
        if (response.ok) {
          const data = await response.json();
          setScripts(data);
        }
      } catch (err) {
        console.warn("Backend server not running. Falling back to local offline state.");
      }
    };
    fetchScripts();
  }, [isAdmin]); // Refetch when returning from admin panel

  const categories = ["All", "Health & Science", "Motivational"];

  const filteredScripts = activeCategory === "All"
    ? scripts
    : scripts.filter(script => script.category === activeCategory);

  const handleExploreClick = () => {
    const el = document.getElementById('portfolio-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* Main Navbar */}
      <header className="main-navbar">
        <div className="nav-logo" onClick={() => { window.location.hash = ''; }} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Research<span className="gradient-text font-outfit">ToScript</span></span>
        </div>
        <nav className="nav-links">
          {isAdmin ? (
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}>Portfolio Showcase</a>
          ) : (
            <>
              <a href="#portfolio-section" className="nav-link">Portfolio</a>
              <a href="#admin" className="nav-link nav-btn">Upload Script</a>
            </>
          )}
        </nav>
      </header>

      {/* Conditional view rendering: Admin Panel or Main Showcase */}
      {isAdmin ? (
        <AdminPanel onBack={() => { window.location.hash = ''; }} />
      ) : (
        <>
          {/* Hero Component */}
          <Hero onExploreClick={handleExploreClick} />

          {/* Showcase Library Section */}
          <section id="portfolio-section" className="portfolio-showcase-section">
            <CategoryNav 
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              scriptsCount={scripts.length}
            />
            
            <ScriptShowcase scripts={filteredScripts} />
          </section>
        </>
      )}

      {/* Contact Call-To-Action Section */}
      <section id="contact-section" className="contact-section">
        <h2 className="contact-title">Ready to Dominate Short-Form?</h2>
        <p className="contact-subtitle">Stop guessing hooks. Get hyper-researched, biologically validated scripts that hook your audience and convert them into absolute fans.</p>
        <button className="btn-text-link" onClick={() => alert("Contact form integration coming soon! Make sure your research and scripts are saved.")}>
          Request Custom Speech Package →
        </button>

        <style dangerouslySetInnerHTML={{ __html: `
          .contact-section {
            padding: 8rem 0;
            text-align: center;
            margin-bottom: 5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
          }
          .contact-title {
            font-size: 2.8rem;
            margin-bottom: 1.5rem;
            font-weight: 300;
            letter-spacing: -0.02em;
          }
          .contact-subtitle {
            color: var(--text-secondary);
            font-size: 1.15rem;
            max-width: 620px;
            margin: 0 auto 3rem;
            line-height: 1.7;
          }
        `}} />
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <p>© 2026 ResearchToScript Portfolio. Built with scientific precision.</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .app-container {
          padding-top: 3rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Minimalist Editorial Navbar */
        .main-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 0;
          margin-bottom: 4rem;
          background: transparent;
          border-bottom: 1px solid var(--border-color);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 1.1rem;
          color: var(--accent-green);
        }

        .logo-text {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-primary);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .font-outfit {
          font-family: var(--font-heading);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 3rem;
        }

        .nav-link {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-secondary);
          transition: var(--transition-smooth);
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .nav-btn {
          color: var(--accent-green);
          font-weight: 600;
          border-bottom: 1px solid var(--accent-green);
          padding: 2px 0;
        }

        .nav-btn:hover {
          color: var(--text-primary);
          border-bottom-color: var(--text-primary);
          background: transparent;
          transform: none;
        }

        /* Portfolio Showcase Section */
        .portfolio-showcase-section {
          scroll-margin-top: 2rem;
          margin-bottom: 2rem;
        }

        /* Footer Section */
        .footer-section {
          margin-top: auto;
          padding: 3rem 0;
          border-top: 1px solid var(--border-color);
          text-align: center;
        }

        .footer-section p {
          font-size: 0.85rem;
          font-family: var(--font-heading);
          letter-spacing: 0.05em;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .main-navbar {
            padding: 1.25rem 0;
            flex-direction: column;
            gap: 1.5rem;
          }
          .nav-links {
            gap: 1.5rem;
          }
          .nav-link {
            font-size: 0.75rem;
          }
        }
      `}} />
    </div>
  );
}
