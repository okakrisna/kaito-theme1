document.addEventListener('DOMContentLoaded', () => {
    // --- Slideshow Logic ---
    const slideshows = document.querySelectorAll('.hero-slideshow');

    slideshows.forEach(slideshow => {
        const slides = slideshow.querySelectorAll('.slide');
        let currentSlide = 0;
        const slideInterval = 3000; // 3 seconds

        if (slides.length > 0) {
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, slideInterval);
        }
    });

    // --- Open Invitation Button ---
    const openBtn = document.getElementById('open-invitation');
    const guestOverlay = document.getElementById('guest-overlay');
    const rightPanel = document.getElementById('right-panel');
    const stickyHeader = document.getElementById('sticky-header');

    // Initial State: Disable scrolling
    if (rightPanel) rightPanel.style.overflowY = 'hidden';
    document.body.style.overflow = 'hidden';

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            // Hide overlay
            guestOverlay.classList.add('hidden');

            // Enable scroll
            if (rightPanel) {
                rightPanel.style.overflowY = 'auto';
                rightPanel.scrollTop = 0;
            }
            document.body.style.overflow = 'auto';
            window.scrollTo(0, 0);
        });
    }

    // --- Sticky Header Logic ---
    function handleScroll(scrollTop) {
        if (scrollTop > 300) {
            if (stickyHeader) stickyHeader.style.display = 'block';
        } else {
            if (stickyHeader) stickyHeader.style.display = 'none';
        }
    }

    if (rightPanel) {
        rightPanel.addEventListener('scroll', () => {
            handleScroll(rightPanel.scrollTop);
        });
    }

    window.addEventListener('scroll', () => {
        handleScroll(window.scrollY);
    });

    // --- Countdown Timer ---
    const targetDate = new Date("2025-12-09T00:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            const timerElement = document.getElementById("timer");
            if (timerElement) timerElement.innerHTML = "EXPIRED";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.innerText = days;
        if (hoursEl) hoursEl.innerText = hours;
        if (minutesEl) minutesEl.innerText = minutes;
        if (secondsEl) secondsEl.innerText = seconds;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- Copy to Clipboard ---
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const accountNumber = document.getElementById('account-number').innerText;
            navigator.clipboard.writeText(accountNumber).then(() => {
                const originalText = copyBtn.innerText;
                copyBtn.innerText = 'COPIED!';
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }

    // --- Wishes / RSVP Logic (New) ---
    const rsvpForm = document.getElementById('rsvp-form');
    const wishesContainer = document.getElementById('wishes-container');

    // Load wishes from local storage on load
    loadWishes();

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('rsvp-name');
            const messageInput = document.getElementById('rsvp-message');
            const attendanceInput = document.querySelector('input[name="attendance"]:checked');

            const name = nameInput.value;
            const message = messageInput ? messageInput.value : '';
            const attendance = attendanceInput ? attendanceInput.value : 'yes';

            if (name && message) {
                const newWish = {
                    name: name,
                    message: message,
                    attendance: attendance,
                    date: new Date().toISOString()
                };

                addWishToDOM(newWish);
                saveWish(newWish);

                // Reset form
                rsvpForm.reset();
                alert('Thank you for your wishes!');
            } else {
                alert('Please fill in your name and message.');
            }
        });
    }

    function addWishToDOM(wish) {
        if (!wishesContainer) return;

        const wishItem = document.createElement('div');
        wishItem.classList.add('wish-item');

        const nameEl = document.createElement('h4');
        nameEl.classList.add('wish-name');
        // Add checkmark icon
        nameEl.innerHTML = `${wish.name} <i class="fas fa-check-circle verified-badge"></i>`;

        const messageEl = document.createElement('p');
        messageEl.classList.add('wish-message');
        messageEl.textContent = wish.message;

        const dateEl = document.createElement('span');
        dateEl.classList.add('wish-date');
        dateEl.textContent = 'Just now'; // Simplified for demo

        wishItem.appendChild(nameEl);
        wishItem.appendChild(messageEl);
        wishItem.appendChild(dateEl);

        // Prepend to show newest first
        wishesContainer.prepend(wishItem);
    }

    function saveWish(wish) {
        let wishes = JSON.parse(localStorage.getItem('weddingWishes')) || [];
        wishes.push(wish);
        localStorage.setItem('weddingWishes', JSON.stringify(wishes));
    }

    function loadWishes() {
        let wishes = JSON.parse(localStorage.getItem('weddingWishes')) || [];
        // Reverse to show newest first
        wishes.reverse().forEach(wish => addWishToDOM(wish));
    }
});

// --- Global Gallery Logic ---
let galleryState = {
    currentSlide: 0,
    slides: [],
    counter: null,
    totalSlides: 0
};

function setupGalleryGlobal() {
    console.log('Setting up global gallery state');
    const gallerySection = document.querySelector('.gallery-section');
    if (!gallerySection) return;

    galleryState.slides = gallerySection.querySelectorAll('.gallery-slide');
    galleryState.counter = gallerySection.querySelector('.gallery-counter');
    galleryState.totalSlides = galleryState.slides.length;

    updateGalleryUI();
}

function updateGalleryUI() {
    if (galleryState.totalSlides === 0) return;

    galleryState.slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === galleryState.currentSlide) {
            slide.classList.add('active');
        }
    });

    if (galleryState.counter) {
        galleryState.counter.textContent = `${galleryState.currentSlide + 1} / ${galleryState.totalSlides}`;
    }
}

window.nextGallerySlide = function () {
    if (galleryState.totalSlides === 0) setupGalleryGlobal();
    if (galleryState.totalSlides === 0) return;

    galleryState.currentSlide = (galleryState.currentSlide + 1) % galleryState.totalSlides;
    updateGalleryUI();
};

window.prevGallerySlide = function () {
    if (galleryState.totalSlides === 0) setupGalleryGlobal();
    if (galleryState.totalSlides === 0) return;

    galleryState.currentSlide = (galleryState.currentSlide - 1 + galleryState.totalSlides) % galleryState.totalSlides;
    updateGalleryUI();
};

document.addEventListener('DOMContentLoaded', setupGalleryGlobal);