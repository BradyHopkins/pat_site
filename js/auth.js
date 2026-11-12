// js/auth.js
// Handle login/signup with Supabase authentication

import { supabase } from './supabase-client.js'

// Get form elements
const loginForm = document.getElementById('loginForm')
const signupForm = document.getElementById('signupForm')
const resetPasswordForm = document.getElementById('resetPasswordForm')
const loginFormElement = document.getElementById('loginFormElement')
const signupFormElement = document.getElementById('signupFormElement')
const resetPasswordFormElement = document.getElementById('resetPasswordFormElement')
const loginBtn = document.getElementById('loginBtn')
const signupBtn = document.getElementById('signupBtn')
const resetBtn = document.getElementById('resetBtn')
const loginMessage = document.getElementById('loginMessage')
const signupMessage = document.getElementById('signupMessage')
const resetMessage = document.getElementById('resetMessage')

// True only when the page was opened from a Supabase password-reset email
// link. Guards against immediately redirecting the user away before they
// get a chance to set a new password (see checkAuthStatus below).
let isPasswordRecovery = window.location.hash.includes('type=recovery')

// Toggle between login and signup forms
window.toggleForms = function() {
    loginForm.classList.toggle('hidden')
    signupForm.classList.toggle('hidden')
    loginMessage.className = 'auth-message'
    signupMessage.className = 'auth-message'
}

// Show the "set a new password" form and hide the others
function showResetPasswordForm() {
    isPasswordRecovery = true
    loginForm.classList.add('hidden')
    signupForm.classList.add('hidden')
    resetPasswordForm.classList.remove('hidden')
}

// Supabase fires this event once it has parsed the recovery link in the
// URL and created a temporary "recovery" session.
supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
        showResetPasswordForm()
    }
})

// Also check immediately in case the event fires before this script
// finishes loading.
if (isPasswordRecovery) {
    showResetPasswordForm()
}

// Handle login
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const email = document.getElementById('loginEmail').value.trim()
    const password = document.getElementById('loginPassword').value
    
    if (!email || !password) {
        showLoginMessage('Please fill in all fields', 'error')
        return
    }
    
    loginBtn.disabled = true
    loginBtn.textContent = 'Logging in...'
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        
        if (error) throw error
        
        console.log('✅ Logged in as:', data.user.email)
        showLoginMessage('✅ Login successful! Redirecting...', 'success')
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html'
        }, 2000)
        
    } catch (error) {
        console.error('Login error:', error)
        showLoginMessage(`❌ ${error.message}`, 'error')
        loginBtn.disabled = false
        loginBtn.textContent = 'Login'
    }
})

// Handle signup
signupFormElement.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const email = document.getElementById('signupEmail').value.trim()
    const password = document.getElementById('signupPassword').value
    const confirmPassword = document.getElementById('signupConfirmPassword').value
    
    // Validate
    if (!email || !password || !confirmPassword) {
        showSignupMessage('Please fill in all fields', 'error')
        return
    }
    
    if (password.length < 8) {
        showSignupMessage('Password must be at least 8 characters', 'error')
        return
    }
    
    if (password !== confirmPassword) {
        showSignupMessage('Passwords do not match', 'error')
        return
    }
    
    if (!isValidEmail(email)) {
        showSignupMessage('Please enter a valid email address', 'error')
        return
    }
    
    signupBtn.disabled = true
    signupBtn.textContent = 'Creating account...'
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })
        
        if (error) throw error
        
        console.log('✅ Account created:', data.user.email)
        showSignupMessage('✅ Account created! Check your email to confirm.', 'success')
        
        // Clear form
        signupFormElement.reset()
        
        // Reset button after delay
        setTimeout(() => {
            signupBtn.disabled = false
            signupBtn.textContent = 'Sign Up'
        }, 5000)
        
    } catch (error) {
        console.error('Signup error:', error)
        showSignupMessage(`❌ ${error.message}`, 'error')
        signupBtn.disabled = false
        signupBtn.textContent = 'Sign Up'
    }
})

// Handle forgot password
window.forgotPassword = async function() {
    const email = document.getElementById('loginEmail').value.trim()

    if (!email) {
        showLoginMessage('Enter your email above, then click "Forgot Password"', 'error')
        return
    }

    if (!isValidEmail(email)) {
        showLoginMessage('Please enter a valid email address', 'error')
        return
    }

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/login.html'
        })

        if (error) throw error

        showLoginMessage('✅ Password reset email sent. Check your inbox.', 'success')
    } catch (error) {
        showLoginMessage(`❌ ${error.message}`, 'error')
    }
}

// Show login message
function showLoginMessage(text, type) {
    loginMessage.textContent = text
    loginMessage.className = `auth-message ${type}`
}

// Show signup message
function showSignupMessage(text, type) {
    signupMessage.textContent = text
    signupMessage.className = `auth-message ${type}`
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Handle setting a new password (password-recovery flow)
resetPasswordFormElement.addEventListener('submit', async (e) => {
    e.preventDefault()

    const newPassword = document.getElementById('newPassword').value
    const confirmNewPassword = document.getElementById('confirmNewPassword').value

    if (!newPassword || !confirmNewPassword) {
        showResetMessage('Please fill in both fields', 'error')
        return
    }

    if (newPassword.length < 8) {
        showResetMessage('Password must be at least 8 characters', 'error')
        return
    }

    if (newPassword !== confirmNewPassword) {
        showResetMessage('Passwords do not match', 'error')
        return
    }

    resetBtn.disabled = true
    resetBtn.textContent = 'Updating...'

    try {
        const { error } = await supabase.auth.updateUser({ password: newPassword })

        if (error) throw error

        showResetMessage('✅ Password updated! Redirecting to login...', 'success')
        isPasswordRecovery = false

        setTimeout(async () => {
            // Sign out of the temporary recovery session so the user logs
            // in fresh with their new password.
            await supabase.auth.signOut()
            window.location.href = 'login.html'
        }, 2000)

    } catch (error) {
        console.error('Reset password error:', error)
        showResetMessage(`❌ ${error.message}`, 'error')
        resetBtn.disabled = false
        resetBtn.textContent = 'Update Password'
    }
})

// Show reset-password message
function showResetMessage(text, type) {
    resetMessage.textContent = text
    resetMessage.className = `auth-message ${type}`
}

// Check if user is already logged in
async function checkAuthStatus() {
    // Don't redirect away during a password-recovery flow - the user needs
    // to stay on this page to set their new password.
    if (isPasswordRecovery) return

    try {
        const { data, error } = await supabase.auth.getUser()
        
        if (data.user) {
            console.log('✅ User already logged in:', data.user.email)
            // Redirect to home if already logged in
            window.location.href = 'index.html'
        }
    } catch (error) {
        console.log('No user logged in:', error.message)
    }
}

// Check auth status on page load
document.addEventListener('DOMContentLoaded', checkAuthStatus)

console.log('✅ Auth module loaded')
