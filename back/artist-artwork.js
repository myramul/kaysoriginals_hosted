
const urlParams = new URLSearchParams(window.location.search);
const artistId = urlParams.get('artistId');


fetch(`https://nodejs-production-1695.up.railway.app/api/artist/${artistId}`)
  .then(response => response.json())
  .then(data => {
    const artistName = document.getElementById('artist-name');
    artistName.textContent = "Works by " + data['first_name'] + ' ' + data['last_name'];

    const artworkContainer = document.getElementById('artwork-container');
    data.artwork.forEach(artwork => {
      const artworkCard = document.createElement('div');
      artworkCard.classList.add('artwork-card');

      const artworkImage = document.createElement('img');
      artworkImage.src = artwork.image_path;
      artworkImage.alt = artwork.title;
      artworkImage.classList.add('artwork-image');

      const artworkTitle = document.createElement('h2');
      artworkTitle.textContent = artwork.title;
      artworkTitle.classList.add('artwork-title');

      const artworkPrice = document.createElement('p');
      artworkPrice.textContent = `Price: $${artwork.price}`;
      artworkPrice.classList.add('artwork-price');

      artworkCard.appendChild(artworkImage);
      artworkCard.appendChild(artworkTitle);
      artworkCard.appendChild(artworkPrice);

      artworkCard.addEventListener('click', () => {
        window.location.href = `artwork-individual.html?artworkId=${artwork.artwork_id}`;
      })

      artworkContainer.appendChild(artworkCard);
    });
  });