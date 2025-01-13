// JavaScript to track and restore scroll position on hover
document.querySelectorAll('.project-box').forEach(box => {
    let lastScrollPosition = 0;
  
    box.addEventListener('mouseenter', () => {
      // Store current scroll position before hovering
      lastScrollPosition = window.scrollY;
    });
  
    box.addEventListener('mouseleave', () => {
      // Restore the scroll position after hover
      window.scrollTo(0, lastScrollPosition);
    });
  });
  