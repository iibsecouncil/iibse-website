// Simple image slider for homepage

let slideIndex = 0;
const slides = document.querySelectorAll(".slide");

function showSlides() {
    slides.forEach(slide => slide.classList.remove("active"));
    slideIndex++;

    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    slides[slideIndex - 1].classList.add("active");

    setTimeout(showSlides, 4000); // Change slide every 4 seconds
}

// Start slider if slides exist
if (slides.length > 0) {
    showSlides();
}

