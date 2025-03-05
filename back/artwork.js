let currentPage = 1;
const artworkPerPage = 8;
let totalPages = 1; 

const searchIcon = document.querySelector('.search-icon');
const searchBox = document.querySelector('.search-box');
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const filterBox = document.getElementById("filter-box");
const closeFilter = document.getElementById("close-filter");
const filterIcon = document.querySelector(".filter-icon");
const applyFiltersBtn = document.getElementById("apply-filters");
const resetFiltersBtn = document.getElementById("reset-filters");
let allArtwork = [];

async function fetchArtwork(page) {
    try {
        const response = await fetch(`https://nodejs-production-1695.up.railway.app/api/artwork?page=${page}&limit=${artworkPerPage}`);
        const data = await response.json();

        totalPages = Math.ceil(data.total / artworkPerPage);

        if (!data.artwork) {
            console.error("No artwork data available");
            return;
        }

        displayArtwork(data.artwork);
        handlePagination();
    } catch (error) {
        console.error("Error fetching artwork:", error);
    }
}

async function fetchAllArtwork() {
    try {
        const response = await fetch('https://nodejs-production-1695.up.railway.app/api/all_artwork');
        const data = await response.json();
        allArtwork = data;
    } catch (error) {
        console.error("Error fetching all artwork:", error);
    }
}

function displayArtwork(artwork) {
    const container = document.getElementById('artwork-container');
    container.innerHTML = "";
  
    if (artwork.length === 0) {
      container.innerHTML = "<p>No artwork found.</p>";
      return;
    }

    searchBox.style.display = 'none';
    searchIcon.style.display = 'block';
  
    artwork.forEach(artwork => {
      const artworkCard = document.createElement('div');
      artworkCard.classList.add('artwork');
  
      const artworkImage = document.createElement('img');
      artworkImage.src = artwork.image_path;
      artworkImage.alt = artwork.title;
  
      const artworkCaption = document.createElement('div');
      artworkCaption.classList.add('artwork-caption');
      artworkCaption.textContent = `${artwork.title} - ${artwork.artist_name} | $${artwork.price}`;
  
      artworkCard.appendChild(artworkImage);
      artworkCard.appendChild(artworkCaption);
  
      artworkCard.addEventListener('click', () => {
        window.location.href = `artwork-individual.html?artworkId=${artwork.artwork_id}`;
      });
  
      container.appendChild(artworkCard);
    });
  }

function changePage(direction) {
    currentPage += direction;
    fetchArtwork(currentPage);
}

function handlePagination() {
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

searchIcon.addEventListener('click', () => {
  searchBox.style.display = 'block';
  searchIcon.style.display = 'none';
});

searchButton.addEventListener('click', () => {
  const searchString = searchInput.value.trim().toLowerCase();
  const filteredArtwork = allArtwork.filter(artwork => {
      const artistName = `${artwork.artist_name}`.toLowerCase();
      const title = `${artwork.title}`.toLowerCase();
      return artistName.includes(searchString) || title.includes(searchString);
  });
  displayArtwork(filteredArtwork);
});

searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
      searchButton.click();
  }
});


filterIcon.addEventListener("click", () => {
    filterBox.style.display = "block";
});

closeFilter.addEventListener("click", () => {
    filterBox.style.display = "none";
});

async function fetchFilters() {
  try {
      const response = await fetch('https://nodejs-production-1695.up.railway.app/api/filters');
      const data = await response.json();

      populateFilterOptions("medium-filters", data.mediums);
      populateFilterOptions("theme-filters", data.themes);
  } catch (error) {
      console.error("Error fetching filter options:", error);
  }
}

function populateFilterOptions(containerId, options) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    options.forEach(option => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" name="${containerId}" value="${option}"> ${option}`;
        container.appendChild(label);
    });
}

applyFiltersBtn.addEventListener("click", () => {
    const selectedPrice = document.querySelector("input[name='price']:checked")?.value;
    const selectedMediums = [...document.querySelectorAll("input[name='medium-filters']:checked")].map(el => el.value);
    const selectedThemes = [...document.querySelectorAll("input[name='theme-filters']:checked")].map(el => el.value);

    const filteredArtwork = allArtwork.filter(artwork => {
        let matchesPrice = !selectedPrice || (
            (selectedPrice === "l1000" && artwork.price < 1000) ||
            (selectedPrice === "1000-5000" && artwork.price >= 1000 && artwork.price <= 5000) ||
            (selectedPrice === "5001-10000" && artwork.price >= 5001 && artwork.price <= 10000) ||
            (selectedPrice === "g10000" && artwork.price > 10000)
        );

        let matchesMedium = !selectedMediums.length || selectedMediums.some(medium => artwork.artwork_medium.includes(medium));
        let matchesTheme = !selectedThemes.length || selectedThemes.some(theme => artwork.theme.includes(theme));

        return matchesPrice && matchesMedium && matchesTheme;
    });
    displayArtwork(filteredArtwork);
    filterBox.style.display = "none"; 
});

resetFiltersBtn.addEventListener("click", () => {
    document.querySelectorAll("input[type='radio']").forEach(el => el.checked = false);
    document.querySelectorAll("input[type='checkbox']").forEach(el => el.checked = false);
    displayArtwork(allArtwork); 
});

fetchArtwork(currentPage);
fetchAllArtwork();
fetchFilters();
