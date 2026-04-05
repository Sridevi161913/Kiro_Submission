// SafeContacts - Emergency Contact Manager
const STORAGE_KEY = 'safeContacts';

// DOM Elements
const contactForm = document.getElementById('contactForm');
const contactNameInput = document.getElementById('contactName');
const contactPhoneInput = document.getElementById('contactPhone');
const contactsList = document.getElementById('contactsList');
const emptyState = document.getElementById('emptyState');

// Load contacts from LocalStorage
function loadContacts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Save contacts to LocalStorage
function saveContacts(contacts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

// Generate unique ID
function generateId() {
    return Date.now().toString();
}

// Render contacts list
function renderContacts() {
    const contacts = loadContacts();
    
    if (contacts.length === 0) {
        contactsList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    contactsList.innerHTML = contacts.map(contact => `
        <div class="contact-card" data-id="${contact.id}">
            <div class="contact-info">
                <div class="contact-name">${escapeHtml(contact.name)}</div>
                <div class="contact-phone">${escapeHtml(contact.phone)}</div>
            </div>
            <div class="contact-actions">
                <button class="btn btn-call" onclick="callContact('${contact.id}')">📞 Call</button>
                <button class="btn btn-delete" onclick="deleteContact('${contact.id}')">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add new contact
function addContact(name, phone) {
    const contacts = loadContacts();
    const newContact = {
        id: generateId(),
        name: name.trim(),
        phone: phone.trim()
    };
    
    contacts.push(newContact);
    saveContacts(contacts);
    renderContacts();
}

// Call contact (simulated)
function callContact(id) {
    const contacts = loadContacts();
    const contact = contacts.find(c => c.id === id);
    
    if (contact) {
        alert(`📞 Calling ${contact.name} at ${contact.phone}\n\n(This is a simulation. In a real app, this would initiate a phone call.)`);
    }
}

// Delete contact
function deleteContact(id) {
    const contacts = loadContacts();
    const contact = contacts.find(c => c.id === id);
    
    if (contact && confirm(`Delete ${contact.name} from emergency contacts?`)) {
        const updatedContacts = contacts.filter(c => c.id !== id);
        saveContacts(updatedContacts);
        renderContacts();
    }
}

// Handle form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = contactNameInput.value;
    const phone = contactPhoneInput.value;
    
    if (name && phone) {
        addContact(name, phone);
        contactForm.reset();
        contactNameInput.focus();
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderContacts();
});
