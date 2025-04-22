// Define users data
const users = [
    {
        id: 1,
        username: "demo",
        password: "password123", // In a real app, this would be hashed
        email: "demo@example.com",
        name: "Demo User",
        isPremium: false,
        watchlist: ["TCS", "RELIANCE", "HDFCBANK"],
        savedScreens: [
            {
                id: 1,
                name: "High ROE Companies",
                criteria: [
                    { id: "roe", min: 20, max: 100 },
                    { id: "marketCap", min: 10000, max: 2000000 }
                ]
            },
            {
                id: 2,
                name: "Dividend Champions",
                criteria: [
                    { id: "dividendYield", min: 2, max: 20 },
                    { id: "marketCap", min: 5000, max: 2000000 }
                ]
            }
        ]
    },
    {
        id: 2,
        username: "premium",
        password: "premium123", // In a real app, this would be hashed
        email: "premium@example.com",
        name: "Premium User",
        isPremium: true,
        watchlist: ["INFY", "HINDUNILVR", "BHARTIARTL", "ASIANPAINT"],
        savedScreens: [
            {
                id: 1,
                name: "Value Stocks",
                criteria: [
                    { id: "pe", min: 0, max: 15 },
                    { id: "roe", min: 15, max: 100 },
                    { id: "marketCap", min: 1000, max: 2000000 }
                ]
            }
        ]
    }
];

// Function to authenticate a user
function authenticateUser(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // Create a copy without the password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
}

// Make users data and authentication function globally available
if (typeof window !== 'undefined') {
    window.users = users;
    window.authenticateUser = authenticateUser;
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = { users, authenticateUser };
}
