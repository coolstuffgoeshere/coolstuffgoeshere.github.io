document.getElementById('community-pins').addEventListener('change', function() {
    if (this.checked) {
        fetchCommunityPinsForCurrentMap();
    } else {
        clearFilterDrawer();
        clearMap();
    }
});

async function fetchCommunityPinsForCurrentMap() {
    // Fetch community pins data for the current map from MapDataPublic
    let supaFiles = await supabase.from("MapDataPublic").select("*");
    console.log("PUBLIC data found:");
    console.log(supaFiles.data);
    console.log("Current Map is: " + currentMap);

    const availableDataForMap = supaFiles.data.filter(item => item.mapUsed === currentMap).map(item => ({
        map: item.mapUsed,
        dataName: item.name,
        mapData: item.mapData,
    }));

    console.log(availableDataForMap);

    const displayData = availableDataForMap.find(item => item.dataName === 'community');
    if (displayData) {
        data = displayData.mapData;
        console.log("Data Picked To Show: ", data);
        createPinsAndCategoriesInMenu(data);
        data.forEach(pin => {
            createPinOnMap(pin);
            
        });
    }
}


function clearCommunityPins() {
    // Clear the displayed community pins from the map
    // Implement this function based on how pins are displayed
}