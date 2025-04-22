// Define screening criteria
const screeningCriteria = [
    {
        id: "marketCap",
        name: "Market Cap",
        type: "range",
        unit: "Cr",
        min: 0,
        max: 2000000,
        description: "Total market value of a company's outstanding shares"
    },
    {
        id: "pe",
        name: "P/E Ratio",
        type: "range",
        unit: "",
        min: 0,
        max: 200,
        description: "Price-to-earnings ratio"
    },
    {
        id: "roe",
        name: "ROE",
        type: "range",
        unit: "%",
        min: -50,
        max: 100,
        description: "Return on equity"
    },
    {
        id: "roce",
        name: "ROCE",
        type: "range",
        unit: "%",
        min: -50,
        max: 100,
        description: "Return on capital employed"
    },
    {
        id: "dividendYield",
        name: "Dividend Yield",
        type: "range",
        unit: "%",
        min: 0,
        max: 20,
        description: "Annual dividend per share divided by price per share"
    },
    {
        id: "sector",
        name: "Sector",
        type: "select",
        options: [
            "All Sectors",
            "IT Services",
            "Banking",
            "Financial Services",
            "Oil & Gas",
            "FMCG",
            "Automobiles",
            "Telecom",
            "Paints"
        ],
        description: "Industry sector of the company"
    },
    {
        id: "bookValue",
        name: "Book Value",
        type: "range",
        unit: "₹",
        min: 0,
        max: 5000,
        description: "Net asset value of a company's shares"
    }
];

// Make screening criteria globally available
if (typeof window !== 'undefined') {
    window.screeningCriteria = screeningCriteria;
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = { screeningCriteria };
}
