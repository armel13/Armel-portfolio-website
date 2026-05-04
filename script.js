// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');
const themeToggleIconMobile = document.getElementById('theme-toggle-icon-mobile');

function updateThemeIcons(isDark) {
    if (isDark) {
        themeToggleIcon?.classList.remove('fa-moon');
        themeToggleIcon?.classList.add('fa-sun');
        themeToggleIconMobile?.classList.remove('fa-moon');
        themeToggleIconMobile?.classList.add('fa-sun');
    } else {
        themeToggleIcon?.classList.remove('fa-sun');
        themeToggleIcon?.classList.add('fa-moon');
        themeToggleIconMobile?.classList.remove('fa-sun');
        themeToggleIconMobile?.classList.add('fa-moon');
    }
}

// Check for saved theme preference or use system preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    updateThemeIcons(true);
} else {
    document.documentElement.classList.remove('dark');
    updateThemeIcons(false);
}

// Toggle theme function
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');

    localStorage.theme = isDark ? 'dark' : 'light';
    updateThemeIcons(isDark);
}

themeToggleBtn?.addEventListener('click', toggleTheme);
themeToggleBtnMobile?.addEventListener('click', toggleTheme);

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('bg-white/80', 'dark:bg-darker/80', 'backdrop-blur-md', 'shadow-md');
        navbar.classList.remove('bg-transparent', 'py-4');
        navbar.classList.add('py-2');
    } else {
        navbar.classList.remove('bg-white/80', 'dark:bg-darker/80', 'backdrop-blur-md', 'shadow-md', 'py-2');
        navbar.classList.add('bg-transparent', 'py-4');
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Optional: stop observing once animated
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
});
