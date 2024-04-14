// Data.js is Step #1 of Loading & Drawing the App.  Keep the functions tied to setup in one script. 

console.log('Begin Loading Maps')

const { createClient } = supabase;
supabase = createClient(
    'https://iipfkaeymrjaulaazoph.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjQ5OTcyMiwiZXhwIjoxOTQyMDc1NzIyfQ.I8bVXoJTQtQ18xJeKG7Snq4FhVTFKQD-533tMED1jLA'
);
// console.log(supabase); // Log data of succesful connection

var maps = []; 
var data = [];
var currentMap = "";
var currentMapUrl = "monaco";
var currentMapData = [];

// 1. Fetch all the Maps from the database and then tell the app to get to work!
async function fetchMapsFromSupabase() {
    // Get the "Maps" table and select everything inside, then map it to an array of maps like before. Simple!
    let supaFiles = await supabase.from("Maps").select("*");
    console.log(supaFiles.data);
    maps = supaFiles.data.map(item => ({
        name: item.name,
        urlName: item.urlName,
        mapImage: item.mapImage,
    }));
    console.log("Maps Loaded:" + maps);
    createMapMenu(maps);
    showMap(maps);

}
fetchMapsFromSupabase();

// 2. Create the Map Menu of all Maps & give them the functions needed when clicked on.
async function createMapMenu(maps){
    const mapChoices = document.getElementById('map-drawer');
    for (let map of maps) {
        console.log(map)
        const choice = document.createElement('div');
        choice.textContent = map.name;
        choice.classList.add('item');
        choice.onclick = function() {
            selectedLocation = map.name;
            console.log(selectedLocation);
            document.getElementById('map').style.backgroundImage = `url(${map.mapImage})`;
            currentMap = map.name;
            currentMapUrl = map.urlName;
            clearMap();
            fetchMapDataFromSupabase(currentMap);
        };
        mapChoices.appendChild(choice);
    }
}

// 3. Display the map image & set the currentMap we're on.
async function showMap(maps){
    const mapImageDiv = document.getElementById('map');
    const mapToShow = maps.find(map => map.urlName === currentMapUrl);
    
    if (mapToShow) {
        mapImageDiv.style.backgroundImage = `url(${mapToShow.mapImage})`;
        currentMap = mapToShow.name;
        currentMapUrl = mapToShow.urlName;
        fetchMapDataFromSupabase(currentMap);
    }
}

// 4. Now, based on selected map fetch all the Available Data for that map.
// This means it will load multiple data sets (if there are more than one). I just have it load the one named 'default' for that map for now as the starting point.

async function fetchMapDataFromSupabase(currentMap) {
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

        data.forEach(pin => {
            createNewPin(pin);
        });
    }


}

// 5. Take the data we want and creates all the pins.  Easy!
async function createNewPin(pin) {
        // console.log(pin)
        // console.log(currentMapUrl)
        var pinElement = document.createElement('div');
        pinElement.classList.add('pin');
        pinElement.style.left = pin.coords.x.replace('%%', '%');
        pinElement.style.top = pin.coords.y.replace('%%', '%');
        pinElement.title = pin.title;
      
        var pinImage = document.createElement('img');
        pinImage.src = pin.pinImg; // Use pinImg property for pin image
        
        pinImage.alt = pin.title;
      
        var popup = createPopup(pin);
      
        pinElement.appendChild(pinImage);
        pinElement.appendChild(popup);
        document.getElementById('map').appendChild(pinElement);
      
        pinElement.addEventListener('mouseenter', function() {
          popup.classList.add('active');
          updateNamatamaText(pin);
        });
      
        pinElement.addEventListener('mouseleave', function() {
            popup.classList.remove('active');
            clearNamatamaText();
        });
      
        pinElement.addEventListener('click', function() {
            togglePopup(popup);
            updateSidebar(); // Update the sidebar when pin visibility changes
        });
      
        // Create URL for the pin and replace unwanted characters
        var pinUrl = window.location.origin + window.location.pathname + '#' + currentMapUrl.toLowerCase() + '?category=' + encodeURIComponent(pin.category) + '&title=' + encodeURIComponent(pin.title) + '&x=' + encodeURIComponent(pin.coords.x + '%') + '&y=' + encodeURIComponent(pin.coords.y + '%') + '&pinImg=' + encodeURIComponent(pin.pinImg) + '&dataImg=' + encodeURIComponent(pin.dataImg);
      
        // Add a click event listener to copy the URL to clipboard
        pinElement.addEventListener('click', function() {
            navigator.clipboard.writeText(pinUrl)
                .then(function() {
                    console.log('URL copied to clipboard: ' + pinUrl);
                    // alert('URL copied to clipboard: ' + pinUrl);
                })
                .catch(function(err) {
                    console.error('Failed to copy URL to clipboard: ', err);
                });
        });
      }

 function clearMap() {
        const map = document.getElementById('map');
        console.log(map);
        map.innerHTML = ''; // Clear all child elements (pins) from the map

      }


