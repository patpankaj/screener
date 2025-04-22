// Watchlist functionality

// Function to initialize watchlist page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the watchlist page
    const watchlistContainer = document.getElementById('watchlist-container');
    if (!watchlistContainer) return;
    
    // Check if user is logged in
    if (!currentUser) {
        // Redirect to login page
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }
    
    // Initialize watchlist
    initWatchlist();
    
    // Setup watchlist filters
    setupWatchlistFilters();
    
    // Setup export functionality
    setupExportWatchlist();
});

// Function to initialize watchlist
function initWatchlist() {
    const watchlistContainer = document.getElementById('watchlist-container');
    if (!watchlistContainer) return;
    
    // Get watchlist stocks
    const watchlistStocks = getWatchlistStocks();
    
    // Render watchlist
    renderWatchlist(watchlistStocks);
}

// Function to get watchlist stocks
function getWatchlistStocks() {
    if (!currentUser || !currentUser.watchlist) return [];
    
    // Get stock data for watchlist items
    return currentUser.watchlist.map(id => {
        const company = companies.find(c => c.id === id);
        return company || null;
    }).filter(Boolean); // Remove null values
}

// Function to render watchlist
function renderWatchlist(stocks) {
    const watchlistContainer = document.getElementById('watchlist-container');
    if (!watchlistContainer) return;
    
    if (stocks.length === 0) {
        // Show empty state
        watchlistContainer.innerHTML = `
            <div class="empty-watchlist">
                <div class="empty-watchlist-icon">
                    <i class="fas fa-star"></i>
                </div>
                <h3>Your watchlist is empty</h3>
                <p>Add stocks to your watchlist to track their performance and get quick access to their details.</p>
                <a href="screen.html" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Add Stocks
                </a>
            </div>
        `;
        return;
    }
    
    // Create watchlist table
    let watchlistHtml = `
        <table class="watchlist-table">
            <thead>
                <tr>
                    <th>Company</th>
                    <th>Sector</th>
                    <th class="numeric">Price (₹)</th>
                    <th class="numeric">Market Cap (Cr)</th>
                    <th class="numeric">P/E</th>
                    <th class="numeric">ROE (%)</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    stocks.forEach(stock => {
        watchlistHtml += `
            <tr data-id="${stock.id}">
                <td>
                    <div class="company-name">${stock.name}</div>
                    <div class="company-id">${stock.id}</div>
                </td>
                <td>
                    <div class="company-sector">${stock.sector}</div>
                </td>
                <td class="numeric">${formatCurrency(stock.currentPrice, 2)}</td>
                <td class="numeric">${formatNumber(stock.marketCap)}</td>
                <td class="numeric">${formatNumber(stock.pe, 1)}</td>
                <td class="numeric ${stock.roe >= 15 ? 'positive' : ''}">${formatPercentage(stock.roe)}</td>
                <td>
                    <div class="actions">
                        <a href="company.html?id=${stock.id}" class="btn-icon" title="View Details">
                            <i class="fas fa-chart-line"></i>
                        </a>
                        <button class="btn-icon add-compare-btn" data-id="${stock.id}" title="Add to Compare">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="btn-icon btn-remove remove-watchlist-btn" data-id="${stock.id}" title="Remove from Watchlist">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    watchlistHtml += `
            </tbody>
        </table>
    `;
    
    watchlistContainer.innerHTML = watchlistHtml;
    
    // Setup remove buttons
    setupRemoveButtons();
    
    // Setup compare buttons
    setupCompareButtons();
}

// Function to setup remove buttons
function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-watchlist-btn');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const stockId = this.dataset.id;
            
            // Remove from watchlist
            if (currentUser && currentUser.watchlist) {
                currentUser.watchlist = currentUser.watchlist.filter(id => id !== stockId);
                
                // Save user data
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Show toast
                showToast(`Removed ${stockId} from watchlist`);
                
                // Re-render watchlist
                const watchlistStocks = getWatchlistStocks();
                renderWatchlist(watchlistStocks);
            }
        });
    });
}

// Function to setup compare buttons
function setupCompareButtons() {
    const compareButtons = document.querySelectorAll('.add-compare-btn');
    
    // Get comparison stocks from localStorage
    let comparisonStocks = JSON.parse(localStorage.getItem('comparisonStocks')) || [];
    
    compareButtons.forEach(button => {
        const stockId = button.dataset.id;
        
        // Check if stock is in comparison
        if (comparisonStocks.includes(stockId)) {
            button.classList.add('in-compare');
            button.title = "Remove from Compare";
        }
        
        button.addEventListener('click', function() {
            const stockId = this.dataset.id;
            
            // Toggle comparison
            if (comparisonStocks.includes(stockId)) {
                // Remove from comparison
                comparisonStocks = comparisonStocks.filter(id => id !== stockId);
                this.classList.remove('in-compare');
                this.title = "Add to Compare";
                showToast(`Removed ${stockId} from comparison`);
            } else {
                // Add to comparison (limit to 4 stocks)
                if (comparisonStocks.length >= 4) {
                    showToast('Maximum 4 stocks can be compared at once');
                    return;
                }
                
                comparisonStocks.push(stockId);
                this.classList.add('in-compare');
                this.title = "Remove from Compare";
                showToast(`Added ${stockId} to comparison`);
            }
            
            // Save comparison stocks
            localStorage.setItem('comparisonStocks', JSON.stringify(comparisonStocks));
            
            // Show comparison button if at least 2 stocks
            if (comparisonStocks.length >= 2) {
                // Check if comparison button exists
                let compareAllBtn = document.getElementById('compare-all-btn');
                
                if (!compareAllBtn) {
                    // Create comparison button
                    compareAllBtn = document.createElement('button');
                    compareAllBtn.id = 'compare-all-btn';
                    compareAllBtn.className = 'btn btn-primary compare-all-btn';
                    compareAllBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Compare Selected Stocks';
                    
                    // Add to body
                    document.body.appendChild(compareAllBtn);
                    
                    // Add styles
                    const style = document.createElement('style');
                    style.textContent = `
                        .compare-all-btn {
                            position: fixed;
                            bottom: 20px;
                            right: 20px;
                            z-index: 100;
                            padding: 12px 20px;
                            border-radius: 30px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            animation: slideIn 0.3s ease;
                        }
                        
                        @keyframes slideIn {
                            from { transform: translateY(100px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                        
                        .in-compare {
                            background-color: var(--primary-color) !important;
                            color: white !important;
                            border-color: var(--primary-color) !important;
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                // Add click event
                compareAllBtn.addEventListener('click', function() {
                    window.location.href = `comparison.html?stocks=${comparisonStocks.join(',')}`;
                });
            } else {
                // Remove comparison button if less than 2 stocks
                const compareAllBtn = document.getElementById('compare-all-btn');
                if (compareAllBtn) {
                    document.body.removeChild(compareAllBtn);
                }
            }
        });
    });
    
    // Show comparison button if at least 2 stocks
    if (comparisonStocks.length >= 2) {
        // Check if comparison button exists
        let compareAllBtn = document.getElementById('compare-all-btn');
        
        if (!compareAllBtn) {
            // Create comparison button
            compareAllBtn = document.createElement('button');
            compareAllBtn.id = 'compare-all-btn';
            compareAllBtn.className = 'btn btn-primary compare-all-btn';
            compareAllBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Compare Selected Stocks';
            
            // Add to body
            document.body.appendChild(compareAllBtn);
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .compare-all-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 100;
                    padding: 12px 20px;
                    border-radius: 30px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    animation: slideIn 0.3s ease;
                }
                
                @keyframes slideIn {
                    from { transform: translateY(100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .in-compare {
                    background-color: var(--primary-color) !important;
                    color: white !important;
                    border-color: var(--primary-color) !important;
                }
            `;
            document.head.appendChild(style);
            
            // Add click event
            compareAllBtn.addEventListener('click', function() {
                window.location.href = `comparison.html?stocks=${comparisonStocks.join(',')}`;
            });
        }
    }
}

// Function to setup watchlist filters
function setupWatchlistFilters() {
    const searchInput = document.getElementById('watchlist-search');
    const sortSelect = document.getElementById('watchlist-sort');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterWatchlist();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            filterWatchlist();
        });
    }
}

// Function to filter watchlist
function filterWatchlist() {
    const searchInput = document.getElementById('watchlist-search');
    const sortSelect = document.getElementById('watchlist-sort');
    
    if (!searchInput || !sortSelect) return;
    
    const searchQuery = searchInput.value.trim().toLowerCase();
    const sortBy = sortSelect.value;
    
    // Get watchlist stocks
    let watchlistStocks = getWatchlistStocks();
    
    // Filter by search query
    if (searchQuery) {
        watchlistStocks = watchlistStocks.filter(stock => 
            stock.name.toLowerCase().includes(searchQuery) || 
            stock.id.toLowerCase().includes(searchQuery) || 
            stock.sector.toLowerCase().includes(searchQuery)
        );
    }
    
    // Sort stocks
    watchlistStocks.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price':
                return b.currentPrice - a.currentPrice;
            case 'marketCap':
                return b.marketCap - a.marketCap;
            case 'pe':
                return b.pe - a.pe;
            default:
                return 0;
        }
    });
    
    // Render filtered watchlist
    renderWatchlist(watchlistStocks);
}

// Function to setup export watchlist
function setupExportWatchlist() {
    const exportButton = document.getElementById('export-watchlist');
    
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            // Get watchlist stocks
            const watchlistStocks = getWatchlistStocks();
            
            if (watchlistStocks.length === 0) {
                showToast('No stocks in watchlist to export');
                return;
            }
            
            // Create CSV content
            let csv = 'Company,ID,Sector,Price,Market Cap,P/E,ROE\n';
            
            watchlistStocks.forEach(stock => {
                csv += `"${stock.name}",${stock.id},${stock.sector},${stock.currentPrice},${stock.marketCap},${stock.pe},${stock.roe}\n`;
            });
            
            // Create download link
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'watchlist.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast('Watchlist exported successfully');
        });
    }
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
