// Data.js is Step #1 of Loading & Drawing the App from its' data.  These functions call each other and the rest of the app depends on them from here.

console.log('Begin Loading Maps')

const { createClient } = supabase;
supabase = createClient(
    'https://iipfkaeymrjaulaazoph.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjQ5OTcyMiwiZXhwIjoxOTQyMDc1NzIyfQ.I8bVXoJTQtQ18xJeKG7Snq4FhVTFKQD-533tMED1jLA'
);
// console.log(supabase); // Log data of succesful connection

let maps = []; 
let data = [];
let currentMap = "Monaco";
let currentMapUrl = "monaco";
let currentMapData = [];
const filterDrawer = document.getElementById('filter-drawer');

// -----------------------------THE MAPS--------------------------------------------------------
// 1. Fetch all the Maps from the database and then tell the app to show the correct one.

async function fetchMapsFromSupabase() {
    // Get the "Maps" table and select everything inside, then map it to an array of maps like before. Simple!
    let supaFiles = await supabase.from("Maps").select("*");
    // console.log(supaFiles.data);
    maps = supaFiles.data.map(item => ({
        name: item.name,
        urlName: item.urlName,
        mapImage: item.mapImage,
    }));
    // console.log("Maps Loaded:" + maps);
    createMapMenu();
    showMap();

}
fetchMapsFromSupabase();

// Create the Map Menu of those Maps & give them the functions needed when clicked on.
function createMapMenu(){
    const mapChoices = document.getElementById('map-drawer');

    for (let map of maps) {
        // console.log(map)
        const choice = document.createElement('div');
        choice.textContent = map.name;
        choice.classList.add('item');
        choice.onclick = function() {
            currentMap = map.name;
            console.log("currentMap is: " + currentMap);
            showMap();
        };
        mapChoices.appendChild(choice);
    }
}

// Display the Map
function showMap(){
    console.log(maps);
    const mapToShow = maps.find(map => map.name === currentMap);
    
    if (mapToShow) {
        document.getElementById('map').style.backgroundImage = `url(${mapToShow.mapImage})`;
        currentMap = mapToShow.name;
        currentMapUrl = mapToShow.urlName;
        clearMap();
        fetchMapDataFromSupabase(currentMap);
    }
}

// Clear the Map
function clearMap() {
    const map = document.getElementById('map');
    console.log(map);
    map.innerHTML = ''; // Clear all child elements (pins) from the map
}

// ----------------------------MAP DATA---------------------------------------------------------
// 2. Fetch All Map Data available and then tell the app to show the correct one.
// Multiple Data Sets possible.  Currently just loads 'default' for that map for now as the starting point.

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
        createPinsAndCategoriesInMenu(data);
        data.forEach(pin => {
            createPinOnMap(pin);
   
        });
    }


}

// Create the Pins at correct places
function createPinOnMap(pin) {
        console.log(pin)
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

// Create Pin Menu items for list
function createPinsAndCategoriesInMenu(allpins) {
    clearFilterDrawer()
    console.log(allpins)
    // clearFilterDrawer();
    var categories = {}; // Object to store pins by category
  
    allpins.forEach(function(pin) {
        if (!categories[pin.category]) {
            categories[pin.category] = [];
        }
        categories[pin.category].push(pin);
        
    });
    console.log(categories);

    for (var category in categories) {
        var categoryHeader = document.createElement('h3');
        categoryHeader.textContent = category;
        filterDrawer.appendChild(categoryHeader);
  
        categories[category].forEach(function(pin) {
            var pinCheckbox = document.createElement('input');
            pinCheckbox.type = 'checkbox';
            pinCheckbox.checked = true; // By default, pins are visible
            pinCheckbox.addEventListener('change', function() {
                var pinElement = document.querySelector('.pin[title="' + pin.title + '"]');
                pinElement.style.display = this.checked ? 'block' : 'none';
            });
  
            var pinLabel = document.createElement('label');
            pinLabel.textContent = pin.title;
            pinLabel.style.cursor = 'pointer';
            pinLabel.addEventListener('click', function() {
                var pinElement = document.querySelector('.pin[title="' + pin.title + '"]');
                var popup = pinElement.querySelector('.popup');
                togglePopup(popup);
                showPinEdit(pin, filterDrawer);
            });
  
            var pinItem = document.createElement('div');
            pinItem.appendChild(pinCheckbox);
            pinItem.appendChild(pinLabel);
            filterDrawer.appendChild(pinItem);
        });
    }
}

function clearFilterDrawer() {
    const first = filterDrawer.firstElementChild;
    filterDrawer.innerHTML = '';
    filterDrawer.appendChild(first);
  }


  // ------NOTHING ELSE SHOULD GO IN THIS SCRIPT---------------------------------------------