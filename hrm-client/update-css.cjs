const fs = require('fs');

const cssPath = './src/index.css';
let content = fs.readFileSync(cssPath, 'utf8');

// The marker where we start replacing
const marker = "/* ======================== EMPLOYEES PAGE (LIGHT MODE) ======================== */";
const startIndex = content.indexOf(marker);
if (startIndex === -1) {
  console.error("Marker not found!");
  process.exit(1);
}

const prefix = content.substring(0, startIndex);

const newCSS = `/* ======================== EMPLOYEES PAGE SHARED STRUCTURE ======================== */
.emp-dept-header {
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-style: solid;
}
.emp-dept-header td > div {
  font-weight: 700;
  letter-spacing: 0.05em;
}

.emp-row td {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}

.emp-id-badge {
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  font-family: inherit !important;
  border-width: 1px;
  border-style: solid;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.emp-avatar {
  width: 2rem !important;
  height: 2rem !important;
  border-radius: 9999px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  border-width: 1px;
  border-style: solid;
  flex-shrink: 0 !important;
}

.emp-status-badge {
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  padding: 0.25rem 0.75rem !important;
  border-width: 1px;
  border-style: solid;
  border-radius: 9999px !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.25rem !important;
}

.emp-email,
.emp-hire-date {
  font-size: 0.875rem !important;
  font-weight: 500 !important;
}

.emp-action-group {
  display: flex !important;
  gap: 0.375rem !important;
  align-items: center !important;
  margin-left: 0 !important;
  justify-content: flex-end !important;
}

.emp-action-view,
.emp-action-edit,
.emp-action-delete {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.375rem !important;
  width: auto !important;
  height: 32px !important;
  padding: 0 0.75rem !important;
  border-radius: 6px !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  margin: 0 !important;
  text-decoration: none !important;
  border-width: 1px;
  border-style: solid;
}

.emp-action-text {
  display: inline !important;
}

.emp-btn-primary,
.emp-btn-secondary {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 0.75rem !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke !important;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
  transition-duration: 150ms !important;
}
.emp-btn-primary {
  border: none !important;
}
.emp-btn-secondary {
  border-width: 1px;
  border-style: solid;
}

.emp-search-input,
.emp-filter-select {
  border-width: 1px !important;
  border-style: solid !important;
  border-radius: 0.75rem !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.875rem !important;
  outline: 2px solid transparent !important;
  outline-offset: 2px !important;
}

.emp-pagination {
  border-top-width: 1px !important;
  border-style: solid !important;
}
.emp-pagination button {
  border-width: 1px !important;
  border-style: solid !important;
  border-radius: 0.5rem !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  transition-property: color, background-color, border-color !important;
  transition-duration: 150ms !important;
}

.emp-file-input::file-selector-button {
  border-width: 1px;
  border-style: solid;
  font-weight: 600 !important;
  margin-right: 0.75rem !important;
  padding: 0.5rem 1rem !important;
  border-radius: 0.75rem !important;
  font-size: 0.75rem !important;
  cursor: pointer !important;
  transition-property: color, background-color, border-color !important;
  transition-duration: 150ms !important;
}

.emp-info-box {
  padding: 0.75rem !important;
  border-radius: 0.75rem !important;
  margin-bottom: 1rem !important;
  font-size: 0.75rem !important;
  border-width: 1px;
  border-style: solid;
}
.emp-info-title {
  font-weight: 700 !important;
  margin-bottom: 0.25rem !important;
}
.emp-code-block {
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.25rem !important;
  display: block !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
}

.emp-modal-surface {
  border-width: 1px;
  border-style: solid;
}


/* ======================== DARK MODE COLORS (DEFAULTS) ======================== */
.emp-dept-header {
  background: rgba(30, 41, 59, 0.5) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}
.emp-dept-header td > div {
  color: #F8FAFC !important;
}
.emp-dept-count {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #94A3B8 !important;
}

.emp-row td {
  color: #F8FAFC !important;
}
.emp-row .text-slate-300 { color: #CBD5E1 !important; }
.emp-row .text-slate-400 { color: #94A3B8 !important; }
.emp-row .font-medium.text-white { color: #F8FAFC !important; }

.emp-id-badge {
  background: rgba(99, 102, 241, 0.1) !important;
  color: #818CF8 !important;
  border-color: transparent !important;
}

.emp-avatar {
  background: linear-gradient(to bottom right, #6E7D14, #059669) !important;
  color: #FFFFFF !important;
  border-color: transparent !important;
}

.emp-status-badge {
  border-color: transparent !important;
}
.emp-status-active {
  background: rgba(16, 185, 129, 0.1) !important;
  color: #34D399 !important;
}
.emp-status-inactive,
.emp-status-offboarding,
.emp-status-leave {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #94A3B8 !important;
}

.emp-email, .emp-hire-date {
  color: #94A3B8 !important;
}

.emp-action-view {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #CBD5E1 !important;
  border-color: transparent !important;
}
.emp-action-view:hover { background: rgba(255, 255, 255, 0.1) !important; color: #FFFFFF !important; }

.emp-action-edit {
  background: rgba(110, 125, 20, 0.1) !important;
  color: #6E7D14 !important;
  border-color: transparent !important;
}
.emp-action-edit:hover { background: rgba(110, 125, 20, 0.2) !important; }

.emp-action-delete {
  background: rgba(244, 63, 94, 0.1) !important;
  color: #FB7185 !important;
  border-color: transparent !important;
}
.emp-action-delete:hover { background: rgba(244, 63, 94, 0.2) !important; color: #F43F5E !important; }

.emp-btn-primary {
  background: #6E7D14 !important;
  color: #FFFFFF !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}
.emp-btn-primary:hover { background: #10B981 !important; }

.emp-btn-secondary {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #CBD5E1 !important;
  border-color: transparent !important;
}
.emp-btn-secondary:hover { background: rgba(255, 255, 255, 0.1) !important; color: #FFFFFF !important; }

.emp-search-input, .emp-filter-select {
  background: rgba(15, 23, 42, 0.5) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: #F8FAFC !important;
}
.emp-search-input:focus, .emp-filter-select:focus {
  border-color: rgba(99, 102, 241, 0.5) !important;
}

.emp-pagination {
  background: transparent !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}
.emp-pagination span.text-slate-400 { color: #94A3B8 !important; }
.emp-pagination span.text-white { color: #F8FAFC !important; }
.emp-pagination button {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #CBD5E1 !important;
  border-color: transparent !important;
}
.emp-pagination button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #FFFFFF !important;
}
.emp-pagination button:disabled { opacity: 0.5 !important; }

.emp-file-input::file-selector-button {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #CBD5E1 !important;
  border-color: transparent !important;
}
.emp-file-input:hover::file-selector-button {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #FFFFFF !important;
}

.emp-info-box {
  background: rgba(99, 102, 241, 0.1) !important;
  border-color: rgba(99, 102, 241, 0.2) !important;
  color: #A5B4FC !important;
}
.emp-info-title { color: inherit !important; }
.emp-code-block {
  background: rgba(0, 0, 0, 0.3) !important;
  color: #34D399 !important;
  border-color: transparent !important;
}
.emp-modal-surface { border-color: rgba(255, 255, 255, 0.1) !important; }


/* ======================== LIGHT MODE COLORS (OVERRIDES) ======================== */
html[data-theme='light'] .emp-dept-header {
  background: #F0EEE9 !important;
  border-color: #E0DDD6 !important;
}
html[data-theme='light'] .emp-dept-header td > div {
  color: #1A1A1A !important;
}
html[data-theme='light'] .emp-dept-count {
  background: #E0DDD6 !important;
  color: #5C5C5C !important;
}

html[data-theme='light'] .emp-row td {
  color: #1A1A1A !important;
}
html[data-theme='light'] .emp-row .text-slate-300 { color: #5C5C5C !important; }
html[data-theme='light'] .emp-row .text-slate-400 { color: #737373 !important; }
html[data-theme='light'] .emp-row .font-medium.text-white { color: #1A1A1A !important; }

html[data-theme='light'] .emp-id-badge {
  background: #FAFAF8 !important;
  color: #5C5C5C !important;
  border-color: #E0DDD6 !important;
}

html[data-theme='light'] .emp-avatar {
  background: #FAFAF8 !important;
  color: #6E7D14 !important;
  border-color: #E0DDD6 !important;
}

html[data-theme='light'] .emp-status-badge {
  border-color: #E0DDD6 !important;
}
html[data-theme='light'] .emp-status-active {
  background: rgba(163,184,31,0.1) !important;
  color: #6E7D14 !important;
  border-color: rgba(163,184,31,0.2) !important;
}
html[data-theme='light'] .emp-status-inactive,
html[data-theme='light'] .emp-status-offboarding,
html[data-theme='light'] .emp-status-leave {
  background: #FAFAF8 !important;
  color: #9B9B9B !important;
  border-color: #E0DDD6 !important;
}

html[data-theme='light'] .emp-email,
html[data-theme='light'] .emp-hire-date {
  color: #5C5C5C !important;
}

html[data-theme='light'] .emp-action-view {
  background: #FFFFFF !important;
  color: #5C5C5C !important;
  border-color: #D5D1C8 !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
}
html[data-theme='light'] .emp-action-view:hover { background: #FAFAF8 !important; color: #1A1A1A !important; border-color: #BCBCBC !important; }

html[data-theme='light'] .emp-action-edit {
  background: #FAFAF8 !important;
  color: #6E7D14 !important;
  border-color: #E0DDD6 !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
}
html[data-theme='light'] .emp-action-edit:hover { background: rgba(163,184,31,0.05) !important; border-color: rgba(163,184,31,0.2) !important; color: #5A6610 !important; }

html[data-theme='light'] .emp-action-delete {
  background: #FFFFFF !important;
  color: #C62828 !important;
  border-color: #F8D7DA !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
}
html[data-theme='light'] .emp-action-delete:hover { background: #F8D7DA !important; border-color: #F5C2C7 !important; color: #A52A2A !important; }

html[data-theme='light'] .emp-btn-primary {
  background: #6E7D14 !important;
  color: #FFFFFF !important;
  box-shadow: 0 2px 4px rgba(110,125,20,0.2) !important;
}
html[data-theme='light'] .emp-btn-primary:hover { background: #5A6610 !important; }

html[data-theme='light'] .emp-btn-secondary {
  background: #FFFFFF !important;
  color: #5C5C5C !important;
  border-color: #E0DDD6 !important;
}
html[data-theme='light'] .emp-btn-secondary:hover { background: #FAFAF8 !important; color: #1A1A1A !important; border-color: #D5D1C8 !important; }

html[data-theme='light'] .emp-search-input,
html[data-theme='light'] .emp-filter-select {
  background: #FFFFFF !important;
  border-color: #D5D1C8 !important;
  color: #1A1A1A !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
}
html[data-theme='light'] .emp-search-input:focus,
html[data-theme='light'] .emp-filter-select:focus {
  border-color: #A3B81F !important;
  box-shadow: 0 0 0 3px rgba(163,184,31,0.12) !important;
}
html[data-theme='light'] .emp-search-input::placeholder {
  color: #9B9B9B !important;
}

html[data-theme='light'] .emp-pagination {
  background: #FAFAF8 !important;
  border-color: #E0DDD6 !important;
}
html[data-theme='light'] .emp-pagination span.text-slate-400 { color: #404040 !important; }
html[data-theme='light'] .emp-pagination span.text-white { color: #1A1A1A !important; }
html[data-theme='light'] .emp-pagination button {
  background: #FFFFFF !important;
  color: #5C5C5C !important;
  border-color: #E0DDD6 !important;
}
html[data-theme='light'] .emp-pagination button:hover:not(:disabled) {
  background: #F0EEE9 !important;
  color: #1A1A1A !important;
}

html[data-theme='light'] .emp-file-input::file-selector-button {
  background: #FFFFFF !important;
  color: #5C5C5C !important;
  border-color: #E0DDD6 !important;
}
html[data-theme='light'] .emp-file-input:hover::file-selector-button {
  background: #FAFAF8 !important;
  color: #1A1A1A !important;
  border-color: #D5D1C8 !important;
}

html[data-theme='light'] .emp-info-box {
  background: #FAFAF8 !important;
  border-color: #E0DDD6 !important;
  color: #5C5C5C !important;
}
html[data-theme='light'] .emp-info-title {
  color: #1A1A1A !important;
}
html[data-theme='light'] .emp-code-block {
  background: #F0EEE9 !important;
  color: #1A1A1A !important;
  border-color: #D5D1C8 !important;
}
html[data-theme='light'] .emp-modal-surface {
  border-color: #E0DDD6 !important;
}
`

fs.writeFileSync(cssPath, prefix + newCSS);
console.log("Updated index.css successfully!");
