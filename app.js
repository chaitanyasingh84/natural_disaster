import { initializeMap, addMarkerToMap, centerMapOnMarkers } from './map.js';

// Define the version number
const version = "3.0.0";

// Display the version number on the website when the page loads
window.onload = function () {
    const versionDisplay = document.getElementById('versionDisplay');
    if (versionDisplay) {
        versionDisplay.textContent = `Version: ${version}`;
    }
};

// Basic admin credentials
const adminUsername = 'admin';
const adminPassword = 'password';

// Data storage
let stations = loadStations();
let commodityTypes = loadCommodityTypes();

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

    stations[stationName] = { lat, lon, commodities: {} };

    saveStations();
    updateStationSelect();
    updateStationList();
    centerMapOnMarkers();

    document.getElementById('stationName').value = '';
    document.getElementById('stationLat').value = '';
    document.getElementById('stationLon').value = '';
}

// Function to add a new commodity type
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

// Function to add a commodity to a station
function addCommodity() {
    const stationName = document.getElementById('stationSelect').value;
    const commodityType = document.getElementById('commoditySelect').value;
    const quantity = parseInt(document.getElementById('commodityQuantity').value);

    if (!stationName || !commodityType || isNaN(quantity) || quantity <= 0) {
        alert("Please select a station, a commodity type, and provide a valid quantity.");
        return;
    }

    stations[stationName].commodities[commodityType] = quantity;
    saveStations();
    addMarkerToMap(stationName, stations[stationName].lat, stations[stationName].lon, stations[stationName].commodities);
    updateStationList();
    centerMapOnMarkers();

    document.getElementById('commoditySelect').value = '';
    document.getElementById('commodityQuantity').value = 1;
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
}

// Initialize map and load stations on page load
window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('map')) {
        initializeMap();

        // Load saved stations and add markers for each station
        Object.keys(stations).forEach(stationName => {
            const station = stations[stationName];
            addMarkerToMap(stationName, station.lat, station.lon, station.commodities);
        });

        updateStationSelect();
        updateStationList();
        updateCommoditySelect();
        centerMapOnMarkers(); // Center map on initial markers
    }
});
