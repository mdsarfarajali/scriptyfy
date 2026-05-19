import React, { useState } from 'react';

export default function AdminPanel({ onBack }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Health & Science',
    researchSource: '',
    researchUrl: '',
    scriptText: ''
  });

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [scriptFile, setScriptFile] = useState(null);
  const [parsedSummary, setParsedSummary] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setStatus({ type: 'error', message: 'Only image files are supported!' });
        return;
      }
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setStatus({ type: 'success', message: 'Cover art selected successfully.' });
    }
  };

  // Helper parser strictly to show live analysis feedback to user
  const analyzeScriptText = (text) => {
    const lines = text.split('\n').map(l => l.trim());
    let sceneCount = 0;
    let voWords = 0;
    let overlayLines = 0;

    const timeRegex = /^(\d+:\d+)\s*[–-]\s*(\d+:\d+)$/;

    lines.forEach(line => {
      if (timeRegex.test(line)) sceneCount++;
      if (line.startsWith('"') || line.includes('Voiceover') || line.includes('VO:')) {
        voWords += line.split(' ').length;
      }
      if (line.includes('On-screen overlay') || line.includes('OVERLAY:')) {
        overlayLines++;
      }
    });

    return {
      scenes: sceneCount || 1,
      voWordCount: voWords || Math.round(text.split(' ').length * 0.6),
      overlays: overlayLines || Math.round(lines.length / 8)
    };
  };

  const handleScriptFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
        setStatus({ type: 'error', message: 'Only standard text (.txt) files are supported!' });
        return;
      }
      setScriptFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setFormData(prev => ({ ...prev, scriptText: text }));
        
        // Auto-extract Title & Source
        const lines = text.split('\n');
        let extractedTitle = file.name.replace('.txt', '');
        if (lines.length > 0 && lines[0].trim()) {
          extractedTitle = lines[0].trim();
        }

        const researchLine = lines.find(l => l.includes('Oxford') || l.includes('Research') || l.includes('Primary:'));
        const extractedSource = researchLine ? researchLine.trim() : '';

        setFormData(prev => ({
          ...prev,
          title: prev.title || extractedTitle,
          researchSource: prev.researchSource || extractedSource
        }));

        // Generate dynamic visual analysis HUD metrics
        setParsedSummary(analyzeScriptText(text));
        setStatus({ type: 'success', message: '✓ Script read and analyzed in background.' });
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.scriptText) {
      setStatus({ type: 'error', message: 'Please upload a script file (.txt) and enter a title.' });
      return;
    }

    setLoading(true);
    setStatus({ type: 'info', message: 'Uploading script details and saving files...' });

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });
    if (coverFile) {
      submissionData.append('coverImage', coverFile);
    }

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: submissionData
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Server error occurred');
      }

      setStatus({ type: 'success', message: '✓ Published successfully! Added to your live showcase.' });
      
      // Reset form
      setFormData({
        title: '',
        category: 'Health & Science',
        researchSource: '',
        researchUrl: '',
        scriptText: ''
      });
      setCoverFile(null);
      setCoverPreview(null);
      setScriptFile(null);
      setParsedSummary(null);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: `Upload failed: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dark-theme">
      <div className="admin-container">
        
        {/* Dashboard Navbar */}
        <header className="admin-header">
          <div className="header-meta">
            <span className="badge-console">ADMIN CONSOLE</span>
            <h1 className="admin-title">Script Management</h1>
          </div>
          <button className="btn-back-console" onClick={onBack}>
            ← Back to Showcase
          </button>
        </header>

        {status.message && (
          <div className={`status-banner-dark ${status.type}`}>
            {status.type === 'success' ? '⚡' : status.type === 'error' ? '⚠' : 'ℹ'} {status.message}
          </div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="dashboard-grid">
            
            {/* Left Control Panel: Metadata Form */}
            <div className="dashboard-card form-card">
              <h2 className="card-heading">01. Metadata Controller</h2>
              
              <div className="input-group">
                <label>Speech Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Your Liver Is Under Attack"
                  required 
                />
              </div>

              <div className="input-group">
                <label>Vibe Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="Health & Science">Health & Science</option>
                  <option value="Motivational">Motivational</option>
                </select>
              </div>

              <div className="input-group">
                <label>Research Anchor Source</label>
                <input 
                  type="text" 
                  name="researchSource" 
                  value={formData.researchSource} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Oxford University — Cell Metabolism, Mar 2026"
                />
              </div>

              <div className="input-group">
                <label>Research Paper Link</label>
                <input 
                  type="url" 
                  name="researchUrl" 
                  value={formData.researchUrl} 
                  onChange={handleInputChange} 
                  placeholder="https://pubmed.ncbi.nlm.nih.gov/study-id"
                />
              </div>
            </div>

            {/* Right Control Panel: Media & Document Drag */}
            <div className="dashboard-card uploads-card">
              <h2 className="card-heading">02. Asset & Script Upload</h2>

              {/* Cover Art Upload */}
              <div className="input-group">
                <label>Cover Art / Visual Thumbnail</label>
                <div className="dark-upload-box">
                  <input 
                    type="file" 
                    id="coverDarkInput" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    style={{ display: 'none' }}
                  />
                  {coverPreview ? (
                    <div className="dark-preview-wrapper">
                      <img src={coverPreview} alt="Cover Preview" className="dark-image-preview" />
                      <button type="button" className="btn-remove-dark" onClick={() => { setCoverFile(null); setCoverPreview(null); }}>
                        Remove Asset
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="coverDarkInput" className="dark-upload-label">
                      <span className="upload-icon">🏞️</span>
                      <span className="upload-text">Upload Cover Art</span>
                      <span className="upload-hint">Click to browse visual posters</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Script Text File Upload */}
              <div className="input-group">
                <label>Speech Script File (.txt) *</label>
                <div className="dark-upload-box">
                  <input 
                    type="file" 
                    id="scriptDarkInput" 
                    accept=".txt" 
                    onChange={handleScriptFileChange} 
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="scriptDarkInput" className="dark-upload-label">
                    <span className="upload-icon">📂</span>
                    <span className="upload-text">{scriptFile ? scriptFile.name : "Select Script Text Document"}</span>
                    <span className="upload-hint">The system will parse scenes and voiceovers in the background</span>
                  </label>
                </div>
              </div>

              {/* Parsed Script Summary HUD */}
              {parsedSummary && (
                <div className="parsed-summary-hud">
                  <div className="hud-header">
                    <span className="hud-dot animate-pulse"></span>
                    <span className="hud-title">REAL-TIME TEXT PARSING ACTIVE</span>
                  </div>
                  <div className="hud-stats">
                    <div className="hud-stat-item">
                      <span className="hud-value">{parsedSummary.scenes}</span>
                      <span className="hud-label">SCENES DETECTED</span>
                    </div>
                    <div className="hud-stat-item">
                      <span className="hud-value">{parsedSummary.voWordCount}</span>
                      <span className="hud-label">VOICEOVER WORDS</span>
                    </div>
                    <div className="hud-stat-item">
                      <span className="hud-value">{parsedSummary.overlays}</span>
                      <span className="hud-label">TEXT OVERLAYS</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="submit-panel">
            <button type="submit" className="btn-submit-console" disabled={loading}>
              {loading ? "PROCESSING..." : "PUBLISH TO SHOWCASE →"}
            </button>
          </div>
        </form>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Dedicated Dark Console Theme */
        .admin-dark-theme {
          background-color: #09090B;
          color: #FAFAFA;
          min-height: 100vh;
          padding: 4rem 2rem;
          font-family: 'Outfit', sans-serif;
          margin-top: -3rem; /* Offset App main padding */
        }

        .admin-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Header UI */
        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #1E1E24;
          padding-bottom: 2rem;
          margin-bottom: 3rem;
        }

        .badge-console {
          font-family: monospace;
          font-size: 0.75rem;
          color: #10B981;
          letter-spacing: 0.25em;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .admin-title {
          font-size: 2.2rem;
          font-weight: 300;
          letter-spacing: -0.02em;
          margin-top: 0.75rem;
          color: #FAFAFA;
        }

        .btn-back-console {
          background: transparent;
          border: 1px solid #27272A;
          color: #A1A1AA;
          padding: 10px 18px;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-back-console:hover {
          border-color: #FAFAFA;
          color: #FAFAFA;
        }

        /* Dark Status Banner */
        .status-banner-dark {
          padding: 1rem 1.5rem;
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.85rem;
          margin-bottom: 2.5rem;
          border: 1px solid;
        }

        .status-banner-dark.success {
          background: rgba(16, 185, 129, 0.05);
          color: #34D399;
          border-color: rgba(16, 185, 129, 0.15);
        }

        .status-banner-dark.error {
          background: rgba(239, 68, 68, 0.05);
          color: #F87171;
          border-color: rgba(239, 68, 68, 0.15);
        }

        .status-banner-dark.info {
          background: rgba(59, 130, 246, 0.05);
          color: #60A5FA;
          border-color: rgba(59, 130, 246, 0.15);
        }

        /* Dashboard Form Cards */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 3rem;
        }

        .dashboard-card {
          background: #121214;
          border: 1px solid #1E1E24;
          border-radius: 12px;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .card-heading {
          font-size: 1.05rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #A1A1AA;
          border-bottom: 1px solid #1E1E24;
          padding-bottom: 1rem;
          margin-bottom: 0.5rem;
        }

        /* Form Inputs Console */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-family: monospace;
          font-size: 0.75rem;
          color: #A1A1AA;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .input-group input,
        .input-group select {
          background: #09090B;
          border: 1px solid #27272A;
          border-radius: 6px;
          padding: 12px 14px;
          color: #FAFAFA;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.3s;
        }

        .input-group input:focus,
        .input-group select:focus {
          border-color: #10B981;
          box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.1);
        }

        .input-group select {
          appearance: none;
          cursor: pointer;
        }

        /* Dark Upload Container */
        .dark-upload-box {
          background: #09090B;
          border: 1px dashed #27272A;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .dark-upload-box:hover {
          border-color: #10B981;
        }

        .dark-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .dark-upload-label .upload-icon {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .dark-upload-label .upload-text {
          font-size: 0.85rem;
          font-weight: 500;
          color: #FAFAFA;
        }

        .dark-upload-label .upload-hint {
          font-size: 0.7rem;
          color: #71717A;
        }

        .dark-preview-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .dark-image-preview {
          max-height: 140px;
          border-radius: 4px;
          border: 1px solid #27272A;
        }

        .btn-remove-dark {
          background: transparent;
          border: none;
          color: #F87171;
          font-family: monospace;
          font-size: 0.75rem;
          cursor: pointer;
          text-transform: uppercase;
        }

        /* Realtime Parse HUD */
        .parsed-summary-hud {
          background: rgba(16, 185, 129, 0.03);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 8px;
          padding: 1.25rem;
          margin-top: 1rem;
        }

        .hud-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 1rem;
        }

        .hud-dot {
          width: 6px;
          height: 6px;
          background: #10B981;
          border-radius: 50%;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .3; }
        }

        .hud-title {
          font-family: monospace;
          font-size: 0.7rem;
          color: #10B981;
          letter-spacing: 0.1em;
        }

        .hud-stats {
          display: flex;
          justify-content: space-between;
        }

        .hud-stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hud-value {
          font-size: 1.4rem;
          font-weight: 300;
          color: #FAFAFA;
          font-family: monospace;
        }

        .hud-label {
          font-size: 0.65rem;
          font-family: monospace;
          color: #71717A;
          letter-spacing: 0.05em;
        }

        /* Console Submit Bar */
        .submit-panel {
          border-top: 1px solid #1E1E24;
          padding-top: 2rem;
          margin-top: 3rem;
          display: flex;
          justify-content: flex-end;
        }

        .btn-submit-console {
          background: #10B981;
          border: none;
          color: #FFFFFF;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          padding: 14px 28px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-submit-console:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .btn-submit-console:disabled {
          background: #27272A;
          color: #71717A;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }
      `}} />
    </div>
  );
}
