const urlParams = new URLSearchParams(window.location.search);
const artworkId = urlParams.get('artworkId');

fetch(`https://nodejs-production-1695.up.railway.app/api/artwork/${artworkId}`)
    .then(response => response.json())
    .then(data => {
        if (!data || Object.keys(data).length === 0) {
            document.getElementById("artwork-container").innerHTML = "<h2>Artwork not found.</h2>";
            return;
        }
        document.getElementById("artwork-container").innerHTML = `
        <div class="artwork-card">
        <img src="${data.image_path}" alt="${data.title}" class="artwork-image">
        <div class="artwork-details">
            <h2 class="artwork-title">${data.title}</h2>
            <p class="artwork-artist">${data.artist_name}</p>
            <div class="artwork-row">
                <div class="artwork-col"><strong>Price:</strong> $${data.price}</div>
                <div class="artwork-col"><strong>Status:</strong> ${data.avail_status}</div>
                <div class="artwork-col"><strong>Year:</strong> ${data.year_made}</div>
            </div>
            <div class="artwork-row">
                <div class="artwork-col"><strong>Dimensions:</strong> ${data.dimensions}</div>
                <div class="artwork-col"><strong>Medium:</strong> ${data.artwork_medium}</div>
                <div class="artwork-col"><strong>Theme:</strong> ${data.theme}</div>
            </div>
            <p class="artwork-desc">${data.artwork_desc}</p>
        </div>
        </div>`;

        const artworkArtist = document.querySelector(".artwork-artist");

        if (artworkArtist) {
        artworkArtist.addEventListener("click", () => {
        window.location.href = `artist-artwork.html?artistId=${data.artist_id}`;
        });}
    })
    .catch(error => {
        console.error("Error fetching artwork details:", error);
    });

