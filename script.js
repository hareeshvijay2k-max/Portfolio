// ============================================
// Theme Toggle Functionality
// ============================================

const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

// Update button text based on current theme
function updateThemeButtonText() {
    const theme = htmlElement.getAttribute('data-theme');
    themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Initialize button text
updateThemeButtonText();

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonText();
});

// ============================================
// Smooth Scroll for Navigation Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Contact Form Submission
// ============================================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
            alert('Please fill in all fields.');
            return;
        }
        
        // Log form data (in a real application, send to a server)
        console.log('Form Submitted:', { name, email, message });
        
        // Show success message
        alert(`Thank you, ${name}! Your message has been sent. I'll get back to you soon.`);
        
        // Reset form
        contactForm.reset();
    });
}

// ============================================
// Intersection Observer for Animations
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe skill cards and project cards for fade-in animation
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out';
    observer.observe(card);
});

// ============================================
// Active Navigation Link Highlighting
// ============================================

const navLinks = document.querySelectorAll('.nav-list a');

window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// Add Active Link Styling
// ============================================

const style = document.createElement('style');
style.textContent = `
    .nav-list a.active {
        color: var(--color-primary);
        font-weight: 700;
    }
    
    .nav-list a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ============================================
// Mobile Menu Toggle (Optional Enhancement)
// ============================================

// You can add a hamburger menu for mobile devices here
// This is a placeholder for future enhancement

console.log('Portfolio script loaded successfully!');