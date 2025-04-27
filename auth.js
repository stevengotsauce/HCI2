// Authentication System for CPSU Confession Wall

const AuthSystem = {
  currentUser: null,
  
  // Initialize auth listeners
  init() {
    // Check for existing session
    this.checkSession();
    
    // Setup UI elements
    this.setupAuthUI();
    
    // Add CSS for auth components
    this.addAuthStyles();
  },
  
  // Check if user has a valid session
  checkSession() {
    // Check both storage locations for token
    const localToken = localStorage.getItem('auth_token');
    const sessionToken = sessionStorage.getItem('auth_token');
    const token = localToken || sessionToken;
    
    if (token) {
      // Validate token (would call your backend in real implementation)
      this.validateToken(token)
        .then(user => this.setLoggedInState(user))
        .catch(() => this.logout()); // Invalid token
    }
  },
  
  // Validate token with backend
  async validateToken(token) {
    // In real implementation, this would call your backend
    // For now, we'll simulate a response
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (token && token.length > 10) {
          const [username] = token.split('_');
          resolve({
            id: "user123",
            username: username,
            email: username.split('-')[1] + "@gmail.com",
            role: "student",
            campus: "CPSU-Main"
          });
        } else {
          reject(new Error("Invalid token"));
        }
      }, 300);
    });
  },
  
  // Setup login/register UI
  setupAuthUI() {
    // Enhanced login button - open modal instead of direct login
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => this.showLoginModal());
    }
    
    // Logout with confirmation
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        this.showConfirmDialog({
          title: "Log Out",
          message: "Are you sure you want to log out of your account?",
          onSelect: () => this.logout()
        });
      });
    }
  },
  
  // Show login modal with tabs for login/register
  showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'auth-modal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-user-circle"></i> Account Access</h2>
          <span class="close"><i class="fas fa-times"></i></span>
        </div>
        
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login">Login</button>
          <button class="auth-tab" data-tab="register">Register</button>
        </div>
        
        <div class="auth-tab-content" id="login-tab">
          <div class="form-group">
            <label for="login-email">Email:</label>
            <input type="email" id="login-email" placeholder="your.email@gmail.com">
          </div>
          
          <div class="form-group">
            <label for="login-password">Password:</label>
            <div class="password-input-group">
              <input type="password" id="login-password" placeholder="••••••••">
              <button type="button" class="password-toggle">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="remember-me">
              <span class="checkbox-text">Remember me</span>
            </label>
          </div>
          
          <div class="auth-button-container">
            <button id="login-submit" class="primary-btn">
              <i class="fas fa-sign-in-alt"></i> Login
            </button>
          </div>
          
          <div class="auth-links">
            <a href="#" id="forgot-password">Forgot password?</a>
          </div>
        </div>
        
        <div class="auth-tab-content" id="register-tab" style="display: none;">
          <div class="form-group">
            <label for="register-email">Email:</label>
            <input type="email" id="register-email" placeholder="your.email@gmail.com">
            <small class="form-helper">Must be a valid email address</small>
          </div>
          
          <div class="form-group">
            <label for="register-password">Password:</label>
            <div class="password-input-group">
              <input type="password" id="register-password" placeholder="••••••••">
              <button type="button" class="password-toggle">
                <i class="fas fa-eye"></i>
              </button>
            </div>
            <div class="password-strength"></div>
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirm Password:</label>
            <div class="password-input-group">
              <input type="password" id="confirm-password" placeholder="••••••••">
              <button type="button" class="password-toggle">
                <i class="fas fa-eye"></i>
              </button>
            </div>
            <small class="form-helper">Please confirm your password</small>
          </div>
          
          <div class="form-group">
            <label for="register-campus">Campus:</label>
            <select id="register-campus" class="select-styled">
              <option value="">Select your campus</option>
              <option value="CPSU-Main">CPSU-Main</option>
              <option value="CPSU-San Carlos">CPSU-San Carlos</option>
              <option value="CPSU-Victorias">CPSU-Victorias</option>
              <option value="CPSU-Moises Padilla">CPSU-Moises Padilla</option>
              <option value="CPSU-Sipalay">CPSU-Sipalay</option>
              <option value="CPSU-Hinigaran">CPSU-Hinigaran</option>
              <option value="CPSU-Hinoba-an">CPSU-Hinoba-an</option>
              <option value="CPSU-Cauayan">CPSU-Cauayan</option>
              <option value="CPSU-Candoni">CPSU-Candoni</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="terms-agree">
              <span class="checkbox-text">I agree to the <a href="#">Terms & Conditions</a></span>
            </label>
          </div>
          
          <div class="auth-button-container">
            <button id="register-submit" class="primary-btn" disabled>
              <i class="fas fa-user-plus"></i> Create Account
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Append to body and setup event listeners
    document.body.appendChild(modal);
    this.setupModalEvents(modal);
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10);
  },
  
  // Setup events for auth modal
  setupModalEvents(modal) {
    // Close modal
    modal.querySelector('.close').addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });
    
    // Tab switching
    modal.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        modal.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding content
        const tabName = tab.dataset.tab;
        modal.querySelectorAll('.auth-tab-content').forEach(c => c.style.display = 'none');
        modal.querySelector(`#${tabName}-tab`).style.display = 'block';
      });
    });
    
    // Login form submission
    const loginSubmit = modal.querySelector('#login-submit');
    loginSubmit.addEventListener('click', () => {
      const email = modal.querySelector('#login-email').value;
      const password = modal.querySelector('#login-password').value;
      const remember = modal.querySelector('#remember-me').checked;
      
      this.loginUser(email, password, remember);
    });
    
    // Register form submission
    const registerSubmit = modal.querySelector('#register-submit');
    const termsCheckbox = modal.querySelector('#terms-agree');
    
    // Enable/disable register button based on terms agreement
    termsCheckbox.addEventListener('change', () => {
      registerSubmit.disabled = !termsCheckbox.checked;
    });
    
    registerSubmit.addEventListener('click', () => {
      const email = modal.querySelector('#register-email').value;
      const password = modal.querySelector('#register-password').value;
      const confirmValue = modal.querySelector('#confirm-password').value;
      const campus = modal.querySelector('#register-campus').value;
      
      if (password !== confirmValue) {
        showNotification("Passwords do not match", "error");
        return;
      }
      
      this.registerUser(email, password, campus);
    });
    
    // Forgot password
    modal.querySelector('#forgot-password').addEventListener('click', (e) => {
      e.preventDefault();
      this.showForgotPasswordUI();
    });
    
    // Add password strength meter
    const passwordInput = modal.querySelector('#register-password');
    const strengthMeter = modal.querySelector('.password-strength');
    
    passwordInput.addEventListener('input', () => {
      const strength = this.checkPasswordStrength(passwordInput.value);
      
      strengthMeter.innerHTML = '';
      strengthMeter.className = 'password-strength';
      
      if (passwordInput.value) {
        strengthMeter.classList.add(strength.level);
        strengthMeter.innerHTML = `
          <div class="strength-bar"></div>
          <span>${strength.message}</span>
        `;
      }
    });
    
    // Email validation
    const emailInput = modal.querySelector('#register-email');
    emailInput.addEventListener('blur', () => {
      const email = emailInput.value;
      if (email && !email.includes('@gmail.com')) {
        emailInput.classList.add('invalid');
        const helper = modal.querySelector('.form-helper');
        helper.classList.add('error');
        helper.textContent = 'Please use a Gmail address';
      } else {
        emailInput.classList.remove('invalid');
        const helper = modal.querySelector('.form-helper');
        helper.classList.remove('error');
        helper.textContent = 'Must be a valid email address';
      }
    });

    // Add password toggle functionality
    modal.querySelectorAll('.password-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const input = toggle.previousElementSibling;
        const icon = toggle.querySelector('i');
        
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    });

    // Add password confirmation validation
    const registerPassword = modal.querySelector('#register-password');
    const confirmPassword = modal.querySelector('#confirm-password');
    const confirmHelper = confirmPassword.nextElementSibling;

    confirmPassword.addEventListener('input', () => {
      if (confirmPassword.value && confirmPassword.value !== registerPassword.value) {
        confirmPassword.classList.add('invalid');
        confirmHelper.classList.add('error');
        confirmHelper.textContent = 'Passwords do not match';
      } else {
        confirmPassword.classList.remove('invalid');
        confirmHelper.classList.remove('error');
        confirmHelper.textContent = 'Please confirm your password';
      }
    });
  },
  
  // Check password strength
  checkPasswordStrength(password) {
    if (!password) {
      return { level: 'none', message: '' };
    }
    
    // Check password strength
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const length = password.length;
    
    let strength = 0;
    if (length >= 8) strength++;
    if (length >= 10) strength++;
    if (hasLower && hasUpper) strength++;
    if (hasNumber) strength++;
    if (hasSpecial) strength++;
    
    if (strength < 2) {
      return { level: 'weak', message: 'Weak password' };
    } else if (strength < 4) {
      return { level: 'medium', message: 'Medium strength' };
    } else {
      return { level: 'strong', message: 'Strong password' };
    }
  },
  
  // Login user
  async loginUser(email, password, remember) {
    try {
      // Basic validation
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }
      
      showNotification("Logging in...", "info");
      
      // Simulate backend call
      const user = await this.authenticateUser(email, password);
      
      // Store auth token in appropriate storage
      const token = user.token;
      if (remember) {
        localStorage.setItem('auth_token', token);
        sessionStorage.removeItem('auth_token'); // Clear session storage
      } else {
        sessionStorage.setItem('auth_token', token);
        localStorage.removeItem('auth_token'); // Clear local storage
      }
      
      // Set logged in state
      this.setLoggedInState(user);
      
      // Close modal
      const modal = document.getElementById('auth-modal');
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
      
      showNotification("Logged in successfully!", "success");
    } catch (error) {
      // Show a more prominent error message for login failures
      if (error.message === "Invalid credentials") {
        showNotification("Login failed: Invalid email or password. Please try again.", "error");
      } else {
        showNotification("Login failed: " + error.message, "error");
      }
    }
  },
  
  // Register new user
  async registerUser(email, password, campus) {
    try {
      // Basic validation
      if (!email || !password || !campus) {
        throw new Error('Please fill in all required fields');
      }
      
      // Validate email domain
      if (!email.includes('@gmail.com')) {
        throw new Error('Please use your Gmail address');
      }
      
      // Validate password strength
      const strength = this.checkPasswordStrength(password);
      if (strength.level === 'weak') {
        throw new Error('Please choose a stronger password');
      }
      
      showNotification("Creating your account...", "info");
      
      // Simulate backend call
      const user = await this.createUser(email, password, campus);
      
      // Store auth token
      localStorage.setItem('auth_token', user.token);
      
      // Set logged in state
      this.setLoggedInState(user);
      
      // Close modal
      const modal = document.getElementById('auth-modal');
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
      
      // Show welcome message
      showNotification("Account created successfully!", "success");
      
      // Show onboarding tooltip
      this.showOnboardingTip();
    } catch (error) {
      showNotification("Registration failed: " + error.message, "error");
    }
  },
  
  // Authenticate user (simulate backend call)
  async authenticateUser(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Basic validation
        if (!email || !password) {
          reject(new Error("Email and password are required"));
          return;
        }

        // Find user in stored users
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
          reject(new Error("No account found with this email"));
          return;
        }

        if (user.password !== password) { // In real app, compare hashed passwords
          reject(new Error("Invalid password"));
          return;
        }

        // User authenticated successfully
        const userData = {
          ...user,
          token: `${user.username}_${Date.now()}`
        };
        
        delete userData.password; // Don't include password in session data
        resolve(userData);
      }, 800);
    });
  },
  
  // Create new user (simulate backend call)
  async createUser(email, password, campus) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6 && campus) {
          // Check if user already exists
          if (this.users.some(u => u.email === email)) {
            reject(new Error("Email already registered"));
            return;
          }

          const username = this.getOrGenerateUsername(email);
          const userData = {
            id: "user" + Math.floor(Math.random() * 1000),
            email: email,
            username: username, // Store the consistent username
            password: password,
            campus: campus,
            role: "student"
          };
          
          this.users.push(userData);
          localStorage.setItem('registered_users', JSON.stringify(this.users));
          
          userData.token = `${username}_${Date.now()}`;
          resolve(userData);
        } else {
          reject(new Error("Please fill all required fields"));
        }
      }, 1000);
    });
  },

  // Add new function to get stored username or generate new one
  getOrGenerateUsername(email) {
    // Check if user already exists and has a username
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser && existingUser.username) {
      return existingUser.username;
    }
    
    // Create hash from email to ensure consistency
    const hash = Array.from(email)
      .reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) >>> 0, 0)
      .toString(36)
      .substring(0, 4);
    
    const words = ["Shadow", "Mystic", "Echo", "Nova", "Blaze", "Phoenix", "Zen", "Titan"];
    const wordIndex = parseInt(hash, 36) % words.length;
    
    return `Cenphilian-${words[wordIndex]}${hash}`;
  },
  
  // Set the UI to logged in state
  setLoggedInState(user) {
    this.currentUser = user;
    window.isLoggedIn = true;
    
    // Update UI
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const postBtn = document.getElementById('post-btn');
    
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) {
      logoutBtn.style.display = "inline-flex";
      logoutBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
    }
    
    // Make sure post button is displayed properly
    if (postBtn) {
      postBtn.style.display = "flex";
    } else {
      // If post button doesn't exist yet, create a floating post button
      const newPostBtn = document.createElement('button');
      newPostBtn.id = 'post-btn';
      newPostBtn.className = 'floating-btn-option2';
      newPostBtn.innerHTML = `
        <div class="icon-section">
          <i class="fas fa-plus"></i>
        </div>
        <div class="text-section">
          Post Confession
        </div>
      `;
      document.body.appendChild(newPostBtn);
      
      // Add event listener for new post button
      newPostBtn.addEventListener('click', () => {
        if (typeof openPostModal === 'function') {
          openPostModal();
        } else {
          showNotification("Post functionality not available", "error");
        }
      });
    }
    
    // If admin, show admin link
    if (user.role === 'admin' || user.role === 'moderator') {
      const headerActions = document.querySelector('.header-actions');
      if (headerActions && !document.getElementById('admin-link')) {
        const adminLink = document.createElement('a');
        adminLink.id = 'admin-link';
        adminLink.href = 'admin.html';
        adminLink.className = 'primary-btn';
        adminLink.innerHTML = '<i class="fas fa-shield-alt"></i> Admin';
        headerActions.insertBefore(adminLink, logoutBtn);
      }
    }
    
    // Update all displays
    if (typeof updateAllDisplays === 'function') {
      updateAllDisplays();
    }
  },
  
  // Log user out
  logout() {
    this.currentUser = null;
    window.isLoggedIn = false;
    
    // Clear both storage types
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    
    // Update UI
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const postBtn = document.getElementById('post-btn');
    
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (postBtn) postBtn.style.display = "none";
    
    // Remove admin link if exists
    const adminLink = document.getElementById('admin-link');
    if (adminLink) adminLink.remove();
    
    // Update displays
    if (typeof updateAllDisplays === 'function') {
      updateAllDisplays();
    }
    
    showNotification("Logged out successfully", "success");
  },
  
  // Show forgot password UI
  showForgotPasswordUI() {
    const modal = document.getElementById('auth-modal');
    const loginTab = modal.querySelector('#login-tab');
    
    // Save original content to restore later
    const originalContent = loginTab.innerHTML;
    
    // Replace with password reset form
    loginTab.innerHTML = `
      <div class="password-reset-form">
        <h3>Reset Your Password</h3>
        <p>Enter your email address to receive a password reset link.</p>
        
        <div class="form-group">
          <label for="reset-email">Email:</label>
          <input type="email" id="reset-email" placeholder="your.email@gmail.com">
        </div>
        
        <div class="form-actions">
          <button id="send-reset" class="primary-btn">
            <i class="fas fa-paper-plane"></i> Send Reset Link
          </button>
          <button id="back-to-login" class="primary-btn" style="background-color: #777; margin-top: 10px;">
            <i class="fas fa-arrow-left"></i> Back to Login
          </button>
        </div>
      </div>
    `;
    
    // Setup event listeners
    const sendResetBtn = loginTab.querySelector('#send-reset');
    sendResetBtn.addEventListener('click', () => {
      const email = loginTab.querySelector('#reset-email').value;
      this.requestPasswordReset(email);
    });
    
    const backBtn = loginTab.querySelector('#back-to-login');
    backBtn.addEventListener('click', () => {
      // Restore original content
      loginTab.innerHTML = originalContent;
      this.setupModalEvents(modal);
    });
  },
  
  // Request password reset
  async requestPasswordReset(email) {
    try {
      if (!email) {
        throw new Error('Please enter your email');
      }
      
      if (!email.includes('@gmail.com')) {
        throw new Error('Please use your Gmail address');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success
      const modal = document.getElementById('auth-modal');
      const loginTab = modal.querySelector('#login-tab');
      
      loginTab.innerHTML = `
        <div class="reset-success">
          <i class="fas fa-check-circle"></i>
          <h3>Reset Link Sent</h3>
          <p>We've sent a password reset link to ${email}. Please check your inbox.</p>
          <button id="back-to-login" class="primary-btn">
            Return to Login
          </button>
        </div>
      `;
      
      // Setup back button
      loginTab.querySelector('#back-to-login').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
          modal.remove();
          this.showLoginModal();
        }, 300);
      });
      
    } catch (error) {
      showNotification(error.message, "error");
    }
  },
  
  // Show confirmation dialog
  showConfirmDialog({ title, message, options = [], onSelect }) {
    // Remove any existing dialogs first
    const existingDialogs = document.querySelectorAll('.confirm-dialog');
    existingDialogs.forEach(dialog => dialog.remove());
    
    const dialog = document.createElement('div');
    dialog.className = 'modal';  
    dialog.id = 'logout-modal';
    
    dialog.innerHTML = `
      <div class="modal-content" style="max-width: 360px;">
        <div class="modal-header">
          <h2><i class="fas fa-sign-out-alt"></i> ${title}</h2>
          <span class="close"><i class="fas fa-times"></i></span>
        </div>
        
        <div class="modal-body">
          <p style="text-align: center; margin-bottom: 20px;">${message}</p>
          ${options.length ? `
            <div class="form-group">
              <select id="confirm-select" class="select-styled">
                ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
              </select>
            </div>
          ` : ''}
        </div>
        
        <div class="modal-footer">
          <div style="display: flex; justify-content: center; width: 100%; gap: 16px;">
            <button class="primary-btn btn-cancel" style="background-color: #777; width: 120px;">
              <i class="fas fa-times"></i> Cancel
            </button>
            <button class="primary-btn btn-confirm" style="width: 120px;">
              <i class="fas fa-check"></i> Confirm
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Show the dialog with animation
    setTimeout(() => dialog.classList.add('show'), 10);
    
    // Confirm button handler
    dialog.querySelector('.btn-confirm').addEventListener('click', () => {
      const reason = options.length 
        ? dialog.querySelector('#confirm-select').value 
        : null;
      dialog.classList.remove('show');
      setTimeout(() => {
        dialog.remove();
        onSelect(reason);
      }, 300);
    });
    
    // Cancel button and close icon handler
    const closeModal = () => {
      dialog.classList.remove('show');
      setTimeout(() => dialog.remove(), 300);
    };
    
    dialog.querySelector('.btn-cancel').addEventListener('click', closeModal);
    dialog.querySelector('.close').addEventListener('click', closeModal);
    
    // Click outside to close
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        closeModal();
      }
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('logout-modal')) {
        closeModal();
      }
    });
  },
  
  // Show onboarding tip for new users
  showOnboardingTip() {
    setTimeout(() => {
      const tip = document.createElement('div');
      tip.className = 'onboarding-tip';
      tip.innerHTML = `
        <div class="tip-content">
          <i class="fas fa-lightbulb"></i>
          <h3>Welcome to CPSU Confessions!</h3>
          <p>Click the "Post Confession" button to share your first anonymous confession.</p>
          <button class="primary-btn">Got it!</button>
        </div>
      `;
      
      document.body.appendChild(tip);
      
      // Animate in
      setTimeout(() => tip.classList.add('show'), 10);
      
      // Close button
      tip.querySelector('button').addEventListener('click', () => {
        tip.classList.remove('show');
        setTimeout(() => tip.remove(), 300);
      });
      
      // Auto close after delay
      setTimeout(() => {
        if (document.body.contains(tip)) {
          tip.classList.remove('show');
          setTimeout(() => tip.remove(), 300);
        }
      }, 6000);
    }, 1000);
  },
  
  // Add CSS for auth components
  addAuthStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #auth-modal {
        z-index: 9999;
      }

      #auth-modal .modal-content {
        border-radius: 12px;
        width: 100%;
        max-width: 400px;  /* Increased from 360px */
        margin: 50px auto;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        padding: 0;
        overflow: hidden;
      }
      
      #auth-modal .modal-header {
        background-color: #0B6623;
        color: white;
        padding: 16px 20px;
        font-size: 1.2rem;
        border-radius: 12px 12px 0 0;  /* Added to match top corners */
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      #auth-modal .auth-tabs {
        display: flex;
        width: 100%;
      }
      
      #auth-modal .auth-tab {
        flex: 1;
        padding: 16px 0;
        text-align: center;
        background-color: #F5F5F5;
        border: none;
        outline: none;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      #auth-modal .auth-tab.active {
        background-color: #0B6623;
        color: white;
      }
      
      #auth-modal .auth-tab-content {
        padding: 25px 20px;  /* Adjusted padding */
        background-color: white;
      }
      
      #auth-modal .form-group {
        margin-bottom: 20px;
      }
      
      #auth-modal label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        font-size: 1rem;
      }
      
      #auth-modal input[type="email"],
      #auth-modal input[type="password"] {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        box-sizing: border-box;
      }
      
      #auth-modal .checkbox-label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        margin-bottom: 20px;
      }
      
      #auth-modal .checkbox-text {
        font-size: 0.95rem;
        color: #555;
      }
      
      #auth-modal .primary-btn {
        width: 100%;
        padding: 14px 0;  /* Increased padding */
        background-color: #f9a825;
        color: white;
        border: none;
        border-radius: 0;  /* Removed border radius */
        font-size: 1rem;
        font-weight: 500;  /* Added font weight */
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        transition: all 0.2s;
      }
      
      /* Split button container for login/register forms */
      .auth-button-container {
        display: flex;
        justify-content: center;
        gap: 16px;  /* Match logout modal spacing */
      }

      .auth-button-container .primary-btn {
        width: 120px;  /* Match logout modal button width */
      }
      
      #auth-modal .primary-btn:hover {
        background-color: #f57f17;
      }
      
      #auth-modal .primary-btn:disabled {
        background-color: #ddd;
        cursor: not-allowed;
        color: #999;
      }
      
      #auth-modal .auth-links {
        margin-top: 20px;
        text-align: center;
      }
      
      #auth-modal .auth-links a {
        color: #0B6623;
        text-decoration: none;
        font-size: 0.95rem;
      }
      
      #auth-modal .auth-links a:hover {
        text-decoration: underline;
      }
      
      #auth-modal select {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        background-color: white;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 16px;
      }
      
      #auth-modal .form-helper {
        font-size: 0.8rem;
        color: #666;
        margin-top: 5px;
      }
      
      #auth-modal .form-helper.error {
        color: #f44336;
      }
      
      #auth-modal input.invalid {
        border-color: #f44336;
      }
      
      .password-strength {
        margin-top: 8px;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .password-strength.weak {
        color: #f44336;
      }
      
      .password-strength.medium {
        color: #ff9800;
      }
      
      .password-strength.strong {
        color: #4caf50;
      }
      
      .strength-bar {
        height: 4px;
        width: 100px;
        background-color: #e0e0e0;
        position: relative;
      }
      
      .password-strength.weak .strength-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 30%;
        background-color: #f44336;
      }
      
      .password-strength.medium .strength-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 60%;
        background-color: #ff9800;
      }
      
      .password-strength.strong .strength-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: #4caf50;
      }
      
      .reset-success {
        text-align: center;
        padding: 20px;
      }
      
      .reset-success i {
        color: #4caf50;
        margin-bottom: 20px;
        font-size: 3rem;
      }
      
      .reset-success h3 {
        margin-bottom: 15px;
        font-size: 1.25rem;
      }
      
      .reset-success p {
        margin-bottom: 25px;
        color: #555;
      }
      
      .onboarding-tip {
        position: fixed;
        bottom: 80px;
        right: 20px;
        background-color: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        padding: 0;
        width: 300px;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        overflow: hidden;
      }
      
      .onboarding-tip.show {
        transform: translateY(0);
        opacity: 1;
      }
      
      .tip-content {
        padding: 20px;
      }
      
      .tip-content i {
        color: #ffc107;
        font-size: 24px;
        margin-bottom: 10px;
      }
      
      .tip-content h3 {
        margin-top: 10px;
        margin-bottom: 10px;
        font-size: 1.1rem;
      }
      
      .tip-content p {
        margin-bottom: 15px;
        font-size: 0.9rem;
        line-height: 1.4;
      }
      
      /* Dark mode styles */
      body.dark-mode #auth-modal .auth-tab-content {
        background-color: #333;
        color: #eee;
      }
      
      body.dark-mode #auth-modal .auth-tab {
        background-color: #444;
        color: #ccc;
      }
      
      body.dark-mode #auth-modal .auth-tab.active {
        background-color: #0B6623;
        color: white;
      }
      
      body.dark-mode #auth-modal .checkbox-text {
        color: #ccc;
      }
      
      body.dark-mode #auth-modal .auth-links a {
        color: #8BC34A;
      }
      
      body.dark-mode #auth-modal input[type="email"],
      body.dark-mode #auth-modal input[type="password"],
      body.dark-mode #auth-modal select {
        background-color: #444;
        border-color: #555;
        color: #eee;
      }
      
      body.dark-mode #auth-modal .form-helper {
        color: #ccc;
      }
      
      body.dark-mode #auth-modal .form-helper.error {
        color: #f77;
      }
      
      body.dark-mode .onboarding-tip {
        background-color: #333;
        color: #fff;
      }
      
      body.dark-mode .reset-success p {
        color: #ccc;
      }

      .password-input-group {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: white;
        transition: all 0.2s;
      }

      .password-input-group:focus-within {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(11, 102, 35, 0.1);
      }

      .password-input-group input {
        flex: 1;
        padding: 12px;
        border: none;
        background: none;
        outline: none;
        font-size: 1rem;
      }

      .password-toggle {
        padding: 8px 12px;
        border: none;
        background: none;
        color: #666;
        cursor: pointer;
        transition: color 0.2s;
        outline: none; /* Remove outline */
      }

      .password-toggle:focus {
        outline: none; /* Remove outline on focus */
      }

      .password-toggle:hover {
        color: #333;
      }

      /* Dark mode adjustments */
      body.dark-mode .password-input-group {
        background-color: #444;
        border-color: #555;
      }

      body.dark-mode .password-input-group input {
        color: #eee;
      }

      body.dark-mode .password-toggle {
        color: #aaa;
      }

      body.dark-mode .password-toggle:hover {
        color: #fff;
      }
      
      @media (max-width: 520px) {
        #auth-modal .modal-content {
          margin: 20px 10px;
          max-width: calc(100% - 20px);
          min-width: 320px;  /* Added minimum width */
        }
      }
    `;
    
    document.head.appendChild(style);
  },

  // Add user storage
  users: JSON.parse(localStorage.getItem('registered_users')) || [],

  // Update createUser to store registration
  async createUser(email, password, campus) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6 && campus) {
          // Check if user already exists
          if (this.users.some(u => u.email === email)) {
            reject(new Error("Email already registered"));
            return;
          }

          const username = this.getOrGenerateUsername(email);
          const userData = {
            id: "user" + Math.floor(Math.random() * 1000),
            email: email,
            username: username, // Store the consistent username
            password: password, // In real app, hash password
            campus: campus,
            role: "student"
          };
          
          // Store user in users array
          this.users.push(userData);
          localStorage.setItem('registered_users', JSON.stringify(this.users));
          
          // Create token for session
          userData.token = `${username}_${Date.now()}`;
          resolve(userData);
        } else {
          reject(new Error("Please fill all required fields"));
        }
      }, 1000);
    });
  },

  // Update authenticateUser to validate against stored users
  async authenticateUser(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Basic validation
        if (!email || !password) {
          reject(new Error("Email and password are required"));
          return;
        }

        // Find user in stored users
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
          reject(new Error("No account found with this email"));
          return;
        }

        if (user.password !== password) { // In real app, compare hashed passwords
          reject(new Error("Invalid password"));
          return;
        }

        // User authenticated successfully
        const userData = {
          ...user,
          token: `${user.username}_${Date.now()}`
        };
        
        delete userData.password; // Don't include password in session data
        resolve(userData);
      }, 800);
    });
  },

  // Add new function to get stored username or generate new one
  getOrGenerateUsername(email) {
    // Check if user already exists and has a username
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser && existingUser.username) {
      return existingUser.username;
    }
    
    // Create hash from email to ensure consistency
    const hash = Array.from(email)
      .reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) >>> 0, 0)
      .toString(36)
      .substring(0, 4);
    
    const words = ["Shadow", "Mystic", "Echo", "Nova", "Blaze", "Phoenix", "Zen", "Titan"];
    const wordIndex = parseInt(hash, 36) % words.length;
    
    return `Cenphilian-${words[wordIndex]}${hash}`;
  },
};

// Initialize auth system on page load
window.addEventListener('DOMContentLoaded', () => {
  AuthSystem.init();
});
