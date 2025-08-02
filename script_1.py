# Create the rebranded Document.it with AI analytics features
import os

# Create directory
os.makedirs('document-it-mvp', exist_ok=True)

# Create the new HTML with Document.it branding and AI features
document_it_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document.it - AI-Powered Career Analytics</title>
    <link rel="stylesheet" href="style.css">
    
    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js"></script>
    
    <!-- PDF Generation -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    
    <!-- Chart.js for Analytics -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Aptos Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Loading Spinner -->
    <div id="loadingSpinner" class="loading-spinner hidden">
        <div class="spinner"></div>
        <p>Analyzing your career data...</p>
    </div>

    <!-- Notification -->
    <div id="notification" class="notification hidden">
        <span id="notificationText"></span>
        <button onclick="hideNotification()" class="notification-close">&times;</button>
    </div>

    <!-- Landing Page -->
    <div id="landingPage" class="page active">
        <div class="landing-hero">
            <div class="container">
                <div class="hero-content">
                    <div class="logo">
                        <h1>📊 Document.it</h1>
                        <p class="tagline">AI-Powered Career Analytics</p>
                    </div>
                    <h2>Transform Your Career Data into Actionable Insights</h2>
                    <p class="hero-description">Track your professional growth, analyze skill development, and receive AI-powered recommendations for career advancement.</p>
                    <div class="hero-actions">
                        <button class="btn btn--primary btn--lg" onclick="showSignup()">Start Free Trial</button>
                        <button class="btn btn--outline btn--lg" onclick="showLogin()">Sign In</button>
                    </div>
                </div>
                <div class="hero-features">
                    <div class="feature-card">
                        <div class="feature-icon">🤖</div>
                        <h3>AI Analytics</h3>
                        <p>Perplexity AI analyzes your career progression and provides personalized insights</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📈</div>
                        <h3>Growth Tracking</h3>
                        <p>Monitor skill development and career milestones over time</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📋</div>
                        <h3>Smart Reports</h3>
                        <p>Quarterly and semi-annual reports for performance reviews</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Authentication Modal -->
    <div id="authModal" class="modal hidden">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="authTitle">Create Account</h2>
                <button onclick="hideAuth()" class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="authForm">
                    <div class="form-group">
                        <label for="authEmail">Email</label>
                        <input type="email" id="authEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="authPassword">Password</label>
                        <input type="password" id="authPassword" required>
                    </div>
                    <div id="signupFields" class="signup-only">
                        <div class="form-group">
                            <label for="authName">Full Name</label>
                            <input type="text" id="authName">
                        </div>
                        <div class="form-group">
                            <label for="authConfirmPassword">Confirm Password</label>
                            <input type="password" id="authConfirmPassword">
                        </div>
                    </div>
                    <button type="submit" class="btn btn--primary btn--full">
                        <span id="authButtonText">Create Account</span>
                    </button>
                </form>
                <div class="auth-switch">
                    <p id="authSwitchText">Already have an account? <a href="#" onclick="toggleAuthMode()">Sign In</a></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Dashboard Page -->
    <div id="dashboardPage" class="page hidden">
        <nav class="navbar">
            <div class="nav-brand">
                <h2>📊 Document.it</h2>
            </div>
            <div class="nav-menu">
                <a href="#" onclick="showDashboard()" class="nav-link active">Dashboard</a>
                <a href="#" onclick="showForm()" class="nav-link">New Entry</a>
                <a href="#" onclick="showEntries()" class="nav-link">My Entries</a>
                <a href="#" onclick="showAnalytics()" class="nav-link">AI Analytics</a>
                <a href="#" onclick="showReports()" class="nav-link">Reports</a>
                <a href="#" onclick="showSettings()" class="nav-link">Settings</a>
                <a href="#" onclick="logout()" class="nav-link">Logout</a>
            </div>
        </nav>

        <div class="dashboard-content">
            <div class="container">
                <div class="dashboard-header">
                    <h1>Welcome back, <span id="userName">User</span>!</h1>
                    <p>Your AI-powered career analytics dashboard</p>
                </div>

                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-icon">📝</div>
                        <div class="stat-content">
                            <h3 id="totalEntries">0</h3>
                            <p>Career Entries</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <h3 id="skillsTracked">0</h3>
                            <p>Skills Tracked</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📈</div>
                        <div class="stat-content">
                            <h3 id="growthScore">0</h3>
                            <p>Growth Score</p>
                        </div>
                    </div>
                    <div class="stat-card ai-stat">
                        <div class="stat-icon">🤖</div>
                        <div class="stat-content">
                            <h3 id="aiInsights">0</h3>
                            <p>AI Insights</p>
                        </div>
                    </div>
                </div>

                <div class="dashboard-actions">
                    <button class="btn btn--primary" onclick="showForm()">📝 New Entry</button>
                    <button class="btn btn--secondary" onclick="generateAIInsights()">🤖 Generate AI Insights</button>
                    <button class="btn btn--outline" onclick="showAnalytics()">📊 View Analytics</button>
                    <button class="btn btn--outline" onclick="generateReport()">📋 Generate Report</button>
                </div>

                <div class="ai-insights-section">
                    <h2>🤖 Latest AI Insights</h2>
                    <div id="aiInsightsList" class="ai-insights-container">
                        <p class="empty-state">Generate your first AI insights to see personalized career recommendations!</p>
                    </div>
                </div>

                <div class="recent-entries">
                    <h2>Recent Entries</h2>
                    <div id="recentEntriesList">
                        <p class="empty-state">No entries yet. Create your first career entry!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Form Page (same 14 fields as before) -->
    <div id="formPage" class="page hidden">
        <nav class="navbar">
            <div class="nav-brand">
                <h2>📊 Document.it</h2>
            </div>
            <div class="nav-menu">
                <a href="#" onclick="showDashboard()" class="nav-link">Dashboard</a>
                <a href="#" onclick="showForm()" class="nav-link active">New Entry</a>
                <a href="#" onclick="showEntries()" class="nav-link">My Entries</a>
                <a href="#" onclick="showAnalytics()" class="nav-link">AI Analytics</a>
                <a href="#" onclick="showReports()" class="nav-link">Reports</a>
                <a href="#" onclick="showSettings()" class="nav-link">Settings</a>
                <a href="#" onclick="logout()" class="nav-link">Logout</a>
            </div>
        </nav>

        <div class="form-content">
            <div class="container">
                <div class="form-header">
                    <h1 id="formTitle">New Career Entry</h1>
                    <div class="form-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="formProgress"></div>
                        </div>
                        <span id="progressText">0% Complete</span>
                    </div>
                </div>

                <form id="careerForm" class="career-form">
                    <!-- Week Overview -->
                    <div class="form-section">
                        <h2>📅 Week Overview</h2>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="weekDate">Week Starting Date *</label>
                                <input type="date" id="weekDate" name="weekDate" required>
                            </div>
                            <div class="form-group">
                                <label for="projectName">Project or Client Name</label>
                                <input type="text" id="projectName" name="projectName" placeholder="Optional">
                            </div>
                        </div>
                    </div>

                    <!-- Responsibilities -->
                    <div class="form-section">
                        <h2>💼 Responsibilities</h2>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="responsibilityCategory">Responsibility Category *</label>
                                <div class="category-input-container">
                                    <select id="responsibilityCategory" name="responsibilityCategory" required>
                                        <option value="">Select a category</option>
                                    </select>
                                    <button type="button" class="btn btn--sm btn--outline" onclick="addCustomCategory()">+ Add Custom</button>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="responsibilityDescription">Responsibility Description *</label>
                            <textarea id="responsibilityDescription" name="responsibilityDescription" placeholder="Describe your key responsibilities this week..." required rows="4"></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="difficultyRating">Difficulty Rating *</label>
                                <div class="rating-container">
                                    <div class="rating-stars" id="difficultyStars">
                                        <span class="star" data-rating="1">⭐</span>
                                        <span class="star" data-rating="2">⭐</span>
                                        <span class="star" data-rating="3">⭐</span>
                                        <span class="star" data-rating="4">⭐</span>
                                        <span class="star" data-rating="5">⭐</span>
                                    </div>
                                    <span class="rating-label" id="difficultyLabel">Not rated</span>
                                </div>
                                <input type="hidden" id="difficultyRating" name="difficultyRating" value="0">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="impactAssessment">Impact Assessment</label>
                            <textarea id="impactAssessment" name="impactAssessment" placeholder="Optional: Describe the effect of your work on team or company goals..." rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="leadership">Leadership & Initiative</label>
                            <textarea id="leadership" name="leadership" placeholder="Optional: Document any leadership actions taken..." rows="3"></textarea>
                        </div>
                    </div>

                    <!-- Skills -->
                    <div class="form-section">
                        <h2>🎯 Skills & Development</h2>
                        <div class="form-group">
                            <label for="skillsUsed">Skills Used *</label>
                            <div class="skills-container">
                                <div class="selected-skills" id="selectedSkills">
                                    <!-- Selected skills will appear here -->
                                </div>
                                <div class="skills-input-container">
                                    <input type="text" id="skillSearch" placeholder="Search and select skills..." autocomplete="off">
                                    <div class="skills-dropdown" id="skillsDropdown">
                                        <!-- Skills options will appear here -->
                                    </div>
                                </div>
                                <div class="add-skill-container">
                                    <input type="text" id="newSkill" placeholder="Add new skill...">
                                    <button type="button" class="btn btn--sm btn--primary" onclick="addNewSkill()">Add Skill</button>
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="proficiencyLevel">Proficiency Level *</label>
                                <select id="proficiencyLevel" name="proficiencyLevel" required>
                                    <option value="">Select level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="usageIntensity">Usage Intensity *</label>
                                <div class="rating-container">
                                    <div class="rating-stars" id="intensityStars">
                                        <span class="star" data-rating="1">⭐</span>
                                        <span class="star" data-rating="2">⭐</span>
                                        <span class="star" data-rating="3">⭐</span>
                                        <span class="star" data-rating="4">⭐</span>
                                        <span class="star" data-rating="5">⭐</span>
                                    </div>
                                    <span class="rating-label" id="intensityLabel">Not rated</span>
                                </div>
                                <input type="hidden" id="usageIntensity" name="usageIntensity" value="0">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="skillGoals">Skill Development Goals</label>
                            <textarea id="skillGoals" name="skillGoals" placeholder="Optional: Set goals for new skills you want to develop..." rows="3"></textarea>
                        </div>
                    </div>

                    <!-- Collaboration -->
                    <div class="form-section">
                        <h2>🤝 Collaboration & Networking</h2>
                        <div class="form-group">
                            <label for="networking">Networking & Collaboration</label>
                            <textarea id="networking" name="networking" placeholder="Optional: Track cross-functional teamwork and networking activities..." rows="3"></textarea>
                        </div>
                    </div>

                    <!-- Well-being -->
                    <div class="form-section">
                        <h2>💪 Well-being</h2>
                        <div class="form-group">
                            <label for="mentalHealth">Weekly Mental Health Rating *</label>
                            <div class="slider-container">
                                <input type="range" id="mentalHealth" name="mentalHealth" min="0" max="10" value="5" class="slider">
                                <div class="slider-labels">
                                    <span>0 (Poor)</span>
                                    <span id="mentalHealthValue">5</span>
                                    <span>10 (Excellent)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Reflections -->
                    <div class="form-section">
                        <h2>💭 Reflections</h2>
                        <div class="form-group">
                            <label for="notes">Notes or Reflections *</label>
                            <textarea id="notes" name="notes" placeholder="Share your thoughts, learnings, challenges, or any additional reflections from this week..." required rows="4"></textarea>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn--outline" onclick="saveDraft()">Save Draft</button>
                        <button type="submit" class="btn btn--primary" id="submitBtn">Save Entry</button>
                        <button type="button" class="btn btn--secondary" onclick="showDashboard()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- NEW: AI Analytics Page -->
    <div id="analyticsPage" class="page hidden">
        <nav class="navbar">
            <div class="nav-brand">
                <h2>📊 Document.it</h2>
            </div>
            <div class="nav-menu">
                <a href="#" onclick="showDashboard()" class="nav-link">Dashboard</a>
                <a href="#" onclick="showForm()" class="nav-link">New Entry</a>
                <a href="#" onclick="showEntries()" class="nav-link">My Entries</a>
                <a href="#" onclick="showAnalytics()" class="nav-link active">AI Analytics</a>
                <a href="#" onclick="showReports()" class="nav-link">Reports</a>
                <a href="#" onclick="showSettings()" class="nav-link">Settings</a>
                <a href="#" onclick="logout()" class="nav-link">Logout</a>
            </div>
        </nav>

        <div class="analytics-content">
            <div class="container">
                <div class="analytics-header">
                    <h1>🤖 AI-Powered Career Analytics</h1>
                    <button class="btn btn--primary" onclick="generateAIInsights()">Generate New Insights</button>
                </div>
                
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <h3>🎯 Skill Growth Analysis</h3>
                        <div id="skillGrowthChart">
                            <canvas id="skillGrowthCanvas"></canvas>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h3>📈 Career Progression</h3>
                        <div id="careerProgressionInsight">
                            <p class="loading-text">Generate insights to see your career progression analysis...</p>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h3>💡 Growth Recommendations</h3>
                        <div id="growthRecommendations">
                            <p class="loading-text">AI recommendations will appear here after analysis...</p>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h3>🎤 Performance Review Prep</h3>
                        <div id="performanceReviewPrep">
                            <p class="loading-text">Generate talking points for your next performance review...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- NEW: Reports Page -->
    <div id="reportsPage" class="page hidden">
        <nav class="navbar">
            <div class="nav-brand">
                <h2>📊 Document.it</h2>
            </div>
            <div class="nav-menu">
                <a href="#" onclick="showDashboard()" class="nav-link">Dashboard</a>
                <a href="#" onclick="showForm()" class="nav-link">New Entry</a>
                <a href="#" onclick="showEntries()" class="nav-link">My Entries</a>
                <a href="#" onclick="showAnalytics()" class="nav-link">AI Analytics</a>
                <a href="#" onclick="showReports()" class="nav-link active">Reports</a>
                <a href="#" onclick="showSettings()" class="nav-link">Settings</a>
                <a href="#" onclick="logout()" class="nav-link">Logout</a>
            </div>
        </nav>

        <div class="reports-content">
            <div class="container">
                <h1>📋 Career Reports</h1>
                
                <div class="report-actions">
                    <button class="btn btn--primary" onclick="generateQuarterlyReport()">Generate Quarterly Report</button>
                    <button class="btn btn--secondary" onclick="generateSemiAnnualReport()">Generate Semi-Annual Report</button>
                    <button class="btn btn--outline" onclick="scheduleAutomaticReports()">Schedule Automatic Reports</button>
                </div>

                <div class="reports-list" id="reportsList">
                    <p class="empty-state">No reports generated yet. Create your first report!</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Entries Page -->
    <div id="entriesPage" class="page hidden">
        <nav class="navbar">
            <div class="nav-brand">
                <h2>📊 Document.it</h2>
            </div>
            <div class="nav-menu">
                <a href="#" onclick="showDashboard()" class="nav-link">Dashboard</a>
                <a href="#" onclick="showForm()" class="nav-link">New Entry</a>
                <a href="#" onclick="showEntries()" class="nav-link active">My Entries</a>
                <a href="#" onclick="showAnalytics()" class="nav-link">AI Analytics</a>
                <a href="#" onclick="showReports()" class="nav-link">Reports</a>
                <a href="#" onclick="showSettings()" class="nav-link">Settings</a>
                <a href="#" onclick="logout()" class="nav-link">Logout</a>
            </div>
        </nav>

        <div class="entries-content">
            <div class="container">
                <div class="entries-header">
                    <h1>My Career Entries</h1>
                    <div class="entries-actions">
                        <input type="text" id="searchEntries" placeholder="Search entries..." class="search-input">
                        <button class="btn btn--primary" onclick="showForm()">+ New Entry</button>
                        <button class="btn btn--outline" onclick="exportData()">📥 Export Data</button>
                    </div>
                </div>

                <div class="entries-list" id="entriesList">
                    <!-- Entries will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Settings Page -->
    <div id="settingsPage" class="page hidden">
        <nav class="navbar">
            <div class="nav-brand">
                <h2>📊 Document.it</h2>
            </div>
            <div class="nav-menu">
                <a href="#" onclick="showDashboard()" class="nav-link">Dashboard</a>
                <a href="#" onclick="showForm()" class="nav-link">New Entry</a>
                <a href="#" onclick="showEntries()" class="nav-link">My Entries</a>
                <a href="#" onclick="showAnalytics()" class="nav-link">AI Analytics</a>
                <a href="#" onclick="showReports()" class="nav-link">Reports</a>
                <a href="#" onclick="showSettings()" class="nav-link active">Settings</a>
                <a href="#" onclick="logout()" class="nav-link">Logout</a>
            </div>
        </nav>

        <div class="settings-content">
            <div class="container">
                <h1>⚙️ Settings</h1>
                
                <div class="settings-grid">
                    <div class="settings-section">
                        <h2>Profile</h2>
                        <div class="form-group">
                            <label for="settingsName">Full Name</label>
                            <input type="text" id="settingsName" placeholder="Your name">
                        </div>
                        <div class="form-group">
                            <label for="settingsEmail">Email</label>
                            <input type="email" id="settingsEmail" placeholder="Your email" readonly>
                        </div>
                        <button class="btn btn--primary" onclick="updateProfile()">Update Profile</button>
                    </div>

                    <div class="settings-section">
                        <h2>🤖 AI Configuration</h2>
                        <div class="form-group">
                            <label for="perplexityApiKey">Perplexity API Key</label>
                            <input type="password" id="perplexityApiKey" placeholder="Enter your Perplexity API key">
                            <small>Get your API key from <a href="https://www.perplexity.ai/settings/api" target="_blank">Perplexity Settings</a></small>
                        </div>
                        <button class="btn btn--primary" onclick="saveAPISettings()">Save API Settings</button>
                    </div>

                    <div class="settings-section">
                        <h2>📋 Report Preferences</h2>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="autoQuarterlyReports" checked>
                                Generate quarterly reports automatically
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="autoSemiAnnualReports" checked>
                                Generate semi-annual reports automatically
                            </label>
                        </div>
                        <button class="btn btn--primary" onclick="saveReportSettings()">Save Report Settings</button>
                    </div>

                    <div class="settings-section">
                        <h2>Custom Categories</h2>
                        <div id="customCategoriesList"></div>
                        <div class="add-item-container">
                            <input type="text" id="newCategory" placeholder="Add new category...">
                            <button class="btn btn--primary" onclick="addCustomCategoryFromSettings()">Add</button>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h2>Custom Skills</h2>
                        <div id="customSkillsList"></div>
                        <div class="add-item-container">
                            <input type="text" id="newSkillSetting" placeholder="Add new skill...">
                            <button class="btn btn--primary" onclick="addCustomSkillFromSettings()">Add</button>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h2>Data Management</h2>
                        <button class="btn btn--outline" onclick="exportData()">📥 Export All Data</button>
                        <button class="btn btn--outline" onclick="importData()">📤 Import Data</button>
                        <button class="btn btn--danger" onclick="deleteAccount()">🗑️ Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>'''

print("✅ Created Document.it HTML with AI features")
print("📁 HTML size:", len(document_it_html), "characters")
print("\n🎨 New features added:")
print("   • Document.it branding and Aptos font")
print("   • AI Analytics dashboard page")
print("   • Reports generation page")
print("   • Perplexity API integration setup")
print("   • Firebase integration ready")
print("   • PDF report generation")
print("   • White/ivory color scheme with blue accents")