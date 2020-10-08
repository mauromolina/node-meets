import { OpenStreetMapProvider } from 'leaflet-geosearch';



const lat = document.querySelector('#lat').value || -34.7731894;
const lng = document.querySelector('#lng').value || -58.2369962;
const address = document.querySelector('#direccion').value || '';

const map = L.map('mapa').setView([lat, lng], 15);
let markers = new L.FeatureGroup().addTo(map);
let marker;
const geocodeService = L.esri.Geocoding.geocodeService();

    if(lat && lng){
        marker = new L.marker([lat, lng], {
            draggable: true,
            autoPan: true
        })
        .addTo(map)
        .bindPopup(address)
        .openPopup();
        markers.addLayer(marker);
        marker.on('moveend', function(e){
            marker = e.target;
            const pos = marker.getLatLng();
            map.panTo(new L.latLng(pos.lat, pos.lng));

            geocodeService.reverse().latlng(pos, 15).run(function(error, response){
                fillInputs(response);
                marker.bindPopup(response.address.LongLabel)
            });

        })
    }

document.addEventListener('DOMContentLoaded', () => {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const searcher = document.querySelector('#formbuscador');
    searcher.addEventListener('input', searchLocation);

})

function searchLocation(e) {
    if(e.target.value.length > 4) {
        markers.clearLayers();
        const provider = new OpenStreetMapProvider();
        provider.search({
            query: e.target.value
        }).then( (result) => {
            geocodeService.reverse().latlng(result[0].bounds[0], 15).run(function(error, res){
                fillInputs(res);
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
                    const pos = marker.getLatLng();
                    map.panTo(new L.latLng(pos.lat, pos.lng));

                    geocodeService.reverse().latlng(pos, 15).run(function(error, response){
                        fillInputs(response);
                        marker.bindPopup(response.address.LongLabel)
                    });

                })
            })
        })
    }
}

function fillInputs(results){
    document.querySelector('#direccion').value = results.address.Address || '';
    document.querySelector('#ciudad').value = results.address.City || '';
    document.querySelector('#estado').value = results.address.Region || '';
    document.querySelector('#pais').value = results.address.CountryCode || '';
    document.querySelector('#lat').value = results.latlng.lat || '';
    document.querySelector('#lng').value = results.latlng.lng || '';
}
