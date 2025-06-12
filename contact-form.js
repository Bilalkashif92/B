document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const successModal = document.querySelector('.contact-success-modal');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields');
                return;
            }
            
            // In a real implementation, you would send the form data to your server here
            console.log('Form submitted:', { name, email, subject, message });
            
            // Show success modal
            successModal.classList.add('active');
            document.querySelector('.overlay').classList.add('active');
            document.body.classList.add('no-scroll');
            
            // Reset form
            contactForm.reset();
        });
    }

});
// Updated contact-form.js
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Rest of form validation...
    });
}