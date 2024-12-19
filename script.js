// Wait for the page to load completely
window.addEventListener('load', () => {
    const menu = document.getElementById('menu');
    // Add the 'visible' class to fade in the menu
    menu.classList.remove('hidden');
    menu.classList.add('visible');
  });

window.addEventListener('load', () => {
    // First image (headshot)
    const firstImage = document.getElementById('headshot');
    firstImage.classList.remove('hiddenPic');
    firstImage.classList.add('visiblePic');
    
    /// Second image (LinkedIn icon)
    const secondImage = document.getElementById('linkedin');
    if (secondImage) {
        secondImage.classList.remove('hiddenPic');
        secondImage.classList.add('visiblePic');
    } 

    // Third image (GitHub icon)
    const thirdImage = document.getElementById('github');
    if (thirdImage) {
        thirdImage.classList.remove('hiddenPic');
        thirdImage.classList.add('visiblePic');
    } 

    // Fourth image (Email icon)
    const fourthImage = document.getElementById('email');
    if (fourthImage) {
        fourthImage.classList.remove('hiddenPic');
        fourthImage.classList.add('visiblePic');
    } 

    const introParagraph = document.getElementById('intro');
    introParagraph.classList.remove('hiddenPic');
    introParagraph.classList.add('visiblePic');
  });
  
// Select the button
const backToTopButton = document.getElementById('topButton');

// Listen for scroll events
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) { // Show the button after 300px of scrolling
        backToTopButton.classList.remove('hidden');
        backToTopButton.classList.add('visible');
    } else { // Hide the button if less than 300px is scrolled
        backToTopButton.classList.remove('visible');
        backToTopButton.classList.add('hidden');
    }
});

// Scroll back to the top when the button is clicked
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scrolling effect
    });
});