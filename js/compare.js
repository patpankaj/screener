// Stock Comparison Tool

// Function to initialize comparison tool
function initComparisonTool() {
    // Check if comparison container exists
    const comparisonContainer = document.getElementById('comparison-container');
    if (!comparisonContainer) return;
    
    // Get comparison stocks from URL
    const urlParams = new URLSearchParams(window.location.search);
    const stocksParam = urlParams.get('stocks');
    
    if (!stocksParam) {
        // Show empty state if no stocks specified
        showEmptyComparisonState();
        return;
    }
    
    // Parse stocks parameter
    const stockIds = stocksParam.split(',');
    
    // Get stock data
    const stocksData = stockIds.map(id => companies.find(c => c.id === id)).filter(Boolean);
    
    if (stocksData.length === 0) {
        // Show empty state if no valid stocks
        showEmptyComparisonState();
        return;
    }
    
    // Render comparison
    renderComparison(stocksData);
    
    // Setup add stock functionality
    setupAddStock(stocksData);
}

// Function to show empty comparison state
function showEmptyComparisonState() {
    const comparisonContainer = document.getElementById('comparison-container');
    if (!comparisonContainer) return;
    
    comparisonContainer.innerHTML = `
        <div class="empty-comparison">
            <div class="empty-comparison-icon">
                <i class="fas fa-exchange-alt"></i>
            </div>
            <h3>No stocks selected for comparison</h3>
            <p>Add stocks to compare their financial metrics</p>
            <div class="stock-search-container">
                <input type="text" id="stock-search" class="form-control" placeholder="Search for a stock...">
                <button id="add-stock-btn" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Add
                </button>
            </div>
            <div id="stock-search-results" class="stock-search-results"></div>
        </div>
    `;
    
    // Setup stock search
    setupStockSearch();
}

// Function to render comparison
function renderComparison(stocksData) {
    const comparisonContainer = document.getElementById('comparison-container');
    if (!comparisonContainer) return;
    
    // Create comparison table
    let comparisonHtml = `
        <div class="comparison-header">
            <h2>Stock Comparison</h2>
            <div class="comparison-actions">
                <button id="add-stock-button" class="btn btn-outline">
                    <i class="fas fa-plus"></i> Add Stock
                </button>
                <button id="export-comparison-button" class="btn btn-outline">
                    <i class="fas fa-download"></i> Export
                </button>
            </div>
        </div>
        <div class="comparison-table-container">
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        ${stocksData.map(stock => `
                            <th class="stock-column">
                                <div class="stock-header">
                                    <div class="stock-name">${stock.name}</div>
                                    <div class="stock-id">${stock.id}</div>
                                    <button class="remove-stock-btn" data-id="${stock.id}">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="metric-name">Sector</td>
                        ${stocksData.map(stock => `<td>${stock.sector}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="metric-name">Industry</td>
                        ${stocksData.map(stock => `<td>${stock.industry || '-'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="metric-name">Market Cap (Cr)</td>
                        ${stocksData.map(stock => `<td>${formatNumber(stock.marketCap)}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="metric-name">Current Price (₹)</td>
                        ${stocksData.map(stock => `<td>${formatNumber(stock.currentPrice, 2)}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="metric-name">P/E Ratio</td>
                        ${stocksData.map(stock => `<td>${formatNumber(stock.pe, 2)}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="metric-name">Book Value (₹)</td>
                        ${stocksData.map(stock => `<td>${formatNumber(stock.bookValue, 2)}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="metric-name">ROCE (%)</td>
                        ${stocksData.map(stock => `<td>${formatNumber(stock.roce, 2)}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="metric-name">ROE (%)</td>
                        ${stocksData.map(stock => `<td>${formatNumber(stock.roe, 2)}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="metric-name">Dividend Yield (%)</td>
                        ${stocksData.map(stock => `<td>${formatNumber(stock.dividendYield, 2)}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="metric-name">52 Week High (₹)</td>
                        ${stocksData.map(stock => `<td>${formatNumber(stock.high52, 2)}</td>`).join('')}
                    </tr>
                    <tr>
                        <td class="metric-name">52 Week Low (₹)</td>
                        ${stocksData.map(stock => `<td>${formatNumber(stock.low52, 2)}</td>`).join('')}
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="comparison-charts">
            <h3>Financial Comparison</h3>
            <div class="chart-selector">
                <button class="chart-type-btn active" data-chart="revenue">Revenue</button>
                <button class="chart-type-btn" data-chart="profit">Profit</button>
                <button class="chart-type-btn" data-chart="equity">Equity</button>
            </div>
            <div class="chart-container">
                <canvas id="comparison-chart"></canvas>
            </div>
        </div>
        
        <div id="add-stock-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add Stock to Comparison</h3>
                    <button class="close-modal-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="stock-search-container">
                        <input type="text" id="stock-search" class="form-control" placeholder="Search for a stock...">
                    </div>
                    <div id="stock-search-results" class="stock-search-results"></div>
                </div>
            </div>
        </div>
    `;
    
    comparisonContainer.innerHTML = comparisonHtml;
    
    // Setup chart
    renderComparisonChart(stocksData, 'revenue');
    
    // Setup chart type buttons
    setupChartTypeButtons(stocksData);
    
    // Setup remove stock buttons
    setupRemoveStockButtons(stocksData);
    
    // Setup add stock button
    setupAddStockModal(stocksData);
    
    // Setup export button
    setupExportButton(stocksData);
}

// Function to render comparison chart
function renderComparisonChart(stocksData, chartType) {
    const canvas = document.getElementById('comparison-chart');
    if (!canvas) return;
    
    // Get years (assuming all stocks have the same years)
    const years = stocksData[0].financials[chartType].map(item => item.year);
    
    // Prepare datasets
    const datasets = stocksData.map((stock, index) => {
        // Generate a color based on index
        const hue = (index * 137) % 360; // Use golden ratio to spread colors
        const color = `hsl(${hue}, 70%, 60%)`;
        
        return {
            label: stock.name,
            data: stock.financials[chartType].map(item => item.value),
            backgroundColor: `${color}33`, // Add transparency
            borderColor: color,
            borderWidth: 2
        };
    });
    
    // Create chart
    if (window.comparisonChart) {
        window.comparisonChart.destroy();
    }
    
    // Create new chart
    window.comparisonChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹ ' + value.toLocaleString('en-IN');
                        }
                    },
                    title: {
                        display: true,
                        text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} (₹ Cr)`
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹ ' + context.raw.toLocaleString('en-IN') + ' Cr';
                        }
                    }
                }
            }
        }
    });
}

// Function to setup chart type buttons
function setupChartTypeButtons(stocksData) {
    const chartTypeButtons = document.querySelectorAll('.chart-type-btn');
    
    chartTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            chartTypeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get chart type
            const chartType = this.dataset.chart;
            
            // Render chart
            renderComparisonChart(stocksData, chartType);
        });
    });
}

// Function to setup remove stock buttons
function setupRemoveStockButtons(stocksData) {
    const removeButtons = document.querySelectorAll('.remove-stock-btn');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const stockId = this.dataset.id;
            
            // Remove stock from URL
            const urlParams = new URLSearchParams(window.location.search);
            const stocksParam = urlParams.get('stocks');
            const stockIds = stocksParam.split(',');
            const updatedStockIds = stockIds.filter(id => id !== stockId);
            
            if (updatedStockIds.length === 0) {
                // If no stocks left, remove stocks parameter
                urlParams.delete('stocks');
            } else {
                // Update stocks parameter
                urlParams.set('stocks', updatedStockIds.join(','));
            }
            
            // Update URL
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            window.location.href = newUrl;
        });
    });
}

// Function to setup add stock modal
function setupAddStockModal(stocksData) {
    const addStockButton = document.getElementById('add-stock-button');
    const modal = document.getElementById('add-stock-modal');
    const closeModalButton = document.querySelector('.close-modal-btn');
    
    if (addStockButton && modal && closeModalButton) {
        // Open modal
        addStockButton.addEventListener('click', function() {
            modal.style.display = 'block';
            document.getElementById('stock-search').focus();
        });
        
        // Close modal
        closeModalButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Setup stock search
        setupStockSearch(stocksData);
    }
}

// Function to setup stock search
function setupStockSearch(existingStocks = []) {
    const searchInput = document.getElementById('stock-search');
    const searchResults = document.getElementById('stock-search-results');
    
    if (searchInput && searchResults) {
        // Get existing stock IDs
        const existingStockIds = existingStocks.map(stock => stock.id);
        
        // Search on input
        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }
            
            // Filter companies
            const filteredCompanies = companies.filter(company => 
                (company.name.toLowerCase().includes(query) || 
                company.id.toLowerCase().includes(query)) &&
                !existingStockIds.includes(company.id)
            ).slice(0, 5); // Limit to 5 results
            
            // Render results
            if (filteredCompanies.length > 0) {
                let resultsHtml = '';
                
                filteredCompanies.forEach(company => {
                    resultsHtml += `
                        <div class="stock-search-result" data-id="${company.id}">
                            <div class="stock-search-result-name">${company.name}</div>
                            <div class="stock-search-result-meta">${company.sector} | ${company.id}</div>
                        </div>
                    `;
                });
                
                searchResults.innerHTML = resultsHtml;
                
                // Add click event to results
                const resultItems = searchResults.querySelectorAll('.stock-search-result');
                resultItems.forEach(item => {
                    item.addEventListener('click', function() {
                        const stockId = this.dataset.id;
                        addStockToComparison(stockId, existingStockIds);
                    });
                });
            } else {
                searchResults.innerHTML = `
                    <div class="no-results">
                        No stocks found matching "${query}"
                    </div>
                `;
            }
        });
    }
}

// Function to add stock to comparison
function addStockToComparison(stockId, existingStockIds = []) {
    // Get current stocks from URL
    const urlParams = new URLSearchParams(window.location.search);
    const stocksParam = urlParams.get('stocks');
    
    let stockIds = [];
    if (stocksParam) {
        stockIds = stocksParam.split(',');
    }
    
    // Add new stock if not already in comparison
    if (!stockIds.includes(stockId) && !existingStockIds.includes(stockId)) {
        stockIds.push(stockId);
    }
    
    // Update URL
    urlParams.set('stocks', stockIds.join(','));
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.location.href = newUrl;
}

// Function to setup add stock functionality
function setupAddStock(existingStocks = []) {
    const addStockBtn = document.getElementById('add-stock-btn');
    
    if (addStockBtn) {
        addStockBtn.addEventListener('click', function() {
            const searchInput = document.getElementById('stock-search');
            const query = searchInput.value.trim();
            
            if (query) {
                // Find matching company
                const company = companies.find(c => 
                    c.name.toLowerCase().includes(query.toLowerCase()) || 
                    c.id.toLowerCase() === query.toLowerCase()
                );
                
                if (company) {
                    // Add to comparison
                    const existingStockIds = existingStocks.map(stock => stock.id);
                    addStockToComparison(company.id, existingStockIds);
                } else {
                    alert('Company not found. Please try a different search term.');
                }
            }
        });
    }
}

// Function to setup export button
function setupExportButton(stocksData) {
    const exportButton = document.getElementById('export-comparison-button');
    
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            // Create CSV content
            let csv = 'Metric';
            
            // Add stock names as headers
            stocksData.forEach(stock => {
                csv += `,${stock.name} (${stock.id})`;
            });
            
            csv += '\n';
            
            // Add metrics
            const metrics = [
                { name: 'Sector', key: 'sector' },
                { name: 'Industry', key: 'industry' },
                { name: 'Market Cap (Cr)', key: 'marketCap' },
                { name: 'Current Price (₹)', key: 'currentPrice' },
                { name: 'P/E Ratio', key: 'pe' },
                { name: 'Book Value (₹)', key: 'bookValue' },
                { name: 'ROCE (%)', key: 'roce' },
                { name: 'ROE (%)', key: 'roe' },
                { name: 'Dividend Yield (%)', key: 'dividendYield' },
                { name: '52 Week High (₹)', key: 'high52' },
                { name: '52 Week Low (₹)', key: 'low52' }
            ];
            
            metrics.forEach(metric => {
                csv += metric.name;
                
                stocksData.forEach(stock => {
                    const value = stock[metric.key] || '-';
                    csv += `,${value}`;
                });
                
                csv += '\n';
            });
            
            // Create download link
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'stock-comparison.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
}

// Add CSS for comparison tool
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        /* Comparison Tool Styles */
        .comparison-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .comparison-actions {
            display: flex;
            gap: 10px;
        }
        
        .comparison-table-container {
            overflow-x: auto;
            margin-bottom: 30px;
        }
        
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px var(--shadow-color);
        }
        
        .comparison-table th,
        .comparison-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        
        .comparison-table thead th {
            background-color: var(--bg-color);
            font-weight: 600;
            color: var(--text-color);
        }
        
        .comparison-table tbody tr:nth-child(even) {
            background-color: var(--bg-color);
        }
        
        .comparison-table tbody tr:hover {
            background-color: rgba(26, 115, 232, 0.05);
        }
        
        .stock-column {
            min-width: 200px;
        }
        
        .stock-header {
            position: relative;
            padding-right: 20px;
        }
        
        .stock-name {
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .stock-id {
            font-size: 12px;
            color: var(--text-light);
        }
        
        .remove-stock-btn {
            position: absolute;
            top: 0;
            right: 0;
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
            font-size: 14px;
            padding: 0;
        }
        
        .remove-stock-btn:hover {
            color: #e53935;
        }
        
        .metric-name {
            font-weight: 500;
        }
        
        .comparison-charts {
            margin-bottom: 30px;
        }
        
        .chart-selector {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .chart-type-btn {
            padding: 8px 16px;
            background-color: var(--bg-color);
            border: 1px solid var(--border-color);
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .chart-type-btn:hover {
            background-color: rgba(26, 115, 232, 0.1);
        }
        
        .chart-type-btn.active {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        .chart-container {
            height: 400px;
            background-color: var(--bg-light);
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px var(--shadow-color);
        }
        
        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
        }
        
        .modal-content {
            position: relative;
            background-color: var(--bg-light);
            margin: 10% auto;
            padding: 0;
            width: 500px;
            max-width: 90%;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            animation: modalFadeIn 0.3s ease;
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 18px;
        }
        
        .close-modal-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-light);
        }
        
        .close-modal-btn:hover {
            color: var(--text-color);
        }
        
        .modal-body {
            padding: 20px;
        }
        
        /* Stock Search Styles */
        .stock-search-container {
            margin-bottom: 15px;
        }
        
        .stock-search-results {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid var(--border-color);
            border-radius: 4px;
        }
        
        .stock-search-result {
            padding: 10px 15px;
            border-bottom: 1px solid var(--border-color);
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .stock-search-result:last-child {
            border-bottom: none;
        }
        
        .stock-search-result:hover {
            background-color: rgba(26, 115, 232, 0.1);
        }
        
        .stock-search-result-name {
            font-weight: 500;
            margin-bottom: 5px;
        }
        
        .stock-search-result-meta {
            font-size: 12px;
            color: var(--text-light);
        }
        
        .no-results {
            padding: 15px;
            text-align: center;
            color: var(--text-light);
        }
        
        /* Empty Comparison Styles */
        .empty-comparison {
            text-align: center;
            padding: 60px 20px;
            background-color: var(--bg-light);
            border-radius: 8px;
            box-shadow: 0 2px 8px var(--shadow-color);
        }
        
        .empty-comparison-icon {
            font-size: 48px;
            color: var(--text-light);
            margin-bottom: 20px;
        }
        
        .empty-comparison h3 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .empty-comparison p {
            font-size: 16px;
            color: var(--text-light);
            margin-bottom: 20px;
        }
    `;
    document.head.appendChild(style);
});
