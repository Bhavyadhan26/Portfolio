// Fetch and inject navbar and footer
document.addEventListener("DOMContentLoaded", function() {
    fetch("navbar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.querySelector("header").innerHTML = data;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation for navbar:', error);
        });

    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("footer").innerHTML = data;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation for footer:', error);
        });
});

// Sticky left column functionality
document.addEventListener('DOMContentLoaded', () => {
    const leftColumn = document.querySelector('.left-column');
    const rightColumn = document.querySelector('.right-column');

    const handleScroll = () => {
        const rightColumnRect = rightColumn.getBoundingClientRect();
        const leftColumnRect = leftColumn.getBoundingClientRect();
        
        // Check if right column is scrolled through
        if (rightColumnRect.bottom <= window.innerHeight) {
            leftColumn.style.position = 'static';
        } else {
            leftColumn.style.position = 'sticky';
        }
    };

    window.addEventListener('scroll', handleScroll);
});

// Fullscreen menu toggle functionality
document.addEventListener("DOMContentLoaded", () => {
    const navigateButton = document.getElementById("navigateButton");
    const fullScreenMenu = document.getElementById("fullScreenMenu");
    const closeButton = document.getElementById("closeButton");

    navigateButton.addEventListener("click", () => {
        fullScreenMenu.classList.add("show");
    });

    closeButton.addEventListener("click", () => {
        fullScreenMenu.classList.remove("show");
    });
});

// Enhanced smooth scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    const contentSection = document.querySelector('.content');
    const aboutMeSection = document.querySelector('#aboutme');
    let isScrolling = false; // Flag to lock the scroll

    // Function to check if content section is in viewport
    function isContentInView() {
        const rect = contentSection.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }

    // Function to check if about me section is in viewport
    function isAboutMeInView() {
        const rect = aboutMeSection.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }

    window.addEventListener('wheel', function(event) {
        if (isScrolling) return; // Prevent other scroll actions if already scrolling

        // Scroll down from content section to about me
        if (isContentInView() && event.deltaY > 0) {
            isScrolling = true;
            const headerHeight = document.querySelector('header').offsetHeight;
            
            window.scrollTo({
                top: aboutMeSection.offsetTop - headerHeight,
                behavior: 'smooth'
            });

            setTimeout(() => {
                isScrolling = false;
            }, 1000); // Timeout to allow scrolling to complete
        }

        // Scroll up from about me section to the top of the page
        if (isAboutMeInView() && event.deltaY < 0) {
            isScrolling = true;
            const headerHeight = document.querySelector('header').offsetHeight;
            
            window.scrollTo({
                top: 0, // Scroll to the top of the page
                behavior: 'smooth'
            });

            setTimeout(() => {
                isScrolling = false;
            }, 1000); // Timeout to allow scrolling to complete
        }
    });
});

// Add loaded class to html and body once the page is fully loaded
window.addEventListener('load', () => {
    document.documentElement.classList.add('loaded');
    document.body.classList.add('loaded');
});
// Dynamic iframe height adjustment for multiple iframes
document.addEventListener('DOMContentLoaded', function () {
    const iframes = document.querySelectorAll('iframe');

    function adjustIframeHeight(iframe) {
        const iframeContentHeight = iframe.contentWindow.document.body.scrollHeight;
        iframe.style.height = iframeContentHeight + 'px';
    }

    iframes.forEach(iframe => {
        iframe.onload = () => adjustIframeHeight(iframe);
    });

    window.addEventListener('resize', () => {
        iframes.forEach(adjustIframeHeight);
    });
});
window.onload = function() {
    if(window.location.hash) {
        document.querySelector(window.location.hash).scrollIntoView({behavior: "smooth"});
    }
};
