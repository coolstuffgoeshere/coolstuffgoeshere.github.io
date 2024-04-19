// Data.js is Step #1 of Loading & Drawing the App from its' data.  These functions call each other and the rest of the app depends on them from here.

console.log('Begin Loading Maps')

const { createClient } = supabase;
supabase = createClient(
    'https://iipfkaeymrjaulaazoph.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjQ5OTcyMiwiZXhwIjoxOTQyMDc1NzIyfQ.I8bVXoJTQtQ18xJeKG7Snq4FhVTFKQD-533tMED1jLA'
);

const defaultMapUrl = "monaco";
const filterDrawer = document.getElementById('filter-drawer');
const editPinsModeToggle = document.getElementById('edit-pins-mode');

// -----------------------------THE MAPS--------------------------------------------------------
// 1. Fetch all the Maps from the database and then tell the app to show the correct one.

async function fetchMapsFromSupabase () {
    // Get the "Maps" table and select everything inside, then map it to an array of maps like before. Simple!
    const supaFiles = await supabase.from("Maps").select("*");
    // console.log(supaFiles.data);
    state.maps = supaFiles.data.map(item => ({
        name: item.name,
        urlName: item.urlName,
        mapImage: item.mapImage,
    }));
    // console.log("Maps Loaded:" + maps);
    buildMapMenu();
    showMap();

}
fetchMapsFromSupabase();

// Display the Map
function showMap () {
    // console.log(state.maps);
    const mapToShow = state.maps.find(map => map.urlName === defaultMapUrl);
    setMap(mapToShow || state.maps[0]);
}

// ----------------------------MAP DATA FUNCTIONS------------------------------------------------------
// 2. Fetch All Map Data available and then tell the app to show the correct one.
// Multiple Data Sets possible.  Currently just loads 'default' for that map for now as the starting point.

async function fetchMapDataFromSupabase (currentMap) {
    let supaFiles = await supabase.from("MapData").select("*");
    console.log("I found: " + supaFiles.data);
    console.log("Current Map is: " + currentMap);

    const availableDataForMap = supaFiles.data.filter(item => item.mapUsed === currentMap).map(item => ({
        map: item.mapUsed,
        dataName: item.name,
        mapData: item.mapData,
    }));

    console.log(availableDataForMap);

    const displayData = availableDataForMap.find(item => item.dataName === 'default');
    if (displayData) {
        data = displayData.mapData;
        console.log("Data Picked To Show: ", data);

        setMapData(data);
    }
}
