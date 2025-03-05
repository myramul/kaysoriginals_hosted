let currentPage = 1;
const artistsPerPage = 8;
let totalPages = 1; 
let allArtists = [];
const searchIcon = document.querySelector('.search-icon');
const searchBox = document.querySelector('.search-box');
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');


async function fetchArtists(page) {
    try {
        const response = await fetch(`https://nodejs-production-1695.up.railway.app/api/artists?page=${page}&limit=${artistsPerPage}`);
        const data = await response.json();
        console.log("Received artists data:", data);

        totalPages = Math.ceil(data.total / artistsPerPage);

        if (!data.artists) {
            console.error("No artists data available");
            return;
        }

        displayArtists(data.artists);
        handlePagination();
    } catch (error) {
        console.error("Error fetching artists:", error);
    }
}

function displayArtists(artists) {
    const container = document.getElementById('artists-container');
    container.innerHTML = "";
  
    if (artists.length === 0) {
      container.innerHTML = "<p>No artists found.</p>";
      return;
    }

    searchBox.style.display = 'none';
    searchIcon.style.display = 'block';
  
    artists.forEach(artist => {
      const artistCard = document.createElement('div');
      artistCard.classList.add('artist');
  
      const artistImage = document.createElement('img');
      artistImage.src = artist['image_path'];
      artistImage.alt = artist['first_name'] + ' ' + artist['last_name'];
      artistImage.classList.add('artist-image');
  
      const artistName = document.createElement('p');
      artistName.textContent = artist['first_name'] + ' ' + artist['last_name'];
  
      const artworkImage = document.createElement('img');
      artworkImage.src = artist['artwork_image_path'];
      console.log("Artwork image path:", artist['artwork_image_path']);
      artworkImage.alt = artist['first_name'] + ' ' + artist['last_name'] + "'s artwork";
      artworkImage.classList.add('artwork-image');
      artworkImage.style.display = 'none';
  
      artistCard.appendChild(artistImage);
      artistCard.appendChild(artistName);
      artistCard.appendChild(artworkImage);
  
      artistCard.addEventListener('mouseover', () => {
        artworkImage.style.display = 'block';
      });
  
      artistCard.addEventListener('mouseout', () => {
        artworkImage.style.display = 'none';
      });

      artistCard.addEventListener('click', () => {
        window.location.href = `artist-artwork.html?artistId=${artist.artist_id}`;
      });
  
      container.appendChild(artistCard);
    });
  }
  
function changePage(direction) {
    currentPage += direction;
    fetchArtists(currentPage);
}

function handlePagination() {
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

function filterArtistsByLetter(artists, letter) {
  return artists.filter(artist => artist.first_name.toUpperCase().startsWith(letter));
}

async function createAlphabet() {
  const alphabetContainer = document.querySelector('.alphabet');
  const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  alphabetContainer.innerHTML = '';

  try{
    const response = await fetch(`https://nodejs-production-1695.up.railway.app/api/all_artists`);
    const data = await response.json();
    allArtists = data;
  }catch(error){
    console.error("Error fetching all artist data:", error);
  }

  for (let i = 0; i < alphabet.length; i++) {
      const letter = document.createElement('span');
      letter.textContent = alphabet[i];
      letter.classList.add('letter');
      if (i === 0) {
          letter.addEventListener('click', () => {
          fetchArtists(1);
        });
      }else{
        letter.addEventListener('click', () => {
          const filteredArtists = filterArtistsByLetter(allArtists, alphabet[i]);
          displayArtists(filteredArtists);
        });
      }
      alphabetContainer.appendChild(letter);
  }
}

searchIcon.addEventListener('click', () => {
  searchBox.style.display = 'block';
  searchIcon.style.display = 'none';
});

searchButton.addEventListener('click', () => {
  const searchString = searchInput.value.trim().toLowerCase();
  const filteredArtists = allArtists.filter(artist => {
      const artistName = `${artist.first_name} ${artist.last_name}`.toLowerCase();
      return artistName.includes(searchString);
  });
  displayArtists(filteredArtists);
});

searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
      searchButton.click();
  }
});

createAlphabet();
fetchArtists(currentPage);