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

function filterLocationsWithinRadius(targetLat, targetLon, stations, radius) {
    available_locations = {}
    console.log("all makrers", markers)
    for(stationName in stations) {
        const distance = haversineDistance(targetLat, targetLon, stations[stationName]["lat"], stations[stationName]["lon"]);
        if(distance <= radius) {
            // addMarkerToMap(
            //     stationName,
            //     stations[stationName].lat,
            //     stations[stationName].lon,
            //     commodity,
            //     newQuantity
            // );
            available_locations[station] = stations[station]
        }
    }
    return available_locations
}

// Usage
const targetLat = 2; // Target latitude
const targetLon = 2; // Target longitude
const radius = 160; // 



console.log(filterLocationsWithinRadius(targetLat,targetLon,stations,radius), "test")
updateStationList()
