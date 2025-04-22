// Search functionality

// Function to initialize search page
function initSearchPage() {
    // Get search query
    const query = getUrlParameter('q');
    if (!query) {
        window.location.href = 'index.html';
        return;
    }

    // Search companies
    const results = searchCompanies(query);

    // Display results
    displaySearchResults(query, results);

    // Initialize comparison functionality
    initComparisonFunctionality();

    // Setup search box
    setupSearchBox();
}

// Function to search companies
function searchCompanies(query) {
    query = query.toLowerCase();

    // Special handling for HDFC queries
    if (query.includes('hdfc')) {
        console.log('HDFC search detected, prioritizing HDFC results');

        // First, find exact HDFC matches
        const exactHDFCMatches = companies.filter(company =>
            company.id.toLowerCase() === 'hdfcbank' ||
            company.name.toLowerCase() === 'hdfc bank ltd'
        );

        // Then find partial HDFC matches
        const partialHDFCMatches = companies.filter(company =>
            (company.id.toLowerCase().includes('hdfc') ||
            company.name.toLowerCase().includes('hdfc')) &&
            !exactHDFCMatches.includes(company)
        );

        // Then find other matches
        const otherMatches = companies.filter(company =>
            (company.sector.toLowerCase().includes(query) ||
            (company.industry && company.industry.toLowerCase().includes(query)) ||
            (company.description && company.description.toLowerCase().includes(query))) &&
            !exactHDFCMatches.includes(company) &&
            !partialHDFCMatches.includes(company)
        );

        // Combine results with priority order
        return [...exactHDFCMatches, ...partialHDFCMatches, ...otherMatches];
    }

    // Regular search for other queries
    return companies.filter(company =>
        company.name.toLowerCase().includes(query) ||
        company.id.toLowerCase().includes(query) ||
        company.sector.toLowerCase().includes(query) ||
        (company.industry && company.industry.toLowerCase().includes(query)) ||
        (company.description && company.description.toLowerCase().includes(query))
    );
}

// Function to display search results
function displaySearchResults(query, results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    // Update search query display
    const queryDisplay = document.getElementById('search-query');
    if (queryDisplay) {
        queryDisplay.textContent = query;
    }

    // Update results count
    const countDisplay = document.getElementById('results-count');
    if (countDisplay) {
        countDisplay.textContent = results.length;
    }

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> No results found for "${query}". Try a different search term.
            </div>
            <div class="search-suggestions">
                <h3>Popular searches</h3>
                <div class="suggestion-tags">
                    <a href="search.html?q=banking" class="suggestion-tag">Banking</a>
                    <a href="search.html?q=IT" class="suggestion-tag">IT Services</a>
                    <a href="search.html?q=dividend" class="suggestion-tag">Dividend Stocks</a>
                    <a href="search.html?q=growth" class="suggestion-tag">Growth Stocks</a>
                </div>
            </div>
        `;
        return;
    }

    // Add filter and sort options
    let resultsHtml = `
        <div class="search-controls">
            <div class="search-filters">
                <select id="sector-filter" class="form-select">
                    <option value="all">All Sectors</option>
                    ${[...new Set(results.map(c => c.sector))].map(sector =>
                        `<option value="${sector}">${sector}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="search-sort">
                <label>Sort by:</label>
                <select id="sort-option" class="form-select">
                    <option value="name">Name</option>
                    <option value="marketCap">Market Cap</option>
                    <option value="pe">P/E Ratio</option>
                    <option value="roe">ROE</option>
                </select>
                <button id="sort-direction" class="btn btn-sm btn-outline">
                    <i class="fas fa-sort-amount-down"></i>
                </button>
            </div>
        </div>
    `;

    // Create results list
    resultsHtml += '<div class="search-results-list">';

    results.forEach(company => {
        resultsHtml += `
            <div class="search-result-item" data-sector="${company.sector}">
                <div class="search-result-header">
                    <h3 class="search-result-title">
                        <a href="company.html?id=${company.id}">${company.name}</a>
                    </h3>
                    <span class="search-result-id">${company.id}</span>
                </div>
                <div class="search-result-meta">
                    <span class="search-result-sector">
                        <i class="fas fa-industry"></i> ${company.sector}
                    </span>
                    ${company.industry ? `<span class="search-result-industry">
                        <i class="fas fa-building"></i> ${company.industry}
                    </span>` : ''}
                </div>
                <div class="search-result-metrics">
                    <div class="search-result-metric">
                        <span class="metric-label">Market Cap</span>
                        <span class="metric-value">${formatCurrency(company.marketCap)} Cr</span>
                    </div>
                    <div class="search-result-metric">
                        <span class="metric-label">Price</span>
                        <span class="metric-value">${formatCurrency(company.currentPrice)}</span>
                    </div>
                    <div class="search-result-metric">
                        <span class="metric-label">P/E</span>
                        <span class="metric-value">${formatNumber(company.pe, 1)}</span>
                    </div>
                    <div class="search-result-metric">
                        <span class="metric-label">ROE</span>
                        <span class="metric-value">${formatPercentage(company.roe)}</span>
                    </div>
                </div>
                ${company.description ? `
                    <div class="search-result-description">
                        ${company.description.length > 200 ? company.description.substring(0, 200) + '...' : company.description}
                        <a href="company.html?id=${company.id}" class="read-more">Read more</a>
                    </div>
                ` : ''}
                <div class="search-result-actions">
                    <a href="company.html?id=${company.id}" class="btn btn-sm btn-primary">
                        <i class="fas fa-chart-bar"></i> View Details
                    </a>
                    <button class="btn btn-sm btn-outline add-watchlist-btn" data-id="${company.id}">
                        <i class="far fa-star"></i> Add to Watchlist
                    </button>
                    <button class="btn btn-sm btn-outline compare-btn" data-id="${company.id}">
                        <i class="fas fa-exchange-alt"></i> Compare
                    </button>
                </div>
            </div>
        `;
    });

    resultsHtml += '</div>';

    // Add pagination if there are many results
    if (results.length > 10) {
        resultsHtml += `
            <div class="search-pagination">
                <button class="btn btn-outline pagination-btn" disabled>
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                <span class="pagination-info">Page 1 of ${Math.ceil(results.length / 10)}</span>
                <button class="btn btn-outline pagination-btn">
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
    }

    resultsContainer.innerHTML = resultsHtml;

    // Add watchlist functionality
    setupWatchlistButtons();

    // Setup filter and sort functionality
    setupFilterAndSort(results);

    // Add animation to results
    animateResults();
}

// Function to setup filter and sort functionality
function setupFilterAndSort(results) {
    const sectorFilter = document.getElementById('sector-filter');
    const sortOption = document.getElementById('sort-option');
    const sortDirection = document.getElementById('sort-direction');

    if (sectorFilter) {
        sectorFilter.addEventListener('change', function() {
            const sector = this.value;
            const resultItems = document.querySelectorAll('.search-result-item');

            resultItems.forEach(item => {
                if (sector === 'all' || item.dataset.sector === sector) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    if (sortOption && sortDirection) {
        // Initial sort
        sortResults('name', true);

        // Sort direction toggle
        let isAscending = true;
        sortDirection.addEventListener('click', function() {
            isAscending = !isAscending;
            this.innerHTML = isAscending ?
                '<i class="fas fa-sort-amount-down"></i>' :
                '<i class="fas fa-sort-amount-up"></i>';

            sortResults(sortOption.value, isAscending);
        });

        // Sort option change
        sortOption.addEventListener('change', function() {
            sortResults(this.value, isAscending);
        });
    }
}

// Function to sort results
function sortResults(field, isAscending) {
    const resultsList = document.querySelector('.search-results-list');
    if (!resultsList) return;

    const resultItems = Array.from(resultsList.querySelectorAll('.search-result-item'));

    resultItems.sort((a, b) => {
        let aValue, bValue;

        if (field === 'name') {
            aValue = a.querySelector('.search-result-title a').textContent;
            bValue = b.querySelector('.search-result-title a').textContent;
            return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
            // Extract values from metrics
            const aMetrics = a.querySelectorAll('.search-result-metric');
            const bMetrics = b.querySelectorAll('.search-result-metric');

            let aMetricIndex, bMetricIndex;

            switch (field) {
                case 'marketCap':
                    aMetricIndex = 0;
                    bMetricIndex = 0;
                    break;
                case 'pe':
                    aMetricIndex = 2;
                    bMetricIndex = 2;
                    break;
                case 'roe':
                    aMetricIndex = 3;
                    bMetricIndex = 3;
                    break;
                default:
                    aMetricIndex = 0;
                    bMetricIndex = 0;
            }

            aValue = parseFloat(aMetrics[aMetricIndex].querySelector('.metric-value').textContent.replace(/[₹,%]/g, ''));
            bValue = parseFloat(bMetrics[bMetricIndex].querySelector('.metric-value').textContent.replace(/[₹,%]/g, ''));

            return isAscending ? aValue - bValue : bValue - aValue;
        }
    });

    // Reorder items
    resultItems.forEach(item => {
        resultsList.appendChild(item);
    });
}

// Function to animate search results
function animateResults() {
    const resultItems = document.querySelectorAll('.search-result-item');

    resultItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
}

// Function to setup watchlist buttons
function setupWatchlistButtons() {
    const watchlistButtons = document.querySelectorAll('.add-watchlist-btn');

    watchlistButtons.forEach(button => {
        const companyId = button.dataset.id;

        // Check if company is in watchlist
        if (currentUser && currentUser.watchlist && currentUser.watchlist.includes(companyId)) {
            button.innerHTML = '<i class="fas fa-star"></i> Remove from Watchlist';
            button.classList.add('in-watchlist');
        }

        button.addEventListener('click', function() {
            if (!currentUser) {
                // Redirect to login
                window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
                return;
            }

            // Toggle watchlist
            if (!currentUser.watchlist) {
                currentUser.watchlist = [];
            }

            const index = currentUser.watchlist.indexOf(companyId);
            if (index === -1) {
                // Add to watchlist
                currentUser.watchlist.push(companyId);
                button.innerHTML = '<i class="fas fa-star"></i> Remove from Watchlist';
                button.classList.add('in-watchlist');
                showToast('Added to watchlist');
            } else {
                // Remove from watchlist
                currentUser.watchlist.splice(index, 1);
                button.innerHTML = '<i class="far fa-star"></i> Add to Watchlist';
                button.classList.remove('in-watchlist');
                showToast('Removed from watchlist');
            }

            // Save user data
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        });
    });
}

// Function to setup search box
function setupSearchBox() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');

    if (searchInput && searchButton) {
        // Set initial value from URL parameter
        const query = getUrlParameter('q');
        if (query) {
            searchInput.value = query;
        }

        // Search on button click
        searchButton.addEventListener('click', function() {
            performSearch();
        });

        // Search on enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Function to initialize comparison functionality
function initComparisonFunctionality() {
    // Get comparison bar elements
    const comparisonBar = document.getElementById('comparison-bar');
    const comparisonCount = document.getElementById('comparison-count');
    const comparisonItems = document.getElementById('comparison-items');
    const compareBtn = document.getElementById('compare-btn');
    const clearComparisonBtn = document.getElementById('clear-comparison-btn');

    if (!comparisonBar || !comparisonCount || !comparisonItems || !compareBtn || !clearComparisonBtn) {
        return;
    }

    // Get comparison stocks from localStorage
    let comparisonStocks = JSON.parse(localStorage.getItem('comparisonStocks')) || [];

    // Update comparison bar
    updateComparisonBar(comparisonStocks, comparisonBar, comparisonCount, comparisonItems, compareBtn);

    // Setup compare button
    compareBtn.addEventListener('click', function() {
        if (comparisonStocks.length > 0) {
            // Redirect to comparison page
            window.location.href = `comparison.html?stocks=${comparisonStocks.join(',')}`;
        }
    });

    // Setup clear button
    clearComparisonBtn.addEventListener('click', function() {
        // Clear comparison stocks
        comparisonStocks = [];
        localStorage.setItem('comparisonStocks', JSON.stringify(comparisonStocks));

        // Update comparison bar
        updateComparisonBar(comparisonStocks, comparisonBar, comparisonCount, comparisonItems, compareBtn);

        // Update compare buttons in search results
        updateCompareButtons(comparisonStocks);

        // Show toast
        showToast('Comparison cleared');
    });

    // Add compare buttons to search results
    addCompareButtons(comparisonStocks);
}

// Function to update comparison bar
function updateComparisonBar(comparisonStocks, comparisonBar, comparisonCount, comparisonItems, compareBtn) {
    // Update count
    comparisonCount.textContent = comparisonStocks.length;

    // Update items
    if (comparisonStocks.length > 0) {
        let itemsHtml = '';

        comparisonStocks.forEach(stockId => {
            const company = companies.find(c => c.id === stockId);
            if (company) {
                itemsHtml += `
                    <div class="comparison-item" data-id="${company.id}">
                        ${company.name} (${company.id})
                        <button class="comparison-item-remove" data-id="${company.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            }
        });

        comparisonItems.innerHTML = itemsHtml;

        // Setup remove buttons
        const removeButtons = comparisonItems.querySelectorAll('.comparison-item-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const stockId = this.dataset.id;

                // Remove from comparison stocks
                comparisonStocks = comparisonStocks.filter(id => id !== stockId);
                localStorage.setItem('comparisonStocks', JSON.stringify(comparisonStocks));

                // Update comparison bar
                updateComparisonBar(comparisonStocks, comparisonBar, comparisonCount, comparisonItems, compareBtn);

                // Update compare buttons in search results
                updateCompareButtons(comparisonStocks);

                // Show toast
                showToast(`Removed ${stockId} from comparison`);
            });
        });

        // Show comparison bar
        comparisonBar.style.display = 'block';

        // Enable compare button if at least 2 stocks
        compareBtn.disabled = comparisonStocks.length < 2;
    } else {
        // Hide comparison bar
        comparisonBar.style.display = 'none';

        // Disable compare button
        compareBtn.disabled = true;
    }
}

// Function to add compare buttons to search results
function addCompareButtons(comparisonStocks) {
    // Get all search result items
    const searchResultItems = document.querySelectorAll('.search-result-item');

    searchResultItems.forEach(item => {
        // Get company ID from the watchlist button
        const watchlistBtn = item.querySelector('.add-watchlist-btn');
        if (!watchlistBtn) return;

        const companyId = watchlistBtn.dataset.id;

        // Check if compare button already exists
        let compareBtn = item.querySelector('.compare-btn');

        if (!compareBtn) {
            // Create compare button
            const actionsContainer = item.querySelector('.search-result-actions');
            if (!actionsContainer) return;

            compareBtn = document.createElement('button');
            compareBtn.className = 'btn btn-sm btn-outline compare-btn';
            compareBtn.dataset.id = companyId;
            compareBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Compare';

            // Add to actions container
            actionsContainer.appendChild(compareBtn);
        }

        // Check if company is in comparison
        if (comparisonStocks.includes(companyId)) {
            compareBtn.classList.add('selected');
            compareBtn.innerHTML = '<i class="fas fa-check"></i> Selected';
        } else {
            compareBtn.classList.remove('selected');
            compareBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Compare';
        }

        // Add click event
        compareBtn.addEventListener('click', function() {
            const stockId = this.dataset.id;

            // Get comparison stocks
            let comparisonStocks = JSON.parse(localStorage.getItem('comparisonStocks')) || [];

            // Toggle stock in comparison
            if (comparisonStocks.includes(stockId)) {
                // Remove from comparison
                comparisonStocks = comparisonStocks.filter(id => id !== stockId);
                this.classList.remove('selected');
                this.innerHTML = '<i class="fas fa-exchange-alt"></i> Compare';
                showToast(`Removed ${stockId} from comparison`);
            } else {
                // Add to comparison (limit to 4 stocks)
                if (comparisonStocks.length >= 4) {
                    showToast('Maximum 4 stocks can be compared at once');
                    return;
                }

                comparisonStocks.push(stockId);
                this.classList.add('selected');
                this.innerHTML = '<i class="fas fa-check"></i> Selected';
                showToast(`Added ${stockId} to comparison`);
            }

            // Save comparison stocks
            localStorage.setItem('comparisonStocks', JSON.stringify(comparisonStocks));

            // Update comparison bar
            const comparisonBar = document.getElementById('comparison-bar');
            const comparisonCount = document.getElementById('comparison-count');
            const comparisonItems = document.getElementById('comparison-items');
            const compareBtn = document.getElementById('compare-btn');

            if (comparisonBar && comparisonCount && comparisonItems && compareBtn) {
                updateComparisonBar(comparisonStocks, comparisonBar, comparisonCount, comparisonItems, compareBtn);
            }
        });
    });
}

// Function to update compare buttons
function updateCompareButtons(comparisonStocks) {
    const compareButtons = document.querySelectorAll('.compare-btn');

    compareButtons.forEach(button => {
        const stockId = button.dataset.id;

        if (comparisonStocks.includes(stockId)) {
            button.classList.add('selected');
            button.innerHTML = '<i class="fas fa-check"></i> Selected';
        } else {
            button.classList.remove('selected');
            button.innerHTML = '<i class="fas fa-exchange-alt"></i> Compare';
        }
    });
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
                bottom: 80px; /* Position above comparison bar */
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
