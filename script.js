// Add smooth fade-in animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('main').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('main').style.transition = 'opacity 1s ease-in';
        document.querySelector('main').style.opacity = '1';
    }, 100);
}); 