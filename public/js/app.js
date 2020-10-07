import { OpenStreetMapProvider } from 'leaflet-geosearch';

const lat = -34.7731894;
const lng = -58.2369962;

const map = L.map('mapa').setView([lat, lng], 15);
let markers = new L.FeatureGroup().addTo(map);
let marker;
const geocodeService = L.esri.Geocoding.geocodeService();

document.addEventListener('DOMContentLoaded', () => {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const searcher = document.querySelector('#formbuscador');
    searcher.addEventListener('input', searchLocation);

})

function searchLocation(e) {
    console.log('Hola?');
    if(e.target.value.length > 4) {
        console.log('Si, hola');
        markers.clearLayers();
        const provider = new OpenStreetMapProvider();
        provider.search({
            query: e.target.value
        }).then( (result) => {
            console.log('Acá?');
            geocodeService.reverse().latlng(result[0].bounds[0], 15).run(function(error, res){
                console.log('Aca tambien!');
                console.log(res);
                map.setView(result[0].bounds[0], 15);
                marker = new L.marker(result[0].bounds[0], {
                    draggable: true,
                    autoPan: true
                })
                .addTo(map)
                .bindPopup(result[0].label)
                .openPopup();

                markers.addLayer(marker);
                marker.on('moveend', function(e){
                    marker = e.target;
                    console.log('gola');
                    const pos = marker.getLatLng();
                    map.panTo(new L.latLng(pos.lat, pos.lng));

                    geocodeService.reverse().latlng(pos, 15).run(function(error, response){
                        console.log('hols');
                        console.log(response);
                        marker.bindPopup(response.address.LongLabel)
                    });

                })
            })
        })
        .catch( error => console.log('error!:', error));
    }
}
