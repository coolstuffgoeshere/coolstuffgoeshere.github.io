// document.getElementById('community-pins').addEventListener('change', function() {
//     if (this.checked) {
//         fetchCommunityPinsForCurrentMap();
//     } else {
//         clearFilterDrawer();
//         clearMap();

//     }
// });

async function loadCommunityMaps () {
    // Fetch community pins data for the current map from MapDataPublic
    const div = document.getElementById('community-map-selector');

    if (div.classList.contains('active')) {
        div.classList.remove('active');
        div.querySelector('select').innerHTML = '';
        return;
    } else {
        div.classList.add('active');
    }

    const currentMapName = state.currentMap.name;
    let supaFiles = await supabase.from("MapDataPublic").select("*");
    console.log("PUBLIC data found:");
    console.log(supaFiles.data);
    console.log("Current Map is: " + currentMapName);

    const availableDataForMap = supaFiles.data.filter(item => item.mapUsed === currentMapName).map(item => ({
        map: item.mapUsed,
        dataName: item.name,
        mapData: item.mapData,
    }));

    console.log(availableDataForMap);

    createSelectBox(availableDataForMap);

    // Finish up

    // const displayData = availableDataForMap.find(item => item.dataName === userChoice);
    // if (displayData) {
    //     data = displayData.mapData;
    //     console.log("Data Picked To Show: ", data);
    //     createPinsAndCategoriesInMenu(data);
    //     createAllPinsOnMap(data);
    // }
}


function createSelectBox (availableDataForMap) {
    const selectEl = document.getElementById('community-map-select');
    const buttonEl = document.getElementById('community-map-selector').querySelector('button');

    // Populate it with options
    availableDataForMap.forEach(item => {
        const option = document.createElement("option");
        option.value = item.dataName;
        option.textContent = item.dataName;
        selectEl.appendChild(option);
    });

    var userChoice = selectEl.value;
    console.log(userChoice);

    // Add Listener for value
    selectEl.addEventListener("change", function () {
        userChoice = this.value;
        console.log("User Changed To Choice:");
        console.log(userChoice);
    });

    buttonEl.onclick = () => {
        console.log(userChoice);
        const displayData = availableDataForMap.find(item => item.dataName === userChoice);
        if (displayData) {
            const data = displayData.mapData;
            console.log("Data Picked To Show: ", data);

            setMapData(data);

            var namatamaText = document.getElementById('namatamaText');
            namatamaText.innerHTML = "Here is " + userChoice + " map data";
            pinEditDiv.innerHTML = '';
        }
    }
}
