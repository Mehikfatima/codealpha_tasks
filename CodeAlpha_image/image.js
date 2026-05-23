const galleryGrid = document.getElementById("galleryGrid");
const galleryTitle = document.getElementById("galleryTitle");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryButtons = document.querySelectorAll(".category-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCaption = document.getElementById("lightboxCaption");
const downloadBtn = document.getElementById("downloadBtn");

const closeBtn = document.getElementById("closeBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const places = ["hunza", "kalam", "lahore", "swat", "skardu", "naran"];

const placeNames = {
  hunza: "Hunza",
  kalam: "Kalam",
  lahore: "Lahore",
  swat: "Swat",
  skardu: "Skardu",
  naran: "Naran Kaghan"
};

let allImages = [];
let visibleImages = [];
let currentIndex = 0;

places.forEach(place => {
  for (let i = 1; i <= 20; i++) {
    allImages.push({
      src: `images/${place}${i}.jpg`,
      place: place,
      title: `${placeNames[place]} View ${i}`,
      caption: `Beautiful travel view from ${placeNames[place]}`
    });
  }
});

function showImages(category = "all", limitHome = true) {
  galleryGrid.innerHTML = "";

  let imagesToShow;

  if (category === "all") {
    imagesToShow = allImages.filter(img => {
      const number = Number(img.src.match(/\d+/)[0]);
      return number <= 5;
    });

    galleryTitle.innerText = "All Destinations";
  } else {
    imagesToShow = allImages.filter(img => img.place === category);

    if (limitHome) {
      imagesToShow = imagesToShow.filter(img => {
        const number = Number(img.src.match(/\d+/)[0]);
        return number <= 5;
      });
    }

    galleryTitle.innerText = `${placeNames[category]} Gallery`;
  }

  visibleImages = imagesToShow;

  imagesToShow.forEach((image, index) => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.innerHTML = `
  <button class="favorite-btn">♡</button>
  <img src="${image.src}" alt="${image.title}" loading="lazy">
  <div class="gallery-overlay">
    <h3>${image.title}</h3>
    <p>${image.caption}</p>
  </div>
`;
    card.addEventListener("click", () => openLightbox(index));
   const favBtn = card.querySelector(".favorite-btn");
favBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  favBtn.classList.toggle("active");
  favBtn.innerText = favBtn.classList.contains("active") ? "♥" : "♡";
});

    galleryGrid.appendChild(card);
  });
}

function searchImages() {
  const searchText = searchInput.value.toLowerCase().trim();

  if (searchText === "") {
    showImages("all", true);
    galleryTitle.innerText = "All Destinations";
    return;
  }

  let matchedPlace = null;

  if (searchText.includes("hunza")) matchedPlace = "hunza";
  if (searchText.includes("kalam")) matchedPlace = "kalam";
  if (searchText.includes("lahore")) matchedPlace = "lahore";
  if (searchText.includes("swat")) matchedPlace = "swat";
  if (searchText.includes("skardu")) matchedPlace = "skardu";
  if (searchText.includes("naran") || searchText.includes("kaghan")) matchedPlace = "naran";

  if (matchedPlace) {
    showImages(matchedPlace, false);
    galleryTitle.innerText = `Search Results: ${placeNames[matchedPlace]}`;
  } else {
    galleryGrid.innerHTML = `<p class="no-result">No images found. Try Hunza, Kalam, Lahore, Swat, Skardu, or Naran.</p>`;
    visibleImages = [];
    galleryTitle.innerText = "No Results Found";
  }
}

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    categoryButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    searchInput.value = "";

    const category = button.getAttribute("data-category");
    showImages(category, true);
  });
});

searchBtn.addEventListener("click", searchImages);

searchInput.addEventListener("keyup", event => {
  if (event.key === "Enter") {
    searchImages();
  }
});

function openLightbox(index) {
  if (visibleImages.length === 0) return;

  currentIndex = index;
  const image = visibleImages[currentIndex];

  lightboxImage.src = image.src;
  lightboxTitle.innerText = image.title;
  lightboxCaption.innerText = image.caption;
  downloadBtn.href = image.src;
  downloadBtn.setAttribute("download", image.title);

  lightbox.style.display = "flex";
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function nextImage() {
  currentIndex = (currentIndex + 1) % visibleImages.length;
  openLightbox(currentIndex);
}

function prevImage() {
  currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
  openLightbox(currentIndex);
}

closeBtn.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", nextImage);
prevBtn.addEventListener("click", prevImage);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (lightbox.style.display === "flex") {
    if (event.key === "ArrowRight") nextImage();
    if (event.key === "ArrowLeft") prevImage();
    if (event.key === "Escape") closeLightbox();
  }
});

showImages("all", true);
// Dark Mode
const darkModeBtn = document.getElementById("darkModeBtn");

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    darkModeBtn.innerText = "☀️";
  } else {
    darkModeBtn.innerText = "🌙";
  }
});

// Back to Top
const backToTopBtn = document.getElementById("backToTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});