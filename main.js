// DOM Elements
const mobileMenuBtn = document.querySelector('.btn-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const overlay = document.querySelector('.overlay');
const cartBtn = document.querySelector('.cart-btn');
const cartDrawer = document.querySelector('.cart-drawer');
const closeCartBtn = document.querySelector('.btn-close-cart');
const header = document.querySelector('.header');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});

// Cart Toggle
cartBtn.addEventListener('click', () => {
    cartDrawer.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
});

closeCartBtn.addEventListener('click', () => {
    cartDrawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
});

overlay.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    cartDrawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Testimonials Slider
const testimonialsSlider = document.querySelector('.testimonials-slider');
if (testimonialsSlider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    testimonialsSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - testimonialsSlider.offsetLeft;
        scrollLeft = testimonialsSlider.scrollLeft;
        testimonialsSlider.style.cursor = 'grabbing';
    });

    testimonialsSlider.addEventListener('mouseleave', () => {
        isDown = false;
        testimonialsSlider.style.cursor = 'grab';
    });

    testimonialsSlider.addEventListener('mouseup', () => {
        isDown = false;
        testimonialsSlider.style.cursor = 'grab';
    });

    testimonialsSlider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - testimonialsSlider.offsetLeft;
        const walk = (x - startX) * 2;
        testimonialsSlider.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    testimonialsSlider.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - testimonialsSlider.offsetLeft;
        scrollLeft = testimonialsSlider.scrollLeft;
    });

    testimonialsSlider.addEventListener('touchend', () => {
        isDown = false;
    });

    testimonialsSlider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - testimonialsSlider.offsetLeft;
        const walk = (x - startX) * 2;
        testimonialsSlider.scrollLeft = scrollLeft - walk;
    });
}

// Newsletter Form
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        
        // Here you would typically send the data to your server
        console.log('Subscribed with email:', email);
        
        // Show success message
        alert('Thank you for subscribing to BK Threads!');
        newsletterForm.reset();
    });
}

// Initialize animations with Intersection Observer
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.collection-card, .brand-story__image, .testimonial');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
};

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    
    // Set current year in footer
    const yearElement = document.querySelector('.footer__legal p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = yearElement.textContent.replace('2023', currentYear);
    }
});
