document.addEventListener('DOMContentLoaded', function () {
    SliderModule.init();
});

const SliderModule = (function () {
    const SLIDES = document.querySelectorAll('.slide');
    const POWER_BUTTON = document.querySelector('#power');
    const PREVIOUS_BUTTON = document.querySelector('#previous');
    const NEXT_BUTTON = document.querySelector('#next');
    const POINTERS = document.querySelectorAll('.pointer');
    const SLIDER = document.querySelector('.slider');

    let slideInterval;
    let currentSlide = SLIDES.length - 1;
    let isPlaying = true;
    let touchStart = 0;
    let touchEnd = 0;
    let isDragging = false;
    let dragStart = 0;

    function power() {
        isPlaying ? pause() : play();
    }

    function nextSlideClick() {
        nextSlide();
        pause();
    }

    function previousSlide() {
        let index = currentSlide <= 0 ? SLIDES.length - 1 : currentSlide - 1;
        goToSlide(index);
        pause();
    }

    function goToSlide(index) {
        SLIDES[currentSlide].className = 'slide';
        POINTERS[currentSlide].className = 'pointer';
        currentSlide = index;
        SLIDES[index].className = 'slide current';
        POINTERS[index].className = 'pointer current-pointer';
    }

    function swipe() {
        slideDirection(touchEnd - touchStart, 50);
    }

    function drag(event) {
        if (isDragging) {
            if (slideDirection(event.clientX - dragStart, 200)) {
                dragStart = event.clientX;
                isDragging = false;
            }
        }
    }

    function parseKey(event) {
        let keyboard = {
            'ArrowRight': nextSlide,
            'ArrowLeft': previousSlide,
            ' ': power
        }
        let action = keyboard[event.key];
        if (action) {
            action();
        }
    }

    function recordTouchStart(event) {
        touchStart = event.touches[0].clientX;
    }

    function recordTouchEnd(event) {
        touchEnd = event.touches[0].clientX;
    }

    function startDragging(event) {
        isDragging = true;
        dragStart = event.clientX;
    }

    function slideDirection(distance, sensitivity) {
        if (Math.abs(distance) > sensitivity) {
            if (distance > 0) {
                previousSlide();
            } else {
                nextSlideClick();
            }
            return true;
        }
    }

    function selectSlide(index) {
        goToSlide(index);
        pause();
    }

    function previousSlidePress(event) {
        if (event.key === 'ArrowLeft') {
            previousSlide();
        }
    }

    function nextSlide() {
        let index = currentSlide === SLIDES.length - 1 ? 0 : currentSlide + 1;
        goToSlide(index);
    }

    function pause() {
        POWER_BUTTON.innerHTML = 'Play';
        isPlaying = false;
        clearInterval(slideInterval);
    }

    function play() {
        POWER_BUTTON.innerHTML = 'Pause';
        isPlaying = true;
        slideInterval = setInterval(nextSlide, 2000);
    }

    return {
        init: function () {
            slideInterval = setInterval(nextSlide, 2000);
            document.addEventListener('keydown', parseKey);
            document.addEventListener('touchstart', recordTouchStart);
            document.addEventListener('touchmove', recordTouchEnd);
            document.addEventListener('touchend', swipe);

            POWER_BUTTON.addEventListener('click', power);
            NEXT_BUTTON.addEventListener('click', nextSlideClick);
            PREVIOUS_BUTTON.addEventListener('click', previousSlide);
            SLIDER.addEventListener('mousedown', startDragging);
            SLIDER.addEventListener('mousemove', drag);
            POINTERS.forEach((pointer, index) => {
                pointer.addEventListener('click', () => selectSlide(index));
            });
        }
    };
})();