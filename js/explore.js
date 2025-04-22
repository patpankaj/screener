// Explore page functionality

// Sample screen data
const sampleScreens = [
    {
        id: 1,
        name: "High ROE Companies",
        description: "Companies with high return on equity (ROE > 20%)",
        author: "Screener Team",
        likes: 1245,
        views: 5678,
        createdAt: "2023-10-15",
        isFeatured: true,
        isPopular: true,
        criteria: [
            { id: "roe", min: 20, max: 100 },
            { id: "marketCap", min: 1000, max: 2000000 }
        ]
    },
    {
        id: 2,
        name: "Dividend Champions",
        description: "Companies with high dividend yield (> 3%)",
        author: "Dividend Hunter",
        likes: 987,
        views: 4321,
        createdAt: "2023-11-20",
        isFeatured: false,
        isPopular: true,
        criteria: [
            { id: "dividendYield", min: 3, max: 20 },
            { id: "marketCap", min: 5000, max: 2000000 }
        ]
    },
    {
        id: 3,
        name: "Value Stocks",
        description: "Undervalued companies with low P/E ratio",
        author: "Value Investor",
        likes: 765,
        views: 3456,
        createdAt: "2023-12-05",
        isFeatured: true,
        isPopular: true,
        criteria: [
            { id: "pe", min: 0, max: 15 },
            { id: "roe", min: 15, max: 100 },
            { id: "marketCap", min: 1000, max: 2000000 }
        ]
    },
    {
        id: 4,
        name: "Growth Stocks",
        description: "Companies with high growth potential",
        author: "Growth Seeker",
        likes: 543,
        views: 2345,
        createdAt: "2024-01-10",
        isFeatured: false,
        isPopular: false,
        criteria: [
            { id: "roe", min: 15, max: 100 },
            { id: "roce", min: 15, max: 100 },
            { id: "marketCap", min: 1000, max: 2000000 }
        ]
    },
    {
        id: 5,
        name: "Blue Chip Companies",
        description: "Large, well-established companies",
        author: "Safe Investor",
        likes: 432,
        views: 1987,
        createdAt: "2024-02-15",
        isFeatured: true,
        isPopular: true,
        criteria: [
            { id: "marketCap", min: 50000, max: 2000000 },
            { id: "dividendYield", min: 1, max: 20 }
        ]
    },
    {
        id: 6,
        name: "Banking Sector Leaders",
        description: "Top performing banks with strong financials",
        author: "Banking Expert",
        likes: 321,
        views: 1654,
        createdAt: "2024-03-01",
        isFeatured: false,
        isPopular: false,
        criteria: [
            { id: "sector", value: "Banking" },
            { id: "roe", min: 12, max: 100 }
        ]
    }
];

// Function to initialize explore page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the explore page
    const screensContainer = document.getElementById('screens-container');
    if (!screensContainer) return;
    
    // Initialize the page
    initExplorePage();
});

function initExplorePage() {
    // Get user's saved screens
    const userScreens = currentUser ? currentUser.savedScreens || [] : [];
    
    // Combine sample screens with user screens
    const allScreens = [...sampleScreens];
    
    // Add user screens if logged in
    if (currentUser && userScreens.length > 0) {
        userScreens.forEach(screen => {
            allScreens.push({
                ...screen,
                author: currentUser.name,
                likes: Math.floor(Math.random() * 100),
                views: Math.floor(Math.random() * 500),
                createdAt: new Date().toISOString().split('T')[0],
                isUserScreen: true
            });
        });
    }
    
    // Render screens
    renderScreens(allScreens, 'popular');
    
    // Setup filter tabs
    setupFilterTabs(allScreens);
    
    // Setup search
    setupSearch(allScreens);
}

// Function to render screens
function renderScreens(screens, filter) {
    const screensContainer = document.getElementById('screens-container');
    if (!screensContainer) return;
    
    // Filter screens based on selected filter
    let filteredScreens = screens;
    
    switch (filter) {
        case 'popular':
            filteredScreens = screens.filter(screen => screen.isPopular);
            break;
        case 'recent':
            filteredScreens = [...screens].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'featured':
            filteredScreens = screens.filter(screen => screen.isFeatured);
            break;
        case 'my-screens':
            filteredScreens = screens.filter(screen => screen.isUserScreen);
            if (!currentUser) {
                // Show login prompt if not logged in
                screensContainer.innerHTML = `
                    <div class="login-prompt">
                        <div class="login-prompt-icon">
                            <i class="fas fa-user-lock"></i>
                        </div>
                        <h3>Login to view your screens</h3>
                        <p>Create and save your own screens to access them here</p>
                        <a href="login.html" class="btn btn-primary">Login</a>
                        <a href="register.html" class="btn btn-outline">Register</a>
                    </div>
                `;
                return;
            }
            break;
    }
    
    // If no screens match the filter
    if (filteredScreens.length === 0) {
        screensContainer.innerHTML = `
            <div class="no-screens">
                <div class="no-screens-icon">
                    <i class="fas fa-filter"></i>
                </div>
                <h3>No screens found</h3>
                <p>Try a different filter or create your own screen</p>
                <a href="screen.html" class="btn btn-primary">Create Screen</a>
            </div>
        `;
        return;
    }
    
    // Render screens
    let screensHtml = '';
    
    filteredScreens.forEach(screen => {
        // Format criteria for display
        const criteriaText = screen.criteria.map(c => {
            if (c.id === 'sector') {
                return `Sector: ${c.value}`;
            } else {
                const criteriaInfo = screeningCriteria.find(sc => sc.id === c.id);
                const name = criteriaInfo ? criteriaInfo.name : c.id;
                const unit = criteriaInfo && criteriaInfo.unit ? criteriaInfo.unit : '';
                return `${name}: ${c.min} to ${c.max}${unit}`;
            }
        }).join(', ');
        
        screensHtml += `
            <div class="screen-card" data-id="${screen.id}">
                <div class="screen-card-header">
                    <h3 class="screen-card-title">${screen.name}</h3>
                    <div class="screen-card-meta">
                        <span class="screen-card-author">
                            <i class="fas fa-user"></i> ${screen.author}
                        </span>
                        <span class="screen-card-date">
                            <i class="fas fa-calendar"></i> ${formatDate(screen.createdAt)}
                        </span>
                    </div>
                </div>
                <div class="screen-card-body">
                    <p class="screen-card-description">${screen.description}</p>
                    <div class="screen-card-criteria">
                        <h4>Criteria:</h4>
                        <p>${criteriaText}</p>
                    </div>
                </div>
                <div class="screen-card-footer">
                    <div class="screen-card-stats">
                        <span class="screen-card-likes">
                            <i class="fas fa-heart"></i> ${screen.likes}
                        </span>
                        <span class="screen-card-views">
                            <i class="fas fa-eye"></i> ${screen.views}
                        </span>
                    </div>
                    <div class="screen-card-actions">
                        <a href="screen.html?screen=${screen.id}" class="btn btn-primary btn-sm">
                            <i class="fas fa-play"></i> Run
                        </a>
                        <button class="btn btn-outline btn-sm save-screen-btn" data-id="${screen.id}">
                            <i class="far fa-bookmark"></i> Save
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    screensContainer.innerHTML = screensHtml;
    
    // Add animation to screen cards
    animateScreenCards();
    
    // Setup save button functionality
    setupSaveButtons();
}

// Function to setup filter tabs
function setupFilterTabs(screens) {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get filter value
            const filter = this.dataset.filter;
            
            // Render screens with selected filter
            renderScreens(screens, filter);
        });
    });
}

// Function to setup search
function setupSearch(screens) {
    const searchInput = document.querySelector('.filter-search input');
    const searchButton = document.querySelector('.filter-search button');
    
    if (searchInput && searchButton) {
        // Search on button click
        searchButton.addEventListener('click', function() {
            searchScreens(searchInput.value, screens);
        });
        
        // Search on enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchScreens(this.value, screens);
            }
        });
    }
}

// Function to search screens
function searchScreens(query, screens) {
    if (!query.trim()) return;
    
    const screensContainer = document.getElementById('screens-container');
    if (!screensContainer) return;
    
    // Filter screens based on search query
    const filteredScreens = screens.filter(screen => 
        screen.name.toLowerCase().includes(query.toLowerCase()) ||
        screen.description.toLowerCase().includes(query.toLowerCase()) ||
        screen.author.toLowerCase().includes(query.toLowerCase())
    );
    
    // Update active tab
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => tab.classList.remove('active'));
    
    // Render search results
    if (filteredScreens.length === 0) {
        screensContainer.innerHTML = `
            <div class="no-screens">
                <div class="no-screens-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No screens found</h3>
                <p>No screens match your search query "${query}"</p>
                <a href="screen.html" class="btn btn-primary">Create Screen</a>
            </div>
        `;
    } else {
        // Render screens
        let screensHtml = `
            <div class="search-results-header">
                <h3>Search results for "${query}"</h3>
                <p>${filteredScreens.length} screens found</p>
            </div>
        `;
        
        filteredScreens.forEach(screen => {
            // Format criteria for display
            const criteriaText = screen.criteria.map(c => {
                if (c.id === 'sector') {
                    return `Sector: ${c.value}`;
                } else {
                    const criteriaInfo = screeningCriteria.find(sc => sc.id === c.id);
                    const name = criteriaInfo ? criteriaInfo.name : c.id;
                    const unit = criteriaInfo && criteriaInfo.unit ? criteriaInfo.unit : '';
                    return `${name}: ${c.min} to ${c.max}${unit}`;
                }
            }).join(', ');
            
            screensHtml += `
                <div class="screen-card" data-id="${screen.id}">
                    <div class="screen-card-header">
                        <h3 class="screen-card-title">${screen.name}</h3>
                        <div class="screen-card-meta">
                            <span class="screen-card-author">
                                <i class="fas fa-user"></i> ${screen.author}
                            </span>
                            <span class="screen-card-date">
                                <i class="fas fa-calendar"></i> ${formatDate(screen.createdAt)}
                            </span>
                        </div>
                    </div>
                    <div class="screen-card-body">
                        <p class="screen-card-description">${screen.description}</p>
                        <div class="screen-card-criteria">
                            <h4>Criteria:</h4>
                            <p>${criteriaText}</p>
                        </div>
                    </div>
                    <div class="screen-card-footer">
                        <div class="screen-card-stats">
                            <span class="screen-card-likes">
                                <i class="fas fa-heart"></i> ${screen.likes}
                            </span>
                            <span class="screen-card-views">
                                <i class="fas fa-eye"></i> ${screen.views}
                            </span>
                        </div>
                        <div class="screen-card-actions">
                            <a href="screen.html?screen=${screen.id}" class="btn btn-primary btn-sm">
                                <i class="fas fa-play"></i> Run
                            </a>
                            <button class="btn btn-outline btn-sm save-screen-btn" data-id="${screen.id}">
                                <i class="far fa-bookmark"></i> Save
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        screensContainer.innerHTML = screensHtml;
        
        // Add animation to screen cards
        animateScreenCards();
        
        // Setup save button functionality
        setupSaveButtons();
    }
}

// Function to setup save buttons
function setupSaveButtons() {
    const saveButtons = document.querySelectorAll('.save-screen-btn');
    
    saveButtons.forEach(button => {
        const screenId = parseInt(button.dataset.id);
        
        // Check if screen is already saved
        if (currentUser && currentUser.savedScreens && currentUser.savedScreens.some(s => s.id === screenId)) {
            button.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
            button.classList.add('saved');
        }
        
        button.addEventListener('click', function() {
            if (!currentUser) {
                // Redirect to login if not logged in
                window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
                return;
            }
            
            // Toggle saved state
            if (this.classList.contains('saved')) {
                // Remove from saved screens
                currentUser.savedScreens = currentUser.savedScreens.filter(s => s.id !== screenId);
                this.innerHTML = '<i class="far fa-bookmark"></i> Save';
                this.classList.remove('saved');
                showToast('Screen removed from saved screens');
            } else {
                // Add to saved screens
                if (!currentUser.savedScreens) {
                    currentUser.savedScreens = [];
                }
                
                // Find the screen
                const screen = sampleScreens.find(s => s.id === screenId);
                
                if (screen) {
                    currentUser.savedScreens.push({
                        id: screen.id,
                        name: screen.name,
                        criteria: screen.criteria
                    });
                    
                    this.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
                    this.classList.add('saved');
                    showToast('Screen saved successfully');
                }
            }
            
            // Save user data
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        });
    });
}

// Function to animate screen cards
function animateScreenCards() {
    const screenCards = document.querySelectorAll('.screen-card');
    
    screenCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Function to show toast message
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
        
        // Add toast styles
        const style = document.createElement('style');
        style.textContent = `
            #toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--primary-color);
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            #toast.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set toast message
    toast.textContent = message;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
