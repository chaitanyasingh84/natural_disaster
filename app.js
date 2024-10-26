// Basic admin credentials
const adminUsername = 'admin';
const adminPassword = 'password';

// Data storage
let stations = loadStations(); // Load stations from localStorage on page load
let loggedIn = false;

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === adminUsername && password === adminPassword) {
        loggedIn = true;
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'dashboard.html'; // Redirect to dashboard
    } else {
        document.getElementById('error-message').textContent = 'Incorrect username or password';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html'; // Redirect to login page
}

// Check if admin is logged in when loading dashboard
if (window.location.pathname.includes('dashboard.html')) {
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'index.html'; // Redirect to login if not logged in
    }
}

// Initialize map
let map;
if (document.getElementById('map')) {
    map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Load existing station markers on map
    Object.keys(stations).forEach(stationName => {
        const station = stations[stationName];
        station.marker = L.marker([station.lat, station.lon]).addTo(map).bindPopup(`Station: ${stationName}`);
    });

    updateStationSelect();
    updateStationList();
}

// Function to add a deployment station
function addDeploymentStation() {
    const stationName = document.getElementById('stationName').value;
    const lat = parseFloat(document.getElementById('stationLat').value);
    const lon = parseFloat(document.getElementById('stationLon').value);

    if (!stationName || isNaN(lat) || isNaN(lon)) {
        alert("Please provide valid station name and coordinates.");
        return;
    }

    // Add to stations object
    stations[stationName] = { lat, lon, commodities: {} };

    // Add marker to map
    const marker = L.marker([lat, lon]).addTo(map).bindPopup(`Station: ${stationName}`);
    stations[stationName].marker = marker;

    saveStations();
    updateStationSelect();
    updateStationList();

    // Clear input fields
    document.getElementById('stationName').value = '';
    document.getElementById('stationLat').value = '';
    document.getElementById('stationLon').value = '';
}

// Function to update station select dropdown
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

// Function to add a commodity to a selected station
function addCommodity() {
    const stationName = document.getElementById('stationSelect').value;
    const commodityType = document.getElementById('commodityType').value;
    const quantity = parseInt(document.getElementById('commodityQuantity').value);

    if (!stationName || !commodityType || isNaN(quantity)) {
        alert("Please select a station, and provide valid commodity type and quantity.");
        return;
    }

    // Initialize commodity quantity if not present, then add quantity
    if (!stations[stationName].commodities[commodityType]) {
        stations[stationName].commodities[commodityType] = 0;
    }
    stations[stationName].commodities[commodityType] += quantity;

    saveStations();
    updateStationList();

    // Clear commodity input fields
    document.getElementById('commodityType').value = '';
    document.getElementById('commodityQuantity').value = 1;
}

// Function to update the station list display
function updateStationList() {
    const stationList = document.getElementById('stationList');
    stationList.innerHTML = '';

    for (const stationName in stations) {
        const station = stations[stationName];
        const listItem = document.createElement('li');
        listItem.innerHTML = `<b>${stationName}</b> (Lat: ${station.lat}, Lon: ${station.lon})`;

        const commoditiesList = document.createElement('ul');
        for (const commodity in station.commodities) {
            const commodityItem = document.createElement('li');
            const quantity = station.commodities[commodity];
            commodityItem.innerHTML = `${commodity}: ${quantity} `;

            // Increase quantity button
            const increaseButton = document.createElement('button');
            increaseButton.textContent = "+";
            increaseButton.onclick = () => changeQuantity(stationName, commodity, 1);

            // Decrease quantity button
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

// Function to change the quantity of a commodity at a specific station
function changeQuantity(stationName, commodity, amount) {
    if (stations[stationName] && stations[stationName].commodities[commodity] !== undefined) {
        stations[stationName].commodities[commodity] += amount;
        if (stations[stationName].commodities[commodity] < 0) {
            stations[stationName].commodities[commodity] = 0; // Prevent negative quantities
        }

        saveStations();
        updateStationList();
    }
}

// Save stations to localStorage
function saveStations() {
    localStorage.setItem('stations', JSON.stringify(stations));
}

// Load stations from localStorage
function loadStations() {
    const savedStations = localStorage.getItem('stations');
    return savedStations ? JSON.parse(savedStations) : {};
}
