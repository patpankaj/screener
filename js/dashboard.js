// Dashboard functionality

// Function to initialize dashboard page
function initDashboardPage() {
    // Check if user is logged in
    if (!currentUser) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    // Render dashboard
    renderDashboardHeader();
    renderWatchlist();
    renderSavedScreens();

    // Check if we need to show a message
    const message = getUrlParameter('message');
    if (message) {
        showMessage(decodeURIComponent(message));
    }
}

// Function to render dashboard header
function renderDashboardHeader() {
    const headerContainer = document.getElementById('dashboard-header');
    if (!headerContainer) return;

    headerContainer.innerHTML = `
        <div class="dashboard-title">
            <h1>Welcome, ${currentUser.name}</h1>
        </div>
        <div class="dashboard-actions">
            ${!currentUser.isPremium ?
                `<a href="premium.html" class="btn btn-secondary">
                    <i class="fas fa-crown"></i> Upgrade to Premium
                </a>` :
                `<span class="premium-badge">
                    <i class="fas fa-crown"></i> Premium Member
                </span>`
            }
        </div>
    `;
}

// Function to render watchlist
function renderWatchlist() {
    const watchlistContainer = document.getElementById('watchlist-container');
    if (!watchlistContainer) return;

    // Check if watchlist is empty
    if (!currentUser.watchlist || currentUser.watchlist.length === 0) {
        watchlistContainer.innerHTML = `
            <div class="alert alert-info">
                Your watchlist is empty. Add companies to your watchlist to track them here.
            </div>
        `;
        return;
    }

    // Get watchlist companies
    const watchlistCompanies = companies.filter(company =>
        currentUser.watchlist.includes(company.id)
    );

    // Create watchlist table
    let tableHtml = `
        <div class="table-responsive">
            <table class="watchlist-table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Price (₹)</th>
                        <th>Market Cap (Cr)</th>
                        <th>P/E</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // Add rows
    watchlistCompanies.forEach(company => {
        tableHtml += `
            <tr>
                <td>
                    <a href="company.html?id=${company.id}">${company.name}</a>
                    <div class="sector-cell">${company.sector}</div>
                </td>
                <td>${formatNumber(company.currentPrice)}</td>
                <td>${formatNumber(company.marketCap)}</td>
                <td>${formatNumber(company.pe, 1)}</td>
                <td>
                    <div class="watchlist-actions">
                        <button class="btn btn-sm btn-outline remove-watchlist-btn" data-id="${company.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tableHtml += `
                </tbody>
            </table>
        </div>
    `;

    watchlistContainer.innerHTML = tableHtml;

    // Add remove functionality
    setupWatchlistRemove();
}

// Function to setup watchlist remove
function setupWatchlistRemove() {
    const removeButtons = document.querySelectorAll('.remove-watchlist-btn');

    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const companyId = this.dataset.id;

            // Remove from watchlist
            const index = currentUser.watchlist.indexOf(companyId);
            if (index !== -1) {
                currentUser.watchlist.splice(index, 1);

                // Save user data
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                // Re-render watchlist
                renderWatchlist();

                // Show message
                showMessage(`Removed ${companyId} from watchlist`);
            }
        });
    });
}

// Function to render saved screens
function renderSavedScreens() {
    const screensContainer = document.getElementById('saved-screens-container');
    if (!screensContainer) return;

    // Check if saved screens is empty
    if (!currentUser.savedScreens || currentUser.savedScreens.length === 0) {
        screensContainer.innerHTML = `
            <div class="alert alert-info">
                You don't have any saved screens. Create and save screens to access them here.
            </div>
        `;
        return;
    }

    // Create saved screens list
    let screensHtml = `<div class="saved-screens-list">`;

    // Add screen cards
    currentUser.savedScreens.forEach(screen => {
        screensHtml += `
            <div class="screen-card">
                <div class="screen-card-header">
                    <h3 class="screen-card-title">${screen.name}</h3>
                </div>
                <div class="screen-card-body">
                    <div class="screen-criteria-list">
        `;

        // Add criteria
        screen.criteria.forEach(criteria => {
            if (criteria.id === 'sector') {
                screensHtml += `
                    <div class="screen-criteria-item">
                        <span class="screen-criteria-label">Sector:</span>
                        <span>${criteria.value}</span>
                    </div>
                `;
            } else {
                const criteriaInfo = screeningCriteria.find(c => c.id === criteria.id);
                screensHtml += `
                    <div class="screen-criteria-item">
                        <span class="screen-criteria-label">${criteriaInfo ? criteriaInfo.name : criteria.id}:</span>
                        <span>${criteria.min} to ${criteria.max} ${criteriaInfo && criteriaInfo.unit ? criteriaInfo.unit : ''}</span>
                    </div>
                `;
            }
        });

        screensHtml += `
                    </div>
                </div>
                <div class="screen-card-footer">
                    <a href="screen.html?screen=${screen.id}" class="btn btn-sm btn-primary">Run Screen</a>
                    <button class="btn btn-sm btn-outline remove-screen-btn" data-id="${screen.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    screensHtml += `</div>`;

    screensContainer.innerHTML = screensHtml;

    // Add remove functionality
    setupScreenRemove();
}

// Function to setup screen remove
function setupScreenRemove() {
    const removeButtons = document.querySelectorAll('.remove-screen-btn');

    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const screenId = parseInt(this.dataset.id);

            // Remove from saved screens
            const index = currentUser.savedScreens.findIndex(s => s.id === screenId);
            if (index !== -1) {
                currentUser.savedScreens.splice(index, 1);

                // Save user data
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                // Re-render saved screens
                renderSavedScreens();

                // Show message
                showMessage('Screen removed successfully');
            }
        });
    });
}

// Function to show message
function showMessage(message) {
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
