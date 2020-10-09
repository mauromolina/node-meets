document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('#ubicacion-meeti')){
        showMap();
    }
})

function showMap(){

    const lat = document.querySelector('#lat').value,
          lng = document.querySelector('#lng').value,
          address = document.querySelector('#address').value;

    var map = L.map('ubicacion-meeti').setView([lat, lng], 18);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([lat, lng]).addTo(map)
        .bindPopup(address)
        .openPopup();
}
