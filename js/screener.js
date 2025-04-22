// Initialize global variables
let companies = window.companies || [];
let ratios = window.ratios || {};
let financials = window.financials || {};
let screeningCriteria = window.screeningCriteria || [];

// Screener page functionality
function initScreenerPage() {
    // Check if required data is available
    if (!screeningCriteria || !companies) {
        showError('Required data not available. Please try refreshing the page.');
        return;
    }

    // Show loading state
    showLoading();

    try {
        // Render screening form
        renderScreeningForm();

        // Check if there's a saved screen in URL
        const screenId = getUrlParameter('screen');
        if (screenId && currentUser && currentUser.savedScreens) {
            const savedScreen = currentUser.savedScreens.find(s => s.id.toString() === screenId);
            if (savedScreen) {
                loadSavedScreen(savedScreen);
            }
        }

        // Add event listeners
        setupScreeningForm();

        // Hide loading state
        hideLoading();
    } catch (error) {
        console.error('Error initializing screener page:', error);
        showError('Failed to initialize screener. Please try refreshing the page.');
        hideLoading();
    }
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

// Function to initialize the screener
function initializeScreener() {
    try {
        // Check if required data is available
        if (!companies || companies.length === 0) {
            throw new Error('Companies data not available');
        }

        if (!screeningCriteria || screeningCriteria.length === 0) {
            throw new Error('Screening criteria not available');
        }

        // Initialize the UI
        renderScreeningForm();
        setupEventListeners();
        
        console.log('Screener initialized successfully');
    } catch (error) {
        console.error('Error initializing screener:', error);
        showError('Failed to initialize screener: ' + error.message);
    }
}

// Function to show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <p>${message}</p>
        <button onclick="location.reload()">Retry</button>
    `;
    document.body.appendChild(errorDiv);
}

// Function to render screening form
function renderScreeningForm() {
    const formContainer = document.getElementById('screening-form');
    if (!formContainer) return;

    let formHtml = '';

    // Add search box for quick filtering
    formHtml += `
        <div class="filter-search mb-4">
            <input type="text" id="filter-search" class="form-control" placeholder="Search for criteria...">
            <i class="fas fa-search search-icon"></i>
        </div>
        <div class="filter-sections">
    `;

    // Group criteria by category
    const categories = {
        'Market': ['marketCap', 'currentPrice'],
        'Valuation': ['pe', 'bookValue'],
        'Performance': ['roe', 'roce', 'dividendYield'],
        'General': ['sector']
    };

    // Render criteria by category
    Object.keys(categories).forEach(category => {
        formHtml += `
            <div class="filter-category">
                <h4 class="filter-category-title">
                    <i class="fas fa-chevron-down"></i> ${category}
                </h4>
                <div class="filter-category-content">
        `;

        // Get criteria for this category
        const categoryCriteria = screeningCriteria.filter(c => categories[category].includes(c.id));

        // Render each criteria in this category
        categoryCriteria.forEach(criteria => {
            if (criteria.type === 'range') {
                formHtml += `
                    <div class="filter-group" data-criteria-id="${criteria.id}" data-criteria-name="${criteria.name.toLowerCase()}">
                        <label class="filter-label">${criteria.name} ${criteria.unit ? `(${criteria.unit})` : ''}</label>
                        <div class="range-inputs">
                            <input type="number" id="${criteria.id}-min" class="form-control" placeholder="Min" min="${criteria.min}" max="${criteria.max}">
                            <span>to</span>
                            <input type="number" id="${criteria.id}-max" class="form-control" placeholder="Max" min="${criteria.min}" max="${criteria.max}">
                        </div>
                        <div class="range-slider" id="${criteria.id}-slider"></div>
                        <small class="text-muted">${criteria.description}</small>
                    </div>
                `;
            } else if (criteria.type === 'select') {
                formHtml += `
                    <div class="filter-group" data-criteria-id="${criteria.id}" data-criteria-name="${criteria.name.toLowerCase()}">
                        <label class="filter-label">${criteria.name}</label>
                        <select id="${criteria.id}" class="form-select">
                            ${criteria.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>
                        <small class="text-muted">${criteria.description}</small>
                    </div>
                `;
            }
        });

        formHtml += `
                </div>
            </div>
        `;
    });

    formHtml += `</div>`;

    // Add preset filters section
    formHtml += `
        <div class="preset-filters mt-4">
            <h4 class="filter-section-title">Preset Filters</h4>
            <div class="preset-buttons">
                <button class="btn btn-outline preset-btn" data-preset="high-growth">
                    <i class="fas fa-chart-line"></i> High Growth
                </button>
                <button class="btn btn-outline preset-btn" data-preset="value">
                    <i class="fas fa-coins"></i> Value Stocks
                </button>
                <button class="btn btn-outline preset-btn" data-preset="dividend">
                    <i class="fas fa-hand-holding-usd"></i> Dividend
                </button>
                <button class="btn btn-outline preset-btn" data-preset="large-cap">
                    <i class="fas fa-building"></i> Large Cap
                </button>
            </div>
        </div>
    `;

    formContainer.innerHTML = formHtml;

    // Setup filter search functionality
    setupFilterSearch();

    // Setup category toggles
    setupCategoryToggles();

    // Setup range sliders
    setupRangeSliders();

    // Setup preset filters
    setupPresetFilters();
}

// Function to setup filter search
function setupFilterSearch() {
    const searchInput = document.getElementById('filter-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const filterGroups = document.querySelectorAll('.filter-group');

        filterGroups.forEach(group => {
            const criteriaName = group.dataset.criteriaName;
            const criteriaId = group.dataset.criteriaId;

            if (criteriaName.includes(query) || criteriaId.includes(query)) {
                group.style.display = 'block';

                // Expand the category containing this filter
                const category = group.closest('.filter-category');
                if (category) {
                    const content = category.querySelector('.filter-category-content');
                    const icon = category.querySelector('.fa-chevron-down, .fa-chevron-right');

                    content.style.display = 'block';
                    if (icon) {
                        icon.classList.remove('fa-chevron-right');
                        icon.classList.add('fa-chevron-down');
                    }
                }
            } else {
                group.style.display = 'none';
            }
        });

        // If search is empty, reset display
        if (!query) {
            filterGroups.forEach(group => {
                group.style.display = 'block';
            });
        }
    });
}

// Function to setup category toggles
function setupCategoryToggles() {
    const categoryTitles = document.querySelectorAll('.filter-category-title');

    categoryTitles.forEach(title => {
        title.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');

            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-down');
            } else {
                content.style.display = 'none';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-right');
            }
        });
    });
}

// Function to setup range sliders
function setupRangeSliders() {
    // Add noUiSlider CSS
    const style = document.createElement('style');
    style.textContent = `
        .noUi-target {
            margin: 15px 0;
            height: 8px;
            background-color: #e0e0e0;
            border: none;
            box-shadow: none;
        }
        .noUi-connect {
            background-color: var(--primary-color);
        }
        .noUi-handle {
            width: 18px !important;
            height: 18px !important;
            border-radius: 50%;
            background-color: white;
            border: 2px solid var(--primary-color);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            cursor: pointer;
        }
        .noUi-handle:before, .noUi-handle:after {
            display: none;
        }
        .noUi-tooltip {
            font-size: 12px;
            padding: 4px 8px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);

    // Setup sliders for each range criteria
    screeningCriteria.forEach(criteria => {
        if (criteria.type === 'range') {
            const sliderId = `${criteria.id}-slider`;
            const sliderElement = document.getElementById(sliderId);

            if (sliderElement && typeof noUiSlider !== 'undefined') {
                noUiSlider.create(sliderElement, {
                    start: [criteria.min, criteria.max],
                    connect: true,
                    range: {
                        'min': criteria.min,
                        'max': criteria.max
                    },
                    step: criteria.id === 'dividendYield' ? 0.1 : 1,
                    tooltips: true,
                    format: {
                        to: function(value) {
                            return criteria.unit ? value + criteria.unit : value;
                        },
                        from: function(value) {
                            return value;
                        }
                    }
                });

                // Connect slider to input fields
                const minInput = document.getElementById(`${criteria.id}-min`);
                const maxInput = document.getElementById(`${criteria.id}-max`);

                sliderElement.noUiSlider.on('update', function(values, handle) {
                    const value = parseFloat(values[handle].replace(criteria.unit, ''));
                    if (handle === 0) {
                        minInput.value = value;
                    } else {
                        maxInput.value = value;
                    }
                });

                // Connect input fields to slider
                minInput.addEventListener('change', function() {
                    sliderElement.noUiSlider.set([this.value, null]);
                });

                maxInput.addEventListener('change', function() {
                    sliderElement.noUiSlider.set([null, this.value]);
                });
            }
        }
    });
}

// Function to setup preset filters
function setupPresetFilters() {
    const presetButtons = document.querySelectorAll('.preset-btn');

    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const preset = this.dataset.preset;

            // Clear all current filters
            clearScreen();

            // Apply preset filters
            switch (preset) {
                case 'high-growth':
                    document.getElementById('roe-min').value = 20;
                    document.getElementById('roce-min').value = 20;
                    document.getElementById('marketCap-min').value = 1000;
                    break;

                case 'value':
                    document.getElementById('pe-min').value = 5;
                    document.getElementById('pe-max').value = 15;
                    document.getElementById('bookValue-min').value = 100;
                    break;

                case 'dividend':
                    document.getElementById('dividendYield-min').value = 3;
                    break;

                case 'large-cap':
                    document.getElementById('marketCap-min').value = 20000;
                    break;
            }

            // Update sliders if they exist
            screeningCriteria.forEach(criteria => {
                if (criteria.type === 'range') {
                    const sliderId = `${criteria.id}-slider`;
                    const sliderElement = document.getElementById(sliderId);

                    if (sliderElement && sliderElement.noUiSlider) {
                        const minInput = document.getElementById(`${criteria.id}-min`);
                        const maxInput = document.getElementById(`${criteria.id}-max`);

                        sliderElement.noUiSlider.set([minInput.value || criteria.min, maxInput.value || criteria.max]);
                    }
                }
            });

            // Run screening with the preset filters
            runScreening();

            // Highlight the active preset button
            presetButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Function to setup screening form
function setupScreeningForm() {
    const runScreenBtn = document.getElementById('run-screen-btn');
    const saveScreenBtn = document.getElementById('save-screen-btn');
    const clearScreenBtn = document.getElementById('clear-screen-btn');

    if (runScreenBtn) {
        runScreenBtn.addEventListener('click', function() {
            runScreening();
        });
    }

    if (saveScreenBtn) {
        saveScreenBtn.addEventListener('click', function() {
            saveScreen();
        });
    }

    if (clearScreenBtn) {
        clearScreenBtn.addEventListener('click', function() {
            clearScreen();
        });
    }
}

// Function to run screening
function runScreening() {
    // Show loading state
    showLoading();

    try {
        // Get criteria values
        const criteria = [];

        screeningCriteria.forEach(c => {
            if (c.type === 'range') {
                const minInput = document.getElementById(`${c.id}-min`);
                const maxInput = document.getElementById(`${c.id}-max`);

                if (!minInput || !maxInput) {
                    throw new Error(`Missing input elements for criteria ${c.id}`);
                }

                const minValue = minInput.value;
                const maxValue = maxInput.value;

                if (minValue || maxValue) {
                    criteria.push({
                        id: c.id,
                        min: minValue ? parseFloat(minValue) : c.min,
                        max: maxValue ? parseFloat(maxValue) : c.max
                    });
                }
            } else if (c.type === 'select') {
                const select = document.getElementById(c.id);
                if (!select) {
                    throw new Error(`Missing select element for criteria ${c.id}`);
                }

                const value = select.value;
                if (value && value !== 'All Sectors') {
                    criteria.push({
                        id: c.id,
                        value: value
                    });
                }
            }
        });

        // Filter companies
        const results = filterCompanies(criteria);

        // Display results
        displayResults(results);

        // Hide loading state
        hideLoading();
    } catch (error) {
        console.error('Error running screening:', error);
        showError('Failed to run screening. Please try again.');
        hideLoading();
    }
}

// Function to filter companies
function filterCompanies(criteria) {
    return companies.filter(company => {
        // Check each criteria
        return criteria.every(c => {
            if (c.id === 'sector') {
                return company.sector === c.value;
            } else {
                // Range criteria
                const value = company[c.id];
                return value >= c.min && value <= c.max;
            }
        });
    });
}

// Function to display results
function displayResults(results) {
    const resultsContainer = document.getElementById('screening-results');
    if (!resultsContainer) return;

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                No companies match your criteria. Try adjusting your filters.
            </div>
        `;
        return;
    }

    // Create results table
    let tableHtml = `
        <div class="results-header">
            <div class="results-count">${results.length} companies found</div>
            <div class="results-actions">
                <button id="export-btn" class="btn btn-outline">
                    <i class="fas fa-download"></i> Export
                </button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="results-table">
                <thead>
                    <tr>
                        <th class="sortable" data-sort="name">Company</th>
                        <th class="sortable" data-sort="marketCap">Market Cap (Cr)</th>
                        <th class="sortable" data-sort="currentPrice">Price (₹)</th>
                        <th class="sortable" data-sort="pe">P/E</th>
                        <th class="sortable" data-sort="roe">ROE (%)</th>
                        <th class="sortable" data-sort="roce">ROCE (%)</th>
                        <th class="sortable" data-sort="dividendYield">Div Yield (%)</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // Add rows
    results.forEach(company => {
        tableHtml += `
            <tr>
                <td class="company-name-cell">
                    <a href="company.html?id=${company.id}">${company.name}</a>
                    <div class="sector-cell">${company.sector}</div>
                </td>
                <td>${formatNumber(company.marketCap)}</td>
                <td>${formatNumber(company.currentPrice)}</td>
                <td>${formatNumber(company.pe, 1)}</td>
                <td>${formatNumber(company.roe, 1)}</td>
                <td>${formatNumber(company.roce, 1)}</td>
                <td>${formatNumber(company.dividendYield, 2)}</td>
            </tr>
        `;
    });

    tableHtml += `
                </tbody>
            </table>
        </div>
    `;

    resultsContainer.innerHTML = tableHtml;

    // Add sorting functionality
    setupSorting();

    // Add export functionality
    setupExport(results);
}

// Function to setup sorting
function setupSorting() {
    const sortHeaders = document.querySelectorAll('.sortable');

    sortHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const sortField = this.dataset.sort;
            const isAsc = !this.classList.contains('sort-asc');

            // Remove sort classes from all headers
            sortHeaders.forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });

            // Add sort class to clicked header
            this.classList.add(isAsc ? 'sort-asc' : 'sort-desc');

            // Sort table
            sortTable(sortField, isAsc);
        });
    });
}

// Function to sort table
function sortTable(field, isAsc) {
    const table = document.querySelector('.results-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Sort rows
    rows.sort((a, b) => {
        let aValue, bValue;

        if (field === 'name') {
            aValue = a.querySelector('.company-name-cell a').textContent;
            bValue = b.querySelector('.company-name-cell a').textContent;
            return isAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
            // Get cell index
            const cellIndex = Array.from(table.querySelector('thead tr').cells).findIndex(cell =>
                cell.dataset.sort === field
            );

            // Get values
            aValue = parseFloat(a.cells[cellIndex].textContent.replace(/[₹,%]/g, '').trim());
            bValue = parseFloat(b.cells[cellIndex].textContent.replace(/[₹,%]/g, '').trim());

            return isAsc ? aValue - bValue : bValue - aValue;
        }
    });

    // Reorder rows
    rows.forEach(row => {
        tbody.appendChild(row);
    });
}

// Function to setup export
function setupExport(results) {
    const exportBtn = document.getElementById('export-btn');
    if (!exportBtn) return;

    exportBtn.addEventListener('click', function() {
        // Create CSV content
        let csv = 'Company,Sector,Market Cap (Cr),Price (₹),P/E,ROE (%),ROCE (%),Div Yield (%)\n';

        results.forEach(company => {
            csv += `"${company.name}","${company.sector}",${company.marketCap},${company.currentPrice},${company.pe},${company.roe},${company.roce},${company.dividendYield}\n`;
        });

        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'screener-results.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// Function to save screen
function saveScreen() {
    if (!currentUser) {
        // Redirect to login
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    try {
        // Get criteria values
        const criteria = [];

        screeningCriteria.forEach(c => {
            if (c.type === 'range') {
                const minInput = document.getElementById(`${c.id}-min`);
                const maxInput = document.getElementById(`${c.id}-max`);

                if (!minInput || !maxInput) {
                    throw new Error(`Missing input elements for criteria ${c.id}`);
                }

                const minValue = minInput.value;
                const maxValue = maxInput.value;

                if (minValue || maxValue) {
                    criteria.push({
                        id: c.id,
                        min: minValue ? parseFloat(minValue) : c.min,
                        max: maxValue ? parseFloat(maxValue) : c.max
                    });
                }
            } else if (c.type === 'select') {
                const select = document.getElementById(c.id);
                if (!select) {
                    throw new Error(`Missing select element for criteria ${c.id}`);
                }

                const value = select.value;
                if (value && value !== 'All Sectors') {
                    criteria.push({
                        id: c.id,
                        value: value
                    });
                }
            }
        });

        if (criteria.length === 0) {
            showError('Please set at least one filter criteria');
            return;
        }

        // Prompt for screen name
        const screenName = prompt('Enter a name for this screen:');
        if (!screenName) return;

        // Create screen object
        const screen = {
            id: Date.now(),
            name: screenName,
            criteria: criteria
        };

        // Add to saved screens
        if (!currentUser.savedScreens) {
            currentUser.savedScreens = [];
        }

        currentUser.savedScreens.push(screen);

        // Save user data
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Show success message
        alert('Screen saved successfully');
    } catch (error) {
        console.error('Error saving screen:', error);
        showError('Failed to save screen. Please try again.');
    }
}

// Function to clear screen
function clearScreen() {
    // Reset all inputs
    screeningCriteria.forEach(c => {
        if (c.type === 'range') {
            document.getElementById(`${c.id}-min`).value = '';
            document.getElementById(`${c.id}-max`).value = '';
        } else if (c.type === 'select') {
            document.getElementById(c.id).value = c.options[0];
        }
    });

    // Clear results
    const resultsContainer = document.getElementById('screening-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
}

// Function to load saved screen
function loadSavedScreen(screen) {
    // Set criteria values
    screen.criteria.forEach(c => {
        if (c.id === 'sector') {
            document.getElementById(c.id).value = c.value;
        } else {
            if (c.min !== undefined) {
                document.getElementById(`${c.id}-min`).value = c.min;
            }
            if (c.max !== undefined) {
                document.getElementById(`${c.id}-max`).value = c.max;
            }
        }
    });

    // Run screening
    runScreening();
}

async function loadData() {
    try {
        // Show loading state
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="spinner"></div>
            <p>Loading data...</p>
        `;
        document.body.appendChild(loadingIndicator);

        // Load all data in parallel
        const [companiesData, ratiosData, financialsData] = await Promise.all([
            fetch('data/companies.json').then(res => res.json()),
            fetch('data/ratios.json').then(res => res.json()),
            fetch('data/financials.json').then(res => res.json())
        ]);

        // Process data
        companies = companiesData;
        ratios = ratiosData;
        financials = financialsData;

        // Initialize screener
        initializeScreener();

        // Remove loading indicator
        loadingIndicator.remove();
    } catch (error) {
        console.error('Error loading data:', error);
        // Show error message to user
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <p>Error loading data. Please try refreshing the page.</p>
            <button onclick="location.reload()">Retry</button>
        `;
        document.body.appendChild(errorMessage);
    }
}

// Add CSS for loading indicator
const style = document.createElement('style');
style.textContent = `
    .loading-indicator {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
    .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .error-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        text-align: center;
    }
    .error-message button {
        margin-top: 10px;
        padding: 8px 16px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .error-message button:hover {
        background: #2980b9;
    }
`;
document.head.appendChild(style);
