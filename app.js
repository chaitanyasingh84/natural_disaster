// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Store markers in an object for easy reference
const markers = {};

// Function to add a location
function addLocation() {
    const name = document.getElementById('locationName').value;
    const lat = parseFloat(document.getElementById('latitude').value);
    const lon = parseFloat(document.getElementById('longitude').value);

    if (!name || isNaN(lat) || isNaN(lon)) {
        alert("Please enter valid location name and coordinates.");
        return;
    }

    // Create a new marker
    const marker = L.marker([lat, lon]).addTo(map).bindPopup(name);

    // Add marker to the markers object with a unique id (e.g., location name)
    markers[name] = marker;

    // Update the list display
    updateLocationList();
}

// Function to update the location list and add delete options
function updateLocationList() {
    const locationList = document.getElementById('locationList');
    locationList.innerHTML = ''; // Clear previous list

    // Populate the list with current markers
    for (const name in markers) {
        const listItem = document.createElement('li');
        listItem.textContent = name;

        // Add a delete button for each marker
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => removeLocation(name);

        listItem.appendChild(deleteButton);
        locationList.appendChild(listItem);
    }
}

// Function to remove a location
function removeLocation(name) {
    if (markers[name]) {
        // Remove the marker from the map
        map.removeLayer(markers[name]);
        delete markers[name]; // Remove the marker from the markers object

        // Update the list display
        updateLocationList();
    }
}
