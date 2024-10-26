// Define the version number
const version = "1.6.0";

// Display the version number on the website
window.onload = function () {
    const versionDisplay = document.getElementById('versionNumber');
    if (versionDisplay) {
        versionDisplay.textContent = version;
    }
};

// Basic admin credentials
const adminUsername = 'admin';
const adminPassword = 'password';

// Data storage
let stations = loadStations();
let commodityTypes = loadCommodityTypes();
let markers = {}; // Store markers for each station
const commodityColors = {}; // Store colors for each commodity

// Generate a color palette with 30 unique colors
function generateColorPalette() {
    const colors = [];
    for (let i = 0; i < 30; i++) {
        colors.push(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
    }
    return colors;
}

// Assign colors to commodities from the palette
const colorPalette = generateColorPalette();
function getColorForCommodity(commodity) {
    if (!commodityColors[commodity]) {
        commodityColors[commodity] = colorPalette[Object.keys(commodityColors).length % colorPalette.length];
    }
    return commodityColors[commodity];
}

// Initialize map only if on the dashboard page and the map element exists
let map;
window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('map')) {
        map = L.map('map').setView([20.5937, 78.9629], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Load saved stations and add markers for each station
        Object.keys(stations).forEach(stationName => {
            const station = stations[stationName];
            addMarkerWithTooltip(stationName, station.lat, station.lon, station.commodities);
        });

        updateStationSelect();
        updateStationList();
        updateCommoditySelect();
        centerMapOnMarkers();
    }
});

// Function to center the map based on the bounds of all markers
function centerMapOnMarkers() {
    const markerBounds = L.latLngBounds([]);
    const markerList = Object.values(markers);

    markerList.forEach(marker => {
        markerBounds.extend(marker.getLatLng());
    });

    if (markerList.length === 1) {
        map.setView(markerList[0].getLatLng(), 8);
    } else if (markerBounds.isValid()) {
        map.fitBounds(markerBounds);
    }
}

// Function to add a marker with a dynamic tooltip displaying commodities
function addMarkerWithTooltip(stationName, lat, lon, commodities) {
    const markerKey = stationName;

    if (markers[markerKey]) {
        map.removeLayer(markers[markerKey]);
    }

    const icon = L.divIcon({
        className: 'simple-icon',
        html: `<div></div>`,
        iconSize: [20, 20]
    });

    const tooltipContent = formatCommoditiesTooltip(commodities);

    const marker = L.marker([lat, lon], { icon })
        .addTo(map)
        .bindTooltip(tooltipContent, { direction: "top", offset: [0, -10], className: 'commodity-tooltip' });

    markers[markerKey] = marker;

    centerMapOnMarkers();
}

// Helper function to format commodities for the tooltip
function formatCommoditiesTooltip(commodities) {
    return Object.entries(commodities)
        .map(([commodity, quantity]) => {
            const color = getColorForCommodity(commodity);
            return `<div style="display: flex; align-items: center;">
                        <div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px;"></div>
                        ${commodity}: ${quantity}
                    </div>`;
        })
        .join("");
}

// Function to update commodity dropdown
function updateCommoditySelect() {
    const commoditySelect = document.getElementById('commoditySelect');
    commoditySelect.innerHTML = '<option value="">Select Commodity</option>';

    commodityTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        commoditySelect.appendChild(option);
    });
}

// Helper functions for stations, markers, and data persistence remain as before
// These include addDeploymentStation, addCommodityType, addCommodity, and data persistence functions
