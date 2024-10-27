// Load data from localStorage
let stations = JSON.parse(localStorage.getItem('stations')) || {};
let commodityTypes = JSON.parse(localStorage.getItem('commodityTypes')) || [];

// Save stations to localStorage
function saveStations() {
    localStorage.setItem('stations', JSON.stringify(stations));
}

// Save commodity types to localStorage
function saveCommodityTypes() {
    localStorage.setItem('commodityTypes', JSON.stringify(commodityTypes));
}

// Add a new commodity type
function addCommodityType() {
    const newType = document.getElementById('newCommodityType').value;
    if (newType && !commodityTypes.includes(newType)) {
        commodityTypes.push(newType);
        saveCommodityTypes();
        updateCommoditySelect();
        document.getElementById('newCommodityType').value = '';
    }
}

// Add a new station
function addStation() {
    const name = document.getElementById('stationName').value;
    const lat = parseFloat(document.getElementById('stationLat').value);
    const lon = parseFloat(document.getElementById('stationLon').value);

    if (name && !isNaN(lat) && !isNaN(lon)) {
        stations[name] = { lat, lon, commodities: {} };
        saveStations();
        updateStationSelect();
        renderStationBlocks();
        document.getElementById('stationName').value = '';
        document.getElementById('stationLat').value = '';
        document.getElementById('stationLon').value = '';
    }
}

// Update the quantity of a commodity at a station, allowing both positive and negative values
function updateQuantity() {
    const stationName = document.getElementById('stationSelect').value;
    const commodity = document.getElementById('commoditySelect').value;
    const quantity = parseInt(document.getElementById('commodityQuantity').value);

    if (stationName && commodity && !isNaN(quantity)) {
        // Initialize the commodity if it doesn't exist yet
        if (!stations[stationName].commodities[commodity]) {
            stations[stationName].commodities[commodity] = 0;
        }
        
        // Update quantity with the provided value (add or subtract)
        stations[stationName].commodities[commodity] += quantity;

        // If the quantity drops to zero or below, remove the commodity from the station
        if (stations[stationName].commodities[commodity] <= 0) {
            delete stations[stationName].commodities[commodity];
        }

        saveStations();
        renderStationBlocks();
        document.getElementById('commodityQuantity').value = ''; // Reset input field
    }
}

// Update station dropdown
function updateStationSelect() {
    const stationSelect = document.getElementById('stationSelect');
    stationSelect.innerHTML = '<option value="">Select Station</option>';
    Object.keys(stations).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        stationSelect.appendChild(option);
    });
}

// Update commodity dropdown
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

// Render station blocks dynamically
function renderStationBlocks() {
    const stationDisplay = document.getElementById('station-display');
    stationDisplay.innerHTML = '';
    Object.keys(stations).forEach(stationName => {
        const station = stations[stationName];
        const stationBlock = document.createElement('div');
        stationBlock.className = 'station-block';

        let commoditiesHtml = '';
        Object.entries(station.commodities).forEach(([commodity, quantity]) => {
            commoditiesHtml += `<div class="commodity-item"><span>${commodity}</span>: <span>${quantity}</span></div>`;
        });

        stationBlock.innerHTML = `<h3>${stationName}</h3><div>${commoditiesHtml}</div>`;
        stationDisplay.appendChild(stationBlock);
    });
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
    updateStationSelect();
    updateCommoditySelect();
    renderStationBlocks();
});
