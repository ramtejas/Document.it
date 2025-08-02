# Create the complete CSS file with all the styling for the full-featured form
complete_css = '''/* CareerTrack MVP - Complete Styling */

/* Reset and Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* Primary Colors */
    --primary-color: #1e40af;
    --secondary-color: #059669;
    --accent-color: #7c3aed;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --error-color: #ef4444;
    --neutral-color: #6b7280;
    
    /* Background Colors */
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-tertiary: #f1f5f9;
    
    /* Text Colors */
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --text-tertiary: #9ca3af;
    
    /* Border Colors */
    --border-light: #e5e7eb;
    --border-medium: #d1d5db;
    --border-dark: #9ca3af;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    
    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;
    
    /* Border Radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background-color: var(--bg-secondary);
}

/* Utility Classes */
.hidden { display: none !important; }
.container { 
    max-width: 1200px; 
    margin: 0 auto; 
    padding: 0 var(--space-md); 
}

/* Loading Spinner */
.loading-spinner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-light);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Notifications */
.notification {
    position: fixed;
    top: var(--space-lg);
    right: var(--space-lg);
    padding: var(--space-md);
    border-radius: var(--radius-md);
    color: white;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    min-width: 300px;
    animation: slideIn 0.3s ease-out;
}

.notification.success { background-color: var(--success-color); }
.notification.error { background-color: var(--error-color); }
.notification.warning { background-color: var(--warning-color); }

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: auto;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

/* Buttons */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    background: none;
}

.btn--primary {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.btn--primary:hover {
    background-color: #1d4ed8;
    border-color: #1d4ed8;
}

.btn--outline {
    color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn--outline:hover {
    background-color: var(--primary-color);
    color: white;
}

.btn--secondary {
    background-color: var(--neutral-color);
    color: white;
    border-color: var(--neutral-color);
}

.btn--danger {
    background-color: var(--error-color);
    color: white;
    border-color: var(--error-color);
}

.btn--sm {
    padding: var(--space-xs) var(--space-sm);
    font-size: 0.75rem;
}

.btn--lg {
    padding: var(--space-md) var(--space-xl);
    font-size: 1rem;
}

.btn--full {
    width: 100%;
}

/* Landing Page */
.landing-hero {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
    color: white;
    display: flex;
    align-items: center;
}

.hero-content {
    text-align: center;
    margin-bottom: var(--space-2xl);
}

.hero-content h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: var(--space-lg);
}

.hero-content p {
    font-size: 1.25rem;
    margin-bottom: var(--space-xl);
    opacity: 0.9;
}

.hero-actions {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
    flex-wrap: wrap;
}

.hero-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-xl);
    margin-top: var(--space-2xl);
}

.feature-card {
    text-align: center;
    padding: var(--space-xl);
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(10px);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: var(--space-md);
}

.feature-card h3 {
    font-size: 1.25rem;
    margin-bottom: var(--space-sm);
}

/* Modal */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: var(--radius-lg);
    width: 90%;
    max-width: 400px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-lg);
    border-bottom: 1px solid var(--border-light);
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-secondary);
}

.modal-body {
    padding: var(--space-lg);
}

.auth-switch {
    text-align: center;
    margin-top: var(--space-md);
}

.signup-only {
    display: block;
}

/* Navigation */
.navbar {
    background: white;
    border-bottom: 1px solid var(--border-light);
    padding: var(--space-md) 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand h2 {
    color: var(--primary-color);
    font-size: 1.5rem;
}

.nav-menu {
    display: flex;
    gap: var(--space-lg);
    align-items: center;
}

.nav-link {
    text-decoration: none;
    color: var(--text-secondary);
    font-weight: 500;
    transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
    color: var(--primary-color);
}

/* Forms */
.form-group {
    margin-bottom: var(--space-lg);
}

.form-group label {
    display: block;
    margin-bottom: var(--space-xs);
    font-weight: 500;
    color: var(--text-primary);
}

.form-control,
input[type="text"],
input[type="email"],
input[type="password"],
input[type="date"],
select,
textarea {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus,
input:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

textarea {
    resize: vertical;
    min-height: 80px;
}

/* Dashboard */
.dashboard-content {
    padding: var(--space-xl) 0;
}

.dashboard-header {
    text-align: center;
    margin-bottom: var(--space-2xl);
}

.dashboard-header h1 {
    font-size: 2.5rem;
    margin-bottom: var(--space-sm);
}

.dashboard-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-lg);
    margin-bottom: var(--space-2xl);
}

.stat-card {
    background: white;
    padding: var(--space-xl);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
}

.stat-icon {
    font-size: 2rem;
}

.stat-content h3 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
}

.dashboard-actions {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
    margin-bottom: var(--space-2xl);
    flex-wrap: wrap;
}

.recent-entries,
.achievement-section {
    background: white;
    padding: var(--space-xl);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    margin-bottom: var(--space-xl);
}

.badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--space-md);
}

.badge {
    text-align: center;
    padding: var(--space-md);
    border-radius: var(--radius-md);
    background: var(--bg-tertiary);
    opacity: 0.5;
    transition: opacity 0.2s;
}

.badge.earned {
    opacity: 1;
    background: linear-gradient(135deg, var(--success-color), var(--secondary-color));
    color: white;
}

.badge-icon {
    font-size: 2rem;
    margin-bottom: var(--space-xs);
}

/* Form Sections - ENHANCED FOR COMPLETE FORM */
.form-content {
    padding: var(--space-xl) 0;
}

.form-header {
    text-align: center;
    margin-bottom: var(--space-2xl);
}

.form-progress {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-top: var(--space-lg);
}

.progress-bar {
    flex: 1;
    height: 8px;
    background: var(--border-light);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--primary-color);
    transition: width 0.3s ease;
}

.career-form {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
}

.form-section {
    padding: var(--space-xl);
    border-bottom: 1px solid var(--border-light);
}

.form-section:last-child {
    border-bottom: none;
}

.form-section h2 {
    color: var(--primary-color);
    margin-bottom: var(--space-lg);
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    gap: var(--space-sm);
}

.form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-lg);
}

.form-actions {
    padding: var(--space-xl);
    display: flex;
    gap: var(--space-md);
    justify-content: center;
    flex-wrap: wrap;
}

/* Category Input Container */
.category-input-container {
    display: flex;
    gap: var(--space-sm);
    align-items: flex-end;
}

.category-input-container select {
    flex: 1;
}

/* Rating Systems */
.rating-container {
    display: flex;
    align-items: center;
    gap: var(--space-md);
}

.rating-stars {
    display: flex;
    gap: var(--space-xs);
}

.star {
    font-size: 1.5rem;
    cursor: pointer;
    transition: opacity 0.2s;
    opacity: 0.3;
}

.star.active {
    opacity: 1;
}

.star:hover {
    opacity: 0.7;
}

.rating-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    min-width: 80px;
}

/* Slider */
.slider-container {
    width: 100%;
}

.slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: var(--border-light);
    outline: none;
    -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
}

.slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    border: none;
}

.slider-labels {
    display: flex;
    justify-content: space-between;
    margin-top: var(--space-xs);
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.slider-labels span:nth-child(2) {
    font-weight: 600;
    color: var(--primary-color);
}

/* Skills Selection - ENHANCED */
.skills-container {
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    background: var(--bg-primary);
}

.selected-skills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-bottom: var(--space-md);
    min-height: 40px;
    padding: var(--space-xs);
    border: 1px dashed var(--border-light);
    border-radius: var(--radius-sm);
    background: var(--bg-secondary);
}

.selected-skills:empty::before {
    content: "Selected skills will appear here...";
    color: var(--text-tertiary);
    font-style: italic;
}

.skill-tag {
    background: var(--primary-color);
    color: white;
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
}

.skill-tag-remove {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.skill-tag-remove:hover {
    background: rgba(255, 255, 255, 0.2);
}

.skills-input-container {
    position: relative;
    margin-bottom: var(--space-md);
}

.skills-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid var(--border-medium);
    border-top: none;
    border-radius: 0 0 var(--radius-md) var(--radius-md);
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
    display: none;
}

.skills-dropdown:not(:empty) {
    display: block;
}

.skill-option {
    padding: var(--space-sm) var(--space-md);
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid var(--border-light);
}

.skill-option:last-child {
    border-bottom: none;
}

.skill-option:hover {
    background: var(--bg-tertiary);
}

.add-skill-container {
    display: flex;
    gap: var(--space-sm);
    align-items: center;
}

.add-skill-container input {
    flex: 1;
}

/* Entries List */
.entries-content {
    padding: var(--space-xl) 0;
}

.entries-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xl);
    flex-wrap: wrap;
    gap: var(--space-md);
}

.entries-actions {
    display: flex;
    gap: var(--space-md);
    align-items: center;
    flex-wrap: wrap;
}

.search-input {
    min-width: 250px;
}

.entry-card {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: var(--space-xl);
    margin-bottom: var(--space-lg);
    transition: box-shadow 0.2s;
}

.entry-card:hover {
    box-shadow: var(--shadow-md);
}

.entry-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-md);
    flex-wrap: wrap;
    gap: var(--space-md);
}

.entry-date {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.entry-actions {
    display: flex;
    gap: var(--space-sm);
}

.entry-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-md);
}

.entry-field {
    font-size: 0.875rem;
}

.entry-field strong {
    color: var(--text-primary);
}

/* Analytics */
.analytics-content {
    padding: var(--space-xl) 0;
}

.analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--space-xl);
}

.chart-container {
    background: white;
    padding: var(--space-xl);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
}

.chart-container h3 {
    margin-bottom: var(--space-lg);
    color: var(--primary-color);
}

/* Settings */
.settings-content {
    padding: var(--space-xl) 0;
}

.settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-xl);
}

.settings-section {
    background: white;
    padding: var(--space-xl);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
}

.settings-section h2 {
    color: var(--primary-color);
    margin-bottom: var(--space-lg);
}

.custom-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    margin-bottom: var(--space-xs);
}

.add-item-container {
    display: flex;
    gap: var(--space-sm);
    margin-top: var(--space-md);
}

.add-item-container input {
    flex: 1;
}

.empty-state {
    text-align: center;
    color: var(--text-secondary);
    font-style: italic;
    padding: var(--space-xl);
}

/* Page Management */
.page {
    display: none;
}

.page.active {
    display: block;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .hero-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .nav-menu {
        flex-wrap: wrap;
        gap: var(--space-md);
    }
    
    .dashboard-stats {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .entries-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .entry-header {
        flex-direction: column;
    }
    
    .analytics-grid {
        grid-template-columns: 1fr;
    }
    
    .settings-grid {
        grid-template-columns: 1fr;
    }
    
    .category-input-container {
        flex-direction: column;
        align-items: stretch;
    }
    
    .add-skill-container {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 var(--space-sm);
    }
    
    .modal-content {
        width: 95%;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .btn--lg {
        padding: var(--space-sm) var(--space-lg);
    }
    
    .skills-container {
        padding: var(--space-sm);
    }
    
    .search-input {
        min-width: 200px;
    }
}

/* Focus and Accessibility */
.btn:focus,
input:focus,
select:focus,
textarea:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

.star:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* Print Styles */
@media print {
    .navbar,
    .form-actions,
    .entry-actions,
    .btn {
        display: none;
    }
}'''

print("✅ Created complete CSS with professional styling")  
print("📁 CSS file size:", len(complete_css), "characters")
print("\n🎨 Styling features:")
print("   • Professional color scheme and typography")
print("   • Responsive grid layouts")
print("   • Interactive form elements")
print("   • Smooth animations and transitions")
print("   • Mobile-optimized design")
print("   • Accessibility features")
print("   • Print-friendly styles")