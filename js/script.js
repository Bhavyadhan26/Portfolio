// Track loading state of all components
let state = {
    navbarLoaded: false,
    footerLoaded: false,
    iframesLoaded: 0,
    totalIframes: 0
};

// Utility function to fetch content with error handling
function fetchContent(url, element) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .catch(error => {
            console.error(`Failed to load ${url}:`, error);
            element.innerHTML = '<p>Content temporarily unavailable. Please refresh the page.</p>';
            throw error;
        });
}

// Check if all content is loaded and initialize page
function checkAllContentLoaded() {
    if (state.navbarLoaded && 
        state.footerLoaded && 
        state.iframesLoaded === state.totalIframes) {
        document.body.classList.add('loaded');
        document.documentElement.classList.add('loaded');
    }
}

// Handle iframe height adjustments using ResizeObserver
function adjustIframeHeight(iframe) {
    try {
        const observer = new ResizeObserver(() => {
            const height = iframe.contentWindow.document.body.scrollHeight;
            iframe.style.height = `${height}px`;
        });
        
        if (iframe.contentWindow && iframe.contentWindow.document.body) {
            observer.observe(iframe.contentWindow.document.body);
        }
    } catch (error) {
        console.error("Error adjusting iframe height:", error);
        // Fallback method
        try {
            const height = iframe.contentWindow.document.body.scrollHeight;
            iframe.style.height = `${height}px`;
        } catch (e) {
            console.error("Fallback iframe adjustment failed:", e);
        }
    }
}

// Handle screen resize and menu visibility
function handleScreenResize() {
    const hamburger = document.querySelector('.hamburger');
    const navbarRight = document.querySelector('.navbar-right');
    
    if (hamburger && navbarRight) {
        if (window.innerWidth > 768) {
            hamburger.style.display = 'none';
            navbarRight.style.display = 'flex';
            navbarRight.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('modal-open');
        } else {
            hamburger.style.display = 'flex';
            if (!navbarRight.classList.contains('active')) {
                navbarRight.style.display = 'none';
            }
        }
    }
}

// Initialize hamburger menu functionality
function initializeHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navbarRight = document.querySelector('.navbar-right');
    
    if (hamburger && navbarRight) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navbarRight.classList.toggle('active');
            navbarRight.style.display = navbarRight.classList.contains('active') ? 'flex' : 'none';
            document.body.classList.toggle('modal-open', navbarRight.classList.contains('active'));
        });
    }
}

function initializeSmoothScrolling() {
    document.querySelectorAll('.navbar-right a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if no href
            if (!href) return;

            // Handle cross-page navigation with hash
            if (href.includes('#')) {
                const [pagePath, hash] = href.split('#');
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';

                // If we're on a different page, let the normal navigation happen
                if (pagePath && pagePath !== currentPage) {
                    // Just let the normal navigation occur
                    return;
                }

                // If we're on the same page, handle smooth scrolling
                e.preventDefault();
                const targetElement = document.getElementById(hash);
                
                // Close mobile menu
                if (window.innerWidth <= 768) {
                    const hamburger = document.querySelector('.hamburger');
                    const navbarRight = document.querySelector('.navbar-right');
                    if (hamburger && navbarRight) {
                        hamburger.classList.remove('active');
                        navbarRight.classList.remove('active');
                        navbarRight.style.display = 'none';
                        document.body.classList.remove('modal-open');
                    }
                }

                // Scroll if target exists
                if (targetElement) {
                    setTimeout(() => {
                        targetElement.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 100);
                }
            }
        });
    });
}

// Modal functionality
function openModal() {
    const modal = document.getElementById("resumeModal");
    const hamburger = document.querySelector('.hamburger');
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
        if (hamburger) {
            hamburger.style.display = "none";
        }
    }
}

function closeModal() {
    const modal = document.getElementById("resumeModal");
    const hamburger = document.querySelector('.hamburger');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        if (hamburger && window.innerWidth <= 768) {
            hamburger.style.display = "flex";
            const navbarRight = document.querySelector('.navbar-right');
            if (navbarRight) {
                navbarRight.classList.remove('active');
                navbarRight.style.display = 'none';
                hamburger.classList.remove('active');
            }
        }
    }
}

// Main initialization
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const iframes = document.querySelectorAll("iframe");
    
    // Set total iframes count
    state.totalIframes = iframes.length;

    // Load navbar
    if (header) {
        fetchContent("navbar.html", header)
            .then(data => {
                header.innerHTML = data;
                initializeHamburgerMenu();
                initializeSmoothScrolling();
                handleScreenResize();
                state.navbarLoaded = true;
                checkAllContentLoaded();
            });
    }

    // Load footer
    if (footer) {
        fetchContent("footer.html", footer)
            .then(data => {
                footer.innerHTML = data;
                state.footerLoaded = true;
                checkAllContentLoaded();
            });
    }

    // Initialize iframes
    iframes.forEach((iframe) => {
        iframe.onload = () => {
            adjustIframeHeight(iframe);
            state.iframesLoaded++;
            checkAllContentLoaded();
        };
    });

    // Debounced resize handler
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            iframes.forEach(adjustIframeHeight);
            handleScreenResize();
        }, 250);
    });
});

// Handle page load completion
window.addEventListener("load", () => {
    checkAllContentLoaded();
});