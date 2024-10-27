// Initialize map
let map;
let markers = {}; // Store markers for each station
const commodityColors = {}; // Store colors for each commodity

// Generate a color palette with 30 unique colors for commodities
function generateColorPalette() {
    const colors = [];
    for (let i = 0; i < 30; i++) {
        colors.push(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
    }
    return colors;
}

const colorPalette = generateColorPalette();

// Function to get a color for each commodity type
function getColorForCommodity(commodity) {
    if (!commodityColors[commodity]) {
        commodityColors[commodity] = colorPalette[Object.keys(commodityColors).length % colorPalette.length];
    }
    return commodityColors[commodity];
}

// Initialize the map and tile layer
function initializeMap() {
    map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// Function to center the map based on the bounds of all markers
function centerMapOnMarkers() {
    const markerBounds = L.latLngBounds([]);
    const markerList = Object.values(markers);

    markerList.forEach(marker => {
        markerBounds.extend(marker.getLatLng());
    });

    if (markerList.length === 1) {
        map.setView(markerList[0].getLatLng(), 8); // Zoom level for a single marker
    } else if (markerBounds.isValid()) {
        map.fitBounds(markerBounds);
    }
}

// Function to add or update a marker with a dynamic tooltip displaying commodities
function addMarkerToMap(stationName, lat, lon, commodities) {
    const markerKey = stationName;

    // Remove existing marker if it exists
    if (markers[markerKey]) {
        map.removeLayer(markers[markerKey]);
    }

    // Only add a marker if there are commodities
    const totalQuantity = Object.values(commodities).reduce((acc, qty) => acc + qty, 0);
    if (totalQuantity > 0) {
        const icon = L.divIcon({
            className: 'simple-icon',
            html: `<div style="width: 20px; height: 20px; background-color: #007bff; border-radius: 50%;"></div>`,
            iconSize: [20, 20]
        });

        const tooltipContent = formatCommoditiesTooltip(stationName, commodities);

        const marker = L.marker([lat, lon], { icon })
            .addTo(map)
            .bindTooltip(tooltipContent, { direction: "top", offset: [0, -10], className: 'commodity-tooltip' });

        markers[markerKey] = marker;
    }

    centerMapOnMarkers(); // Re-center map on markers after each update
}

// Helper function to format commodities for the tooltip, including the station name
function formatCommoditiesTooltip(stationName, commodities) {
    let tooltipContent = `<b>${stationName}</b><br>`;
    tooltipContent += Object.entries(commodities)
        .map(([commodity, quantity]) => {
            const color = getColorForCommodity(commodity);
            return `<div style="display: flex; align-items: center;">
                        <div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px;"></div>
                        ${commodity}: ${quantity}
                    </div>`;
        })
        .join("");
    return tooltipContent;
}

// Exports
export { initializeMap, addMarkerToMap, centerMapOnMarkers };
