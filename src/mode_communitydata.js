// document.getElementById('community-pins').addEventListener('change', function() {
//     if (this.checked) {
//         fetchCommunityPinsForCurrentMap();
//     } else {
//         clearFilterDrawer();
//         clearMap();

//     }
// });

document.getElementById('load-community-map').addEventListener('click', function () {
    fetchCommunityPinsForCurrentMap();
});


async function fetchCommunityPinsForCurrentMap () {
    // Fetch community pins data for the current map from MapDataPublic
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


    const pinEditDiv = document.getElementById('pinEditDiv'); // use that pin edit div to display this info.
    pinEditDiv.innerHTML = 'SELECT MAP DATA TO LOAD:'; // Clear it to be sure

    selectBox = document.createElement("select");
    selectBox.setAttribute("id", "dataSelect");

    // Populate it with options
    availableDataForMap.forEach(item => {
        const option = document.createElement("option");
        option.value = item.dataName;
        option.textContent = item.dataName;
        selectBox.appendChild(option);
    });

    var userChoice = selectBox.value;
    console.log(userChoice);

    // Add Listener for value
    selectBox.addEventListener("change", function () {
        userChoice = this.value;
        console.log("User Changed To Choice:");
        console.log(userChoice);
    });

    // Append the select element to the divCommunity
    pinEditDiv.appendChild(selectBox);

    loadButton = document.createElement("button");
    loadButton.addEventListener('click', function (event) {
        console.log(userChoice);
        const displayData = availableDataForMap.find(item => item.dataName === userChoice);
        if (displayData) {
            const data = displayData.mapData;
            console.log("Data Picked To Show: ", data);

            clearMap();
            createAllPinsOnMap(data);
            clearFilterDrawer()
            createPinsAndCategoriesInMenu(data);

            var namatamaText = document.getElementById('namatamaText');
            namatamaText.innerHTML = "Here is " + userChoice + " map data";
            pinEditDiv.innerHTML = '';
        }
    });
    loadButton.innerHTML = 'Load Selected Data';
    pinEditDiv.appendChild(loadButton);

}
