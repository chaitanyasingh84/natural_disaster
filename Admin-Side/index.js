// Data storage (loaded from localStorage if available)
let stations = JSON.parse(localStorage.getItem('stations')) || {};

// Initialize map and markers array
let map;
let markers = [];

document.addEventListener("DOMContentLoaded", () => {
    // Initialize the map
    map = L.map('map').setView([20.5937, 78.9629], 5); // Default view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for stations with commodities and fit map to markers
    updateMarkersAndFitMap();
});

// Function to update markers and fit map view to bounds
function updateMarkersAndFitMap() {
    // Clear existing markers from the map
    markers.forEach(marker => map.removeLayer(marker));
    markers = []; // Reset markers array

    // Define bounds to dynamically fit all markers
    const bounds = L.latLngBounds([]);

    // Add markers for stations with commodities
    Object.keys(stations).forEach(stationName => {
        const station = stations[stationName];
        const commodities = station.commodities || {};
        const totalQuantity = Object.values(commodities).reduce((acc, qty) => acc + qty, 0);
        
        // Only add marker if the station has commodities
        if (totalQuantity > 0) {
            // Format the popup content to include a breakdown of commodities
            const commodityDetails = Object.entries(commodities)
                .map(([commodity, quantity]) => `<div>${commodity}: ${quantity}</div>`)
                .join("");

            const popupContent = `<strong>${stationName}</strong><br>Total Commodities: ${totalQuantity}<br><hr>${commodityDetails}`;

            const marker = L.marker([station.lat, station.lon])
                .addTo(map)
                .bindPopup(popupContent);
            markers.push(marker); // Add marker to array

            // Extend bounds to include this marker's location
            bounds.extend(marker.getLatLng());
        }
    });

    // If we have at least one marker, fit the map view to the bounds
    if (markers.length > 0) {
        map.fitBounds(bounds);
    } else {
        // Default view if no markers are available
        map.setView([20.5937, 78.9629], 5);
    }
}

// Function to add or remove stations
function modifyStations(stationName, lat, lon, commodities = {}) {
    if (commodities && Object.keys(commodities).length > 0) {
        // Add or update station if it has commodities
        stations[stationName] = { lat, lon, commodities };
    } else {
        // Remove station if there are no commodities
        delete stations[stationName];
    }

    // Save to localStorage
    localStorage.setItem('stations', JSON.stringify(stations));

    // Update markers and re-center map
    updateMarkersAndFitMap();
}
