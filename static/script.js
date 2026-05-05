// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');
const themeToggleIconMobile = document.getElementById('theme-toggle-icon-mobile');

function updateThemeIcons(isDark) {
    const icons = [themeToggleIcon, themeToggleIconMobile];
    icons.forEach(icon => {
        if (!icon) return;

        // Add a rotation animation class
        icon.classList.add('rotate-180', 'opacity-0');

        setTimeout(() => {
            if (isDark) {
                icon.classList.remove('fa-sun', 'text-yellow-400');
                icon.classList.add('fa-moon', 'text-slate-400'); // Dim
                icon.parentElement.classList.remove('shadow-[0_0_15px_rgba(250,204,21,0.3)]');
            } else {
                icon.classList.remove('fa-moon', 'text-slate-400');
                icon.classList.add('fa-sun', 'text-yellow-400'); // Active
                icon.parentElement.classList.add('shadow-[0_0_15px_rgba(250,204,21,0.3)]');
            }
            icon.classList.remove('rotate-180', 'opacity-0');
        }, 150); // half of duration
    });
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

// File upload preview logic
function previewFile(input, previewId) {
    const file = input.files[0];
    const isPhoto = previewId === 'photo-preview';
    const filenameSpan = document.getElementById(isPhoto ? 'photo-filename' : 'cv-filename');

    if (file) {
        filenameSpan.textContent = file.name;

        // Client-side validation
        const maxSize = isPhoto ? 2 * 1024 * 1024 : 5 * 1024 * 1024; // 2MB or 5MB
        if (file.size > maxSize) {
            alert(`File size exceeds the limit of ${isPhoto ? '2MB' : '5MB'}.`);
            input.value = ''; // Clear input
            filenameSpan.textContent = 'Drag and drop or click to browse';
            if (isPhoto) {
                document.getElementById('photo-preview-wrapper').classList.add('hidden');
                document.getElementById('photo-preview-container').classList.remove('hidden');
            }
            return;
        }

        if (isPhoto) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewWrapper = document.getElementById('photo-preview-wrapper');
                const previewImg = document.getElementById('photo-preview');
                const container = document.getElementById('photo-preview-container');

                previewImg.src = e.target.result;
                previewWrapper.classList.remove('hidden');
                container.classList.add('hidden'); // Hide the icon/text when image is shown
            }
            reader.readAsDataURL(file);
        }
    } else {
        filenameSpan.textContent = 'Drag and drop or click to browse';
        if (isPhoto) {
            document.getElementById('photo-preview-wrapper').classList.add('hidden');
            document.getElementById('photo-preview-container').classList.remove('hidden');
        }
    }
}

// Toggle Edit Mode in Admin Settings
function toggleEditMode() {
    const profileDisplay = document.getElementById('profile-display');
    const uploadForm = document.getElementById('upload-form');

    if (uploadForm.classList.contains('hidden')) {
        // Hide profile, show form
        profileDisplay.classList.add('opacity-0');
        setTimeout(() => {
            profileDisplay.classList.add('hidden', 'absolute', 'inset-0', 'pointer-events-none');

            uploadForm.classList.remove('hidden', 'absolute', 'inset-0', 'pointer-events-none');
            uploadForm.classList.add('relative');

            // Trigger reflow for animation
            void uploadForm.offsetWidth;
            uploadForm.classList.remove('opacity-0');
            uploadForm.classList.add('opacity-100');
        }, 500);
    } else {
        // Hide form, show profile
        uploadForm.classList.remove('opacity-100');
        uploadForm.classList.add('opacity-0');

        setTimeout(() => {
            uploadForm.classList.add('hidden', 'absolute', 'inset-0', 'pointer-events-none');
            uploadForm.classList.remove('relative');

            profileDisplay.classList.remove('hidden', 'absolute', 'inset-0', 'pointer-events-none');
            // Trigger reflow
            void profileDisplay.offsetWidth;
            profileDisplay.classList.remove('opacity-0');
        }, 500);
    }
}
