// CareerTrack MVP - Fixed Version
// This version fixes the blank screen issue after signup

console.log('CareerTrack MVP JavaScript loaded successfully');

// Application State
let currentUser = null;
let careerEntries = [];
let customCategories = [];
let customSkills = [];
let selectedSkills = [];
let isEditMode = false;
let editingEntryId = null;

// Default Data
const defaultSkills = [
    "JavaScript", "Python", "Java", "Project Management", "Data Analysis", "Communication", 
    "Problem Solving", "Leadership", "Design", "Marketing", "Sales", "Customer Service",
    "Strategic Planning", "Budget Management", "Quality Control", "Research", "Public Speaking"
];

const defaultCategories = [
    "Product Development", "Project Management", "Problem Solving", "Collaboration", 
    "Research", "Leadership", "Operations", "Sales & Marketing", "Customer Service", "Quality Assurance"
];

const achievementBadges = [
    {name: "First Entry", description: "Completed your first weekly entry", icon: "🌟"},
    {name: "Week Streak", description: "5 consecutive weekly entries", icon: "🔥"},
    {name: "Month Master", description: "4 weeks of consistent tracking", icon: "📅"},
    {name: "Skill Explorer", description: "Used 10+ different skills", icon: "🎯"},
    {name: "Category Creator", description: "Added 3+ custom categories", icon: "📂"},
    {name: "Data Expert", description: "Exported your career data", icon: "📊"}
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
            // Fallback to alert if notification elements don't exist
            alert(`${type.toUpperCase()}: ${message}`);
        }
    } catch (error) {
        console.error('Error showing notification:', error);
        alert(`${type.toUpperCase()}: ${message}`);
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

// Local Storage Functions with error handling
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`Successfully saved to storage: ${key}`);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showNotification('Error saving data. Please check browser storage settings.', 'error');
        return false;
    }
}

function loadFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        const result = data ? JSON.parse(data) : defaultValue;
        console.log(`Loaded from storage: ${key}`, result ? 'data found' : 'using default');
        return result;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

function clearStorage() {
    try {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('careerEntries');
        localStorage.removeItem('customCategories');
        localStorage.removeItem('customSkills');
        console.log('Storage cleared successfully');
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
}

// Authentication Functions
function showSignup() {
    console.log('Showing signup modal');
    try {
        const modal = document.getElementById('authModal');
        const title = document.getElementById('authTitle');
        const buttonText = document.getElementById('authButtonText');
        const switchText = document.getElementById('authSwitchText');
        const signupFields = document.getElementById('signupFields');

        if (title) title.textContent = 'Sign Up';
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
        if (switchText) switchText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthMode()">Sign Up</a>';
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
        if (title && title.textContent === 'Sign Up') {
            showLogin();
        } else {
            showSignup();
        }
    } catch (error) {
        console.error('Error toggling auth mode:', error);
    }
}

function handleAuth(event) {
    event.preventDefault();
    console.log('=== Starting authentication process ===');

    try {
        const email = document.getElementById('authEmail')?.value?.trim();
        const password = document.getElementById('authPassword')?.value;
        const name = document.getElementById('authName')?.value?.trim();
        const title = document.getElementById('authTitle');
        const isSignup = title && title.textContent === 'Sign Up';

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

        if (isSignup) {
            const confirmPassword = document.getElementById('authConfirmPassword')?.value;
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }

            // Create new user
            currentUser = {
                id: generateId(),
                email: email,
                name: name || email.split('@')[0],
                createdAt: new Date().toISOString()
            };

            console.log('Creating new user:', currentUser);

            if (saveToStorage('currentUser', currentUser)) {
                showNotification('Account created successfully!', 'success');
                console.log('User saved to storage successfully');
            } else {
                showNotification('Error creating account', 'error');
                return;
            }
        } else {
            // Login existing user
            const existingUser = loadFromStorage('currentUser');
            if (!existingUser || existingUser.email !== email) {
                showNotification('Invalid credentials or no account found', 'error');
                return;
            }

            currentUser = existingUser;
            showNotification('Welcome back!', 'success');
            console.log('User logged in successfully:', currentUser);
        }

        hideAuth();

        // Navigate to dashboard with proper error handling
        console.log('=== Starting navigation to dashboard ===');
        setTimeout(() => {
            try {
                loadUserData();
                showDashboard();
                console.log('=== Navigation completed successfully ===');
            } catch (navError) {
                console.error('Navigation error:', navError);
                showNotification('Error loading dashboard. Please refresh the page.', 'error');
            }
        }, 1000);

    } catch (error) {
        console.error('Authentication error:', error);
        showNotification('Authentication failed: ' + error.message, 'error');
    }
}

function logout() {
    console.log('Logging out user');
    try {
        currentUser = null;
        careerEntries = [];
        customCategories = [];
        customSkills = [];
        selectedSkills = [];

        showPage('landingPage');
        showNotification('Logged out successfully', 'success');
    } catch (error) {
        console.error('Error during logout:', error);
        showNotification('Error during logout', 'error');
    }
}

// Navigation Functions with enhanced error handling
function showPage(pageId) {
    console.log(`=== Navigating to page: ${pageId} ===`);

    try {
        // Hide all pages
        const allPages = document.querySelectorAll('.page');
        console.log(`Found ${allPages.length} page elements`);

        allPages.forEach((page, index) => {
            page.classList.add('hidden');
            page.classList.remove('active');
            console.log(`Hidden page ${index}: ${page.id}`);
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            targetPage.classList.add('active');
            console.log(`Successfully showed page: ${pageId}`);
            return true;
        } else {
            console.error(`Page not found: ${pageId}`);
            showNotification('Navigation error - page not found', 'error');

            // Fallback to landing page
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
                if (formTitle) formTitle.textContent = 'Edit Weekly Entry';
            } else {
                isEditMode = false;
                editingEntryId = null;
                resetForm();
                const formTitle = document.getElementById('formTitle');
                if (formTitle) formTitle.textContent = 'New Weekly Entry';
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

// Data Loading Functions
function loadUserData() {
    if (!currentUser) {
        console.error('No current user when loading data');
        throw new Error('No current user');
    }

    console.log('Loading data for user:', currentUser.id);

    try {
        careerEntries = loadFromStorage(`entries_${currentUser.id}`, []);
        customCategories = loadFromStorage(`categories_${currentUser.id}`, []);
        customSkills = loadFromStorage(`skills_${currentUser.id}`, []);

        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = currentUser.name;
        }

        // Initialize form dropdowns if form exists
        initializeFormDropdowns();

        console.log('User data loaded successfully:', {
            entries: careerEntries.length,
            categories: customCategories.length,
            skills: customSkills.length
        });
    } catch (error) {
        console.error('Error loading user data:', error);
        throw error;
    }
}

function initializeFormDropdowns() {
    try {
        // Categories dropdown
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

        // Initialize skills dropdown if it exists
        initializeSkillsDropdown();
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

// Dashboard Functions
function loadDashboardData() {
    console.log('Loading dashboard data...');

    try {
        const totalEntries = careerEntries.length;
        const currentStreak = calculateStreak();
        const badgeCount = calculateEarnedBadges().length;
        const avgRating = calculateAverageRating();

        // Update dashboard stats with error handling
        const stats = {
            'totalEntries': totalEntries,
            'currentStreak': currentStreak,
            'badgeCount': badgeCount,
            'avgRating': avgRating.toFixed(1)
        };

        Object.entries(stats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            } else {
                console.warn(`Dashboard stat element not found: ${id}`);
            }
        });

        loadRecentEntries();
        loadAchievementBadges();

        console.log('Dashboard data loaded successfully:', stats);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading dashboard data', 'error');
    }
}

function calculateStreak() {
    try {
        if (careerEntries.length === 0) return 0;

        const sortedEntries = [...careerEntries].sort((a, b) => new Date(b.weekDate) - new Date(a.weekDate));
        let streak = 0;
        let currentWeekStart = getCurrentWeekStart();

        for (const entry of sortedEntries) {
            if (entry.weekDate === currentWeekStart) {
                streak++;
                const prevWeek = new Date(currentWeekStart);
                prevWeek.setDate(prevWeek.getDate() - 7);
                currentWeekStart = prevWeek.toISOString().split('T')[0];
            } else {
                break;
            }
        }

        return streak;
    } catch (error) {
        console.error('Error calculating streak:', error);
        return 0;
    }
}

function calculateEarnedBadges() {
    try {
        const earned = [];

        if (careerEntries.length >= 1) earned.push(achievementBadges[0]);
        if (calculateStreak() >= 5) earned.push(achievementBadges[1]);
        if (careerEntries.length >= 4) earned.push(achievementBadges[2]);

        const uniqueSkills = new Set();
        careerEntries.forEach(entry => {
            if (entry.skillsUsed) {
                entry.skillsUsed.forEach(skill => uniqueSkills.add(skill));
            }
        });
        if (uniqueSkills.size >= 10) earned.push(achievementBadges[3]);

        if (customCategories.length >= 3) earned.push(achievementBadges[4]);
        if (careerEntries.length >= 1) earned.push(achievementBadges[5]);

        return earned;
    } catch (error) {
        console.error('Error calculating badges:', error);
        return [];
    }
}

function calculateAverageRating() {
    try {
        if (careerEntries.length === 0) return 0;

        const total = careerEntries.reduce((sum, entry) => sum + (entry.difficultyRating || 0), 0);
        return total / careerEntries.length;
    } catch (error) {
        console.error('Error calculating average rating:', error);
        return 0;
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
            recentEntriesList.innerHTML = '<p class="empty-state">No entries yet. Create your first weekly entry!</p>';
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

function loadAchievementBadges() {
    try {
        const badgesList = document.getElementById('badgesList');
        if (!badgesList) {
            console.warn('Badges list element not found');
            return;
        }

        const earnedBadges = calculateEarnedBadges();

        badgesList.innerHTML = achievementBadges.map(badge => {
            const isEarned = earnedBadges.some(earned => earned.name === badge.name);
            return `
                <div class="badge ${isEarned ? 'earned' : ''}">
                    <div class="badge-icon">${badge.icon}</div>
                    <h4>${badge.name}</h4>
                    <p>${badge.description}</p>
                </div>
            `;
        }).join('');

        console.log('Achievement badges loaded');
    } catch (error) {
        console.error('Error loading achievement badges:', error);
    }
}

// Form Functions
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

// Simplified form functions for basic functionality
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
    } catch (error) {
        console.error('Error updating selected skills:', error);
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

// Skills Management
function addSkill(skill) {
    try {
        if (!selectedSkills.includes(skill)) {
            selectedSkills.push(skill);
            updateSelectedSkills();
            const skillSearch = document.getElementById('skillSearch');
            if (skillSearch) skillSearch.value = '';
            initializeSkillsDropdown();
            updateFormProgress();
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
    } catch (error) {
        console.error('Error removing skill:', error);
    }
}

// Form Submission
function handleFormSubmit(event) {
    event.preventDefault();
    console.log('Handling form submission...');

    try {
        if (selectedSkills.length === 0) {
            showNotification('Please select at least one skill', 'error');
            return;
        }

        const formData = new FormData(document.getElementById('careerForm'));
        const entry = {
            id: isEditMode ? editingEntryId : generateId(),
            weekDate: formData.get('weekDate'),
            projectName: formData.get('projectName'),
            responsibilityCategory: formData.get('responsibilityCategory'),
            responsibilityDescription: formData.get('responsibilityDescription'),
            difficultyRating: parseInt(formData.get('difficultyRating')) || 0,
            impactAssessment: formData.get('impactAssessment'),
            leadership: formData.get('leadership'),
            skillsUsed: [...selectedSkills],
            proficiencyLevel: formData.get('proficiencyLevel'),
            usageIntensity: parseInt(formData.get('usageIntensity')) || 0,
            skillGoals: formData.get('skillGoals'),
            networking: formData.get('networking'),
            mentalHealth: parseInt(formData.get('mentalHealth')) || 5,
            notes: formData.get('notes'),
            createdAt: isEditMode ? careerEntries.find(e => e.id === editingEntryId).createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (isEditMode) {
            const index = careerEntries.findIndex(e => e.id === editingEntryId);
            careerEntries[index] = entry;
            showNotification('Entry updated successfully!', 'success');
        } else {
            careerEntries.push(entry);
            showNotification('Entry saved successfully!', 'success');
        }

        saveToStorage(`entries_${currentUser.id}`, careerEntries);
        showDashboard();

        console.log('Form submitted successfully');
    } catch (error) {
        console.error('Error handling form submission:', error);
        showNotification('Error saving entry: ' + error.message, 'error');
    }
}

// Simplified versions of other functions
function loadEntriesList() {
    try {
        const entriesList = document.getElementById('entriesList');
        if (!entriesList) return;

        if (careerEntries.length === 0) {
            entriesList.innerHTML = '<p class="empty-state">No entries yet. Create your first weekly entry!</p>';
            return;
        }

        const sortedEntries = [...careerEntries].sort((a, b) => new Date(b.weekDate) - new Date(a.weekDate));

        entriesList.innerHTML = sortedEntries.map(entry => `
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

        console.log('Entries list loaded');
    } catch (error) {
        console.error('Error loading entries list:', error);
    }
}

function loadAnalytics() {
    try {
        const analyticsGrid = document.querySelector('.analytics-grid');
        if (!analyticsGrid) return;

        if (careerEntries.length === 0) {
            analyticsGrid.innerHTML = '<p class="empty-state">No data to analyze yet. Create some entries first!</p>';
        } else {
            analyticsGrid.innerHTML = `
                <div class="chart-container">
                    <h3>Your Progress</h3>
                    <p>You have ${careerEntries.length} entries tracked!</p>
                    <p>Analytics and charts will be enhanced in future updates.</p>
                </div>
            `;
        }

        console.log('Analytics loaded');
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function loadSettings() {
    try {
        const settingsName = document.getElementById('settingsName');
        const settingsEmail = document.getElementById('settingsEmail');

        if (settingsName && currentUser) settingsName.value = currentUser.name;
        if (settingsEmail && currentUser) settingsEmail.value = currentUser.email;

        console.log('Settings loaded');
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function exportData() {
    try {
        const data = {
            user: currentUser,
            entries: careerEntries,
            customCategories,
            customSkills
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `career-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Data exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('Error exporting data: ' + error.message, 'error');
    }
}

// Initialize App
function initializeApp() {
    console.log('=== Initializing CareerTrack MVP ===');

    try {
        // Check if user is logged in
        currentUser = loadFromStorage('currentUser');
        console.log('Current user from storage:', currentUser ? currentUser.name : 'none');

        if (currentUser) {
            console.log('User found, loading data and showing dashboard');
            loadUserData();
            showDashboard();
        } else {
            console.log('No user found, showing landing page');
            showPage('landingPage');
        }

        // Initialize form handlers with enhanced error handling
        const authForm = document.getElementById('authForm');
        const careerForm = document.getElementById('careerForm');

        if (authForm) {
            authForm.addEventListener('submit', handleAuth);
            console.log('Auth form handler attached');
        } else {
            console.warn('Auth form not found - this is normal on some pages');
        }

        if (careerForm) {
            careerForm.addEventListener('submit', handleFormSubmit);
            console.log('Career form handler attached');
        } else {
            console.warn('Career form not found - this is normal on some pages');
        }

        console.log('=== App initialization completed successfully ===');

    } catch (error) {
        console.error('=== Critical error during app initialization ===', error);
        showNotification('App initialization failed: ' + error.message, 'error');

        // Fallback: try to show landing page
        try {
            showPage('landingPage');
        } catch (fallbackError) {
            console.error('Even fallback failed:', fallbackError);
            alert('Critical error: Unable to start application. Please refresh the page.');
        }
    }
}

// Start the app when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM Content Loaded - Starting App ===');

    try {
        initializeApp();
    } catch (error) {
        console.error('=== Failed to start app ===', error);
        alert('Failed to start CareerTrack. Please refresh the page and try again.');
    }
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('=== Global JavaScript Error ===', e.error);
    showNotification('An unexpected error occurred. Check console for details.', 'error');
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('=== Unhandled Promise Rejection ===', e.reason);
    showNotification('An async error occurred. Check console for details.', 'error');
});

console.log('=== CareerTrack MVP JavaScript file loaded completely ===');