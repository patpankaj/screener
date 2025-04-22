// Import data
let companies = [];
let screeningCriteria = [];
let currentUser = null;

// Load data when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    // Show loading state
    showLoading();

    try {
        // Load companies data
        if (typeof window.companies === 'undefined') {
            const companiesData = await loadCompanies();
            if (companiesData && companiesData.length > 0) {
                companies = companiesData;
                console.log('Successfully loaded companies data');
            } else {
                throw new Error('No companies data available');
            }
        } else {
            companies = window.companies;
            console.log('Using preloaded companies data');
        }

        // Load screening criteria
        if (typeof window.screeningCriteria === 'undefined') {
            const criteriaData = await loadScreeningCriteria();
            if (criteriaData && criteriaData.length > 0) {
                screeningCriteria = criteriaData;
                console.log('Successfully loaded screening criteria');
            } else {
                throw new Error('No screening criteria available');
            }
        } else {
            screeningCriteria = window.screeningCriteria;
            console.log('Using preloaded screening criteria');
        }

        // Check if user is logged in
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                currentUser = JSON.parse(storedUser);
                updateUIForLoggedInUser();
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('currentUser');
            }
        }

        // Initialize page-specific functionality
        initPageSpecificFunctionality();

        // Hide loading state
        hideLoading();
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Error loading data. Please refresh the page.');
        hideLoading();
    }

    // Theme switcher functionality
    const themeOptions = document.querySelectorAll('.theme-option');
    const storedTheme = localStorage.getItem('theme') || 'light';

    // Set initial theme
    setTheme(storedTheme);

    // Mark active theme option
    themeOptions.forEach(option => {
        if (option.dataset.theme === storedTheme) {
            option.classList.add('active');
        }

        option.addEventListener('click', function(e) {
            e.preventDefault();
            const theme = this.dataset.theme;

            // Remove active class from all options
            themeOptions.forEach(opt => opt.classList.remove('active'));

            // Add active class to clicked option
            this.classList.add('active');

            // Set theme
            setTheme(theme);

            // Store theme preference
            localStorage.setItem('theme', theme);
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            performSearch();
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Add autocomplete functionality
        if (searchInput) {
            setupAutocomplete(searchInput);
        }
    }

    // Dropdown menu for mobile
    const dropdownToggle = document.querySelector('.dropdown-toggle');

    if (dropdownToggle && window.innerWidth < 768) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = this.nextElementSibling;
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });
    }
});

// Function to load companies data
async function loadCompanies() {
    try {
        // Try to load from data file
        const response = await fetch('data/companies.js');
        if (!response.ok) {
            throw new Error('Failed to load companies data');
        }
        
        // Get the text content
        const text = await response.text();
        
        // Create a script element to load the data
        const script = document.createElement('script');
        script.textContent = text;
        document.head.appendChild(script);
        
        // Return the loaded data
        return window.companies || [];
    } catch (error) {
        console.error('Error loading companies:', error);
        return [];
    }
}

// Function to load screening criteria
async function loadScreeningCriteria() {
    try {
        // Try to load from data file
        const response = await fetch('data/screeningCriteria.js');
        if (!response.ok) {
            throw new Error('Failed to load screening criteria');
        }
        
        // Get the text content
        const text = await response.text();
        
        // Create a script element to load the data
        const script = document.createElement('script');
        script.textContent = text;
        document.head.appendChild(script);
        
        // Return the loaded data
        return window.screeningCriteria || [];
    } catch (error) {
        console.error('Error loading screening criteria:', error);
        return [];
    }
}

// Function to set theme
function setTheme(theme) {
    const body = document.body;

    // Remove all theme classes
    body.classList.remove('theme-light', 'theme-dark');

    if (theme === 'auto') {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('theme-dark');
        } else {
            body.classList.add('theme-light');
        }
    } else {
        // Apply selected theme
        body.classList.add(`theme-${theme}`);
    }
}

// Function to handle search
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();

    if (query) {
        // Show loading indicator
        const searchButton = document.querySelector('.search-button');
        if (searchButton) {
            const originalContent = searchButton.innerHTML;
            searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            // Restore after search completes
            setTimeout(() => {
                searchButton.innerHTML = originalContent;
            }, 1000);
        }

        // Search for company - improved to handle partial matches better
        const matchingCompanies = companies.filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.id.toLowerCase().includes(query.toLowerCase()) ||
            (c.sector && c.sector.toLowerCase().includes(query.toLowerCase()))
        );

        // Direct match on ID (exact match)
        const exactMatch = companies.find(c =>
            c.id.toLowerCase() === query.toLowerCase()
        );

        // Handle HDFC specifically (for demo purposes)
        const isHDFCQuery = query.toLowerCase().includes('hdfc');

        if (exactMatch) {
            // Redirect to company page for exact match
            window.location.href = `company.html?id=${exactMatch.id}`;
        } else if (isHDFCQuery) {
            // Special handling for HDFC queries
            const hdfcCompanies = companies.filter(c =>
                c.id.toLowerCase().includes('hdfc') ||
                c.name.toLowerCase().includes('hdfc')
            );

            if (hdfcCompanies.length === 1) {
                // If only one HDFC company, go directly to it
                window.location.href = `company.html?id=${hdfcCompanies[0].id}`;
            } else {
                // Otherwise show search results
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        } else if (matchingCompanies.length === 1) {
            // If only one match, go directly to it
            window.location.href = `company.html?id=${matchingCompanies[0].id}`;
        } else {
            // Redirect to search results for multiple matches or no matches
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }
}

// Function to setup autocomplete
function setupAutocomplete(inputElement) {
    // Create autocomplete container
    const autocompleteContainer = document.createElement('div');
    autocompleteContainer.className = 'autocomplete-container';
    autocompleteContainer.style.display = 'none';
    inputElement.parentNode.appendChild(autocompleteContainer);

    // Add event listeners
    inputElement.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        if (query.length < 2) {
            autocompleteContainer.style.display = 'none';
            return;
        }

        // Filter companies
        const matches = companies.filter(company =>
            company.name.toLowerCase().includes(query) ||
            company.id.toLowerCase().includes(query)
        ).slice(0, 5); // Limit to 5 results

        if (matches.length > 0) {
            // Show autocomplete
            autocompleteContainer.innerHTML = '';
            matches.forEach(company => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.innerHTML = `
                    <div class="company-name">${company.name}</div>
                    <div class="company-meta">${company.sector} | ${company.id}</div>
                `;
                item.addEventListener('click', function() {
                    window.location.href = `company.html?id=${company.id}`;
                });
                autocompleteContainer.appendChild(item);
            });
            autocompleteContainer.style.display = 'block';
        } else {
            autocompleteContainer.style.display = 'none';
        }
    });

    // Hide autocomplete when clicking outside
    document.addEventListener('click', function(e) {
        if (!autocompleteContainer.contains(e.target) && e.target !== inputElement) {
            autocompleteContainer.style.display = 'none';
        }
    });
}

// Function to initialize page-specific functionality
function initPageSpecificFunctionality() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();

    // Company page
    if (path.includes('company.html') || filename === 'company.html') {
        initCompanyPage();
    }

    // Screener page
    else if (path.includes('screen.html') || filename === 'screen.html') {
        initScreenerPage();
    }

    // Login page
    else if (path.includes('login.html') || filename === 'login.html') {
        initLoginPage();
    }

    // Register page
    else if (path.includes('register.html') || filename === 'register.html') {
        initRegisterPage();
    }

    // Dashboard page
    else if (path.includes('dashboard.html') || filename === 'dashboard.html') {
        initDashboardPage();
    }

    // Search results page
    else if (path.includes('search.html') || filename === 'search.html') {
        initSearchPage();
    }

    // Explore page
    else if (path.includes('explore.html') || filename === 'explore.html') {
        // This will be handled by explore.js
    }

    // Watchlist page
    else if (path.includes('watchlist.html') || filename === 'watchlist.html') {
        // This will be handled by watchlist.js
    }

    // Comparison page
    else if (path.includes('comparison.html') || filename === 'comparison.html') {
        // This will be handled by compare.js
    }

    // Add active class to current nav link
    highlightCurrentNavLink(filename);
}

// Function to highlight current nav link
function highlightCurrentNavLink(filename) {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.classList.remove('active');

        const href = link.getAttribute('href');
        if (href === filename ||
            (filename === '' && href === 'index.html') ||
            (filename === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Function to update UI for logged in user
function updateUIForLoggedInUser() {
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const userMenuContainer = document.querySelector('.user-menu-container');

    if (loginBtn && registerBtn && userMenuContainer) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';

        // Create user menu
        userMenuContainer.innerHTML = `
            <div class="user-menu">
                <div class="user-menu-toggle">
                    <span>${currentUser.name}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="user-menu-dropdown">
                    <a href="dashboard.html">Dashboard</a>
                    <a href="watchlist.html">Watchlist</a>
                    <a href="settings.html">Settings</a>
                    <a href="#" id="logout-btn">Logout</a>
                </div>
            </div>
        `;

        // Add logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }

        // Toggle user menu
        const userMenuToggle = document.querySelector('.user-menu-toggle');
        const userMenuDropdown = document.querySelector('.user-menu-dropdown');

        if (userMenuToggle && userMenuDropdown) {
            userMenuToggle.addEventListener('click', function() {
                userMenuDropdown.style.display = userMenuDropdown.style.display === 'block' ? 'none' : 'block';
            });

            // Hide menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!userMenuToggle.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                    userMenuDropdown.style.display = 'none';
                }
            });
        }
    }
}

// Function to logout
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = 'index.html';
}

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to format numbers
function formatNumber(number, decimals = 0) {
    if (number === null || number === undefined) return '-';
    return number.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Function to format currency
function formatCurrency(number, decimals = 0) {
    if (number === null || number === undefined) return '-';
    return '₹ ' + formatNumber(number, decimals);
}

// Function to format percentage
function formatPercentage(number, decimals = 2) {
    if (number === null || number === undefined) return '-';
    return formatNumber(number, decimals) + '%';
}

// Function to show toast message
function showToast(message, type = 'info') {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);

        // Add toast styles if not already added
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                #toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    border-radius: 4px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    z-index: 9999;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    font-size: 14px;
                    max-width: 300px;
                }

                #toast.show {
                    opacity: 1;
                    transform: translateY(0);
                }

                #toast.info {
                    background-color: var(--primary-color);
                    color: white;
                }

                #toast.success {
                    background-color: #34A853;
                    color: white;
                }

                #toast.warning {
                    background-color: #FBBC05;
                    color: #333;
                }

                #toast.error {
                    background-color: #EA4335;
                    color: white;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Set toast message and type
    toast.textContent = message;
    toast.className = type;

    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Helper function to show loading state
function showLoading() {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading-overlay';
    loadingElement.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(loadingElement);
}

// Helper function to hide loading state
function hideLoading() {
    const loadingElement = document.getElementById('loading-overlay');
    if (loadingElement) {
        loadingElement.remove();
    }
}

// Helper function to show error message
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'alert alert-danger';
    errorElement.textContent = message;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(errorElement, container.firstChild);
}
