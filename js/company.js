// Helper functions
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function formatCurrency(value) {
    if (value === null || value === undefined) return 'N/A';
    return '₹' + value.toLocaleString(undefined, { minimumFractionDigits: 2 });
}

function formatNumber(value, decimals = 0) {
    if (value === null || value === undefined) return 'N/A';
    return value.toLocaleString(undefined, { minimumFractionDigits: decimals });
}

function formatPercentage(value) {
    if (value === null || value === undefined) return 'N/A';
    return value.toFixed(2) + '%';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initCompanyPage();
});

function initCompanyPage() {
    const companyId = getUrlParameter('id');
    if (!companyId) {
        window.location.href = 'index.html';
        return;
    }

    // Get company data
    const company = window.companies.find(c => c.id === companyId);
    if (!company) {
        window.location.href = 'index.html';
        return;
    }

    // Update page title
    document.title = `${company.name} - Company Analysis | Screener`;

    // Render company header
    renderCompanyHeader(company);

    // Render tabs
    renderTabs(company);

    // Initialize charts
    initCharts(company);

    // Setup tab navigation
    setupTabNavigation();

    // Setup watchlist button
    setupWatchlistButton(company);
}

function renderCompanyHeader(company) {
    const header = document.getElementById('company-header');
    if (!header) return;

    header.innerHTML = `
        <div class="container">
            <div class="company-info">
                <h1 class="company-name">${company.name}</h1>
                <div class="company-meta">
                    <span class="sector">${company.sector}</span>
                    <span class="industry">${company.industry}</span>
                </div>
                <div class="company-price">
                    <span class="current-price">${formatCurrency(company.currentPrice)}</span>
                    <span class="price-change">${formatPercentage(company.priceChange)}</span>
                </div>
            </div>
            <div class="company-actions">
                <button class="btn btn-outline add-watchlist-btn" data-id="${company.id}">
                    <i class="fas fa-star"></i> Add to Watchlist
                </button>
                <button class="btn btn-primary add-compare-btn" data-id="${company.id}">
                    <i class="fas fa-exchange-alt"></i> Compare
                </button>
            </div>
        </div>
    `;
}

function renderTabs(company) {
    const tabs = document.getElementById('company-tabs');
    if (!tabs) return;

    tabs.innerHTML = `
        <div class="container">
            <div class="tabs">
                <button class="tab-btn active" data-tab="overview">Overview</button>
                <button class="tab-btn" data-tab="financials">Financials</button>
                <button class="tab-btn" data-tab="charts">Charts</button>
                <button class="tab-btn" data-tab="peers">Peers</button>
                <button class="tab-btn" data-tab="news">News</button>
            </div>
        </div>
    `;

    // Render initial tab content
    renderTabContent('overview', company);
}

function renderTabContent(tabId, company) {
    const tabContent = document.getElementById(`tab-${tabId}`);
    if (!tabContent) return;

    switch (tabId) {
        case 'overview':
            renderOverviewTab(tabContent, company);
            break;
        case 'financials':
            renderFinancialsTab(tabContent, company);
            break;
        case 'charts':
            renderChartsTab(tabContent, company);
            break;
        case 'peers':
            renderPeersTab(tabContent, company);
            break;
        case 'news':
            renderNewsTab(tabContent, company);
            break;
    }
}

function renderOverviewTab(container, company) {
    container.innerHTML = `
        <div class="company-section">
            <h2 class="company-section-title">Company Overview</h2>
            <p class="company-description">${company.description}</p>
        </div>
        <div class="company-section">
            <h2 class="company-section-title">Key Metrics</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Market Cap</span>
                    <span class="metric-value">${formatCurrency(company.marketCap)}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">P/E Ratio</span>
                    <span class="metric-value">${formatNumber(company.pe, 2)}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Book Value</span>
                    <span class="metric-value">${formatCurrency(company.bookValue)}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Dividend Yield</span>
                    <span class="metric-value">${formatPercentage(company.dividendYield)}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">ROE</span>
                    <span class="metric-value">${formatPercentage(company.roe)}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">ROCE</span>
                    <span class="metric-value">${formatPercentage(company.roce)}</span>
                </div>
            </div>
        </div>
    `;
}

function renderFinancialsTab(container, company) {
    container.innerHTML = `
        <div class="company-section">
            <h2 class="company-section-title">Financial Performance</h2>
            <div class="financials-table">
                <table>
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Revenue</th>
                            <th>Profit</th>
                            <th>Equity</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${company.financials.revenue.map((item, index) => `
                            <tr>
                                <td>${item.year}</td>
                                <td>${formatCurrency(company.financials.revenue[index].value)}</td>
                                <td>${formatCurrency(company.financials.profit[index].value)}</td>
                                <td>${formatCurrency(company.financials.equity[index].value)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderChartsTab(container, company) {
    container.innerHTML = `
        <div class="company-section">
            <h2 class="company-section-title">Financial Charts</h2>
            <div class="charts-container">
                <div class="chart-wrapper">
                    <canvas id="revenue-chart"></canvas>
                </div>
                <div class="chart-wrapper">
                    <canvas id="profit-chart"></canvas>
                </div>
                <div class="chart-wrapper">
                    <canvas id="equity-chart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function renderPeersTab(container, company) {
    // Find peers in the same sector
    const peers = window.companies.filter(c => 
        c.sector === company.sector && 
        c.id !== company.id
    ).slice(0, 5);

    container.innerHTML = `
        <div class="company-section">
            <h2 class="company-section-title">Peer Comparison</h2>
            <div class="peers-table">
                <table>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Price</th>
                            <th>P/E</th>
                            <th>Market Cap</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${peers.map(peer => `
                            <tr>
                                <td>${peer.name}</td>
                                <td>${formatCurrency(peer.currentPrice)}</td>
                                <td>${formatNumber(peer.pe, 2)}</td>
                                <td>${formatCurrency(peer.marketCap)}</td>
                                <td>
                                    <button class="btn btn-sm btn-outline add-compare-btn" data-id="${peer.id}">
                                        Compare
                                    </button>
                                    <button class="btn btn-sm btn-outline add-watchlist-btn" data-id="${peer.id}">
                                        Watchlist
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderNewsTab(container, company) {
    container.innerHTML = `
        <div class="company-section">
            <h2 class="company-section-title">Latest News</h2>
            <div class="news-list">
                <p>News feature will be available soon.</p>
            </div>
        </div>
    `;
}

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.style.display = 'none';
            });

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding tab content
            const tabId = button.getAttribute('data-tab');
            const tabContent = document.getElementById(`tab-${tabId}`);
            if (tabContent) {
                tabContent.style.display = 'block';
            }

            // Initialize charts if needed
            if (tabId === 'charts') {
                initCharts(window.companies.find(c => c.id === getUrlParameter('id')));
            }
        });
    });
}

function setupWatchlistButton(company) {
    const watchlistBtn = document.querySelector('.add-watchlist-btn');
    if (!watchlistBtn) return;

    // Check if company is in watchlist
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { watchlist: [] };
    const isInWatchlist = currentUser.watchlist.includes(company.id);

    // Update button text and icon
    watchlistBtn.innerHTML = `
        <i class="fas ${isInWatchlist ? 'fa-star' : 'fa-star'}"></i>
        ${isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    `;

    // Add click event
    watchlistBtn.addEventListener('click', () => {
        if (!currentUser.id) {
            window.location.href = 'login.html';
            return;
        }

        if (isInWatchlist) {
            currentUser.watchlist = currentUser.watchlist.filter(id => id !== company.id);
        } else {
            currentUser.watchlist.push(company.id);
        }

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        setupWatchlistButton(company);
    });
}

function initCharts(company) {
    if (!company) return;

    // Revenue Chart
    const revenueCtx = document.getElementById('revenue-chart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: company.financials.revenue.map(item => item.year),
                datasets: [{
                    label: 'Revenue',
                    data: company.financials.revenue.map(item => item.value),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Revenue Growth'
                    }
                }
            }
        });
    }

    // Profit Chart
    const profitCtx = document.getElementById('profit-chart');
    if (profitCtx) {
        new Chart(profitCtx, {
            type: 'line',
            data: {
                labels: company.financials.profit.map(item => item.year),
                datasets: [{
                    label: 'Profit',
                    data: company.financials.profit.map(item => item.value),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Profit Growth'
                    }
                }
            }
        });
    }

    // Equity Chart
    const equityCtx = document.getElementById('equity-chart');
    if (equityCtx) {
        new Chart(equityCtx, {
            type: 'line',
            data: {
                labels: company.financials.equity.map(item => item.year),
                datasets: [{
                    label: 'Equity',
                    data: company.financials.equity.map(item => item.value),
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Equity Growth'
                    }
                }
            }
        });
    }
}