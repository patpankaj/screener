// Authentication functionality

// Function to initialize login page
function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    // Setup toggle password visibility
    setupPasswordToggle('password', 'toggle-password');

    // Setup form validation
    setupFormValidation();

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember')?.checked || false;

        // Validate inputs
        if (!username || !password) {
            showLoginError('Please enter both username and password');
            highlightEmptyFields(['username', 'password']);
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitBtn.disabled = true;

        // Simulate API call delay
        setTimeout(() => {
            // Authenticate user
            const user = authenticateUser(username, password);
            if (user) {
                // Save user data
                localStorage.setItem('currentUser', JSON.stringify(user));

                // Save remember me preference
                if (remember) {
                    localStorage.setItem('rememberedUser', username);
                } else {
                    localStorage.removeItem('rememberedUser');
                }

                // Show success message
                showLoginSuccess('Login successful! Redirecting...');

                // Redirect after a short delay
                setTimeout(() => {
                    const redirect = getUrlParameter('redirect');
                    window.location.href = redirect || 'index.html';
                }, 1000);
            } else {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Show error
                showLoginError('Invalid username or password');
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
            }
        }, 1000);
    });

    // Check for remembered user
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('remember').checked = true;
        document.getElementById('password').focus();
    }
}

// Function to initialize register page
function initRegisterPage() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    // Setup toggle password visibility
    setupPasswordToggle('password', 'toggle-password');
    setupPasswordToggle('confirm-password', 'toggle-confirm-password');

    // Setup form validation
    setupFormValidation();

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const termsAccepted = document.getElementById('terms')?.checked || false;

        // Validate inputs
        if (!name || !email || !username || !password || !confirmPassword) {
            showRegisterError('Please fill in all required fields');
            highlightEmptyFields(['name', 'email', 'username', 'password', 'confirm-password']);
            return;
        }

        // Validate email format
        if (!isValidEmail(email)) {
            showRegisterError('Please enter a valid email address');
            highlightField('email');
            return;
        }

        // Validate password strength
        if (password.length < 8) {
            showRegisterError('Password must be at least 8 characters long');
            highlightField('password');
            return;
        }

        if (password !== confirmPassword) {
            showRegisterError('Passwords do not match');
            highlightField('confirm-password');
            return;
        }

        if (!termsAccepted) {
            showRegisterError('You must accept the Terms of Service and Privacy Policy');
            highlightField('terms');
            return;
        }

        // Check if username exists
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            showRegisterError('Username already exists');
            highlightField('username');
            return;
        }

        // Check if email exists
        const existingEmail = users.find(u => u.email === email);
        if (existingEmail) {
            showRegisterError('Email address is already registered');
            highlightField('email');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        submitBtn.disabled = true;

        // Simulate API call delay
        setTimeout(() => {
            // Create new user
            const newUser = {
                id: users.length + 1,
                name: name,
                email: email,
                username: username,
                password: password, // In a real app, this would be hashed
                isPremium: false,
                watchlist: [],
                savedScreens: []
            };

            // Add to users array
            users.push(newUser);

            // Save user data
            localStorage.setItem('currentUser', JSON.stringify(newUser));

            // Show success message
            showRegisterSuccess('Account created successfully! Redirecting...');

            // Redirect after a short delay
            setTimeout(() => {
                const redirect = getUrlParameter('redirect');
                window.location.href = redirect || 'index.html';
            }, 1500);
        }, 1500);
    });
}

// Function to setup password toggle
function setupPasswordToggle(passwordId, toggleId) {
    const passwordInput = document.getElementById(passwordId);
    const toggleButton = document.getElementById(toggleId);

    if (passwordInput && toggleButton) {
        toggleButton.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    }
}

// Function to setup form validation
function setupFormValidation() {
    const inputs = document.querySelectorAll('.form-control');

    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove error highlighting when user starts typing
            this.classList.remove('is-invalid');

            // Hide error message when user starts typing
            const formId = this.closest('form').id;
            if (formId === 'login-form') {
                document.getElementById('login-error').style.display = 'none';
            } else if (formId === 'register-form') {
                document.getElementById('register-error').style.display = 'none';
            }
        });
    });
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to highlight empty fields
function highlightEmptyFields(fieldIds) {
    fieldIds.forEach(id => {
        const field = document.getElementById(id);
        if (field && !field.value.trim()) {
            field.classList.add('is-invalid');
        }
    });
}

// Function to highlight a specific field
function highlightField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('is-invalid');
        field.focus();
    }
}

// Function to authenticate user
function authenticateUser(username, password) {
    // In a real app, this would make an API call
    return users.find(u => u.username === username && u.password === password);
}

// Function to show login error
function showLoginError(message) {
    const errorElement = document.getElementById('login-error');
    const errorMessageElement = document.getElementById('error-message');

    if (errorElement && errorMessageElement) {
        errorMessageElement.textContent = message;
        errorElement.style.display = 'block';

        // Add shake animation
        errorElement.classList.add('shake');
        setTimeout(() => {
            errorElement.classList.remove('shake');
        }, 500);
    }
}

// Function to show login success
function showLoginSuccess(message) {
    const errorElement = document.getElementById('login-error');
    if (errorElement) {
        errorElement.className = 'alert alert-success';
        errorElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        errorElement.style.display = 'block';
    }
}

// Function to show register error
function showRegisterError(message) {
    const errorElement = document.getElementById('register-error');
    const errorMessageElement = document.getElementById('error-message');

    if (errorElement && errorMessageElement) {
        errorMessageElement.textContent = message;
        errorElement.style.display = 'block';

        // Add shake animation
        errorElement.classList.add('shake');
        setTimeout(() => {
            errorElement.classList.remove('shake');
        }, 500);
    }
}

// Function to show register success
function showRegisterSuccess(message) {
    const errorElement = document.getElementById('register-error');
    if (errorElement) {
        errorElement.className = 'alert alert-success';
        errorElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        errorElement.style.display = 'block';
    }
}

// Add shake animation to CSS
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
            animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        .is-invalid {
            border-color: #EA4335 !important;
            box-shadow: 0 0 0 2px rgba(234, 67, 53, 0.25) !important;
        }
    `;
    document.head.appendChild(style);
});
