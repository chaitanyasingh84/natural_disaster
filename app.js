// Define the version number
const version = "1.0.0";

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
let markers = {}; // Store markers for each station and commodity
const commodityColors = {}; // Store colors for each commodity

// Generate a color palette with 30 unique colors
function generateColorPalette() {
    const colors = [];
    for (let i = 0; i < 30; i++) {
        // Generate a random hex color code
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

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === adminUsername && password === adminPassword) {
        localStorage.setItem('loggedIn', 'true');
        console.log("Login successful.");
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('error-message').textContent = 'Incorrect username or password';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('loggedIn');
    console.log("User logged out.");
    window.location.href = 'index.html';
}

// Check if admin is logged in when loading dashboard
if (window.location.pathname.includes('dashboard.html')) {
    if (!localStorage.getItem('loggedIn')) {
        console.log("Redirecting to login page - user not logged in.");
        window.location.href = 'index.html';
    }
}

// Initialize map only if on the dashboard page and the map element exists
let map;
window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('map')) {
        console.log("Initializing map...");
        map = L.map('map').setView([20.5937, 78.9629], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Load saved stations and add markers for each commodity
        Object.keys(stations).forEach(stationName => {
            const station = stations[stationName];
            Object.keys(station.commodities).forEach(commodity => {
                if (station.commodities[commodity] > 0) {
                    addMarkerToMap(stationName, station.lat, station.lon, commodity, station.commodities[commodity]);
                }
            });
        });

        updateStationSelect();
        updateStationList();
        updateCommoditySelect();
        centerMapOnMarkers(); // Center map on initial markers
    }
});

// Function to center the map based on the bounds of all markers
function centerMapOnMarkers() {
    const markerBounds = L.latLngBounds([]);
    Object.values(markers).forEach(marker => {
        markerBounds.extend(marker.getLatLng());
    });

    if (markerBounds.isValid()) {
        map.fitBounds(markerBounds);
    } else {
        console.log("No markers to center on.");
    }
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
    console.log("Updated commodity dropdown:", commodityTypes);
}

// Function to add a deployment station without saving the marker
function addDeploymentStation() {
    const stationName = document.getElementById('stationName').value;
    const lat = parseFloat(document.getElementById('stationLat').value);
    const lon = parseFloat(document.getElementById('stationLon').value);

    if (!stationName || isNaN(lat) || isNaN(lon)) {
        alert("Please provide valid station name and coordinates.");
        return;
    }

    if (stations[stationName]) {
        alert("A station with this name already exists.");
        return;
    }

    // Store only relevant properties in stations object
    stations[stationName] = { lat, lon, commodities: {} };

    saveStations();
    updateStationSelect();
    updateStationList();
    centerMapOnMarkers(); // Re-center after adding new station

    // Clear input fields
    document.getElementById('stationName').value = '';
    document.getElementById('stationLat').value = '';
    document.getElementById('stationLon').value = '';
}

// Helper function to add a marker to the map for each commodity
function addMarkerToMap(stationName, lat, lon, commodity, quantity) {
    const markerKey = `${stationName}_${commodity}`;

    // Remove existing marker if it exists (to update popup)
    if (markers[markerKey]) {
        map.removeLayer(markers[markerKey]);
    }

    // Only add marker if quantity is greater than zero
    if (quantity > 0) {
        const color = getColorForCommodity(commodity);
        const icon = L.divIcon({
            className: 'custom-icon',
            html: `<div style="background-color:${color}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
            iconSize: [20, 20]
        });

        const marker = L.marker([lat, lon], { icon }).addTo(map).bindPopup(
            `Station: ${stationName}<br>Commodity: ${commodity}<br>Quantity: ${quantity}`
        );
        markers[markerKey] = marker; // Save marker reference
    }

    centerMapOnMarkers(); // Re-center map on markers after each update
}

// Function to update station dropdown
function updateStationSelect() {
    const stationSelect = document.getElementById('stationSelect');
    stationSelect.innerHTML = '<option value="">Select Station</option>';

    for (const station in stations) {
        const option = document.createElement('option');
        option.value = station;
        option.textContent = station;
        stationSelect.appendChild(option);
    }
    console.log("Updated station dropdown:", Object.keys(stations));
}

// Modified saveStations function to exclude markers
function saveStations() {
    const stationsToSave = {};

    Object.keys(stations).forEach(stationName => {
        const { lat, lon, commodities } = stations[stationName];
        stationsToSave[stationName] = { lat, lon, commodities }; // Only save these properties
    });

    localStorage.setItem('stations', JSON.stringify(stationsToSave));
    console.log("Stations saved to localStorage:", stationsToSave);
}

// Modified loadStations function
function loadStations() {
    const savedStations = localStorage.getItem('stations');
    const loadedStations = savedStations ? JSON.parse(savedStations) : {};
    console.log("Loaded stations from localStorage:", loadedStations);
    return loadedStations;
}

// Additional functions for commodities and persistence
function addCommodityType() {
    const newType = document.getElementById('newCommodityType').value;
    if (!newType) {
        alert("Please enter a valid commodity type.");
        return;
    }

    if (!commodityTypes.includes(newType)) {
        commodityTypes.push(newType);
        saveCommodityTypes();
        updateCommoditySelect();
    }

    document.getElementById('newCommodityType').value = '';
}

function addCommodity() {
    const stationName = document.getElementById('stationSelect').value;
    const commodityType = document.getElementById('commoditySelect').value;
    const quantity = parseInt(document.getElementById('commodityQuantity').value);

    if (!stationName || !commodityType || isNaN(quantity)) {
        alert("Please select a station and a commodity type, and provide a valid quantity.");
        return;
    }

    // Update quantity and marker for commodity
    stations[stationName].commodities[commodityType] = quantity;
    saveStations();
    addMarkerToMap(stationName, stations[stationName].lat, stations[stationName].lon, commodityType, quantity);
    updateStationList();
    centerMapOnMarkers();

    document.getElementById('commoditySelect').value = '';
    document.getElementById('commodityQuantity').value = 1;
}

// Persistence functions for commodity types
function saveCommodityTypes() {
    localStorage.setItem('commodityTypes', JSON.stringify(commodityTypes));
}

function loadCommodityTypes() {
    const savedTypes = localStorage.getItem('commodityTypes');
    const loadedTypes = savedTypes ? JSON.parse(savedTypes) : [];
    console.log("Loaded commodity types from localStorage:", loadedTypes);
    return loadedTypes;
}

// Function to update station list display
function updateStationList() {
    const stationList = document.getElementById('stationList');
    stationList.innerHTML = '';

    for (const stationName in stations) {
        const station = stations[stationName];
        const listItem = document.createElement('li');
        listItem.innerHTML = `<b>${stationName}</b> (Lat: ${station.lat}, Lon: ${station.lon})`;

        const commoditiesList = document.createElement('ul');
        for (const commodity in station.commodities) {
            const quantity = station.commodities[commodity];
            const commodityItem = document.createElement('li');
            commodityItem.innerHTML = `${commodity}: ${quantity}`;

            const increaseButton = document.createElement('button');
            increaseButton.textContent = "+";
            increaseButton.onclick = () => changeQuantity(stationName, commodity, 1);

            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = "-";
            decreaseButton.onclick = () => changeQuantity(stationName, commodity, -1);

            commodityItem.appendChild(increaseButton);
            commodityItem.appendChild(decreaseButton);
            commoditiesList.appendChild(commodityItem);
        }

        listItem.appendChild(commoditiesList);
        stationList.appendChild(listItem);
    }
    console.log("Updated station list display.");
}

// Function to change the quantity of a commodity
function changeQuantity(stationName, commodity, amount) {
    const newQuantity = (stations[stationName].commodities[commodity] || 0) + amount;

    if (newQuantity >= 0) {
        stations[stationName].commodities[commodity] = newQuantity;
        saveStations();

        // Update marker
        addMarkerToMap(
            stationName,
            stations[stationName].lat,
            stations[stationName].lon,
            commodity,
            newQuantity
        );

        updateStationList();
        centerMapOnMarkers();
    }
}
