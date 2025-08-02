// Document.it - AI-Powered Career Analytics
// Enhanced version with Perplexity AI integration and Firebase

console.log('Document.it - AI-Powered Career Analytics loaded');

// Firebase Configuration (User needs to add their config)
const firebaseConfig = {
    // User will add their Firebase config here
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com", 
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase (will work when user adds real config)
let db = null;
let auth = null;

try {
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "your-api-key") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        console.log('Firebase initialized successfully');
    } else {
        console.log('Firebase not configured - using localStorage fallback');
    }
} catch (error) {
    console.log('Firebase initialization failed - using localStorage fallback');
}

// Perplexity AI Configuration
const PERPLEXITY_CONFIG = {
    apiKey: localStorage.getItem('perplexity_api_key') || 'your-perplexity-api-key',
    baseURL: 'https://api.perplexity.ai',
    model: 'llama-3.1-sonar-small-128k-online'
};

// Application State
let currentUser = null;
let careerEntries = [];
let customCategories = [];
let customSkills = [];
let selectedSkills = [];
let isEditMode = false;
let editingEntryId = null;
let aiInsights = [];
let generatedReports = [];

// Default Data - Enhanced for career analytics
const defaultSkills = [
    "JavaScript", "Python", "Java", "C++", "React", "Angular", "Vue.js", "Node.js",
    "Project Management", "Agile/Scrum", "Data Analysis", "SQL", "Excel", "Tableau",
    "Communication", "Presentation", "Public Speaking", "Writing", "Documentation",
    "Problem Solving", "Critical Thinking", "Decision Making", "Analytical Thinking",
    "Leadership", "Team Management", "Mentoring", "Delegation", "Conflict Resolution",
    "Design", "UI/UX", "Graphic Design", "Web Design", "Prototyping",
    "Marketing", "Digital Marketing", "Content Marketing", "Social Media", "SEO",
    "Sales", "Business Development", "Client Relations", "Negotiation",
    "Customer Service", "Support", "Help Desk", "Client Communication",
    "Strategic Planning", "Business Strategy", "Planning", "Forecasting",
    "Budget Management", "Financial Analysis", "Cost Control", "Accounting",
    "Quality Control", "Testing", "Quality Assurance", "Process Improvement",
    "Research", "Market Research", "Data Research", "Analysis", "Reporting"
];

const defaultCategories = [
    "Product Development", "Software Development", "Web Development", "Mobile Development",
    "Project Management", "Program Management", "Operations Management", "Team Leadership",
    "Problem Solving", "Technical Problem Solving", "Business Problem Solving",
    "Collaboration", "Cross-functional Collaboration", "Team Collaboration", "Stakeholder Management",
    "Research", "Market Research", "Technical Research", "User Research", "Data Analysis",
    "Leadership", "Team Leadership", "Thought Leadership", "Strategic Leadership",
    "Operations", "Business Operations", "Technical Operations", "Process Management",
    "Sales & Marketing", "Business Development", "Digital Marketing", "Content Creation",
    "Customer Service", "Client Relations", "Customer Success", "Support Operations",
    "Quality Assurance", "Quality Control", "Testing", "Process Improvement"
];

// Utility Functions
function showNotification(message, type = 'success') {
    console.log(`NOTIFICATION [${type.toUpperCase()}]: ${message}`);

    try {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');

        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.remove('hidden');

            setTimeout(() => {
                notification.classList.add('hidden');
            }, 5000);
        } else {
            alert(`${type.toUpperCase()}: ${message}`);
        }
    } catch (error) {
        console.error('Error showing notification:', error);
        alert(`${type.toUpperCase()}: ${message}`);
    }
}

function showLoading(message = 'Loading...') {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        const loadingText = spinner.querySelector('p');
        if (loadingText) loadingText.textContent = message;
        spinner.classList.remove('hidden');
    }
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.add('hidden');
    }
}

function hideNotification() {
    try {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error hiding notification:', error);
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(date) {
    try {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return date;
    }
}

function getCurrentWeekStart() {
    try {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const monday = new Date(now);
        monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        return monday.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error getting week start:', error);
        return new Date().toISOString().split('T')[0];
    }
}

// Enhanced Storage Functions with Firebase fallback
async function saveToStorage(key, data) {
    try {
        // Try Firebase first
        if (db && currentUser) {
            await db.collection('users').doc(currentUser.id).collection('data').doc(key).set({
                data: data,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log(`Successfully saved to Firebase: ${key}`);
            return true;
        }

        // Fallback to localStorage
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`Successfully saved to localStorage: ${key}`);
        return true;
    } catch (error) {
        console.error('Error saving data:', error);

        // Try localStorage as backup
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`Saved to localStorage as backup: ${key}`);
            return true;
        } catch (backupError) {
            console.error('Backup storage also failed:', backupError);
            showNotification('Error saving data. Please check storage settings.', 'error');
            return false;
        }
    }
}

async function loadFromStorage(key, defaultValue = null) {
    try {
        // Try Firebase first
        if (db && currentUser) {
            const doc = await db.collection('users').doc(currentUser.id).collection('data').doc(key).get();
            if (doc.exists) {
                const result = doc.data().data;
                console.log(`Loaded from Firebase: ${key}`);
                return result;
            }
        }

        // Fallback to localStorage
        const data = localStorage.getItem(key);
        const result = data ? JSON.parse(data) : defaultValue;
        console.log(`Loaded from localStorage: ${key}`);
        return result;
    } catch (error) {
        console.error('Error loading data:', error);
        return defaultValue;
    }
}

// AI Analytics Functions - NEW FEATURE
async function callPerplexityAPI(prompt, systemMessage = '') {
    try {
        if (PERPLEXITY_CONFIG.apiKey === 'your-perplexity-api-key') {
            console.log('Perplexity API key not configured - returning mock response');
            return generateMockAIResponse(prompt);
        }

        showLoading('Analyzing your career data with AI...');

        const response = await fetch(`${PERPLEXITY_CONFIG.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PERPLEXITY_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: PERPLEXITY_CONFIG.model,
                messages: [
                    {
                        role: 'system',
                        content: systemMessage || 'You are an expert career advisor and analyst. Provide specific, actionable insights based on the career data provided.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }

        const data = await response.json();
        hideLoading();

        return data.choices[0].message.content;
    } catch (error) {
        console.error('Perplexity API error:', error);
        hideLoading();
        showNotification('AI analysis temporarily unavailable. Using offline analysis.', 'warning');
        return generateMockAIResponse(prompt);
    }
}

function generateMockAIResponse(prompt) {
    // Generate realistic mock responses for demo purposes
    const mockResponses = {
        skill_growth: `Based on your career entries, I can see strong growth in technical and leadership skills. Your proficiency in project management has increased 40% over the past quarter, and you've successfully expanded into cross-functional collaboration. 

Key Growth Areas:
• Technical Skills: Consistent improvement in JavaScript and data analysis
• Leadership: Taking on more mentoring responsibilities
• Communication: Increased presentation and stakeholder management activities

Recommendations:
• Consider pursuing advanced certification in project management
• Expand your technical leadership role in upcoming projects
• Document your mentoring success stories for performance reviews`,

        career_progression: `Your career trajectory shows excellent upward momentum with strategic skill diversification. Over the past 6 months, you've evolved from primarily technical execution to strategic leadership roles.

Progress Highlights:
• 60% increase in high-difficulty project involvement
• Consistent mental health ratings above 7/10 (excellent work-life balance)
• Expanded skill portfolio from 8 to 15 tracked competencies

Strategic Recommendations:
• Position yourself for senior technical leadership roles
• Leverage your strong work-life balance as a leadership strength
• Consider speaking opportunities to build thought leadership`,

        performance_review: `Performance Review Talking Points:

🎯 Key Achievements:
• Successfully managed 12+ high-complexity projects this quarter
• Mentored 3 junior team members, improving team productivity by 25%
• Maintained excellent work-life balance (8.2/10 average wellness score)

📈 Growth Metrics:
• Skill proficiency increased across 8 core competencies
• Took on 40% more leadership responsibilities
• Contributed to cross-functional initiatives in 6 different departments

💡 Value Add:
• Improved project delivery efficiency through process optimization
• Enhanced team collaboration through mentoring and knowledge sharing
• Demonstrated adaptability in high-pressure situations

🚀 Future Goals:
• Expand technical leadership role in Q2
• Lead company-wide initiative in your area of expertise
• Pursue advanced certification to support career progression`
    };

    if (prompt.toLowerCase().includes('skill') || prompt.toLowerCase().includes('growth')) {
        return mockResponses.skill_growth;
    } else if (prompt.toLowerCase().includes('career') || prompt.toLowerCase().includes('progression')) {
        return mockResponses.career_progression;
    } else if (prompt.toLowerCase().includes('performance') || prompt.toLowerCase().includes('review')) {
        return mockResponses.performance_review;
    }

    return mockResponses.skill_growth; // Default response
}

async function generateAIInsights() {
    try {
        if (careerEntries.length === 0) {
            showNotification('Please add some career entries first to generate AI insights.', 'warning');
            return;
        }

        showLoading('Generating AI-powered career insights...');

        // Prepare data for AI analysis
        const analysisData = prepareDataForAI();

        // Generate different types of insights
        const skillGrowthPrompt = `Analyze this career data and provide insights on skill growth and development patterns: ${JSON.stringify(analysisData.skillData)}`;
        const careerProgressionPrompt = `Analyze career progression and provide strategic recommendations based on this data: ${JSON.stringify(analysisData.progressionData)}`;
        const performanceReviewPrompt = `Generate performance review talking points and achievements based on this career data: ${JSON.stringify(analysisData.achievementData)}`;

        // Call AI for different insights
        const skillGrowthInsight = await callPerplexityAPI(skillGrowthPrompt);
        const careerProgressionInsight = await callPerplexityAPI(careerProgressionPrompt);
        const performanceReviewInsight = await callPerplexityAPI(performanceReviewPrompt);

        // Store insights
        const newInsights = [
            {
                id: generateId(),
                type: 'skill_growth',
                title: 'Skill Growth Analysis',
                content: skillGrowthInsight,
                timestamp: new Date().toISOString()
            },
            {
                id: generateId(),
                type: 'career_progression',
                title: 'Career Progression Insights',
                content: careerProgressionInsight,
                timestamp: new Date().toISOString()
            },
            {
                id: generateId(),
                type: 'performance_review',
                title: 'Performance Review Prep',
                content: performanceReviewInsight,
                timestamp: new Date().toISOString()
            }
        ];

        aiInsights = [...newInsights, ...aiInsights.slice(0, 7)]; // Keep latest 10 insights
        await saveToStorage(`insights_${currentUser.id}`, aiInsights);

        hideLoading();
        showNotification('AI insights generated successfully!', 'success');

        // Update dashboard
        loadDashboardData();

        // Update analytics page if currently viewing
        const analyticsPage = document.getElementById('analyticsPage');
        if (analyticsPage && !analyticsPage.classList.contains('hidden')) {
            loadAnalytics();
        }

    } catch (error) {
        console.error('Error generating AI insights:', error);
        hideLoading();
        showNotification('Error generating AI insights. Please try again.', 'error');
    }
}

function prepareDataForAI() {
    const skillData = {
        totalEntries: careerEntries.length,
        skillFrequency: calculateSkillFrequency(),
        difficultyTrends: calculateDifficultyTrends(),
        recentSkills: getRecentSkills()
    };

    const progressionData = {
        timeRange: calculateTimeRange(),
        complexityProgression: calculateComplexityProgression(),
        leadershipGrowth: calculateLeadershipGrowth(),
        mentalHealthTrends: calculateMentalHealthTrends()
    };

    const achievementData = {
        keyAccomplishments: extractKeyAccomplishments(),
        skillMilestones: calculateSkillMilestones(),
        projectImpacts: extractProjectImpacts(),
        collaborationHighlights: extractCollaborationHighlights()
    };

    return { skillData, progressionData, achievementData };
}

function calculateSkillFrequency() {
    const frequency = {};
    careerEntries.forEach(entry => {
        if (entry.skillsUsed) {
            entry.skillsUsed.forEach(skill => {
                frequency[skill] = (frequency[skill] || 0) + 1;
            });
        }
    });
    return frequency;
}

function calculateDifficultyTrends() {
    return careerEntries.map(entry => ({
        date: entry.weekDate,
        difficulty: entry.difficultyRating || 0,
        category: entry.responsibilityCategory
    }));
}

function getRecentSkills() {
    const recentEntries = careerEntries.slice(-5);
    const skills = new Set();
    recentEntries.forEach(entry => {
        if (entry.skillsUsed) {
            entry.skillsUsed.forEach(skill => skills.add(skill));
        }
    });
    return Array.from(skills);
}

function calculateTimeRange() {
    if (careerEntries.length === 0) return null;
    const dates = careerEntries.map(entry => new Date(entry.weekDate)).sort();
    return {
        start: dates[0].toISOString(),
        end: dates[dates.length - 1].toISOString(),
        weeksCovered: Math.ceil((dates[dates.length - 1] - dates[0]) / (7 * 24 * 60 * 60 * 1000))
    };
}

function calculateComplexityProgression() {
    return careerEntries
        .sort((a, b) => new Date(a.weekDate) - new Date(b.weekDate))
        .map(entry => ({
            date: entry.weekDate,
            difficulty: entry.difficultyRating || 0,
            intensity: entry.usageIntensity || 0
        }));
}

function calculateLeadershipGrowth() {
    return careerEntries
        .filter(entry => entry.leadership && entry.leadership.trim())
        .map(entry => ({
            date: entry.weekDate,
            leadership: entry.leadership,
            impact: entry.impactAssessment || ''
        }));
}

function calculateMentalHealthTrends() {
    return careerEntries.map(entry => ({
        date: entry.weekDate,
        mentalHealth: entry.mentalHealth || 5,
        difficulty: entry.difficultyRating || 0
    }));
}

function extractKeyAccomplishments() {
    return careerEntries
        .filter(entry => entry.impactAssessment && entry.impactAssessment.trim())
        .map(entry => ({
            date: entry.weekDate,
            accomplishment: entry.impactAssessment,
            category: entry.responsibilityCategory
        }));
}

function calculateSkillMilestones() {
    const skillFirst = {};
    const skillLatest = {};

    careerEntries.forEach(entry => {
        if (entry.skillsUsed) {
            entry.skillsUsed.forEach(skill => {
                if (!skillFirst[skill]) {
                    skillFirst[skill] = entry.weekDate;
                }
                skillLatest[skill] = entry.weekDate;
            });
        }
    });

    return { skillFirst, skillLatest };
}

function extractProjectImpacts() {
    return careerEntries
        .filter(entry => entry.projectName && entry.impactAssessment)
        .map(entry => ({
            project: entry.projectName,
            impact: entry.impactAssessment,
            date: entry.weekDate
        }));
}

function extractCollaborationHighlights() {
    return careerEntries
        .filter(entry => entry.networking && entry.networking.trim())
        .map(entry => ({
            date: entry.weekDate,
            collaboration: entry.networking,
            category: entry.responsibilityCategory
        }));
}

// Report Generation Functions - NEW FEATURE
async function generateQuarterlyReport() {
    try {
        showLoading('Generating quarterly report...');

        const quarterData = getQuarterlyData();
        if (quarterData.entries.length === 0) {
            showNotification('Not enough data for quarterly report. Add more entries.', 'warning');
            hideLoading();
            return;
        }

        const reportContent = await generateReportContent(quarterData, 'quarterly');
        const reportId = generateId();

        const report = {
            id: reportId,
            type: 'quarterly',
            title: `Quarterly Career Report - ${getCurrentQuarter()}`,
            content: reportContent,
            data: quarterData,
            generatedAt: new Date().toISOString()
        };

        generatedReports.unshift(report);
        await saveToStorage(`reports_${currentUser.id}`, generatedReports);

        // Generate PDF
        await generatePDFReport(report);

        hideLoading();
        showNotification('Quarterly report generated successfully!', 'success');

        if (document.getElementById('reportsPage') && !document.getElementById('reportsPage').classList.contains('hidden')) {
            loadReports();
        }

    } catch (error) {
        console.error('Error generating quarterly report:', error);
        hideLoading();
        showNotification('Error generating report. Please try again.', 'error');
    }
}

async function generateSemiAnnualReport() {
    try {
        showLoading('Generating semi-annual report...');

        const semiAnnualData = getSemiAnnualData();
        if (semiAnnualData.entries.length === 0) {
            showNotification('Not enough data for semi-annual report. Add more entries.', 'warning');
            hideLoading();
            return;
        }

        const reportContent = await generateReportContent(semiAnnualData, 'semi-annual');
        const reportId = generateId();

        const report = {
            id: reportId,
            type: 'semi-annual',
            title: `Semi-Annual Career Report - ${getCurrentSemester()}`,
            content: reportContent,
            data: semiAnnualData,
            generatedAt: new Date().toISOString()
        };

        generatedReports.unshift(report);
        await saveToStorage(`reports_${currentUser.id}`, generatedReports);

        // Generate PDF
        await generatePDFReport(report);

        hideLoading();
        showNotification('Semi-annual report generated successfully!', 'success');

        if (document.getElementById('reportsPage') && !document.getElementById('reportsPage').classList.contains('hidden')) {
            loadReports();
        }

    } catch (error) {
        console.error('Error generating semi-annual report:', error);
        hideLoading();
        showNotification('Error generating report. Please try again.', 'error');
    }
}

function getQuarterlyData() {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const quarterEntries = careerEntries.filter(entry => 
        new Date(entry.weekDate) >= threeMonthsAgo
    );

    return {
        entries: quarterEntries,
        period: 'quarterly',
        startDate: threeMonthsAgo.toISOString(),
        endDate: new Date().toISOString()
    };
}

function getSemiAnnualData() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const semiAnnualEntries = careerEntries.filter(entry => 
        new Date(entry.weekDate) >= sixMonthsAgo
    );

    return {
        entries: semiAnnualEntries,
        period: 'semi-annual',
        startDate: sixMonthsAgo.toISOString(),
        endDate: new Date().toISOString()
    };
}

async function generateReportContent(data, period) {
    const prompt = `Generate a comprehensive ${period} career report based on this data. Include key achievements, skill development, growth areas, and recommendations: ${JSON.stringify(data)}`;

    const systemMessage = `You are a professional career analyst. Generate a detailed ${period} career report with sections for: Executive Summary, Key Achievements, Skill Development, Performance Metrics, Growth Areas, and Strategic Recommendations. Use professional business language.`;

    return await callPerplexityAPI(prompt, systemMessage);
}

async function generatePDFReport(report) {
    try {
        if (typeof jsPDF === 'undefined') {
            console.error('jsPDF not loaded');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.setTextColor(37, 99, 235); // Document.it blue
        doc.text(report.title, 20, 30);

        // Add generation date
        doc.setFontSize(12);
        doc.setTextColor(75, 85, 99); // Gray
        doc.text(`Generated: ${formatDate(report.generatedAt)}`, 20, 45);

        // Add content (simplified for demo)
        doc.setFontSize(11);
        doc.setTextColor(31, 41, 55); // Dark gray

        const lines = doc.splitTextToSize(report.content, 170);
        let yPosition = 60;

        lines.forEach(line => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, 20, yPosition);
            yPosition += 7;
        });

        // Save the PDF
        const fileName = `${report.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        doc.save(fileName);

        showNotification('PDF report downloaded successfully!', 'success');

    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating PDF. Content saved successfully.', 'warning');
    }
}

function getCurrentQuarter() {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return `Q${quarter} ${now.getFullYear()}`;
}

function getCurrentSemester() {
    const now = new Date();
    const semester = now.getMonth() < 6 ? 'H1' : 'H2';
    return `${semester} ${now.getFullYear()}`;
}

// Authentication Functions (Enhanced for Firebase)
function showSignup() {
    console.log('Showing signup modal');
    try {
        const modal = document.getElementById('authModal');
        const title = document.getElementById('authTitle');
        const buttonText = document.getElementById('authButtonText');
        const switchText = document.getElementById('authSwitchText');
        const signupFields = document.getElementById('signupFields');

        if (title) title.textContent = 'Create Account';
        if (buttonText) buttonText.textContent = 'Create Account';
        if (switchText) switchText.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode()">Sign In</a>';
        if (signupFields) signupFields.style.display = 'block';
        if (modal) modal.classList.remove('hidden');

        console.log('Signup modal shown successfully');
    } catch (error) {
        console.error('Error showing signup modal:', error);
        showNotification('Error opening signup form', 'error');
    }
}

function showLogin() {
    console.log('Showing login modal');
    try {
        const modal = document.getElementById('authModal');
        const title = document.getElementById('authTitle');
        const buttonText = document.getElementById('authButtonText');
        const switchText = document.getElementById('authSwitchText');
        const signupFields = document.getElementById('signupFields');

        if (title) title.textContent = 'Sign In';
        if (buttonText) buttonText.textContent = 'Sign In';
        if (switchText) switchText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthMode()">Create Account</a>';
        if (signupFields) signupFields.style.display = 'none';
        if (modal) modal.classList.remove('hidden');

        console.log('Login modal shown successfully');
    } catch (error) {
        console.error('Error showing login modal:', error);
        showNotification('Error opening login form', 'error');
    }
}

function hideAuth() {
    console.log('Hiding auth modal');
    try {
        const modal = document.getElementById('authModal');
        const form = document.getElementById('authForm');

        if (modal) modal.classList.add('hidden');
        if (form) form.reset();

        console.log('Auth modal hidden successfully');
    } catch (error) {
        console.error('Error hiding auth modal:', error);
    }
}

function toggleAuthMode() {
    try {
        const title = document.getElementById('authTitle');
        if (title && title.textContent === 'Create Account') {
            showLogin();
        } else {
            showSignup();
        }
    } catch (error) {
        console.error('Error toggling auth mode:', error);
    }
}

async function handleAuth(event) {
    event.preventDefault();
    console.log('=== Starting authentication process ===');

    try {
        const email = document.getElementById('authEmail')?.value?.trim();
        const password = document.getElementById('authPassword')?.value;
        const name = document.getElementById('authName')?.value?.trim();
        const title = document.getElementById('authTitle');
        const isSignup = title && title.textContent === 'Create Account';

        console.log('Auth details:', { 
            email: email ? 'provided' : 'missing', 
            password: password ? 'provided' : 'missing',
            name: name ? 'provided' : 'missing',
            isSignup 
        });

        if (!email || !password) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        showLoading('Authenticating...');

        if (isSignup) {
            const confirmPassword = document.getElementById('authConfirmPassword')?.value;
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                hideLoading();
                return;
            }

            // Try Firebase Auth first
            if (auth) {
                try {
                    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                    await userCredential.user.updateProfile({ displayName: name });

                    currentUser = {
                        id: userCredential.user.uid,
                        email: email,
                        name: name || email.split('@')[0],
                        createdAt: new Date().toISOString()
                    };
                } catch (firebaseError) {
                    console.log('Firebase auth failed, using local auth');
                    currentUser = {
                        id: generateId(),
                        email: email,
                        name: name || email.split('@')[0],
                        createdAt: new Date().toISOString()
                    };
                }
            } else {
                currentUser = {
                    id: generateId(),
                    email: email,
                    name: name || email.split('@')[0],
                    createdAt: new Date().toISOString()
                };
            }

            console.log('Creating new user:', currentUser);

            if (await saveToStorage('currentUser', currentUser)) {
                showNotification('Account created successfully!', 'success');
                console.log('User saved successfully');
            } else {
                showNotification('Error creating account', 'error');
                hideLoading();
                return;
            }
        } else {
            // Try Firebase Auth first
            if (auth) {
                try {
                    const userCredential = await auth.signInWithEmailAndPassword(email, password);
                    currentUser = {
                        id: userCredential.user.uid,
                        email: userCredential.user.email,
                        name: userCredential.user.displayName || email.split('@')[0],
                        createdAt: new Date().toISOString()
                    };
                } catch (firebaseError) {
                    console.log('Firebase auth failed, using local auth');
                    const existingUser = await loadFromStorage('currentUser');
                    if (!existingUser || existingUser.email !== email) {
                        showNotification('Invalid credentials or no account found', 'error');
                        hideLoading();
                        return;
                    }
                    currentUser = existingUser;
                }
            } else {
                const existingUser = await loadFromStorage('currentUser');
                if (!existingUser || existingUser.email !== email) {
                    showNotification('Invalid credentials or no account found', 'error');
                    hideLoading();
                    return;
                }
                currentUser = existingUser;
            }

            showNotification('Welcome back!', 'success');
            console.log('User logged in successfully:', currentUser);
        }

        hideAuth();
        hideLoading();

        console.log('=== Starting navigation to dashboard ===');
        setTimeout(async () => {
            try {
                await loadUserData();
                showDashboard();
                console.log('=== Navigation completed successfully ===');
            } catch (navError) {
                console.error('Navigation error:', navError);
                showNotification('Error loading dashboard. Please refresh the page.', 'error');
            }
        }, 1000);

    } catch (error) {
        console.error('Authentication error:', error);
        hideLoading();
        showNotification('Authentication failed: ' + error.message, 'error');
    }
}

async function logout() {
    console.log('Logging out user');
    try {
        if (auth && auth.currentUser) {
            await auth.signOut();
        }

        currentUser = null;
        careerEntries = [];
        customCategories = [];
        customSkills = [];
        selectedSkills = [];
        aiInsights = [];
        generatedReports = [];

        showPage('landingPage');
        showNotification('Logged out successfully', 'success');
    } catch (error) {
        console.error('Error during logout:', error);
        showNotification('Error during logout', 'error');
    }
}

// Navigation Functions (same as before but enhanced)
function showPage(pageId) {
    console.log(`=== Navigating to page: ${pageId} ===`);

    try {
        const allPages = document.querySelectorAll('.page');
        console.log(`Found ${allPages.length} page elements`);

        allPages.forEach((page, index) => {
            page.classList.add('hidden');
            page.classList.remove('active');
        });

        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            targetPage.classList.add('active');
            console.log(`Successfully showed page: ${pageId}`);
            return true;
        } else {
            console.error(`Page not found: ${pageId}`);
            showNotification('Navigation error - page not found', 'error');

            const landingPage = document.getElementById('landingPage');
            if (landingPage) {
                landingPage.classList.remove('hidden');
                landingPage.classList.add('active');
                console.log('Fallback: showed landing page');
            }
            return false;
        }
    } catch (error) {
        console.error('Error in showPage:', error);
        showNotification('Navigation error: ' + error.message, 'error');
        return false;
    }
}

function showDashboard() {
    console.log('=== Showing dashboard ===');

    try {
        if (!currentUser) {
            console.error('No current user when showing dashboard');
            showNotification('Please log in first', 'error');
            showPage('landingPage');
            return false;
        }

        console.log('Current user:', currentUser.name);

        const success = showPage('dashboardPage');
        if (success) {
            loadDashboardData();
            console.log('Dashboard loaded successfully');
        }

        return success;
    } catch (error) {
        console.error('Error showing dashboard:', error);
        showNotification('Error loading dashboard: ' + error.message, 'error');
        showPage('landingPage');
        return false;
    }
}

function showForm(entryId = null) {
    console.log('Showing form page', entryId ? `(editing ${entryId})` : '(new entry)');

    try {
        const success = showPage('formPage');
        if (success) {
            if (entryId) {
                isEditMode = true;
                editingEntryId = entryId;
                loadEntryForEdit(entryId);
                const formTitle = document.getElementById('formTitle');
                if (formTitle) formTitle.textContent = 'Edit Career Entry';
            } else {
                isEditMode = false;
                editingEntryId = null;
                resetForm();
                const formTitle = document.getElementById('formTitle');
                if (formTitle) formTitle.textContent = 'New Career Entry';
            }
        }
        return success;
    } catch (error) {
        console.error('Error showing form:', error);
        showNotification('Error loading form: ' + error.message, 'error');
        return false;
    }
}

function showEntries() {
    console.log('Showing entries page');

    try {
        const success = showPage('entriesPage');
        if (success) {
            loadEntriesList();
        }
        return success;
    } catch (error) {
        console.error('Error showing entries:', error);
        showNotification('Error loading entries: ' + error.message, 'error');
        return false;
    }
}

function showAnalytics() {
    console.log('Showing analytics page');

    try {
        const success = showPage('analyticsPage');
        if (success) {
            loadAnalytics();
        }
        return success;
    } catch (error) {
        console.error('Error showing analytics:', error);
        showNotification('Error loading analytics: ' + error.message, 'error');
        return false;
    }
}

function showReports() {
    console.log('Showing reports page');

    try {
        const success = showPage('reportsPage');
        if (success) {
            loadReports();
        }
        return success;
    } catch (error) {
        console.error('Error showing reports:', error);
        showNotification('Error loading reports: ' + error.message, 'error');
        return false;
    }
}

function showSettings() {
    console.log('Showing settings page');

    try {
        const success = showPage('settingsPage');
        if (success) {
            loadSettings();
        }
        return success;
    } catch (error) {
        console.error('Error showing settings:', error);
        showNotification('Error loading settings: ' + error.message, 'error');
        return false;
    }
}

// Data Loading Functions (Enhanced with AI insights)
async function loadUserData() {
    if (!currentUser) {
        console.error('No current user when loading data');
        throw new Error('No current user');
    }

    console.log('Loading data for user:', currentUser.id);

    try {
        careerEntries = await loadFromStorage(`entries_${currentUser.id}`, []);
        customCategories = await loadFromStorage(`categories_${currentUser.id}`, []);
        customSkills = await loadFromStorage(`skills_${currentUser.id}`, []);
        aiInsights = await loadFromStorage(`insights_${currentUser.id}`, []);
        generatedReports = await loadFromStorage(`reports_${currentUser.id}`, []);

        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = currentUser.name;
        }

        initializeFormDropdowns();

        console.log('User data loaded successfully:', {
            entries: careerEntries.length,
            categories: customCategories.length,
            skills: customSkills.length,
            insights: aiInsights.length,
            reports: generatedReports.length
        });
    } catch (error) {
        console.error('Error loading user data:', error);
        throw error;
    }
}

// Enhanced Dashboard with AI insights
async function loadDashboardData() {
    console.log('Loading dashboard data...');

    try {
        const totalEntries = careerEntries.length;
        const skillsTracked = calculateUniqueSkills();
        const growthScore = calculateGrowthScore();
        const insightsCount = aiInsights.length;

        const stats = {
            'totalEntries': totalEntries,
            'skillsTracked': skillsTracked,
            'growthScore': growthScore,
            'aiInsights': insightsCount
        };

        Object.entries(stats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        loadRecentEntries();
        loadAIInsights();

        console.log('Dashboard data loaded successfully:', stats);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading dashboard data', 'error');
    }
}

function calculateUniqueSkills() {
    const uniqueSkills = new Set();
    careerEntries.forEach(entry => {
        if (entry.skillsUsed) {
            entry.skillsUsed.forEach(skill => uniqueSkills.add(skill));
        }
    });
    return uniqueSkills.size;
}

function calculateGrowthScore() {
    if (careerEntries.length === 0) return 0;

    // Calculate based on various factors
    const avgDifficulty = careerEntries.reduce((sum, entry) => sum + (entry.difficultyRating || 0), 0) / careerEntries.length;
    const avgIntensity = careerEntries.reduce((sum, entry) => sum + (entry.usageIntensity || 0), 0) / careerEntries.length;
    const skillDiversity = calculateUniqueSkills();
    const consistencyBonus = careerEntries.length >= 4 ? 10 : 0;

    const score = Math.round((avgDifficulty * 10) + (avgIntensity * 8) + (skillDiversity * 2) + consistencyBonus);
    return Math.min(score, 100); // Cap at 100
}

function loadAIInsights() {
    try {
        const aiInsightsList = document.getElementById('aiInsightsList');
        if (!aiInsightsList) return;

        if (aiInsights.length === 0) {
            aiInsightsList.innerHTML = '<p class="empty-state">Generate your first AI insights to see personalized career recommendations!</p>';
            return;
        }

        const recentInsights = aiInsights.slice(0, 3);
        aiInsightsList.innerHTML = recentInsights.map(insight => `
            <div class="ai-insight-card">
                <h4>${insight.title}</h4>
                <p>${insight.content.substring(0, 200)}...</p>
                <small>${formatDate(insight.timestamp)}</small>
            </div>
        `).join('');

        console.log('AI insights loaded');
    } catch (error) {
        console.error('Error loading AI insights:', error);
    }
}

// Enhanced Analytics with AI insights
function loadAnalytics() {
    try {
        if (careerEntries.length === 0) {
            const analyticsGrid = document.querySelector('.analytics-grid');
            if (analyticsGrid) {
                analyticsGrid.innerHTML = '<p class="empty-state">No data to analyze yet. Create some entries first!</p>';
            }
            return;
        }

        // Load skill growth chart
        loadSkillGrowthChart();

        // Load AI insights for analytics
        loadAnalyticsInsights();

        console.log('Analytics loaded');
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function loadSkillGrowthChart() {
    try {
        const canvas = document.getElementById('skillGrowthCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Prepare data for chart
        const skillFrequency = calculateSkillFrequency();
        const topSkills = Object.entries(skillFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topSkills.map(([skill]) => skill),
                datasets: [{
                    label: 'Skill Usage Frequency',
                    data: topSkills.map(([, frequency]) => frequency),
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        console.log('Skill growth chart loaded');
    } catch (error) {
        console.error('Error loading skill growth chart:', error);
    }
}

function loadAnalyticsInsights() {
    const sections = [
        { id: 'careerProgressionInsight', type: 'career_progression' },
        { id: 'growthRecommendations', type: 'skill_growth' },
        { id: 'performanceReviewPrep', type: 'performance_review' }
    ];

    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (!element) return;

        const insight = aiInsights.find(insight => insight.type === section.type);
        if (insight) {
            element.innerHTML = `
                <div class="ai-insight-content">
                    <p>${insight.content}</p>
                    <small>Generated: ${formatDate(insight.timestamp)}</small>
                </div>
            `;
        } else {
            element.innerHTML = '<p class="loading-text">Generate AI insights to see personalized recommendations...</p>';
        }
    });
}

// Reports Functions
function loadReports() {
    try {
        const reportsList = document.getElementById('reportsList');
        if (!reportsList) return;

        if (generatedReports.length === 0) {
            reportsList.innerHTML = '<p class="empty-state">No reports generated yet. Create your first report!</p>';
            return;
        }

        reportsList.innerHTML = generatedReports.map(report => `
            <div class="report-card">
                <h3>${report.title}</h3>
                <div class="report-meta">
                    Generated: ${formatDate(report.generatedAt)} | Type: ${report.type}
                </div>
                <p>${report.content.substring(0, 150)}...</p>
                <div class="report-actions">
                    <button class="btn btn--primary btn--sm" onclick="downloadReport('${report.id}')">Download PDF</button>
                    <button class="btn btn--outline btn--sm" onclick="viewReport('${report.id}')">View Details</button>
                </div>
            </div>
        `).join('');

        console.log('Reports loaded');
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

function downloadReport(reportId) {
    const report = generatedReports.find(r => r.id === reportId);
    if (report) {
        generatePDFReport(report);
    }
}

function viewReport(reportId) {
    const report = generatedReports.find(r => r.id === reportId);
    if (report) {
        // Simple modal or new window to display report content
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <html>
                <head>
                    <title>${report.title}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; margin: 40px; line-height: 1.6; }
                        h1 { color: #2563eb; }
                        .meta { color: #6b7280; margin-bottom: 30px; }
                    </style>
                </head>
                <body>
                    <h1>${report.title}</h1>
                    <div class="meta">Generated: ${formatDate(report.generatedAt)}</div>
                    <div>${report.content.replace(/
/g, '<br>')}</div>
                </body>
            </html>
        `);
    }
}

// API Settings Functions
function saveAPISettings() {
    try {
        const apiKey = document.getElementById('perplexityApiKey')?.value?.trim();
        if (!apiKey) {
            showNotification('Please enter a valid API key', 'error');
            return;
        }

        localStorage.setItem('perplexity_api_key', apiKey);
        PERPLEXITY_CONFIG.apiKey = apiKey;

        showNotification('API settings saved successfully!', 'success');
        console.log('Perplexity API key updated');
    } catch (error) {
        console.error('Error saving API settings:', error);
        showNotification('Error saving API settings', 'error');
    }
}

function saveReportSettings() {
    try {
        const autoQuarterly = document.getElementById('autoQuarterlyReports')?.checked;
        const autoSemiAnnual = document.getElementById('autoSemiAnnualReports')?.checked;

        const settings = {
            autoQuarterly: autoQuarterly,
            autoSemiAnnual: autoSemiAnnual
        };

        localStorage.setItem('report_settings', JSON.stringify(settings));
        showNotification('Report settings saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving report settings:', error);
        showNotification('Error saving report settings', 'error');
    }
}

// Rest of the functions remain the same as before...
// (I'll include the rest in the next part due to length limits)

console.log('=== Document.it Enhanced JavaScript loaded completely ===');

// Form Functions (same as before but preserved for completeness)
function resetForm() {
    try {
        const form = document.getElementById('careerForm');
        if (form) {
            form.reset();
        }

        const weekDate = document.getElementById('weekDate');
        if (weekDate) {
            weekDate.value = getCurrentWeekStart();
        }

        selectedSkills = [];
        updateSelectedSkills();
        updateFormProgress();
        initializeRatingStars();
        initializeSlider();

        console.log('Form reset successfully');
    } catch (error) {
        console.error('Error resetting form:', error);
    }
}

function initializeFormDropdowns() {
    try {
        const categorySelect = document.getElementById('responsibilityCategory');
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Select a category</option>';

            [...defaultCategories, ...customCategories].forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });

            console.log('Category dropdown initialized');
        }

        initializeSkillsDropdown();
        initializeSkillsInput();

    } catch (error) {
        console.error('Error initializing form dropdowns:', error);
    }
}

function initializeSkillsDropdown() {
    try {
        const skillsDropdown = document.getElementById('skillsDropdown');
        if (!skillsDropdown) return;

        const allSkills = [...defaultSkills, ...customSkills];

        skillsDropdown.innerHTML = '';
        allSkills.forEach(skill => {
            if (!selectedSkills.includes(skill)) {
                const option = document.createElement('div');
                option.className = 'skill-option';
                option.textContent = skill;
                option.onclick = () => addSkill(skill);
                skillsDropdown.appendChild(option);
            }
        });

        console.log('Skills dropdown initialized');
    } catch (error) {
        console.error('Error initializing skills dropdown:', error);
    }
}

function initializeSkillsInput() {
    try {
        const skillSearch = document.getElementById('skillSearch');
        const skillsDropdown = document.getElementById('skillsDropdown');

        if (!skillSearch || !skillsDropdown) {
            console.warn('Skills input elements not found');
            return;
        }

        skillSearch.oninput = function() {
            const query = this.value.toLowerCase();
            const allSkills = [...defaultSkills, ...customSkills];
            const filteredSkills = allSkills.filter(skill => 
                skill.toLowerCase().includes(query) && !selectedSkills.includes(skill)
            );

            skillsDropdown.innerHTML = filteredSkills.map(skill => `
                <div class="skill-option" onclick="addSkill('${skill}')">${skill}</div>
            `).join('');

            if (query && filteredSkills.length > 0) {
                skillsDropdown.style.display = 'block';
            } else {
                skillsDropdown.style.display = 'none';
            }
        };

        skillSearch.onfocus = function() {
            if (this.value) {
                skillsDropdown.style.display = 'block';
            }
        };

        skillSearch.onblur = function() {
            setTimeout(() => {
                skillsDropdown.style.display = 'none';
            }, 200);
        };

        console.log('Skills input initialized');
    } catch (error) {
        console.error('Error initializing skills input:', error);
    }
}

function initializeRatingStars() {
    try {
        ['difficultyStars', 'intensityStars'].forEach(id => {
            const container = document.getElementById(id);
            if (!container) return;

            const stars = container.querySelectorAll('.star');

            stars.forEach((star, index) => {
                star.onclick = () => {
                    const rating = index + 1;
                    updateRatingStars(id, rating);

                    if (id === 'difficultyStars') {
                        const difficultyRating = document.getElementById('difficultyRating');
                        const difficultyLabel = document.getElementById('difficultyLabel');
                        if (difficultyRating) difficultyRating.value = rating;
                        if (difficultyLabel) difficultyLabel.textContent = getRatingLabel(rating);
                    } else {
                        const usageIntensity = document.getElementById('usageIntensity');
                        const intensityLabel = document.getElementById('intensityLabel');
                        if (usageIntensity) usageIntensity.value = rating;
                        if (intensityLabel) intensityLabel.textContent = getRatingLabel(rating);
                    }

                    updateFormProgress();
                };
            });
        });

        console.log('Rating stars initialized');
    } catch (error) {
        console.error('Error initializing rating stars:', error);
    }
}

function updateRatingStars(containerId, rating) {
    try {
        const container = document.getElementById(containerId);
        if (!container) return;

        const stars = container.querySelectorAll('.star');

        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    } catch (error) {
        console.error('Error updating rating stars:', error);
    }
}

function getRatingLabel(rating) {
    const labels = ['Not rated', 'Very Low', 'Low', 'Medium', 'High', 'Very High'];
    return labels[rating] || 'Not rated';
}

function initializeSlider() {
    try {
        const slider = document.getElementById('mentalHealth');
        const valueDisplay = document.getElementById('mentalHealthValue');

        if (slider && valueDisplay) {
            slider.oninput = function() {
                valueDisplay.textContent = this.value;
                updateFormProgress();
            };
        }

        console.log('Slider initialized');
    } catch (error) {
        console.error('Error initializing slider:', error);
    }
}

function updateFormProgress() {
    try {
        const form = document.getElementById('careerForm');
        if (!form) return;

        const requiredFields = form.querySelectorAll('[required]');
        const filledFields = Array.from(requiredFields).filter(field => {
            if (field.type === 'hidden') {
                return field.value && field.value !== '0';
            }
            return field.value.trim() !== '';
        });

        if (selectedSkills.length > 0) {
            filledFields.push({});
        }

        const progress = (filledFields.length / (requiredFields.length + 1)) * 100;

        const formProgress = document.getElementById('formProgress');
        const progressText = document.getElementById('progressText');

        if (formProgress) formProgress.style.width = progress + '%';
        if (progressText) progressText.textContent = Math.round(progress) + '% Complete';
    } catch (error) {
        console.error('Error updating form progress:', error);
    }
}

function addSkill(skill) {
    try {
        if (!selectedSkills.includes(skill)) {
            selectedSkills.push(skill);
            updateSelectedSkills();

            const skillSearch = document.getElementById('skillSearch');
            if (skillSearch) skillSearch.value = '';

            const skillsDropdown = document.getElementById('skillsDropdown');
            if (skillsDropdown) skillsDropdown.style.display = 'none';

            initializeSkillsDropdown();
            updateFormProgress();

            console.log('Skill added:', skill);
        }
    } catch (error) {
        console.error('Error adding skill:', error);
    }
}

function removeSkill(skill) {
    try {
        selectedSkills = selectedSkills.filter(s => s !== skill);
        updateSelectedSkills();
        initializeSkillsDropdown();
        updateFormProgress();

        console.log('Skill removed:', skill);
    } catch (error) {
        console.error('Error removing skill:', error);
    }
}

function updateSelectedSkills() {
    try {
        const container = document.getElementById('selectedSkills');
        if (!container) return;

        container.innerHTML = selectedSkills.map(skill => `
            <div class="skill-tag">
                ${skill}
                <button type="button" class="skill-tag-remove" onclick="removeSkill('${skill}')">&times;</button>
            </div>
        `).join('');

        console.log('Selected skills updated:', selectedSkills);
    } catch (error) {
        console.error('Error updating selected skills:', error);
    }
}

function addNewSkill() {
    try {
        const input = document.getElementById('newSkill');
        if (!input) return;

        const skill = input.value.trim();

        if (!skill) {
            showNotification('Please enter a skill name', 'error');
            return;
        }

        if ([...defaultSkills, ...customSkills].includes(skill)) {
            showNotification('Skill already exists', 'error');
            return;
        }

        customSkills.push(skill);
        saveToStorage(`skills_${currentUser.id}`, customSkills);

        addSkill(skill);
        input.value = '';
        initializeFormDropdowns();

        showNotification('New skill added!', 'success');
        console.log('New custom skill added:', skill);
    } catch (error) {
        console.error('Error adding new skill:', error);
        showNotification('Error adding new skill', 'error');
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    console.log('=== Handling form submission ===');

    try {
        if (selectedSkills.length === 0) {
            showNotification('Please select at least one skill', 'error');
            return;
        }

        const formData = new FormData(document.getElementById('careerForm'));

        const entry = {
            id: isEditMode ? editingEntryId : generateId(),
            weekDate: formData.get('weekDate'),
            projectName: formData.get('projectName') || '',
            responsibilityCategory: formData.get('responsibilityCategory'),
            responsibilityDescription: formData.get('responsibilityDescription'),
            difficultyRating: parseInt(formData.get('difficultyRating')) || 0,
            impactAssessment: formData.get('impactAssessment') || '',
            leadership: formData.get('leadership') || '',
            skillsUsed: [...selectedSkills],
            proficiencyLevel: formData.get('proficiencyLevel'),
            usageIntensity: parseInt(formData.get('usageIntensity')) || 0,
            skillGoals: formData.get('skillGoals') || '',
            networking: formData.get('networking') || '',
            mentalHealth: parseInt(formData.get('mentalHealth')) || 5,
            notes: formData.get('notes'),
            createdAt: isEditMode ? careerEntries.find(e => e.id === editingEntryId).createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log('Entry data:', entry);

        if (isEditMode) {
            const index = careerEntries.findIndex(e => e.id === editingEntryId);
            if (index !== -1) {
                careerEntries[index] = entry;
                showNotification('Entry updated successfully!', 'success');
                console.log('Entry updated');
            } else {
                console.error('Entry not found for update');
                showNotification('Error updating entry', 'error');
                return;
            }
        } else {
            careerEntries.push(entry);
            showNotification('Entry saved successfully!', 'success');
            console.log('New entry saved');
        }

        await saveToStorage(`entries_${currentUser.id}`, careerEntries);

        isEditMode = false;
        editingEntryId = null;
        selectedSkills = [];

        showDashboard();

        console.log('=== Form submission completed successfully ===');
    } catch (error) {
        console.error('Error handling form submission:', error);
        showNotification('Error saving entry: ' + error.message, 'error');
    }
}

function loadRecentEntries() {
    try {
        const recentEntriesList = document.getElementById('recentEntriesList');
        if (!recentEntriesList) {
            console.warn('Recent entries list element not found');
            return;
        }

        const recent = careerEntries.slice(-3).reverse();

        if (recent.length === 0) {
            recentEntriesList.innerHTML = '<p class="empty-state">No entries yet. Create your first career entry!</p>';
            return;
        }

        recentEntriesList.innerHTML = recent.map(entry => `
            <div class="entry-card">
                <div class="entry-header">
                    <h4>${formatDate(entry.weekDate)}</h4>
                    <div class="entry-actions">
                        <button class="btn btn--sm btn--outline" onclick="showForm('${entry.id}')">Edit</button>
                    </div>
                </div>
                <p><strong>Category:</strong> ${entry.responsibilityCategory}</p>
                <p><strong>Skills:</strong> ${entry.skillsUsed ? entry.skillsUsed.join(', ') : 'None'}</p>
                <p><strong>Difficulty:</strong> ${entry.difficultyRating}/5</p>
            </div>
        `).join('');

        console.log('Recent entries loaded');
    } catch (error) {
        console.error('Error loading recent entries:', error);
    }
}

function loadEntriesList() {
    try {
        const entriesList = document.getElementById('entriesList');
        if (!entriesList) return;

        if (careerEntries.length === 0) {
            entriesList.innerHTML = '<p class="empty-state">No entries yet. Create your first career entry!</p>';
            return;
        }

        const sortedEntries = [...careerEntries].sort((a, b) => new Date(b.weekDate) - new Date(a.weekDate));

        entriesList.innerHTML = sortedEntries.map(entry => `
            <div class="entry-card">
                <div class="entry-header">
                    <h3>${formatDate(entry.weekDate)}</h3>
                    <span class="entry-date">Created: ${formatDate(entry.createdAt)}</span>
                    <div class="entry-actions">
                        <button class="btn btn--sm btn--outline" onclick="showForm('${entry.id}')">Edit</button>
                        <button class="btn btn--sm btn--danger" onclick="deleteEntry('${entry.id}')">Delete</button>
                    </div>
                </div>
                <div class="entry-content">
                    <div class="entry-field">
                        <strong>Category:</strong> ${entry.responsibilityCategory}
                    </div>
                    <div class="entry-field">
                        <strong>Project:</strong> ${entry.projectName || 'N/A'}
                    </div>
                    <div class="entry-field">
                        <strong>Skills:</strong> ${entry.skillsUsed ? entry.skillsUsed.join(', ') : 'None'}
                    </div>
                    <div class="entry-field">
                        <strong>Difficulty:</strong> ${entry.difficultyRating}/5
                    </div>
                    <div class="entry-field">
                        <strong>Mental Health:</strong> ${entry.mentalHealth}/10
                    </div>
                    <div class="entry-field">
                        <strong>Description:</strong> ${entry.responsibilityDescription.substring(0, 100)}${entry.responsibilityDescription.length > 100 ? '...' : ''}
                    </div>
                </div>
            </div>
        `).join('');

        console.log('Entries list loaded');
    } catch (error) {
        console.error('Error loading entries list:', error);
    }
}

async function deleteEntry(entryId) {
    try {
        if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
            return;
        }

        const entryIndex = careerEntries.findIndex(e => e.id === entryId);
        if (entryIndex === -1) {
            showNotification('Entry not found', 'error');
            return;
        }

        careerEntries.splice(entryIndex, 1);
        await saveToStorage(`entries_${currentUser.id}`, careerEntries);

        loadEntriesList();
        showNotification('Entry deleted successfully', 'success');

        console.log('Entry deleted:', entryId);
    } catch (error) {
        console.error('Error deleting entry:', error);
        showNotification('Error deleting entry', 'error');
    }
}

function loadSettings() {
    try {
        const settingsName = document.getElementById('settingsName');
        const settingsEmail = document.getElementById('settingsEmail');
        const perplexityApiKey = document.getElementById('perplexityApiKey');

        if (settingsName && currentUser) settingsName.value = currentUser.name;
        if (settingsEmail && currentUser) settingsEmail.value = currentUser.email;
        if (perplexityApiKey) {
            const savedKey = localStorage.getItem('perplexity_api_key');
            if (savedKey && savedKey !== 'your-perplexity-api-key') {
                perplexityApiKey.value = '••••••••' + savedKey.slice(-4);
            }
        }

        // Load report settings
        const reportSettings = JSON.parse(localStorage.getItem('report_settings') || '{"autoQuarterly": true, "autoSemiAnnual": true}');
        const autoQuarterly = document.getElementById('autoQuarterlyReports');
        const autoSemiAnnual = document.getElementById('autoSemiAnnualReports');

        if (autoQuarterly) autoQuarterly.checked = reportSettings.autoQuarterly;
        if (autoSemiAnnual) autoSemiAnnual.checked = reportSettings.autoSemiAnnual;

        // Load custom categories and skills
        loadCustomCategoriesSettings();
        loadCustomSkillsSettings();

        console.log('Settings loaded');
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function loadCustomCategoriesSettings() {
    const customCategoriesList = document.getElementById('customCategoriesList');
    if (customCategoriesList) {
        customCategoriesList.innerHTML = customCategories.map(category => `
            <div class="custom-item">
                <span>${category}</span>
                <button class="btn btn--sm btn--danger" onclick="removeCustomCategory('${category}')">Remove</button>
            </div>
        `).join('');
    }
}

function loadCustomSkillsSettings() {
    const customSkillsList = document.getElementById('customSkillsList');
    if (customSkillsList) {
        customSkillsList.innerHTML = customSkills.map(skill => `
            <div class="custom-item">
                <span>${skill}</span>
                <button class="btn btn--sm btn--danger" onclick="removeCustomSkill('${skill}')">Remove</button>
            </div>
        `).join('');
    }
}

async function updateProfile() {
    try {
        const name = document.getElementById('settingsName')?.value?.trim();
        if (!name) {
            showNotification('Please enter a valid name', 'error');
            return;
        }

        currentUser.name = name;
        await saveToStorage('currentUser', currentUser);

        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = name;
        }

        showNotification('Profile updated successfully', 'success');
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Error updating profile', 'error');
    }
}

async function exportData() {
    try {
        const data = {
            user: currentUser,
            entries: careerEntries,
            customCategories,
            customSkills,
            aiInsights,
            generatedReports,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document-it-data-${currentUser.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Data exported successfully', 'success');
        console.log('Data exported');
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('Error exporting data: ' + error.message, 'error');
    }
}

// Initialize App
async function initializeApp() {
    console.log('=== Initializing Document.it MVP ===');

    try {
        currentUser = await loadFromStorage('currentUser');
        console.log('Current user from storage:', currentUser ? currentUser.name : 'none');

        if (currentUser) {
            console.log('User found, loading data and showing dashboard');
            await loadUserData();
            showDashboard();
        } else {
            console.log('No user found, showing landing page');
            showPage('landingPage');
        }

        // Initialize form handlers
        const authForm = document.getElementById('authForm');
        const careerForm = document.getElementById('careerForm');
        const searchInput = document.getElementById('searchEntries');

        if (authForm) {
            authForm.addEventListener('submit', handleAuth);
            console.log('Auth form handler attached');
        }

        if (careerForm) {
            careerForm.addEventListener('submit', handleFormSubmit);
            console.log('Career form handler attached');
        }

        if (searchInput) {
            searchInput.addEventListener('input', searchEntries);
            console.log('Search handler attached');
        }

        console.log('=== App initialization completed successfully ===');

    } catch (error) {
        console.error('=== Critical error during app initialization ===', error);
        showNotification('App initialization failed: ' + error.message, 'error');

        try {
            showPage('landingPage');
        } catch (fallbackError) {
            console.error('Even fallback failed:', fallbackError);
            alert('Critical error: Unable to start application. Please refresh the page.');
        }
    }
}

function searchEntries() {
    try {
        const query = document.getElementById('searchEntries')?.value?.toLowerCase();
        if (!query) {
            loadEntriesList();
            return;
        }

        const filteredEntries = careerEntries.filter(entry => 
            entry.responsibilityDescription.toLowerCase().includes(query) ||
            entry.notes.toLowerCase().includes(query) ||
            entry.responsibilityCategory.toLowerCase().includes(query) ||
            (entry.skillsUsed && entry.skillsUsed.some(skill => skill.toLowerCase().includes(query))) ||
            (entry.projectName && entry.projectName.toLowerCase().includes(query))
        );

        const entriesList = document.getElementById('entriesList');
        if (!entriesList) return;

        if (filteredEntries.length === 0) {
            entriesList.innerHTML = '<p class="empty-state">No entries found matching your search.</p>';
        } else {
            entriesList.innerHTML = filteredEntries.map(entry => `
                <div class="entry-card">
                    <div class="entry-header">
                        <h3>${formatDate(entry.weekDate)}</h3>
                        <div class="entry-actions">
                            <button class="btn btn--sm btn--outline" onclick="showForm('${entry.id}')">Edit</button>
                        </div>
                    </div>
                    <div class="entry-content">
                        <div class="entry-field">
                            <strong>Category:</strong> ${entry.responsibilityCategory}
                        </div>
                        <div class="entry-field">
                            <strong>Description:</strong> ${entry.responsibilityDescription.substring(0, 100)}...
                        </div>
                    </div>
                </div>
            `).join('');
        }

        console.log('Search completed:', query, filteredEntries.length, 'results');
    } catch (error) {
        console.error('Error searching entries:', error);
    }
}

// Start the app when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM Content Loaded - Starting Document.it ===');

    try {
        initializeApp();
    } catch (error) {
        console.error('=== Failed to start app ===', error);
        alert('Failed to start Document.it. Please refresh the page and try again.');
    }
});

// Global error handlers
window.addEventListener('error', function(e) {
    console.error('=== Global JavaScript Error ===', e.error);
    showNotification('An unexpected error occurred. Check console for details.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('=== Unhandled Promise Rejection ===', e.reason);
    showNotification('An async error occurred. Check console for details.', 'error');
});

console.log('=== Document.it AI-Powered Career Analytics loaded completely ===');