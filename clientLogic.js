function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}
function stationContainsCommodity(stationName, commodity) {
    console.log(stations[stationName].commodities)
    return commodity in stations[stationName].commodities
}
function filterLocationsWithinRadius(targetLat, targetLon, stations, radius) {
    available_locations = {}
    for(stationName in stations) {
        const distance = haversineDistance(targetLat, targetLon, stations[stationName]["lat"], stations[stationName]["lon"]);
        selected_commodity = document.getElementById("commoditySelect").value
        console.log(selected_commodity)
        if(distance <= radius &&  stationContainsCommodity(stationName, selected_commodity)) {
            map.addLayer(markers[stationName])
            available_locations[stationName] = stations[stationName]
        }
        else {
            removeMarker(stationName)
        }
    }
    return available_locations
}

// Usage
const targetLat = 2; // Target latitude
const targetLon = 2; // Target longitude
radius = 50; // 
temp = true
async function removeMarker(stationName) {
    // Check if the marker exists in the markers object
    const marker = await markers[stationName]
    if (marker) {
        map.removeLayer(markers[stationName]); // Remove the marker from the map
        // markers[stationName]; // Remove the marker from the markers object
        console.log(`Marker for station '${stationName}' removed.`);
    } else {
        console.log(`No marker found for station '${stationName}'.`);
    }
    console.log(markers)
}


function findStations() {
    radius = document.getElementById("radius-input").value
    filterLocationsWithinRadius(targetLat, targetLon, stations, radius)
}
function exitPopup() {
    document.getElementsByClassName("popup")[0].style.visibility = "hidden"
}

commodityTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    commoditySelect.appendChild(option);
});
// console.log(filterLocationsWithinRadius(targetLat,targetLon,stations,radius), "test")