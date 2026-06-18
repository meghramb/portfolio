const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    try {
        // Replace with your local URL during testing, or your Render production link later
        const response = await fetch('/api/contact', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.get_json();

        if (response.ok) {
            alert("Success! Check your inbox.");
            document.getElementById("contactForm").reset(); // Clear inputs
        } else {
            alert("Error: " + result.error);
        }
    } catch (err) {
        console.error("Network connectivity issue:", err);
        alert("Failed to reach the backend application server.");
    }
};


document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year in Footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            if (body.classList.contains('light-theme')) {
                if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // 3. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.add('hidden');
        });
    });

    // 4. Typed.js Initialization
    if (typeof Typed !== 'undefined' && document.querySelector('#typed-text')) {
        new Typed('#typed-text', {
            strings: ['Web Developer', 'Python Programmer', 'MCA Student', 'AI Enthusiast'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            cursorChar: '|'
        });
    }

    // 5. Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // 6. Project Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.style.backgroundColor = 'transparent';
                b.style.color = 'currentColor';
            });

            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                card.classList.remove('show');
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => card.classList.add('show'), 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // 7. Parallax scroll tracking for the Hero section blob
    const parallaxWrapper = document.getElementById('parallax-wrapper');
    if (parallaxWrapper) {
        window.addEventListener('scroll', () => {
            if (window.scrollY <= window.innerHeight) {
                const scrolled = window.scrollY;
                parallaxWrapper.style.transform = `translateY(${scrolled * 0.4}px)`;
                parallaxWrapper.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
            }
        });
    }

    // 8. Scroll to Top Button Logic
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 9. Navbar Scroll Spy
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(item => item.classList.remove('active-nav'));
                const currentId = entry.target.getAttribute('id');
                const activeLinks = document.querySelectorAll(`.nav-item[href="#${currentId}"]`);
                activeLinks.forEach(link => link.classList.add('active-nav'));
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});

// 10. Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// 11. Contact Form Backend Connection
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Stop page from refreshing

        // Get the values the user typed
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Change button text so the user knows it's loading
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin ml-2"></i>';

        try {
            // Send the data to your Flask backend
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Success! Your message has been sent.');
                contactForm.reset(); // Clear the form
            } else {
                alert('Error: ' + result.error);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            alert('Could not connect to the server. Please ensure the backend is running.');
        } finally {
            // Put the button text back to normal
            submitBtn.innerHTML = originalBtnText;
        }
    });
}
