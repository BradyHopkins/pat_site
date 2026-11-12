// js/contact.js
// Handles the contact form submission to Supabase

import { supabase } from './supabase-client.js'

const contactForm = document.getElementById('contactForm')
const nameInput = document.getElementById('name')
const emailInput = document.getElementById('email')
const messageInput = document.getElementById('message')
const submitBtn = document.getElementById('submitBtn')
const formMessage = document.getElementById('formMessage')

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        showMessage('❌ You must be logged in to send a message.', 'error')
        return
    }

    const name = nameInput.value.trim()
    const email = emailInput.value.trim()
    const message = messageInput.value.trim()

    if (!name || !email || !message) {
        showMessage('Please fill in all fields', 'error')
        return
    }

    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error')
        return
    }

    submitBtn.disabled = true
    submitBtn.textContent = 'Sending...'
    contactForm.classList.add('form-loading')

    try {
        const { data, error } = await supabase
            .from('contact_submissions')
            .insert([{ name, email, message, user_id: session.user.id }])
            .select()

        if (error) throw error

        showMessage('✅ Thank you! Your message has been sent. We\'ll get back to you soon.', 'success')
        contactForm.reset()
        nameInput.focus()

    } catch (error) {
        console.error('Error submitting contact:', error)
        showMessage(`❌ Error: ${error.message}. Please try again.`, 'error')

    } finally {
        submitBtn.disabled = false
        submitBtn.textContent = 'Submit'
        contactForm.classList.remove('form-loading')
    }
})

function showMessage(text, type) {
    formMessage.textContent = text
    formMessage.className = `form-message ${type}`

    if (type === 'success') {
        setTimeout(() => {
            formMessage.classList.remove('success')
        }, 5000)
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}
