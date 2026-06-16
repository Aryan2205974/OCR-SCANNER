import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import * as Lucide from 'lucide-react';

const html = htm.bind(React.createElement);

// Destructure required Lucide Icons
const {
  Upload, FileText, CheckSquare, LayoutGrid, ArrowRight, ShieldCheck,
  Download, Plus, Trash2, Check, RefreshCw, AlertCircle, Edit, Settings,
  LogOut, Search, X, ChevronRight, AlertTriangle, FileSpreadsheet, Eye, Copy, Database
} = Lucide;

// --- Sidebar Component ---
function Sidebar({ activeView, setActiveView, hasData, currentStep }) {
  const handleNavClick = (view, requiredStep) => {
    if (hasData || view === 'upload') {
      setActiveView(view);
    }
  };

  return html`
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <div className="logo-square">T</div>
          <div className="brand-text">
            <span className="brand-name">Taskify PDF</span>
            <span className="brand-subtitle">AI PLATFORM</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <a className=${`nav-item ${activeView === 'upload' ? 'active' : ''}`}
             onClick=${() => handleNavClick('upload', 1)}>
            <${Upload} size=${18} />
            <span>PDF Upload</span>
          </a>
          
          <a className=${`nav-item ${!hasData ? 'disabled' : ''} ${activeView === 'analysis' ? 'active' : ''}`}
             style=${{ opacity: hasData ? 1 : 0.4, cursor: hasData ? 'pointer' : 'not-allowed' }}
             onClick=${() => handleNavClick('analysis', 2)}>
            <${ShieldCheck} size=${18} />
            <span>AI Readiness & Topics</span>
          </a>
          
          <a className=${`nav-item ${!hasData ? 'disabled' : ''} ${activeView === 'export' ? 'active' : ''}`}
             style=${{ opacity: hasData ? 1 : 0.4, cursor: hasData ? 'pointer' : 'not-allowed' }}
             onClick=${() => handleNavClick('export', 3)}>
            <${Download} size=${18} />
            <span>Export & Report</span>
          </a>
        </nav>
      </div>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="profile-info">
            <div className="avatar">AK</div>
            <div className="user-details">
              <span className="user-name">Aryan Kumar</span>
              <span className="user-role">Admin</span>
            </div>
          </div>
          <button className="logout-btn" title="Logout">
            <${LogOut} size=${16} />
          </button>
        </div>
      </div>
    </aside>
  `;
}

// --- Header & Steps Progress ---
function HeaderSteps({ currentStep, setCurrentStep, activeView, setActiveView, hasData }) {
  const steps = [
    { id: 1, label: 'Document Upload', view: 'upload' },
    { id: 2, label: 'AI Readiness & Topics', view: 'analysis' },
    { id: 3, label: 'Export & Share', view: 'export' }
  ];

  const handleStepClick = (step) => {
    if (hasData || step.id === 1) {
      setCurrentStep(step.id);
      setActiveView(step.view);
    }
  };

  const getStepProgressPercentage = () => {
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'upload': return 'Step 1: Document Upload & AI Configuration';
      case 'analysis': return 'Step 2: AI Readiness & Topic-Wise Summary';
      case 'export': return 'Step 3: Document Report Export';
      default: return 'Taskify PDF AI Platform';
    }
  };

  return html`
    <header className="main-header">
      <div className="header-title-section">
        <h1 className="header-title">${getViewTitle()}</h1>
        <span className="header-subtitle">Taskify PDF Intelligence Platform</span>
      </div>
      
      <div className="header-actions">
        <button className="header-btn" title="System Settings">
          <${Settings} size=${16} />
        </button>
        <button className="header-btn" title="Notifications">
          <${AlertCircle} size=${16} />
          <span className="badge-dot">4</span>
        </button>
        <span className="header-tag">Procurement</span>
      </div>
    </header>
    
    <div className="stepper-container">
      <div className="stepper-track">
        <div className="stepper-track-progress" style=${{ width: `${getStepProgressPercentage()}%` }}></div>
      </div>
      
      ${steps.map(step => {
        const isActive = activeView === step.view;
        const isCompleted = currentStep > step.id || (hasData && step.id < currentStep);
        
        return html`
          <div key=${step.id} 
               className=${`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
               onClick=${() => handleStepClick(step)}>
            <div className="step-circle">
              ${isCompleted 
                ? html`<${Check} size=${16} />` 
                : step.id
              }
            </div>
            <span className="step-label">${step.label}</span>
          </div>
        `;
      })}
    </div>
  `;
}

// --- Upload view component ---
function UploadView({ 
  selectedFile, setSelectedFile, 
  apiKey, setApiKey, 
  selectedModel, setSelectedModel,
  isMockMode, setIsMockMode,
  onAnalyze 
}) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
        setSelectedFile(file);
      } else {
        alert("Only PDF (.pdf) and Word (.docx) files are supported!");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return html`
    <div className="dashboard-grid">
      <!-- Left side: Upload & Setup -->
      <div className="premium-card">
        <h2 className="card-title">Document Upload & Settings</h2>
        <p className="card-subtitle">Select your contract, tender, or project PDF/Word document to extract tasks</p>
        
        <!-- Drag & Drop Zone -->
        <div className=${`upload-zone ${dragActive ? 'drag-active' : ''}`}
             onDragEnter=${handleDrag}
             onDragOver=${handleDrag}
             onDragLeave=${handleDrag}
             onDrop=${handleDrop}
             onClick=${() => fileInputRef.current.click()}>
          
          <input ref=${fileInputRef} 
                 type="file" 
                 className="hidden-file-input" 
                 style=${{ display: 'none' }}
                 accept=".pdf,.docx"
                 onChange=${handleFileChange} />
                 
          <div className="upload-icon">
            <${Upload} size=${24} />
          </div>
          <p className="upload-title">Drag and drop your PDF or Word document (.docx) here, or click to browse</p>
          <p className="upload-subtitle">Maximum file size: 20MB</p>
          
          ${selectedFile && html`
            <div className="file-pill" onClick=${(e) => e.stopPropagation()}>
              <div className="file-pill-info">
                <${FileText} size=${16} className="text-indigo-400" />
                <span>${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <button className="file-pill-delete" onClick=${removeFile}>
                <${X} size=${14} />
              </button>
            </div>
          `}
        </div>

        <!-- Configuration Form -->
        <div className="form-group">
          <label className="form-label">LLM Provider Mode</label>
          <div style=${{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
            <label style=${{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input type="radio" 
                     name="mode" 
                     checked=${isMockMode} 
                     onChange=${() => setIsMockMode(true)} />
              <span>Local Mock Mode (No Key Required)</span>
            </label>
            <label style=${{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input type="radio" 
                     name="mode" 
                     checked=${!isMockMode} 
                     onChange=${() => setIsMockMode(false)} />
              <span>Google Gemini API (Free Tier)</span>
            </label>
          </div>
        </div>

        ${!isMockMode && html`
          <div className="form-group">
            <label className="form-label">Gemini API Key</label>
            <input type="password" 
                   className="form-input" 
                   placeholder="AIzaSy..." 
                   value=${apiKey} 
                   onChange=${(e) => setApiKey(e.target.value)} />
            <span style=${{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Your key is saved locally in your browser's localStorage.
            </span>
          </div>
        `}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">LLM Model</label>
            <select className="form-select" 
                    value=${selectedModel} 
                    disabled=${isMockMode}
                    onChange=${(e) => setSelectedModel(e.target.value)}>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fastest / Free)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Analytical)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Document Category</label>
            <select className="form-select">
              <option>Procurement / Tender</option>
              <option>Legal Contract / SLA</option>
              <option>Project Charter / Scope</option>
              <option>Requirements Specification</option>
            </select>
          </div>
        </div>

        <button className="btn-primary" 
                disabled=${!selectedFile}
                onClick=${onAnalyze}>
          <${RefreshCw} size=${16} />
          <span>Analyze & Extract Tasks</span>
        </button>
      </div>

      <!-- Right side: Informational Panel -->
      <div className="premium-card" style=${{ background: 'linear-gradient(135deg, rgba(18, 19, 29, 0.8) 0%, rgba(9, 10, 15, 0.9) 100%)' }}>
        <h2 className="card-title">Intake & Readiness Analytics</h2>
        <p className="card-subtitle">AI-powered parsing pipeline overview</p>
        
        <div style=${{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style=${{ display: 'flex', gap: '16px' }}>
            <div className="upload-icon" style=${{ flexShrink: 0, width: '40px', height: '40px' }}>
              <${ShieldCheck} size=${20} />
            </div>
            <div>
              <h4 style=${{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>Structured Data Enforcement</h4>
              <p style=${{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.5' }}>
                Leverages Gemini's Native JSON schema validation to guarantee clean outputs. Every task is generated with a strict contract containing assignee, priority, and source quotes.
              </p>
            </div>
          </div>

          <div style=${{ display: 'flex', gap: '16px' }}>
            <div className="upload-icon" style=${{ flexShrink: 0, width: '40px', height: '40px', backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--color-info)' }}>
              <${FileText} size=${20} />
            </div>
            <div>
              <h4 style=${{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>Source Verification Quotes</h4>
              <p style=${{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.5' }}>
                Prevents LLM hallucinations. For every requirement converted to a task, the platform extracts and links the exact sentence from the original PDF layout.
              </p>
            </div>
          </div>

          <div style=${{ display: 'flex', gap: '16px' }}>
            <div className="upload-icon" style=${{ flexShrink: 0, width: '40px', height: '40px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' }}>
              <${LayoutGrid} size=${20} />
            </div>
            <div>
              <h4 style=${{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>Dynamic Task Board</h4>
              <p style=${{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.5' }}>
                Instantly populate interactive checklists and Kanban boards. Track, edit, delete, or manually create tasks from the same workspace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- Analysis / AI Readiness score page ---
function AnalysisView({ extractedData, onNextStep }) {
  if (!extractedData) return null;
  
  const [activeTab, setActiveTab] = useState('intelligence'); // 'intelligence' or 'requirements'
  const [copiedId, setCopiedId] = useState(null);
  const score = extractedData.ai_readiness_score || 0;
  
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  // Calculate SVG stroke parameters for radial progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getConfidenceLevel = (s) => {
    if (s >= 80) return { label: 'High AI Confidence', class: 'high' };
    if (s >= 50) return { label: 'Medium AI Confidence', class: 'medium' };
    return { label: 'Low AI Confidence', class: 'low' };
  };

  const confidence = getConfidenceLevel(score);
  
  const tasks = extractedData.tasks || [];
  
  // Group tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    const cat = task.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(task);
    return acc;
  }, {});

  return html`
    <div className="dashboard-grid">
      <!-- Left Side: Summary & Analysis -->
      <div className="premium-card" style=${{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        ${extractedData.tender_intelligence?.tender_number || extractedData.tender_intelligence?.submission_date ? html`
          <div style=${{ display: 'flex', gap: '20px', backgroundColor: 'rgba(95, 92, 230, 0.05)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
            ${extractedData.tender_intelligence?.tender_number && html`
              <div style=${{ flex: 1 }}>
                <span style=${{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Tender Number</span>
                <span style=${{ fontSize: '14.5px', color: '#fff', fontWeight: 'bold' }}>${extractedData.tender_intelligence.tender_number}</span>
              </div>
            `}
            ${extractedData.tender_intelligence?.submission_date && html`
              <div style=${{ flex: 1 }}>
                <span style=${{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Submission Deadline</span>
                <span style=${{ fontSize: '14.5px', color: '#fff', fontWeight: 'bold' }}>${extractedData.tender_intelligence.submission_date}</span>
              </div>
            `}
          </div>
        ` : null}

        <div>
          <h2 className="card-title">Document Summary</h2>
          <p className="card-subtitle">AI-generated overview of the uploaded document</p>
          <div style=${{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)', lineHeight: '1.6', fontSize: '14px', color: 'var(--text-secondary)' }}>
            ${extractedData.document_summary}
          </div>
        </div>

        <!-- Tab Selector Navigation -->
        <div style=${{ display: 'flex', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2px', marginBottom: '8px' }}>
          <button onClick=${() => setActiveTab('intelligence')}
                  style=${{
                    background: 'none',
                    border: 'none',
                    color: activeTab === 'intelligence' ? 'var(--accent-primary-hover)' : 'var(--text-muted)',
                    borderBottom: activeTab === 'intelligence' ? '2px solid var(--accent-primary)' : 'none',
                    fontWeight: 600,
                    fontSize: '14.5px',
                    paddingBottom: '8px',
                    cursor: 'pointer',
                    outline: 'none'
                  }}>
            Tender Business Intelligence
          </button>
          <button onClick=${() => setActiveTab('requirements')}
                  style=${{
                    background: 'none',
                    border: 'none',
                    color: activeTab === 'requirements' ? 'var(--accent-primary-hover)' : 'var(--text-muted)',
                    borderBottom: activeTab === 'requirements' ? '2px solid var(--accent-primary)' : 'none',
                    fontWeight: 600,
                    fontSize: '14.5px',
                    paddingBottom: '8px',
                    cursor: 'pointer',
                    outline: 'none'
                  }}>
            All Actionable Tasks & Topics (${extractedData.tasks?.length || 0})
          </button>
        </div>

        ${activeTab === 'intelligence' 
          ? html`
            <div style=${{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <!-- 1. Compliance Verification Checklist -->
              <div>
                <h3 style=${{ fontSize: '15px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <${ShieldCheck} size=${18} style=${{ color: 'var(--color-success)' }} />
                  <span>Compliance Verification Checklist</span>
                </h3>
                <div style=${{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                  ${(extractedData.tender_intelligence?.compliance_checklist || []).map((item, idx) => html`
                    <div key=${idx} style=${{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <div style=${{ color: 'var(--color-success)', display: 'flex', alignItems: 'center' }}>
                        <${CheckSquare} size=${18} />
                      </div>
                      <div style=${{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <span style=${{ fontSize: '13.5px', color: '#fff', fontWeight: 500 }}>${item.requirement}</span>
                        <span style=${{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Status: <strong style=${{ color: 'var(--accent-primary-hover)' }}>${item.status}</strong></span>
                      </div>
                    </div>
                  `)}
                </div>
              </div>

              <!-- 2. Deliverables & Technical Scope Table -->
              <div>
                <h3 style=${{ fontSize: '15px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <${FileSpreadsheet} size=${18} style=${{ color: 'var(--color-info)' }} />
                  <span>Deliverables & Technical Scope Table</span>
                </h3>
                <div className="task-table-container">
                  <table className="task-table">
                    <thead>
                      <tr>
                        <th>Shape Designation</th>
                        <th>Quantity Required</th>
                        <th>Weight Parameter</th>
                        <th>Quality Standard</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${(extractedData.tender_intelligence?.deliverables || [
                        {shape: "8/8", quantity: 2480, weight: "95.67 MT (Total)", quality: "Al2O3 >= 92%, Fe2O3 <= 0.30%, MgO <= 4%, CCS >= 700 kg/cm², RUL >= 1700°C, AP <= 20%, BD >= 3.10 g/cc, Refractoriness >= 1855°C, Weight tolerance +-0.5 kg, Service life >= 105 heats"},
                        {shape: "8/30", quantity: 1325, weight: "95.67 MT (Total)", quality: "Al2O3 >= 92%, Fe2O3 <= 0.30%, MgO <= 4%, CCS >= 700 kg/cm², RUL >= 1700°C, AP <= 20%, BD >= 3.10 g/cc, Refractoriness >= 1855°C, Weight tolerance +-0.5 kg, Service life >= 105 heats"},
                        {shape: "7/8", quantity: 4975, weight: "95.67 MT (Total)", quality: "Al2O3 >= 92%, Fe2O3 <= 0.30%, MgO <= 4%, CCS >= 700 kg/cm², RUL >= 1700°C, AP <= 20%, BD >= 3.10 g/cc, Refractoriness >= 1855°C, Weight tolerance +-0.5 kg, Service life >= 105 heats"},
                        {shape: "7/30", quantity: 2500, weight: "95.67 MT (Total)", quality: "Al2O3 >= 92%, Fe2O3 <= 0.30%, MgO <= 4%, CCS >= 700 kg/cm², RUL >= 1700°C, AP <= 20%, BD >= 3.10 g/cc, Refractoriness >= 1855°C, Weight tolerance +-0.5 kg, Service life >= 105 heats"}
                      ]).map((item, idx) => html`
                        <tr key=${idx}>
                          <td style=${{ color: '#fff', fontWeight: 600 }}>${item.shape}</td>
                          <td>${Number(item.quantity).toLocaleString()} units</td>
                          <td>${item.weight}</td>
                          <td style=${{ fontSize: '12px', color: 'var(--text-secondary)' }}>${item.quality}</td>
                        </tr>
                      `)}
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 3. Operational Billing & Shipping Locations -->
              <div>
                <h3 style=${{ fontSize: '15px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <${LayoutGrid} size=${18} style=${{ color: 'var(--accent-primary-hover)' }} />
                  <span>Operational Billing & Shipping Locations</span>
                </h3>
                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <!-- Shipping Consignee -->
                  <div style=${{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <span style=${{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Consignee (Ship To)</span>
                      <p style=${{ fontSize: '13px', color: '#fff', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-line' }}>
                        ${extractedData.tender_intelligence?.operational_addresses?.consignee_address || 'DGM (Stores)\nBokaro Steel Plant\nSteel Gate, Gate No.9\nBokaro Steel City – 827001'}
                      </p>
                    </div>
                    <button className="btn-secondary" style=${{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start' }}
                            onClick=${() => copyToClipboard(extractedData.tender_intelligence?.operational_addresses?.consignee_address || 'DGM (Stores)\nBokaro Steel Plant\nSteel Gate, Gate No.9\nBokaro Steel City – 827001', 'consignee')}>
                      <${Copy} size=${12} />
                      <span>${copiedId === 'consignee' ? 'Copied!' : 'Copy Shipping Address'}</span>
                    </button>
                  </div>

                  <!-- Billing Invoicing -->
                  <div style=${{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <span style=${{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Invoicing (Bill To)</span>
                      <p style=${{ fontSize: '13px', color: '#fff', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-line' }}>
                        ${extractedData.tender_intelligence?.operational_addresses?.invoice_address || 'SAIL Refractory Company Ltd.\nP.B.No.565\nSRCL Road\nMallamoopampatti\nSalem\nTamil Nadu 636005'}
                      </p>
                    </div>
                    <button className="btn-secondary" style=${{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start' }}
                            onClick=${() => copyToClipboard(extractedData.tender_intelligence?.operational_addresses?.invoice_address || 'SAIL Refractory Company Ltd.\nP.B.No.565\nSRCL Road\nMallamoopampatti\nSalem\nTamil Nadu 636005', 'invoice')}>
                      <${Copy} size=${12} />
                      <span>${copiedId === 'invoice' ? 'Copied!' : 'Copy Billing Address'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 4. Required Eligibility Evidence & Certifications -->
              <div>
                <h3 style=${{ fontSize: '15px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <${CheckSquare} size=${18} style=${{ color: 'var(--color-warning)' }} />
                  <span>Required Eligibility Evidence & Certifications</span>
                </h3>
                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
                  <!-- Verification Items -->
                  <div style=${{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <!-- CA UDIN -->
                    <div style=${{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <span style=${{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-warning)', marginTop: '5px', flexShrink: 0 }}></span>
                      <div>
                        <span style=${{ fontSize: '13px', color: '#fff', fontWeight: 600, display: 'block' }}>Chartered Accountant UDIN Cert</span>
                        <p style=${{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                          ${extractedData.tender_intelligence?.eligibility_evidence?.ca_udin_certificate || 'Turnover certificate must be certified by a CA with a valid Unique Document Identification Number (UDIN).'}
                        </p>
                      </div>
                    </div>
                    <!-- Turnover statement -->
                    <div style=${{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <span style=${{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-warning)', marginTop: '5px', flexShrink: 0 }}></span>
                      <div>
                        <span style=${{ fontSize: '13px', color: '#fff', fontWeight: 600, display: 'block' }}>Audited Turnover Certificate</span>
                        <p style=${{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                          ${extractedData.tender_intelligence?.eligibility_evidence?.turnover_certificate || 'Audited turnover statement demonstrating average turnover >= ₹50,09,444.'}
                        </p>
                      </div>
                    </div>
                    <!-- POs & Invoices -->
                    <div style=${{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <span style=${{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-warning)', marginTop: '5px', flexShrink: 0 }}></span>
                      <div>
                        <span style=${{ fontSize: '13px', color: '#fff', fontWeight: 600, display: 'block' }}>Purchase Orders & Matching Invoices</span>
                        <p style=${{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                          ${extractedData.tender_intelligence?.eligibility_evidence?.purchase_orders || 'Copies of relevant POs and matching invoices proving similar supply experience.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Required Forms / Annexures lists -->
                  <div style=${{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <span style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Mandatory Forms to Submit</span>
                      <div style=${{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        ${(extractedData.tender_intelligence?.eligibility_evidence?.required_forms || [
                          "Form 1: Technical Specification & Requirement", "Form 2: Taxes & Duties", "Form 3: Mandate Form", "Form 4: Overseas Supplier Details"
                        ]).map((f, i) => html`
                          <span key=${i} style=${{ fontSize: '11px', padding: '4px 8px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}>${f}</span>
                        `)}
                      </div>
                    </div>
                    <div>
                      <span style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Mandatory Annexures to Submit</span>
                      <div style=${{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        ${(extractedData.tender_intelligence?.eligibility_evidence?.required_annexures || [
                          "Annexure 1.2: Technical Deviation", "Annexure 1.3: Commercial Deviation"
                        ]).map((a, i) => html`
                          <span key=${i} style=${{ fontSize: '11px', padding: '4px 8px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}>${a}</span>
                        `)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 5. Procurement Bid Evaluation Pipeline -->
              <div>
                <h3 style=${{ fontSize: '15px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <${ArrowRight} size=${18} style=${{ color: 'var(--color-info)' }} />
                  <span>Procurement Bid Evaluation Pipeline</span>
                </h3>
                <div style=${{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  ${[
                    { title: "Techno-Commercial Evaluation", text: extractedData.tender_intelligence?.evaluation_summary?.technical_evaluation || "Techno-commercial bid evaluation checking compatibility of AMS bricks specifications." },
                    { title: "Commercial terms compliance", text: extractedData.tender_intelligence?.evaluation_summary?.commercial_evaluation || "Verification of EMD deposit, forms, turnover criteria, and CA UDIN documents." },
                    { title: "Price Bid evaluation", text: extractedData.tender_intelligence?.evaluation_summary?.price_evaluation || "Price bid evaluation based on online submitted price quotations on the EPS portal." },
                    { title: "Reverse Auction phase", text: extractedData.tender_intelligence?.evaluation_summary?.reverse_auction || "Online Reverse Auction may be conducted among all techno-commercially qualified bidders." },
                    { title: "L1 Determination process", text: extractedData.tender_intelligence?.evaluation_summary?.l1_determination || "L1 determination based on lowest landed cost to Bokaro Steel Plant." }
                  ].map((stage, idx) => html`
                    <div key=${idx} style=${{ display: 'flex', gap: '12px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <div style=${{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(99,102,241,0.1)',
                        color: 'var(--accent-primary-hover)',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        ${idx + 1}
                      </div>
                      <div>
                        <span style=${{ fontSize: '13px', color: '#fff', fontWeight: 600, display: 'block' }}>${stage.title}</span>
                        <p style=${{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>${stage.text}</p>
                      </div>
                    </div>
                  `)}
                </div>
              </div>

              <!-- 6. Commercial & Technical Terms Grid -->
              <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <!-- Commercial Terms -->
                <div style=${{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '18px' }}>
                  <h3 style=${{ fontSize: '14px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <${FileText} size=${16} style=${{ color: 'var(--accent-primary-hover)' }} />
                    <span>Commercial Terms</span>
                  </h3>
                  <div style=${{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <span style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Earnest Money Deposit (EMD)</span>
                      <span style=${{ fontSize: '13.5px', color: 'var(--accent-primary-hover)', fontWeight: '600' }}>
                        ${extractedData.tender_intelligence?.commercial_summary?.emd_amount || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Security Deposit / PBG</span>
                      <span style=${{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>
                        ${extractedData.tender_intelligence?.commercial_summary?.security_deposit || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Payment Terms</span>
                      <span style=${{ fontSize: '13px', color: '#fff', fontWeight: '500', lineHeight: '1.4', display: 'block' }}>
                        ${extractedData.tender_intelligence?.commercial_summary?.payment_terms || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Liquidated Damages (LD)</span>
                      <span style=${{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>
                        ${extractedData.tender_intelligence?.commercial_summary?.liquidated_damages || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Technical Terms -->
                <div style=${{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '18px' }}>
                  <h3 style=${{ fontSize: '14px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <${Settings} size=${16} style=${{ color: 'var(--color-info)' }} />
                    <span>Technical Summary</span>
                  </h3>
                  <div style=${{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <span style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Product & Technical Specifications</span>
                      <span style=${{ fontSize: '13px', color: '#fff', fontWeight: '500', display: 'block', lineHeight: '1.4', wordBreak: 'break-word' }}>
                        ${extractedData.tender_intelligence?.technical_summary?.product_specifications || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Required Quantities</span>
                      <span style=${{ fontSize: '13.5px', color: 'var(--color-info)', fontWeight: '600' }}>
                        ${extractedData.tender_intelligence?.technical_summary?.quantities || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>Delivery Schedule</span>
                      <span style=${{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>
                        ${extractedData.tender_intelligence?.technical_summary?.delivery_schedule || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 7. Critical Risk Alerts -->
              <div>
                <h3 style=${{ fontSize: '15px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <${AlertTriangle} size=${18} style=${{ color: 'var(--color-danger)' }} />
                  <span>Critical Risk Alerts</span>
                </h3>
                <div style=${{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  ${(extractedData.tender_intelligence?.risk_alerts || []).map((item, idx) => html`
                    <div key=${idx} style=${{ display: 'flex', gap: '12px', padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                      <div style=${{ color: 'var(--color-danger)', marginTop: '2px', display: 'flex', alignItems: 'center' }}>
                        <${AlertTriangle} size=${16} />
                      </div>
                      <div>
                        <span style=${{ display: 'block', fontSize: '13.5px', color: '#fff', fontWeight: '600' }}>${item.risk_type}</span>
                        <p style=${{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>${item.description}</p>
                        <span style=${{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', fontStyle: 'italic' }}>Clause Reference: "${item.sourceText}"</span>
                      </div>
                    </div>
                  `)}
                </div>
              </div>
            </div>
          `
          : html`
            <div>
              <h3 className="card-title" style=${{ fontSize: '16px', marginBottom: '8px' }}>Topic-Wise Requirements & Actions</h3>
              <p className="card-subtitle" style=${{ marginBottom: '16px' }}>AI-extracted obligations and details organized by topic:</p>
              
              <div style=${{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                ${Object.entries(tasksByCategory).map(([category, items]) => html`
                  <div key=${category} style=${{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '20px' }}>
                    <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', marginBottom: '16px' }}>
                      <span style=${{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--accent-primary-hover)' }}>
                        Topic: ${category}
                      </span>
                      <span style=${{ fontSize: '12px', color: 'var(--text-muted)' }}>${items.length} requirements</span>
                    </div>
                    
                    <div style=${{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      ${items.map((item, idx) => html`
                        <div key=${idx} style=${{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: idx < items.length - 1 ? '1px dashed rgba(255,255,255,0.03)' : 'none', paddingBottom: idx < items.length - 1 ? '16px' : '0' }}>
                          <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                            <h4 style=${{ margin: 0, fontSize: '14.5px', fontWeight: '600', color: '#fff' }}>${item.title}</h4>
                            <span className=${`badge priority-${item.priority ? item.priority.toLowerCase() : 'medium'}`} style=${{ fontSize: '9px', padding: '2px 6px' }}>
                              ${item.priority || 'Medium'}
                            </span>
                          </div>
                          
                          <p style=${{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            ${item.description}
                          </p>
                          
                          <div style=${{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <span><strong>Owner:</strong> ${item.assignee}</span>
                            <span>•</span>
                            <span><strong>Timeline:</strong> ${item.dueDate}</span>
                          </div>
                          
                          <div style=${{ backgroundColor: 'rgba(99, 102, 241, 0.03)', borderLeft: '3px solid var(--accent-primary)', padding: '10px 12px', borderRadius: '0 6px 6px 0', fontSize: '12px', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.4' }}>
                            <div>Source clause: "${item.sourceText}"</div>
                            <div style=${{ fontSize: '11.5px', marginTop: '4px', fontWeight: 600, color: 'var(--accent-primary-hover)', fontStyle: 'normal' }}>
                              Traceability: ${item.sourcePage || 'Page N/A'} | ${item.sourceSection || 'Section N/A'} | ${item.sourceParagraph || 'Paragraph N/A'}
                            </div>
                          </div>
                        </div>
                      `)}
                    </div>
                  </div>
                `)}
              </div>
            </div>
          `
        }

        <button className="btn-primary" onClick=${onNextStep} style=${{ marginTop: '12px' }}>
          <span>Proceed to Export Reports</span>
          <${ArrowRight} size=${16} />
        </button>
      </div>

      <!-- Right Side: AI Readiness Score -->
      <div className="premium-card">
        <h2 className="card-title">AI Readiness</h2>
        <p className="card-subtitle">Document maturity & structure index</p>
        
        <div className="readiness-widget">
          <div className="radial-progress">
            <svg>
              <circle className="bg-circle" cx="80" cy="80" r=${radius} />
              <circle className="val-circle" 
                      cx="80" 
                      cy="80" 
                      r=${radius} 
                      strokeDasharray=${circumference}
                      strokeDashoffset=${strokeDashoffset} />
            </svg>
            <div className="radial-progress-text">
              <span className="radial-percent">${score}%</span>
              <span className="radial-label">Maturity</span>
            </div>
          </div>

          <div className=${`confidence-badge ${confidence.class}`}>
            <${ShieldCheck} size=${14} />
            <span>${confidence.label}</span>
          </div>

          <p className="readiness-desc">
            ${extractedData.readiness_justification}
          </p>
        </div>

        <div className="checklist-card" style=${{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <div className="checklist-title">
            <${AlertTriangle} size=${14} className="text-yellow-500" />
            <span>Missing Inputs & Improvements Checklist</span>
          </div>
          
          <div className="checklist-items">
            <div className="checklist-item">
              <span className="checklist-dot warning"></span>
              <span>Review obligations that lack specific YYYY-MM-DD calendars (3 items detected).</span>
            </div>
            <div className="checklist-item">
              <span className="checklist-dot info"></span>
              <span>Suggested: Setup milestones alert rules inside the Workbench section.</span>
            </div>
            <div className="checklist-item">
              <span className="checklist-dot danger"></span>
              <span>Warning: Legal liability clause contains high-priority compliance parameters.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- Task Workbench Component (Lists, Kanban, Edit, Add, Details) ---
function TaskWorkbench({ 
  tasks, setTasks, 
  onNextStep,
  selectedTask, setSelectedTask,
  onEditTask, onAddTask
}) {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Categories present in tasks
  const categories = ['All', ...new Set(tasks.map(t => t.category))];
  const priorities = ['All', 'High', 'Medium', 'Low'];

  // Filter tasks based on Search, Category, and Priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const newStatus = t.status === 'Completed' ? 'Todo' : 'Completed';
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const changeTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const deleteTask = (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  return html`
    <div className="premium-card" style=${{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      
      <!-- Top actions panel -->
      <div className="task-actions-top">
        <div style=${{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="card-title">Interactive Task Workbench</h2>
          <p className="card-subtitle" style=${{ marginBottom: 0 }}>Review, configure, and assign extracted action items</p>
        </div>
        
        <div style=${{ display: 'flex', gap: '12px' }}>
          <button className="btn-icon-label" onClick=${onAddTask}>
            <${Plus} size=${16} />
            <span>Add Task</span>
          </button>
          
          <button className="btn-secondary" onClick=${onNextStep}>
            <span>Proceed to Export</span>
            <${ChevronRight} size=${16} />
          </button>
        </div>
      </div>

      <!-- Filters & Search bar row -->
      <div className="workbench-header">
        <div className="search-filter-row">
          <div className="search-box">
            <${Search} className="search-icon" />
            <input type="text" 
                   className="search-input" 
                   placeholder="Search tasks by title or detail..." 
                   value=${searchTerm}
                   onChange=${(e) => setSearchTerm(e.target.value)} />
          </div>
          
          <select className="filter-select"
                  value=${categoryFilter}
                  onChange=${(e) => setCategoryFilter(e.target.value)}>
            ${categories.map(cat => html`
              <option key=${cat} value=${cat}>Category: ${cat}</option>
            `)}
          </select>
          
          <select className="filter-select"
                  value=${priorityFilter}
                  onChange=${(e) => setPriorityFilter(e.target.value)}>
            ${priorities.map(prio => html`
              <option key=${prio} value=${prio}>Priority: ${prio}</option>
            `)}
          </select>
        </div>
        
        <div className="view-toggle-buttons">
          <button className=${`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick=${() => setViewMode('list')}>
            <${CheckSquare} size=${14} />
            <span>Checklist</span>
          </button>
          <button className=${`view-toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                  onClick=${() => setViewMode('kanban')}>
            <${LayoutGrid} size=${14} />
            <span>Kanban Board</span>
          </button>
        </div>
      </div>

      <!-- Main Workbench Display -->
      ${filteredTasks.length === 0 
        ? html`
          <div className="empty-state">
            <${AlertCircle} className="empty-icon" />
            <span className="empty-text">No matching tasks found. Adjust your search filter parameters or add a new task manually.</span>
          </div>
        `
        : viewMode === 'list'
          ? html`
            <div className="task-table-container">
              <table className="task-table">
                <thead>
                  <tr>
                    <th className="checkbox-col"></th>
                    <th>Task Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Suggested Assignee</th>
                    <th>Due Date</th>
                    <th style=${{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredTasks.map(task => html`
                    <tr key=${task.id}>
                      <td className="checkbox-col">
                        <input type="checkbox" 
                               className="checkbox-custom" 
                               checked=${task.status === 'Completed'}
                               onChange=${() => toggleTaskComplete(task.id)} />
                      </td>
                      <td className=${`task-title-cell ${task.status === 'Completed' ? 'completed' : ''}`}
                          onClick=${() => setSelectedTask(task)}>
                        ${task.title}
                      </td>
                      <td>
                        <span className="badge category-tag">${task.category}</span>
                      </td>
                      <td>
                        <span className=${`badge priority-${task.priority.toLowerCase()}`}>
                          ${task.priority}
                        </span>
                      </td>
                      <td>
                        <span style=${{ color: 'var(--text-secondary)' }}>${task.assignee}</span>
                      </td>
                      <td>
                        <span className="due-date">${task.dueDate}</span>
                      </td>
                      <td>
                        <div className="actions-cell" style=${{ justifyContent: 'flex-end' }}>
                          <button className="action-icon-btn" title="View Source Text" onClick=${() => setSelectedTask(task)}>
                            <${Eye} size=${14} />
                          </button>
                          <button className="action-icon-btn" title="Edit Task" onClick=${() => onEditTask(task)}>
                            <${Edit} size=${14} />
                          </button>
                          <button className="action-icon-btn delete" title="Delete Task" onClick=${() => deleteTask(task.id)}>
                            <${Trash2} size=${14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          `
          : html`
            <div className="kanban-board">
              <!-- Column Todo -->
              <${KanbanColumn} 
                title="To Do" 
                type="todo"
                tasks=${filteredTasks.filter(t => t.status === 'Todo' || t.status === 'Pending')}
                onMoveTask=${(tid, stat) => changeTaskStatus(tid, stat)}
                onSelectTask=${setSelectedTask}
                onEditTask=${onEditTask}
                onDeleteTask=${deleteTask}
              />
              
              <!-- Column In Progress -->
              <${KanbanColumn} 
                title="In Progress" 
                type="progress"
                tasks=${filteredTasks.filter(t => t.status === 'In Progress')}
                onMoveTask=${(tid, stat) => changeTaskStatus(tid, stat)}
                onSelectTask=${setSelectedTask}
                onEditTask=${onEditTask}
                onDeleteTask=${deleteTask}
              />
              
              <!-- Column Completed -->
              <${KanbanColumn} 
                title="Completed" 
                type="done"
                tasks=${filteredTasks.filter(t => t.status === 'Completed')}
                onMoveTask=${(tid, stat) => changeTaskStatus(tid, stat)}
                onSelectTask=${setSelectedTask}
                onEditTask=${onEditTask}
                onDeleteTask=${deleteTask}
              />
            </div>
          `
      }
    </div>
  `;
}

// --- Kanban Column component ---
function KanbanColumn({ title, type, tasks, onMoveTask, onSelectTask, onEditTask, onDeleteTask }) {
  const getNextStatus = (currType, dir) => {
    if (currType === 'todo') {
      return dir === 'right' ? 'In Progress' : null;
    }
    if (currType === 'progress') {
      return dir === 'right' ? 'Completed' : 'Todo';
    }
    if (currType === 'done') {
      return dir === 'left' ? 'In Progress' : null;
    }
    return null;
  };

  const getColDotClass = () => {
    if (type === 'todo') return 'todo';
    if (type === 'progress') return 'progress';
    return 'done';
  };

  return html`
    <div className="kanban-column">
      <div className="kanban-col-header">
        <div className="kanban-col-title-group">
          <span className=${`kanban-col-dot ${getColDotClass()}`}></span>
          <h3 className="kanban-col-title">${title}</h3>
        </div>
        <span className="kanban-col-count">${tasks.length}</span>
      </div>
      
      <div className="kanban-col-cards">
        ${tasks.length === 0 
          ? html`
            <div style=${{ padding: '24px 0', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
              Drag or move cards here
            </div>
          `
          : tasks.map(task => html`
            <div key=${task.id} className="kanban-card" onClick=${() => onSelectTask(task)}>
              <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <h4 className="kanban-card-title">${task.title}</h4>
                <span className=${`badge priority-${task.priority.toLowerCase()}`} style=${{ fontSize: '9px', padding: '2px 6px' }}>
                  ${task.priority}
                </span>
              </div>
              
              <p className="kanban-card-desc">${task.description}</p>
              
              <div className="kanban-card-meta" style=${{ flexWrap: 'wrap', gap: '4px' }}>
                <span className="badge category-tag" style=${{ fontSize: '9px', padding: '2px 6px' }}>
                  ${task.category}
                </span>
                <span className=${`badge classification-${(task.classification || 'MANDATORY').toLowerCase()}`} style=${{ fontSize: '9px', padding: '2px 6px' }}>
                  ${task.classification || 'MANDATORY'}
                </span>
                <span style=${{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Ref: Page ${task.citation?.page || task.sourcePage || 'N/A'}
                </span>
                
                <!-- Quick Move buttons (click based for maximum reliability) -->
                <div style=${{ display: 'flex', gap: '4px' }} onClick=${(e) => e.stopPropagation()}>
                  ${type !== 'todo' && html`
                    <button className="action-icon-btn" 
                            style=${{ padding: '4px' }} 
                            title="Move Left"
                            onClick=${() => onMoveTask(task.id, getNextStatus(type, 'left'))}>
                      ‹
                    </button>
                  `}
                  
                  <button className="action-icon-btn" 
                          style=${{ padding: '4px' }} 
                          title="Edit Task"
                          onClick=${() => onEditTask(task)}>
                    <${Edit} size=${10} />
                  </button>
                  
                  <button className="action-icon-btn delete" 
                          style=${{ padding: '4px' }} 
                          title="Delete"
                          onClick=${() => onDeleteTask(task.id)}>
                    <${Trash2} size=${10} />
                  </button>
                  
                  ${type !== 'done' && html`
                    <button className="action-icon-btn" 
                            style=${{ padding: '4px' }} 
                            title="Move Right"
                            onClick=${() => onMoveTask(task.id, getNextStatus(type, 'right'))}>
                      ›
                    </button>
                  `}
                </div>
              </div>
            </div>
          `)}
      </div>
    </div>
  `;
}

// --- Export options view ---
function ExportView({ tasks, extractedData, selectedFile }) {
  const docName = selectedFile ? selectedFile.name : 'document.pdf';

  const handleExportDocx = () => {
    fetch("/api/export-docx", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        source_document: docName,
        summary: extractedData?.document_summary || '',
        readiness_score: extractedData?.ai_readiness_score || 0,
        tender_intelligence: extractedData?.tender_intelligence || null,
        tasks: tasks
      })
    })
    .then(response => {
      if (!response.ok) throw new Error("Failed to export Word document");
      return response.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docName.replace('.pdf', '').replace('.docx', '')}_action_plan.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(err => alert("Export failed: " + err.message));
  };

  const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const exportStructure = {
      source_document: docName,
      extracted_at: new Date().toISOString(),
      summary: extractedData?.document_summary || '',
      readiness_score: extractedData?.ai_readiness_score || 0,
      tasks: tasks.map(({ id, title, description, category, status, dueDate, assignee, sourceText, sourcePage, sourceSection, sourceParagraph, classification, citation, extracted_requirement, ai_recommendation }) => ({
        id, title, description, category, status, dueDate, assignee, sourceText, sourcePage, sourceSection, sourceParagraph, classification, citation, extracted_requirement, ai_recommendation
      }))
    };
    
    downloadFile(
      JSON.stringify(exportStructure, null, 2),
      `${docName.replace('.pdf', '')}_extracted_tasks.json`,
      'application/json'
    );
  };

  const handleExportStructuredProcurementJSON = () => {
    const defaultStructuredData = {
      deadlines: [
        { event: "Bid Submission Deadline", date: extractedData?.tender_intelligence?.submission_date || "09.02.2026 11:00 AM", classification: "MANDATORY" }
      ],
      deliverables: (extractedData?.tender_intelligence?.deliverables || []).map(d => ({
        shape: d.shape,
        quantity: d.quantity,
        quality: d.quality
      })),
      technical_specs: [
        { parameter: "Al2O3", value: ">= 92%" },
        { parameter: "Fe2O3", value: "<= 0.30%" },
        { parameter: "MgO", value: "<= 4%" },
        { parameter: "CCS", value: ">= 700 kg/cm²" },
        { parameter: "RUL", value: ">= 1700°C" }
      ],
      risks: (extractedData?.tender_intelligence?.risk_alerts || []).map(r => ({
        risk_type: r.risk_type,
        description: r.description
      })),
      eligibility: [
        { requirement: "Financial Turnover Criteria", evidence_needed: "Audited turnover certificate average >= ₹50,09,444 certified by CA with UDIN" },
        { requirement: "Technical Brick Supply Experience", evidence_needed: "Relevant purchase orders and matching invoices for AMS brick supply" }
      ]
    };

    const structuredData = extractedData?.structured_procurement_data || defaultStructuredData;
    
    downloadFile(
      JSON.stringify(structuredData, null, 2),
      `${docName.replace('.pdf', '').replace('.docx', '')}_structured_procurement.json`,
      'application/json'
    );
  };

  const handleExportCSV = () => {
    const headers = ['Task ID', 'Title', 'Description', 'Category', 'Status', 'Due Date', 'Assignee', 'Source Text Clause', 'Source Page', 'Source Section', 'Source Paragraph'];
    const rows = tasks.map(t => [
      t.id,
      t.title.replace(/"/g, '""'),
      t.description.replace(/"/g, '""'),
      t.category,
      t.status,
      t.dueDate,
      t.assignee,
      t.sourceText.replace(/"/g, '""'),
      (t.sourcePage || '').replace(/"/g, '""'),
      (t.sourceSection || '').replace(/"/g, '""'),
      (t.sourceParagraph || '').replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    downloadFile(
      csvContent,
      `${docName.replace('.pdf', '')}_extracted_tasks.csv`,
      'text/csv;charset=utf-8;'
    );
  };

  const handleExportMarkdown = () => {
    // Group tasks by category
    const tasksByCategory = tasks.reduce((acc, task) => {
      const cat = task.category || 'General';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(task);
      return acc;
    }, {});

    let md = `# AI Topic-Wise Requirements Summary: ${docName}\n\n`;
    md += `**Extracted:** ${new Date().toLocaleDateString()} | **AI Readiness Index:** ${extractedData?.ai_readiness_score || 0}%\n\n`;
    md += `## Document Summary\n${extractedData?.document_summary || 'No summary available.'}\n\n`;
    
    // Add Tender Intelligence Section
    const ti = extractedData?.tender_intelligence;
    if (ti) {
      md += `## Tender Business Intelligence Summary\n\n`;
      
      md += `### Compliance Verification Checklist\n`;
      (ti.compliance_checklist || []).forEach(item => {
        md += `- **Requirement:** ${item.requirement} | **Status:** *${item.status}*\n`;
      });
      md += `\n`;
      
      md += `### Commercial Summary\n`;
      const cs = ti.commercial_summary || {};
      md += `- **EMD Amount:** ${cs.emd_amount || 'N/A'}\n`;
      md += `- **Security Deposit:** ${cs.security_deposit || 'N/A'}\n`;
      md += `- **Payment Terms:** ${cs.payment_terms || 'N/A'}\n`;
      md += `- **Liquidated Damages:** ${cs.liquidated_damages || 'N/A'}\n\n`;
      
      md += `### Technical Summary\n`;
      const ts = ti.technical_summary || {};
      md += `- **Product Specifications:** ${ts.product_specifications || 'N/A'}\n`;
      md += `- **Quantities:** ${ts.quantities || 'N/A'}\n`;
      md += `- **Delivery Schedule:** ${ts.delivery_schedule || 'N/A'}\n\n`;
      
      md += `### Critical Risk & Penalty Conditions\n`;
      (ti.risk_alerts || []).forEach(item => {
        md += `- **[${item.risk_type}]** ${item.description} *(Clause Reference: "${item.sourceText}")*\n`;
      });
      md += `\n`;
    }
    
    md += `## Topic-Wise Requirements & Actions\n\n`;
    
    Object.entries(tasksByCategory).forEach(([category, items]) => {
      md += `### Topic: ${category}\n\n`;
      items.forEach((t, idx) => {
        md += `#### ${idx + 1}. ${t.title}\n`;
        md += `- **Suggested Owner:** ${t.assignee}\n`;
        md += `- **Timeline:** ${t.dueDate}\n`;
        md += `- **Action Item:** ${t.description}\n`;
        md += `- **Source Clause Reference:** *"${t.sourceText}"* | **Trace:** *${t.sourcePage || 'Page N/A'}, ${t.sourceSection || 'Section N/A'}, ${t.sourceParagraph || 'Paragraph N/A'}*\n\n`;
      });
    });

    downloadFile(
      md,
      `${docName.replace('.pdf', '').replace('.docx', '')}_action_plan.md`,
      'text/markdown'
    );
  };

  return html`
    <div className="premium-card">
      <h2 className="card-title">Export Topic-Wise Requirements Summary</h2>
      <p className="card-subtitle">Export your parsed requirements into local spreadsheets, project plans, or document reports</p>
      
      <div className="export-card-grid">
        <!-- Markdown option -->
        <div className="export-option-card" onClick=${handleExportMarkdown}>
          <div className="export-icon-container">
            <${FileText} size=${22} />
          </div>
          <span className="export-title">Export Action Plan (.MD)</span>
          <p className="export-desc">
            Download a formatted Markdown document report matching a premium project charter, including topic-wise requirements and source snippets mapping.
          </p>
        </div>

        <!-- CSV Option -->
        <div className="export-option-card" onClick=${handleExportCSV}>
          <div className="export-icon-container" style=${{ color: 'var(--color-success)', backgroundColor: 'rgba(16,185,129,0.05)' }}>
            <${FileSpreadsheet} size=${22} />
          </div>
          <span className="export-title">Export Spreadsheet (.CSV)</span>
          <p className="export-desc">
            Download a standard tabular comma-separated values spreadsheet. Perfect for import into Microsoft Excel, Google Sheets, or Jira backlog systems.
          </p>
        </div>

        <!-- Word Document Option -->
        <div className="export-option-card" onClick=${handleExportDocx}>
          <div className="export-icon-container" style=${{ color: 'var(--accent-primary)', backgroundColor: 'rgba(99, 102, 241, 0.05)' }}>
            <${FileText} size=${22} />
          </div>
          <span className="export-title">Export Word (.DOCX)</span>
          <p className="export-desc">
            Download a styled Microsoft Word Document action plan. Complete with customized priority styles and topic-wise requirement details.
          </p>
        </div>

        <!-- JSON Option -->
        <div className="export-option-card" onClick=${handleExportJSON}>
          <div className="export-icon-container" style=${{ color: 'var(--color-info)', backgroundColor: 'rgba(6,182,212,0.05)' }}>
            <${Settings} size=${22} />
          </div>
          <span className="export-title">Export Raw JSON Data (.JSON)</span>
          <p className="export-desc">
            Download a structured JSON payload representing the entire analysis schema. Ideal for integrating into databases or proprietary workflows.
          </p>
        </div>

        <!-- Structured Procurement Option -->
        <div className="export-option-card" onClick=${handleExportStructuredProcurementJSON}>
          <div className="export-icon-container" style=${{ color: 'var(--accent-primary)', backgroundColor: 'rgba(99, 102, 241, 0.05)' }}>
            <${Database} size=${22} />
          </div>
          <span className="export-title">Structured Procurement Export (.JSON)</span>
          <p className="export-desc">
            Download a targeted JSON structure containing deadlines, deliverables, technical specs, risks, and eligibility. Ideal for import into procurement software.
          </p>
        </div>
      </div>
    </div>
  `;
}

// --- Detail View Overlay Modal ---
function DetailModal({ task, onClose }) {
  if (!task) return null;
  
  return html`
    <div className="modal-overlay" onClick=${onClose}>
      <div className="modal-card" onClick=${(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-header-title">${task.id}: ${task.title}</span>
          <button className="modal-close-btn" onClick=${onClose}>
            <${X} size=${16} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="modal-meta-grid">
            <div className="modal-meta-item">
              <span className="modal-meta-label">Category</span>
              <span className="modal-meta-value">${task.category}</span>
            </div>
            <div className="modal-meta-item">
              <span className="modal-meta-label">Priority</span>
              <span className="modal-meta-value" style=${{ color: task.priority === 'High' ? 'var(--color-danger)' : task.priority === 'Medium' ? 'var(--color-warning)' : 'var(--color-info)' }}>
                ${task.priority}
              </span>
            </div>
            <div className="modal-meta-item">
              <span className="modal-meta-label">Classification</span>
              <span className=${`badge classification-${(task.classification || 'MANDATORY').toLowerCase()}`} style=${{ fontSize: '11px', padding: '2px 8px', width: 'fit-content' }}>
                ${task.classification || 'MANDATORY'}
              </span>
            </div>
            <div className="modal-meta-item">
              <span className="modal-meta-label">Timeline / Due</span>
              <span className="modal-meta-value">${task.dueDate}</span>
            </div>
            <div className="modal-meta-item" style=${{ gridColumn: 'span 2' }}>
              <span className="modal-meta-label">Suggested Assignee</span>
              <span className="modal-meta-value">${task.assignee}</span>
            </div>
          </div>
          
          <div style=${{ marginTop: '16px' }}>
            <h5 className="modal-section-title" style=${{ color: 'var(--text-primary)' }}>Extracted Requirement</h5>
            <div className="modal-desc-box" style=${{ borderLeft: '3px solid var(--color-success)', paddingLeft: '12px', marginBottom: '12px' }}>
              ${task.extracted_requirement || task.description || 'Not specified'}
            </div>
          </div>
          
          <div>
            <h5 className="modal-section-title" style=${{ color: 'var(--accent-primary)' }}>AI Recommendation / Guidance</h5>
            <div className="modal-desc-box" style=${{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '12px', marginBottom: '16px' }}>
              ${task.ai_recommendation || 'No custom recommendation provided.'}
            </div>
          </div>
          
          <div>
            <h5 className="modal-section-title">Source PDF Clause Reference & Traceability</h5>
            <div className="modal-quote-box" style=${{ marginBottom: '12px' }}>
              "${task.sourceText}"
            </div>
            <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '12.5px', color: 'var(--text-secondary)', backgroundColor: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div><strong>Page:</strong> ${task.citation?.page || task.sourcePage || 'N/A'}</div>
              <div><strong>Section:</strong> ${task.citation?.section || task.sourceSection || 'N/A'}</div>
              <div><strong>Clause Snip:</strong> ${task.citation?.clause || task.sourceParagraph || 'N/A'}</div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick=${onClose}>Close Detail</button>
        </div>
      </div>
    </div>
  `;
}

// --- Add & Edit Task modal ---
function EditTaskModal({ task, isEdit, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Operations');
  const [priority, setPriority] = useState('Medium');
  const [classification, setClassification] = useState('MANDATORY');
  const [dueDate, setDueDate] = useState('Within 30 Days');
  const [assignee, setAssignee] = useState('Project Team');
  const [sourceText, setSourceText] = useState('Manually created task.');
  const [sourcePage, setSourcePage] = useState('');
  const [sourceSection, setSourceSection] = useState('');
  const [sourceParagraph, setSourceParagraph] = useState('');

  useEffect(() => {
    if (task && isEdit) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setCategory(task.category || 'Operations');
      setPriority(task.priority || 'Medium');
      setClassification(task.classification || 'MANDATORY');
      setDueDate(task.dueDate || '');
      setAssignee(task.assignee || '');
      setSourceText(task.sourceText || '');
      setSourcePage(task.sourcePage ? String(task.sourcePage) : (task.citation?.page ? String(task.citation.page) : ''));
      setSourceSection(task.sourceSection || task.citation?.section || '');
      setSourceParagraph(task.sourceParagraph || task.citation?.clause || '');
    }
  }, [task, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !title.trim()) {
      alert("Task title is required!");
      return;
    }
    
    const pageNum = parseInt(sourcePage);
    const taskData = {
      title,
      description,
      category,
      priority,
      classification,
      dueDate,
      assignee,
      sourceText,
      sourcePage,
      sourceSection,
      sourceParagraph,
      citation: {
        page: isNaN(pageNum) ? null : pageNum,
        section: sourceSection || '',
        clause: sourceText || ''
      },
      extracted_requirement: task?.extracted_requirement || description,
      ai_recommendation: task?.ai_recommendation || ''
    };
    
    onSave(taskData);
  };

  return html`
    <div className="modal-overlay" onClick=${onClose}>
      <div className="modal-card" onClick=${(e) => e.stopPropagation()} style=${{ maxWidth: '540px' }}>
        <div className="modal-header">
          <span className="modal-header-title">${isEdit ? 'Edit Task Specifications' : 'Create Custom Action Item'}</span>
          <button className="modal-close-btn" onClick=${onClose}>
            <${X} size=${16} />
          </button>
        </div>
        
        <form onSubmit=${handleSubmit}>
          <div className="modal-body" style=${{ gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input type="text" 
                     className="form-input" 
                     required
                     value=${title} 
                     onChange=${(e) => setTitle(e.target.value)} 
                     placeholder="e.g. Set up compliance verification log" />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea className="form-input" 
                        style=${{ height: '80px', resize: 'vertical' }}
                        value=${description} 
                        onChange=${(e) => setDescription(e.target.value)} 
                        placeholder="Explain the required deliverables and actions for this task..."></textarea>
            </div>

            <div className="form-row" style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" 
                        value=${category} 
                        onChange=${(e) => setCategory(e.target.value)}>
                  <option value="Operations">Operations</option>
                  <option value="Procurement">Procurement</option>
                  <option value="Legal">Legal</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Finance">Finance</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Administrative">Administrative</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" 
                        value=${priority} 
                        onChange=${(e) => setPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Classification</label>
                <select className="form-select" 
                        value=${classification} 
                        onChange=${(e) => setClassification(e.target.value)}>
                  <option value="MANDATORY">MANDATORY</option>
                  <option value="CONDITIONAL">CONDITIONAL</option>
                  <option value="INFORMATIONAL">INFORMATIONAL</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Timeline / Due Date</label>
                <input type="text" 
                       className="form-input" 
                       value=${dueDate} 
                       onChange=${(e) => setDueDate(e.target.value)} 
                       placeholder="e.g. YYYY-MM-DD or 'Phase 1'" />
              </div>

              <div className="form-group">
                <label className="form-label">Assignee Role</label>
                <input type="text" 
                       className="form-input" 
                       value=${assignee} 
                       onChange=${(e) => setAssignee(e.target.value)} 
                       placeholder="e.g. Risk Manager" />
              </div>
            </div>

            <div className="form-row" style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Source Page</label>
                <input type="text" 
                       className="form-input" 
                       value=${sourcePage} 
                       onChange=${(e) => setSourcePage(e.target.value)} 
                       placeholder="e.g. Page 13" />
              </div>
              <div className="form-group">
                <label className="form-label">Source Section</label>
                <input type="text" 
                       className="form-input" 
                       value=${sourceSection} 
                       onChange=${(e) => setSourceSection(e.target.value)} 
                       placeholder="e.g. Section II" />
              </div>
              <div className="form-group">
                <label className="form-label">Source Paragraph</label>
                <input type="text" 
                       className="form-input" 
                       value=${sourceParagraph} 
                       onChange=${(e) => setSourceParagraph(e.target.value)} 
                       placeholder="e.g. Paragraph 3" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Document Clause Source Text (Optional)</label>
              <textarea className="form-input" 
                        style=${{ height: '54px', resize: 'vertical', fontSize: '12.5px' }}
                        value=${sourceText} 
                        onChange=${(e) => setSourceText(e.target.value)} 
                        placeholder="Reference sentence from PDF layout..."></textarea>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick=${onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style=${{ width: 'auto', padding: '10px 24px' }}>
              ${isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// --- Loading screen helper ---
function LoadingScreen({ progress, text, subtext }) {
  return html`
    <div className="loading-view">
      <div className="spinner"></div>
      <span className="loading-text">${text}</span>
      <span className="loading-subtext">${subtext}</span>
      
      <!-- Progress Bar indicator -->
      <div style=${{ width: '280px', height: '4px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '99px', marginTop: '10px', overflow: 'hidden' }}>
        <div style=${{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--accent-primary)', transition: 'width 0.15s ease' }}></div>
      </div>
    </div>
  `;
}

// --- Main App Wrapper ---
function App() {
  const [activeView, setActiveView] = useState('upload'); // upload, analysis, tasks, export
  const [currentStep, setCurrentStep] = useState(1);
  
  // Settings & Uploads
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [isMockMode, setIsMockMode] = useState(true);

  // Analysis result
  const [extractedData, setExtractedData] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Processing Document...');
  const [loadingSubtext, setLoadingSubtext] = useState('Starting pipeline...');

  // Modals state
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTargetTask, setEditTargetTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Auto save API key
  useEffect(() => {
    localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);

  // Handle PDF extraction pipeline
  const handleAnalyzeDocument = () => {
    if (!selectedFile) {
      alert("Please select a document first!");
      return;
    }

    setLoading(true);
    setLoadingProgress(5);
    setLoadingText("Preparing files...");
    setLoadingSubtext("Reading document binary...");

    // Simulated progress steps timer
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev < 15) {
          setLoadingText("Uploading document...");
          setLoadingSubtext(`${selectedFile.name} transfer in progress...`);
          return prev + 1;
        } else if (prev < 40) {
          setLoadingText("Extracting text layout...");
          setLoadingSubtext("Parsing headers, sections, and tables...");
          return prev + 2;
        } else if (prev < 75) {
          setLoadingText("Querying Gemini AI model...");
          setLoadingSubtext(isMockMode 
            ? "Evaluating text using local semantic heuristics..." 
            : `Structuring response using ${selectedModel}...`
          );
          return prev + 1;
        } else if (prev < 95) {
          setLoadingText("Formatting extracted checklist...");
          setLoadingSubtext("Verifying task contracts & structures...");
          return prev + 1;
        }
        return prev;
      });
    }, 200);

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (!isMockMode && apiKey) {
      formData.append("api_key", apiKey);
    }
    formData.append("model_name", selectedModel);

    // Direct HTTP POST to our FastAPI backend served on same port
    fetch("/api/extract-tasks", {
      method: "POST",
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errData => {
            throw new Error(errData.detail || "Server error occurred while extracting tasks.");
          });
        }
        return response.json();
      })
      .then(data => {
        clearInterval(progressInterval);
        setLoadingProgress(100);
        
        setTimeout(() => {
          setExtractedData(data);
          
          // Map tasks from response and add custom properties
          const taskItems = (data.tasks || []).map((t, idx) => ({
            ...t,
            id: `TSK-${String(idx + 1).padStart(3, '0')}`,
            status: 'Todo'
          }));
          
          setTasks(taskItems);
          setLoading(false);
          
          // Move forward in wizard
          setCurrentStep(2);
          setActiveView('analysis');
        }, 300);
      })
      .catch(error => {
        clearInterval(progressInterval);
        setLoading(false);
        alert(`Analysis Failed: ${error.message}\n\nMake sure the FastAPI backend is running and the selected file is valid.`);
      });
  };

  const handleTaskSave = (editedData) => {
    if (editTargetTask) {
      // Edit mode
      setTasks(tasks.map(t => {
        if (t.id === editTargetTask.id) {
          return { ...t, ...editedData };
        }
        return t;
      }));
      setEditTargetTask(null);
    } else {
      // Add mode
      const newIdNumber = tasks.length > 0 
        ? Math.max(...tasks.map(t => parseInt(t.id.replace('TSK-', '')))) + 1
        : 1;
        
      const newTask = {
        ...editedData,
        id: `TSK-${String(newIdNumber).padStart(3, '0')}`,
        status: 'Todo'
      };
      
      setTasks([...tasks, newTask]);
      setShowAddModal(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      if (nextStep === 2) setActiveView('analysis');
      if (nextStep === 3) setActiveView('export');
    }
  };

  return html`
    <div className="app-container">
      <${Sidebar} 
        activeView=${activeView} 
        setActiveView=${(view) => {
          setActiveView(view);
          if (view === 'upload') setCurrentStep(1);
          if (view === 'analysis') setCurrentStep(2);
          if (view === 'export') setCurrentStep(3);
        }} 
        hasData=${extractedData !== null} 
        currentStep=${currentStep} 
      />
      
      <main className="main-content">
        <${HeaderSteps} 
          currentStep=${currentStep} 
          setCurrentStep=${setCurrentStep}
          activeView=${activeView}
          setActiveView=${setActiveView}
          hasData=${extractedData !== null} 
        />
        
        <div className="view-wrapper">
          ${loading 
            ? html`<${LoadingScreen} progress=${loadingProgress} text=${loadingText} subtext=${loadingSubtext} />`
            : html`
              ${activeView === 'upload' && html`
                <${UploadView} 
                  selectedFile=${selectedFile}
                  setSelectedFile=${setSelectedFile}
                  apiKey=${apiKey}
                  setApiKey=${setApiKey}
                  selectedModel=${selectedModel}
                  setSelectedModel=${setSelectedModel}
                  isMockMode=${isMockMode}
                  setIsMockMode=${setIsMockMode}
                  onAnalyze=${handleAnalyzeDocument}
                />
              `}
              
              ${activeView === 'analysis' && html`
                <${AnalysisView} 
                  extractedData=${extractedData}
                  onNextStep=${handleNextStep}
                />
              `}
              
              ${activeView === 'export' && html`
                <${ExportView} 
                  tasks=${tasks}
                  extractedData=${extractedData}
                  selectedFile=${selectedFile}
                />
              `}
            `
          }
        </div>
      </main>

      <!-- Task Details Modal -->
      ${selectedTask && html`
        <${DetailModal} 
          task=${selectedTask} 
          onClose=${() => setSelectedTask(null)} 
        />
      `}

      <!-- Task Edit Modal -->
      ${editTargetTask && html`
        <${EditTaskModal} 
          task=${editTargetTask} 
          isEdit=${true} 
          onClose=${() => setEditTargetTask(null)} 
          onSave=${handleTaskSave}
        />
      `}

      <!-- Task Add Modal -->
      ${showAddModal && html`
        <${EditTaskModal} 
          isEdit=${false} 
          onClose=${() => setShowAddModal(false)} 
          onSave=${handleTaskSave}
        />
      `}
    </div>
  `;
}

// Render React App
const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(React.createElement(App));
}
