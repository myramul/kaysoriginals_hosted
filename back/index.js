
let slideIndex = 0;
let slideInterval; 

const slideshow_container = document.querySelector(".slideshow-container");
let slides = [];
let totalSlides = 0;

async function fetchFeaturedArt(){
    try{
        const response = await fetch(`https://nodejs-production-1695.up.railway.app/api/featured`);
        const data = await response.json();
        console.log("featured data: ", data)

        displaySlideshow(data);

    }catch(error){
        console.error("Error fetching featrued artwork: ", error)
    }
}

function displaySlideshow(featured_artwork){
    slideshow_container.innerHTML = "";
    if (featured_artwork.length === 0) {
        slideshow_container.innerHTML = "<p>No featured artwork found.</p>";
        return;
    }
    
    
    const prevButton = document.createElement("button");
    prevButton.innerHTML = '&#10094;'
    prevButton.classList.add("prev");
    prevButton.addEventListener("click", prevSlide);
    slideshow_container.appendChild(prevButton);
    
    featured_artwork['featured_art'].forEach(feat_art => {
        const slide = document.createElement("div");
        const slide_img = document.createElement("img");
        const slide_caption = document.createElement("div");

        slide_img.src = feat_art['image_path'];
        slide_img.alt = feat_art['artist_name'];
        slide_caption.innerHTML = `Artist: ${feat_art['artist_name']} | Title: ${feat_art['title']} | Price: $${feat_art['price']}`;

        slide.classList.add("slide")
        slide_caption.classList.add("caption")

        slide.appendChild(slide_img);
        slide.appendChild(slide_caption);

        slide.addEventListener("click", () =>{
            window.location.href = `artwork-individual.html?artworkId=${feat_art['artwork_id']}`;
        });
        slideshow_container.appendChild(slide);
    });

    const nextButton = document.createElement("button");
    nextButton.innerHTML = '&#10095;'
    nextButton.classList.add("next");
    nextButton.addEventListener("click", nextSlide);
    slideshow_container.appendChild(nextButton);

    slides = slideshow_container.querySelectorAll(".slide");
    totalSlides = slides.length;

    showSlides(slideIndex);
    resetTimer();
}

function showSlides(index) {
    slides.forEach((slide) => {
        slide.style.display = "none";
        slide.style.opacity = "0"; 
    });

    slides[index].style.display = "block";
    slides[index].style.opacity = "1"; 
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % totalSlides;
    showSlides(slideIndex);
    resetTimer();
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + totalSlides) % totalSlides;
    showSlides(slideIndex);
    resetTimer();
}

function resetTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3000); 
}


fetchFeaturedArt();




