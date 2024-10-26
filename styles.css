// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Store resources with type as the key
const resources = {};

// Function to add a new resource
function addResource() {
    const type = document.getElementById('type').value;
    const lat = parseFloat(document.getElementById('latitude').value);
    const lon = parseFloat(document.getElementById('longitude').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!type || isNaN(lat) || isNaN(lon) || isNaN(quantity)) {
        alert("Please enter valid resource type, coordinates, and quantity.");
        return;
    }

    // If the resource already exists, update quantity
    if (resources[type]) {
        resources[type].quantity += quantity;
        updateResourceList();
        return;
    }

    // Create a new marker and store resource info
    const marker = L.marker([lat, lon]).addTo(map).bindPopup(`${type}: ${quantity}`);
    resources[type] = { marker, quantity };

    // Update the resource list
    updateResourceList();
}

// Function to update the list display and quantities
function updateResourceList() {
    const resourceList = document.getElementById('resourceList');
    resourceList.innerHTML = ''; // Clear previous list

    // Populate the list with current resources
    for (const type in resources) {
        const resource = resources[type];
        const listItem = document.createElement('li');
        listItem.textContent = `${type} - Quantity: ${resource.quantity} `;

        // Increase Quantity Button
        const increaseButton = document.createElement('button');
        increaseButton.textContent = "+";
        increaseButton.onclick = () => changeQuantity(type, 1);

        // Decrease Quantity Button
        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = "-";
        decreaseButton.onclick = () => changeQuantity(type, -1);

        // Add buttons to the list item
        listItem.appendChild(increaseButton);
        listItem.appendChild(decreaseButton);
        resourceList.appendChild(listItem);

        // Update marker popup with new quantity
        resource.marker.setPopupContent(`${type}: ${resource.quantity}`);
    }
}

// Function to change the quantity of a resource
function changeQuantity(type, amount) {
    if (resources[type]) {
        resources[type].quantity += amount;

        // Prevent quantity from going below 0
        if (resources[type].quantity < 0) {
            resources[type].quantity = 0;
        }

        // Update the marker popup and the resource list display
        resources[type].marker.setPopupContent(`${type}: ${resources[type].quantity}`);
        updateResourceList();
    }
}
