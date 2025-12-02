document.addEventListener('DOMContentLoaded', () => {
    // --- Slideshow Logic ---
    // Handle multiple slideshows (desktop and mobile) independently
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
    // Desktop: rightPanel is hidden/no-scroll
    // Mobile: body is no-scroll
    if (rightPanel) rightPanel.style.overflowY = 'hidden';
    document.body.style.overflow = 'hidden';

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            // Hide overlay
            guestOverlay.classList.add('hidden');

            // Enable scroll
            // Desktop
            if (rightPanel) {
                rightPanel.style.overflowY = 'auto';
                rightPanel.scrollTop = 0;
            }
            // Mobile
            document.body.style.overflow = 'auto';
            window.scrollTo(0, 0);

            // Play audio if needed
            // playAudio();
        });
    }

    // --- Sticky Header Logic ---
    // We need to listen to scroll events on both the window (mobile) and the right panel (desktop)

    function handleScroll(scrollTop) {
        if (scrollTop > 300) {
            if (stickyHeader) stickyHeader.style.display = 'block';
        } else {
            if (stickyHeader) stickyHeader.style.display = 'none';
        }
    }

    // Desktop Scroll Listener
    if (rightPanel) {
        rightPanel.addEventListener('scroll', () => {
            handleScroll(rightPanel.scrollTop);
        });
    }

    // Mobile Scroll Listener
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

    // --- RSVP Form ---
    const rsvpForm = document.querySelector('.rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your confirmation! (This is a demo)');
            rsvpForm.reset();
        });
    }

    // --- Copy to Clipboard ---
    const copyBtn = document.getElementById('copy-btn');
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
});
