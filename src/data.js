// Data.js is Step #1 of Loading & Drawing the App from its' data.  These functions call each other and the rest of the app depends on them from here.

console.log('Begin Loading Maps')

const { createClient } = supabase;
supabase = createClient(
    'https://iipfkaeymrjaulaazoph.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjQ5OTcyMiwiZXhwIjoxOTQyMDc1NzIyfQ.I8bVXoJTQtQ18xJeKG7Snq4FhVTFKQD-533tMED1jLA'
);
// console.log(supabase); // Log data of succesful connection

let maps = []; 
let data = []; // Data contains all the pins to put on map & menu
let currentMap = "Monaco";
let currentMapUrl = "monaco";
let currentMapData = [];
const filterDrawer = document.getElementById('filter-drawer');
const editPinsModeToggle =  document.getElementById('edit-pins-mode');


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
    document.getElementById('pinEditDiv').innerHTML = '';
    const map = document.getElementById('map');
    map.innerHTML = ''; // Clear all child elements (pins) from the map
}

// ----------------------------MAP DATA FUNCTIONS------------------------------------------------------
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
    
    availableDataForMap.find(item => item.dataName === 'default').mapData = rawData;

    console.log(availableDataForMap);

    const displayData = availableDataForMap.find(item => item.dataName === 'default');
    if (displayData) {
        data = displayData.mapData;
        console.log("Data Picked To Show: ", data);

        createPinsAndCategoriesInMenu(data);
        // data.forEach(pin => {
        //     createPinOnMap(pin);
        // });
    }
}

// Create a SINGLE PIN at correct places. So when you update need to get them all again, should fix that.
function createPinOnMap(pin) {
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
            // togglePopup(popup);
            // updateSidebar(); // Update the sidebar when pin visibility changes
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

// Create Pin Menu items from all Pins in data. Also used to Update / Rebuild
function createPinsAndCategoriesInMenu(data) {
    clearFilterDrawer()
    console.log(data)

    for (const category of data.categories) {
        const categoryEl = document.createElement('div');
        categoryEl.classList.add('category');
        filterDrawer.appendChild(categoryEl);
        
        // Header
        const categoryHeader = document.createElement('div');
        categoryHeader.classList.add('category-header');
        categoryEl.appendChild(categoryHeader);

        const categoryEye = document.createElement('div');
        categoryEye.classList.add('toggle-icon', 'mdi', 'mdi-eye');
        const categoryTitle = document.createElement('div');
        categoryTitle.classList.add('category-title');
        categoryTitle.textContent = category.name;
        categoryHeader.appendChild(categoryEye);
        categoryHeader.appendChild(categoryTitle);
         
        // Groups
        for (const group of category.groups) {
            const groupEl = document.createElement('div');
            groupEl.classList.add('group');
            categoryEl.appendChild(groupEl);

            const groupEye = document.createElement('div');
            groupEye.classList.add('toggle-icon', 'mdi', 'mdi-eye');

            const groupIcon = document.createElement('img');
            groupIcon.classList.add('group-icon');
            groupIcon.src = group.icon; // TODO: use a default icon if null
            
            const groupTitle = document.createElement('div');
            groupTitle.classList.add('group-title');
            groupTitle.textContent = group.name;
            
            groupEl.appendChild(groupEye);
            groupEl.appendChild(groupIcon);
            groupEl.appendChild(groupTitle);
        }

        // categories[category].forEach(function(pin) {
        //     var pinCheckbox = document.createElement('input');
        //     pinCheckbox.type = 'checkbox';
        //     pinCheckbox.checked = true; // By default, pins are visible
        //     pinCheckbox.addEventListener('change', function() {
        //         var pinElement = document.querySelector('.pin[title="' + pin.title + '"]');
        //         pinElement.style.display = this.checked ? 'block' : 'none';
        //     });
  
        //     var pinLabel = document.createElement('label');
        //     pinLabel.textContent = pin.title;
        //     pinLabel.style.cursor = 'pointer';
        //     pinLabel.addEventListener('click', function() {
        //         var pinElement = document.querySelector('.pin[title="' + pin.title + '"]');
        //         var popup = pinElement.querySelector('.popup');
        //         // togglePopup(popup);
        //         if (editPinsModeToggle.checked) {
        //             showPinEdit(pin);
        //         }
        //     });
  
        //     var pinItem = document.createElement('div');
        //     pinItem.appendChild(pinCheckbox);
        //     pinItem.appendChild(pinLabel);
        //     filterDrawer.appendChild(pinItem);
        // });
    }
}

function clearFilterDrawer() {
    const first = filterDrawer.firstElementChild;
    filterDrawer.innerHTML = '';
    filterDrawer.appendChild(first);
  }

function showPinEdit(pin) {
    const pinIndex = data.indexOf(pin);
    const pinEditDiv = document.getElementById('pinEditDiv');

    console.log(pin);
    console.log("Pins in Data");
    console.log(data);
    console.log("Pin index");
    console.log(pinIndex);

    pinEditDiv.innerHTML = `
        <div id="editPin">
            <h3>Editing Map Pin: ${pin.category} - ${pin.title}</h3>
            <label for="editCategory">Category:</label>
            <input type="text" id="editCategory" value="${pin.category}"><br>
            <label for="editTitle">Title:</label>
            <input type="text" id="editTitle" value="${pin.title}"><br>
            <label for="editCoordsX">Coordinates (X):</label>
            <input type="text" id="editCoordsX" value="${pin.coords.x}"><br>
            <label for="editCoordsY">Coordinates (Y):</label>
            <input type="text" id="editCoordsY" value="${pin.coords.y}"><br>
            <label for="editPinImg">Pin Image URL:</label>
            <input type="text" id="editPinImg" value="${pin.pinImg}"><br>
            <label for="editDataImg">Data Image URL:</label>
            <input type="text" id="editDataImg" value="${pin.dataImg}"><br>
            <button onclick="savePinEdit(${pinIndex})">Save & Close</button>
            <button onclick="deletePin(${pinIndex})">Delete & Close</button>

        </div>`;
  }

function deletePin(pinIndex) {
    console.log("Begin Delete");
    console.log(pinIndex);
    
    if (pinIndex > -1) {
        data.splice(pinIndex, 1); // Remove one element at pinIndex
        console.log("Pin deleted successfully.");
        clearMap();
        data.forEach(pin => {
            createPinOnMap(pin);
        });
        clearFilterDrawer()
        createPinsAndCategoriesInMenu(data);

            // Clear pinEditDiv div
    document.getElementById('pinEditDiv').innerHTML = '';

    } else {
        console.log("Pin not found in array.");
    }
}

function savePinEdit(index) {
    var editCategory = document.getElementById('editCategory').value;
    var editTitle = document.getElementById('editTitle').value;
    var editCoordsX = document.getElementById('editCoordsX').value;
    var editCoordsY = document.getElementById('editCoordsY').value;
    var editPinImg = document.getElementById('editPinImg').value;
    var editDataImg = document.getElementById('editDataImg').value;
  
    if (!editCategory || !editTitle) {
        alert("Category and Title cannot be empty!");
        return;
    }
  
    data[index].category = editCategory;
    data[index].title = editTitle;
    data[index].coords.x = editCoordsX;
    data[index].coords.y = editCoordsY;
    data[index].pinImg = editPinImg;
    data[index].dataImg = editDataImg;
  
    clearMap();
    data.forEach(pin => {
        createPinOnMap(pin);
    });
    clearFilterDrawer()
    createPinsAndCategoriesInMenu(data);
  
    // Clear pinEditDiv div
    document.getElementById('pinEditDiv').innerHTML = '';
  }

  function blankMap() {
    data = [];
    clearMap();
    data.forEach(pin => {
        createPinOnMap(pin);
    });
    clearFilterDrawer()
    createPinsAndCategoriesInMenu(data);
  }

  const rawData = {
    "categories": [
       {
          "name": "Easter Eggs",
          "groups": [
             {
                "name": "Text",
                "icon": null,
                "description": "",
                "data": [
                   {
                      "name": "S Lies",
                      "x": "63.17%",
                      "y": "57.45%",
                      "image": "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/20230616171309_1.jpg"
                   }
                ]
             },
             {
                "name": "Graffiti",
                "icon": "/assets/icons/graffiti.png",
                "description": "",
                "data": [
                   {
                      "name": "SR.!",
                      "x": "57.83%",
                      "y": "73.89%",
                      "image": "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/SRspray.jpg"
                   },
                   {
                      "name": "825c",
                      "x": "61.38%",
                      "y": "51.95%",
                      "image": "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/825.png"
                   },
                   {
                      "name": "1339c",
                      "x": "27.71%",
                      "y": "29.78%",
                      "image": "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/1339c.png"
                   }
                ]
             },
             {
                "name": "Glitch clusters",
                "icon": "/assets/icons/glitch.png",
                "description": "",
                "data": [
                   {
                      "name": "North East - House",
                      "x": "61.02%",
                      "y": "27.93%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227819762285809674/image.png?ex=6629cb43&is=66175643&hm=57fd64828926873cf47cd004c8fb91e21651a157bbe4224edea03122a80ea454&"
                   },
                   {
                      "name": "South West - Hut",
                      "x": "9.19%",
                      "y": "58.68%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227821077217153044/image.png?ex=6629cc7c&is=6617577c&hm=ef3d6a4f5f05899b375fbfbfdc5dd50af051d4c67ca2671814a82464ff3a005b&"
                   },
                   {
                      "name": "South - by SR.!",
                      "x": "55.67%",
                      "y": "74.50%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1228072176138191010/srglitch.png?ex=662ab657&is=66184157&hm=d074db4c83f2b2bd360e804b92e76a669f57958ec710d3874016948a005010bd&"
                   }
                ]
             },
             {
                "name": "Power Generators",
                "icon": "/assets/icons/flash.png",
                "description": "",
                "data": [
                   {
                      "name": "Residential",
                      "x": "54.06%",
                      "y": "45.06%",
                      "image": null
                   },
                   {
                      "name": "Forest",
                      "x": "45.50%",
                      "y": "34.00%",
                      "image": null
                   },
                   {
                      "name": "Construction",
                      "x": "59.62%",
                      "y": "57.11%",
                      "image": null
                   },
                   {
                      "name": "Villas",
                      "x": "67.18%",
                      "y": "64.00%",
                      "image": null
                   },
                   {
                      "name": "Park",
                      "x": "77.17%",
                      "y": "68.67%",
                      "image": null
                   },
                   {
                      "name": "Cathedral",
                      "x": "47.18%",
                      "y": "66.44%",
                      "image": null
                   },
                   {
                      "name": "Cliffside",
                      "x": "17.72%",
                      "y": "63.50%",
                      "image": null
                   },
                   {
                      "name": "Royal Plaza",
                      "x": "10.50%",
                      "y": "38.78%",
                      "image": null
                   }
                ]
             },
             {
                "name": "Cannons",
                "icon": "/assets/icons/cannon.png",
                "description": "",
                "data": [
                   {
                      "name": "North - Plaza",
                      "x": "19.2%",
                      "y": "25.2%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227821112134467714/image.png?ex=6629cc84&is=66175784&hm=2cce4f764adadb450f808c2a9bc6b8d432bff4ab370824c4fd9ef180df1535af&"
                   },
                   {
                      "name": "West - Plaza 1",
                      "x": "7.07%",
                      "y": "35.16%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227825807099957290/image.png?ex=6629d0e4&is=66175be4&hm=01efa2c8e481d759979b9dc0e2fdb4b03f314bce450477cee1ad05afefb198dd&"
                   },
                   {
                      "name": "West - Plaza 2",
                      "x": "5.73%",
                      "y": "38.98%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227825807099957290/image.png?ex=6629d0e4&is=66175be4&hm=01efa2c8e481d759979b9dc0e2fdb4b03f314bce450477cee1ad05afefb198dd&"
                   },
                   {
                      "name": "South West - Hotels",
                      "x": "16.12%",
                      "y": "60.61%",
                      "image": "https://cdn.discordapp.com/attachments/1228035039695208600/1228073278073995356/image.png?ex=662ab75d&is=6618425d&hm=56634f868b5edd99560c4f27c69d1ad59ba9204280067827009d0531e6d9e65d&"
                   },
                   {
                      "name": "North East - Park",
                      "x": "72.27%",
                      "y": "32.36%",
                      "image": "https://cdn.discordapp.com/attachments/1228035039695208600/1228074720822296656/image.png?ex=662ab8b5&is=661843b5&hm=de899b89ed6785f1e6199f820539df13472e7a2819fe9db022a1fb0f3e03598c&"
                   }
                ]
             }
          ]
       },
       {
          "name": "Props",
          "groups": [
             {
                "name": "Fountains",
                "icon": "/assets/icons/fountain.png",
                "description": "",
                "data": [
                   {
                      "title": "East - Pocket Park",
                      "x": "80.04%",
                      "y": "44.64%",
                      "image": "https://cdn.discordapp.com/attachments/1228035039695208600/1228074242747404390/image.png?ex=662ab843&is=66184343&hm=932533db0b3e8db26192354f2d0b33d0c9dfd01ba8a781058cc0f4e832dac1d1&"
                   },
                   {
                      "title": "West - Plaza",
                      "x": "8.56%",
                      "y": "37.70%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227782477058412585/image.png?ex=6629a889&is=66173389&hm=1b45dacc290191c48038d22db26f82514664661ac20a359f2918d93f3aa8d132&"
                   },
                   {
                      "title": "South East - Park",
                      "x": "72.79%",
                      "y": "75.22%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227820941523025990/image.png?ex=6629cc5c&is=6617575c&hm=1e4cc3e6b6dc42d3efdbca3d9c36aaa305cd28533c16a8a514e8cd24fd7b4f3a&"
                   },
                   {
                      "title": "Center - Shopping",
                      "x": "37.46%",
                      "y": "50.70%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227832150158741554/image.png?ex=6629d6cc&is=661761cc&hm=737ebfeb1494a86f4c4e002d5e1d0d8e595948d66f9e63857b0ffe85198d2ef8&"
                   }
                ]
             },
             {
                "name": "Statues (Gold Woman)",
                "icon": "/assets/icons/statue.png",
                "description": "",
                "data": [
                   {
                      "name": "West - Plaza",
                      "x": "17.8%",
                      "y": "27.1%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227784091219263488/image.png?ex=6629aa0a&is=6617350a&hm=7e74f441e6be794b441be8b74e283ab42f130812999f7690215c55d5156655a2&"
                   },
                   {
                      "name": "South East - Park",
                      "x": "73.23%",
                      "y": "82.77%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227820917346926624/image.png?ex=6629cc56&is=66175756&hm=7a4e3fcccaf103fc85218cbad557d38050500dbfbf629cb2773f6d37def7ff2c&"
                   },
                   {
                      "name": "East - Pocket Park",
                      "x": "84.26%",
                      "y": "49.46%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227820894404087929/image.png?ex=6629cc51&is=66175751&hm=9ddfd59dccd823e00fcb199fc49a04cfaee0638fba019e50e26597e616094465&"
                   },
                   {
                      "name": "Center - Near Cathedral",
                      "x": "40.26%",
                      "y": "63.87%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227820199772684418/image.png?ex=6629cbab&is=661756ab&hm=caa56192946592fef3b4707749a4e08adf9f2bac1b5226943d30a68c5aac72f8&"
                   }
                ]
             },
             {
                "name": "Statues (Non-Destructible)",
                "icon": null,
                "description": "",
                "data": [
                   {
                      "name": "Thinker",
                      "x": "35.58%",
                      "y": "79.47%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227821018257690684/image.png?ex=6629cc6e&is=6617576e&hm=3d71a3c96bfc56f51ba5106f3774d962841187005274872f6e2e741d006c8bd3&"
                   },
                   {
                      "name": "Albert Plaque",
                      "x": "84.89%",
                      "y": "63.71%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227821045805875341/image.png?ex=6629cc75&is=66175775&hm=184343b0bda1d137ce7c98ae456d0cc2b86bb725d366bda318a230fc649841de&"
                   },
                   {
                      "name": "Lovers",
                      "x": "74.84%",
                      "y": "77.40%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227830939938193519/image.png?ex=6629d5ac&is=661760ac&hm=4504da2da5b85f72e14866a3479b98104cd1e57f632bd219361d5aebde988d10&"
                   }
                ]
             },
             {
                "name": "Diamonds",
                "icon": "/assets/icons/poker.png",
                "description": "",
                "data": [
                   {
                      "name": "Oval with crown",
                      "x": "20.88%",
                      "y": "41.21%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227782995692228710/image.png?ex=6629a905&is=66173405&hm=5d1184a4062534a526251c51af92e0c5fa2695b2eab96adee69d2c31d9604ed2&"
                   },
                   {
                      "name": "Sign Post 1",
                      "x": "23.13%",
                      "y": "28.42%",
                      "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227821127687078030/image.png?ex=6629cc88&is=66175788&hm=72664b417d6f78540e5b9865c5082528f707810bcfb9d1fa3191de2bee18e342&"
                   },
                   {
                      "name": "Sign Post 4",
                      "x": "61.18%",
                      "y": "33.54%",
                      "image": "https://cdn.discordapp.com/attachments/1227968583112327198/1228034228344721550/image.png?ex=662a92ff&is=66181dff&hm=79c6505f017917a84420c8b417f79e1992016f765f7f90e944472eddae7988d0&"
                   },
                   {
                      "name": "Sign Post 3",
                      "x": "53.10%",
                      "y": "35.35%",
                      "image": "https://cdn.discordapp.com/attachments/1227968583112327198/1228034520121610361/image.png?ex=662a9345&is=66181e45&hm=59d4dc42d30b9b81cc87317dae0ef5afddc59231c404c7df94bfd1070fa750f1&"
                   },
                   {
                      "name": "Sign Post 5",
                      "x": "65.84%",
                      "y": "32.34%",
                      "image": "https://cdn.discordapp.com/attachments/1227968583112327198/1228033981220388915/20240411182442_1.jpg?ex=662a92c4&is=66181dc4&hm=dcc9a11515f76cdf7d4b26d655ad78754dab4ba995f4da45d3c75027d127ccf4&"
                   },
                   {
                      "name": "Sign Post 2",
                      "x": "46.50%",
                      "y": "34.34%",
                      "image": "https://cdn.discordapp.com/attachments/1227968583112327198/1228034520121610361/image.png?ex=662a9345&is=66181e45&hm=59d4dc42d30b9b81cc87317dae0ef5afddc59231c404c7df94bfd1070fa750f1&"
                   }
                ]
             }
          ]
       }
    ]
 }