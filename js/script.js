// Fetch and inject navbar and footer
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const iframes = document.querySelectorAll("iframe");

    if (header) {
        fetch("navbar.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then(data => {
                header.innerHTML = data;
                // Initialize hamburger menu after navbar is loaded
                initializeHamburgerMenu();
                // Initial check for screen size
                handleScreenResize();
            })
            .catch(error => {
                console.error("There has been a problem with your fetch operation for navbar:", error);
            });
    }

    if (footer) {
        fetch("footer.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then(data => {
                footer.innerHTML = data;
            })
            .catch(error => {
                console.error("There has been a problem with your fetch operation for footer:", error);
            });
    }

    function adjustIframeHeight(iframe) {
        try {
            const iframeContentHeight = iframe.contentWindow.document.body.scrollHeight;
            iframe.style.height = iframeContentHeight + "px";
        } catch (error) {
            console.error("Error adjusting iframe height:", error);
        }
    }

    iframes.forEach((iframe) => {
        iframe.onload = () => adjustIframeHeight(iframe);
    });

    window.addEventListener("resize", () => {
        iframes.forEach(adjustIframeHeight);
        handleScreenResize();
    });
});

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
        } else {
            hamburger.style.display = 'flex';
            navbarRight.style.display = 'none';
            navbarRight.classList.remove('active');
        }
    }
}
// Modal functionality for resume
function openModal() {
    const modal = document.getElementById("resumeModal");
    const hamburger = document.querySelector('.hamburger');
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent background scrolling
        if (hamburger) {
            hamburger.style.display = "none"; // Hide hamburger when modal is open
        }
    }
}

function closeModal() {
    const modal = document.getElementById("resumeModal");
    const hamburger = document.querySelector('.hamburger');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Restore scrolling
        if (hamburger && window.innerWidth <= 768) {
            hamburger.style.display = "flex"; // Show hamburger when modal is closed (only on mobile)
            // Also ensure menu is closed when modal closes
            const navbarRight = document.querySelector('.navbar-right');
            if (navbarRight) {
                navbarRight.classList.remove('active');
                navbarRight.style.display = 'none';
                hamburger.classList.remove('active');
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

        // Close mobile menu when clicking a link
        document.querySelectorAll('.navbar-right a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    hamburger.classList.remove('active');
                    navbarRight.classList.remove('active');
                    navbarRight.style.display = 'none';
                }
            });
        });
    }
}

// Add loaded class to html and body once the page is fully loaded
window.addEventListener("load", () => {
    document.documentElement.classList.add("loaded");
    document.body.classList.add("loaded");
});

