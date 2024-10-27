// Load station data from localStorage
let stations = JSON.parse(localStorage.getItem('stations')) || {};
let commodityTypes = JSON.parse(localStorage.getItem('commodityTypes')) || [];

// Initialize map and markers array
let map;
let markers = [];
let userLocationMarker; // Marker for user location
let userRadiusCircle;   // Circle representing the radius

// Store pending requests
let pendingRequests = JSON.parse(localStorage.getItem('pendingRequests')) || {};

// Request user's location and initialize map
document.addEventListener("DOMContentLoaded", () => {
    // Initialize the map
    map = L.map('map').setView([20.5937, 78.9629], 5); // Default center (India)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Request user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            const initialRadius = parseInt(document.getElementById("radius-slider").value) * 1000; // Convert km to meters

            // Center the map on the user's location with an initial radius
            userLocationMarker = L.marker([userLat, userLon]).addTo(map);
            userRadiusCircle = L.circle([userLat, userLon], { radius: initialRadius, color: '#007bff', fillOpacity: 0.2 }).addTo(map);

            map.fitBounds(userRadiusCircle.getBounds()); // Adjust view to fit the circle

            // Display station markers within the initial radius
            ensureAllCommoditiesInitialized();
            updateMarkersWithinRadius(userLat, userLon, initialRadius);
        }, () => {
            alert("Unable to access location. Showing default view.");
        });
    } else {
        alert("Geolocation not supported by your browser.");
    }
});

// Ensure each station has all commodity types initialized to 0 if not already present
function ensureAllCommoditiesInitialized() {
    Object.keys(stations).forEach(stationName => {
        const station = stations[stationName];
        if (!station.commodities) station.commodities = {};
        
        commodityTypes.forEach(commodity => {
            if (!(commodity in station.commodities)) {
                station.commodities[commodity] = 0; // Initialize missing commodities to 0
            }
        });
    });
}

// Function to update markers within the specified radius
function updateMarkersWithinRadius(lat, lon, radius) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = []; // Reset markers array

    // Add markers for all stations regardless of commodity quantities
    Object.keys(stations).forEach(stationName => {
        const station = stations[stationName];
        const stationLatLng = L.latLng(station.lat, station.lon);
        const userLatLng = L.latLng(lat, lon);

        // Check if the station is within the radius
        if (userLatLng.distanceTo(stationLatLng) <= radius) {
            const commodities = station.commodities || {};

            // Format commodity details for popup, showing all commodities
            const commodityDetails = Object.entries(commodities)
                .map(([commodity, quantity]) => `<div>${commodity}: <strong>${quantity}</strong></div>`)
                .join("");

            const popupContent = `<strong>${stationName}</strong><br>Total Commodities:<br><hr>${commodityDetails}<br><button onclick="openRequestModal('${stationName}')">Request Update for Out of Stock</button>`;

            const marker = L.marker([station.lat, station.lon])
                .addTo(map)
                .bindPopup(popupContent);

            markers.push(marker);
        }
    });
}

// Open request modal
function openRequestModal(stationName) {
    const checkboxesContainer = document.getElementById("commodity-checkboxes");
    checkboxesContainer.innerHTML = ""; // Clear previous checkboxes

    // Add checkboxes for commodities with zero quantity
    Object.entries(stations[stationName].commodities).forEach(([commodity, quantity]) => {
        if (quantity <= 0) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `checkbox-${commodity}`;
            checkbox.value = commodity;

            const label = document.createElement("label");
            label.setAttribute("for", `checkbox-${commodity}`);
            label.textContent = commodity;

            checkboxesContainer.appendChild(checkbox);
            checkboxesContainer.appendChild(label);
            checkboxesContainer.appendChild(document.createElement("br"));
        }
    });

    document.getElementById("request-modal").style.display = "block"; // Show modal
}

// Close request modal
function closeRequestModal() {
    document.getElementById("request-modal").style.display = "none";
}

// Submit request form
function submitRequestForm(event) {
    event.preventDefault();

    const selectedCommodities = Array.from(document.querySelectorAll("#commodity-checkboxes input[type='checkbox']:checked")).map(input => input.value);
    const email = document.getElementById("user-email").value;

    // Add to pending requests
    selectedCommodities.forEach(commodity => {
        if (!pendingRequests[commodity]) {
            pendingRequests[commodity] = [];
        }
        pendingRequests[commodity].push(email);
    });

    localStorage.setItem('pendingRequests', JSON.stringify(pendingRequests)); // Save to localStorage

    alert("Request submitted! You will be notified when selected commodities are back in stock.");
    closeRequestModal();
}

// Function to update radius based on slider input and redraw the circle
function updateRadius() {
    const radiusKm = document.getElementById("radius-slider").value;
    const radiusMeters = radiusKm * 1000; // Convert km to meters
    document.getElementById("radius-display").textContent = `${radiusKm} km`;

    if (userLocationMarker && userRadiusCircle) {
        userRadiusCircle.setRadius(radiusMeters);
        map.fitBounds(userRadiusCircle.getBounds()); // Adjust view to fit the updated circle

        const userLat = userLocationMarker.getLatLng().lat;
        const userLon = userLocationMarker.getLatLng().lng;
        ensureAllCommoditiesInitialized(); 
        updateMarkersWithinRadius(userLat, userLon, radiusMeters);
    }
}

// Logout function
function logout() {
    localStorage.removeItem('loggedIn');
    alert("Logged out successfully");
    window.location.href = '../index.html';
}