var maps = [
  {
      name: "Monaco",
      urlName: "monaco",
      mapImage: "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/MonacoOverview_Hi-Res.jpg",
      fileName: "map_monaco.json",
      defaultData: "https://coolstuffgoeshere.github.io/map_monaco.json"
  },
  {
      name: "Seoul",
      urlName: "seoul",
      mapImage: "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/SeoulOverview_Hi-Res.jpg",
      fileName: "map_seoul.json",
      defaultData: "https://coolstuffgoeshere.github.io/map_seoul.json"
  },
  {
      name: "Skyway Stadium",
      urlName: "skywaystadium",
      mapImage: "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/Atsuhiro_Skyway-Stadium_Overview-Map.png",
      fileName: "map_skyway.json",
      defaultData: "https://coolstuffgoeshere.github.io/map_skyway.json"
  },
  {
      name: "Las Vegas",
      urlName: "lasvegas",
      mapImage: "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/Atsuhiro_Las-Vegas_Overview-MAp.png",
      fileName: "map_vegas.json",
      defaultData: "https://coolstuffgoeshere.github.io/map_vegas.json"
  },
  {
      name: "SYS$Horizon",
      urlName: "syshorizon",
      mapImage: "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/SYSHORIZON_mapOverview.jpg",
      fileName: "map_syshorizon.json",
      defaultData: "https://coolstuffgoeshere.github.io/map_syshorizon.json"
  }
];

var pins = [];
var currentMap = "Monaco";
var currentFile = "map_monaco.json";
const zoomData = {
    zoom: 1.0,
    x: 0,
    y: 0
};

let isAddPinMode = false;

// Set the default mode to VIEW MAP and set active buttons
document.querySelectorAll('.toggle-button').forEach(function(button, index) {
    if (index === 0) {
        button.classList.add('active');
    }
    button.addEventListener('click', function() {
        if (index === 0) {
            isAddPinMode = false; // VIEW MAP mode
        } else {
            isAddPinMode = true; // ADD PINS mode
        }

        // Update button styles based on the selected mode
        document.querySelectorAll('.toggle-button').forEach(function(btn, idx) {
            if (idx === index) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    });
});

document.getElementById('map').addEventListener('click', function(event) {
    if (isAddPinMode) {
        addPin(event);
    }
});

// Show/Hide Namatama Text
// function toggleText() {
//     var text = document.getElementById("namatamaText");
//     if (text.style.display === "none") {
//       text.style.display = "block";
//     } else {
//       text.style.display = "none";
//     }
//   }

function createPin(pin) {
    console.log(pin)
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
        var pinUrl = window.location.origin + window.location.pathname + '#' + currentMap.toLowerCase() + '?category=' + encodeURIComponent(pin.category) + '&title=' + encodeURIComponent(pin.title) + '&x=' + encodeURIComponent(pin.coords.x + '%') + '&y=' + encodeURIComponent(pin.coords.y + '%') + '&pinImg=' + encodeURIComponent(pin.pinImg) + '&dataImg=' + encodeURIComponent(pin.dataImg);
    
        // Add a click event listener to copy the URL to clipboard
        pinElement.addEventListener('click', function() {
            navigator.clipboard.writeText(pinUrl)
                .then(function() {
                    console.log('URL copied to clipboard: ' + pinUrl);
                    alert('URL copied to clipboard: ' + pinUrl);
                })
                .catch(function(err) {
                    console.error('Failed to copy URL to clipboard: ', err);
                });
        });
    
     
    }

function togglePopup(popup) {
    popup.classList.toggle('active');
}

function createPopup(pin) {
    var popup = document.createElement('div');
    popup.classList.add('popup');

    var pinData = document.createElement('div');
    pinData.innerHTML = '<strong>Category:</strong> ' + pin.category + '<br>' +
                     '<strong>Title:</strong> ' + pin.title + '<br>' +
                     '<strong>Image:</strong> <img src="' + pin.dataImg + '" style="">';

    popup.appendChild(pinData);

    return popup;
}

function deletePin(index) {
  if (confirm("Are you sure you want to delete this pin?")) {
      pins.splice(index, 1);
      updateSidebar();
      clearMap(); // Clear existing pins from the map
      loadPins(); // Reload pins onto the map after deletion
      document.getElementById('editMode').innerHTML = ''; // Clear the editMode section
  }
}

function updateSidebar() {
    var sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = ''; // Clear previous content

    var categories = {}; // Object to store pins by category

    pins.forEach(function(pin) {
        if (!categories[pin.category]) {
            categories[pin.category] = [];
        }
        categories[pin.category].push(pin);
    });

    for (var category in categories) {
        var categoryHeader = document.createElement('h3');
        categoryHeader.textContent = category;
        sidebar.appendChild(categoryHeader);

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
                showPinEdit(pin, sidebar);
            });

            var pinItem = document.createElement('div');
            pinItem.appendChild(pinCheckbox);
            pinItem.appendChild(pinLabel);
            sidebar.appendChild(pinItem);
        });
    }
}

function showPinEdit(pin, sidebar) {
    var editMode = document.getElementById('editMode');
    editMode.innerHTML = `
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
            <button onclick="savePinEdit(${pins.indexOf(pin)})">Save & Close</button>
            <button onclick="deletePin(${pins.indexOf(pin)}); document.getElementById('editMode').innerHTML = '';">Delete & Close</button>
        </div>`;
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

    pins[index].category = editCategory;
    pins[index].title = editTitle;
    pins[index].coords.x = editCoordsX;
    pins[index].coords.y = editCoordsY;
    pins[index].pinImg = editPinImg;
    pins[index].dataImg = editDataImg;

    updateSidebar();
    clearMap(); 
    loadPins();

    // Clear editMode div
    document.getElementById('editMode').innerHTML = '';
}


function addPin(event) {
    var category = prompt('Enter the category for the new pin:');
    
    // Check if category is null or blank then stop
    if (!category) {
        return;
    }
    
    var title = prompt('Enter the title for the new pin:');
    var dataImg = prompt('Enter the data image URL for the new pin (optional):');
    var coords = getCoordsFromClick(event);
    
    // Check if title is null or blank then stop
    if (!title) {
        return;
    }
    
    var pin = {category: category, title: title, coords: coords, pinImg: 'https://coolstuffgoeshere.github.io/icons/fried-egg.png', dataImg: dataImg};
    pins.push(pin);
    createPin(pin);
    updateSidebar();
}


function getCoordsFromClick(event) {
    var map = document.getElementById('map');
    var rect = map.getBoundingClientRect();
    var pinSize = 3; // Adjust based on pin size (3 works best)
    var x = ((event.clientX - rect.left) / map.offsetWidth * 100) - (pinSize / 2) + '%';
    var y = ((event.clientY - rect.top) / map.offsetHeight * 100) - (pinSize / 2) + '%';
    return {x: x, y: y};
}

function loadPinsFromFile(file) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var loadedPins = JSON.parse(event.target.result);
        pins = loadedPins;
        clearMap(); // Clear existing pins from the map
        loadPins(); // Load the new pins onto the map
    };
    reader.readAsText(file);
}

function clearMap() {
    var map = document.getElementById('map');
    map.innerHTML = ''; // Clear all child elements (pins) from the map

    var sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = ''; // Clear the sidebar content
}

function savePinsToFile() {
  var json = JSON.stringify(pins, null, 2);
  var blob = new Blob([json], {type: "application/json"});
  var url = URL.createObjectURL(blob);

  var a = document.createElement("a");
  a.style.display = 'none';
  document.body.appendChild(a);
  a.href = url;
  a.download = currentFile;
  a.click();
  window.URL.revokeObjectURL(url);
}

function loadPins() {
    pins.forEach(function(pin) {
        createPin(pin);
    });
    updateSidebar();
}

// Inject map choices in the menu.
const mapChoices = document.getElementById('map-choices');
for (let map of maps) {
    const choice = document.createElement('div');
    choice.textContent = map.name;
    choice.onclick = function() {
        selectedLocation = map.name;
        document.getElementById('map').style.backgroundImage = `url(${map.mapImage})`;
        currentMap = map.name;
        currentFile = map.fileName;
        fetch(map.defaultData)
            .then(response => response.json())
            .then(data => {
                pins = data;
                clearMap();
                loadPins();
            })
            .catch(error => console.error('Error loading JSON:', error));
    };
    mapChoices.appendChild(choice);
}

const map = document.getElementById('map');

// Event Listeners

// Update the event listeners for MENU-BUTTONS to toggle the display of choices
document.querySelectorAll('.menu-button').forEach(function(button) {
  button.addEventListener('click', function() {
      this.classList.toggle('active');
  });
});

// Close the choices when clicking outside of the buttons
document.addEventListener('click', function(event) {
  if (!event.target.closest('.menu-button')) {
      document.querySelectorAll('.menu-button').forEach(function(button) {
          button.classList.remove('active');
      });
  }
});


document.getElementById('loadButton').addEventListener('click', function() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function(event) {
      var file = event.target.files[0];
      if (file) {
          loadPinsFromFile(file);
      }
  };
  input.click();
});

document.getElementById('saveButton').addEventListener('click', savePinsToFile);

document.getElementById('clearButton').addEventListener('click', function() {
  pins = []; // Clear all pins
  clearMap(); // Clear pins from the map
});

// Load map based on the URL hash route
function loadMap() {
    const hash = window.location.hash.substring(1); // Extract the hash part of the URL
    const hashMap = hash.split('?')[0];
    console.log(hashMap);
    const hashParams = hash.split('?')[1];
    console.log(hashParams);
  
    let selectedMap = maps.find(map => map.urlName.toLowerCase() === hashMap.toLowerCase());
  
    if (!selectedMap) {
        // Set Monaco as the default map if no hash route is specified
        selectedMap = maps.find(map => map.urlName.toLowerCase() === 'monaco');
    }
    console.log(selectedMap);
  
    document.getElementById('map').style.backgroundImage = `url(${selectedMap.mapImage})`;
    currentMap = selectedMap.name;
    currentFile = selectedMap.fileName;
    fetch(selectedMap.defaultData)
        .then(response => response.json())
        .then(data => {
            pins = data;
            clearMap();
            loadPins();
  
            // Extract pin data from the URL
            const urlParams = hashParams.replace(/%25/g, '%').replace(/%3A/g, ':').replace(/%2F/g, '/').replace(/%26/g, '&');            
            const category = urlParams.split('&')[0].split('=')[1];
            const title = urlParams.split('&')[1].split('=')[1];
            const x = urlParams.split('&')[2].split('=')[1];
            const y = urlParams.split('&')[3].split('=')[1];
            const pinImg = urlParams.split('&')[4].split('=')[1];
            const dataImg = urlParams.split('&')[5].split('=')[1];
            console.log(category);
            console.log(title);
            console.log(x);
            console.log(y);
            console.log(pinImg);
            console.log(dataImg);

            if (category && title && x && y && pinImg && dataImg) {
                const newPinData = {
                    category,
                    title,
                    coords: { x, y },
                    pinImg,
                    dataImg
                };
                
                createPin(newPinData); // Add a new pin directly
                updateSidebar(); // Update the sidebar with the new pin
                console.log(newPinData);
            }
        })
        .catch(error => console.error('Error loading JSON:', error));
  }

// Listen for hash changes to trigger map loading
window.addEventListener('hashchange', loadMap);

// Load map when the page loads
window.onload = loadMap;

let mapContainer = document.getElementById('map-container');
const r = mapContainer.getBoundingClientRect();
const min = Math.min(r.width, r.height);
map.style.width = min + 'px';
map.style.height = min + 'px';

let observer = new ResizeObserver(function(mutations) {
    const r = mapContainer.getBoundingClientRect();
    const min = Math.min(r.width, r.height);
    map.style.width = min + 'px';
    map.style.height = min + 'px';
});

observer.observe(mapContainer);

// Update CSS transforms for the map zoom and position.
function updateZoom() {
    const r = mapContainer.getBoundingClientRect();
    const min = Math.min(r.width, r.height);
    map.style.transform = `translate(${zoomData.x*min}px, ${zoomData.y*min}px) scale(${zoomData.zoom})`;
    // Adjust pin size based on map zoom level
    var pins = document.getElementsByClassName('pin');
    for (var i = 0; i < pins.length; i++) {
        pins[i].style.transform = `scale(${1 / zoomData.zoom})`;
    }
}

function changeZoom(x, y, scale) {
    const oldZoom = zoomData.zoom;
    zoomData.zoom *= scale;

    // Clamp zoom between a minimum and maximum value.
    zoomData.zoom = Math.min(Math.max(0.5, zoomData.zoom), 8.0);
    
    // Apply translation to keep the zoom centered on the cursor.
    zoomData.x -= (zoomData.zoom - oldZoom) * x;
    zoomData.y -= (zoomData.zoom - oldZoom) * y;
    
    // Clamp translation to keep the zoomed map within the viewport.
    zoomData.x = Math.min(Math.max(-zoomData.zoom, zoomData.x), zoomData.zoom);
    zoomData.y = Math.min(Math.max(-zoomData.zoom, zoomData.y), zoomData.zoom);

    updateZoom();
}

// Touchscreen events.
const hammertime = new Hammer(mapContainer);
hammertime.get('pinch').set({ enable: true });
hammertime.get('pan').set({ enable: true });

// Touchscreen zoom event handlers.
let pinchData = {lastZoom: 1};
hammertime.on('pinchstart', function(ev) {
    const rect = map.getBoundingClientRect();
    pinchData = {
        x: (ev.center.x - rect.x) / rect.width,
        y: (ev.center.y - rect.y) / rect.height,
        lastZoom: 1,
    };
    pinchMove(ev);
})
hammertime.on('pinchmove', pinchMove)

function pinchMove(ev) {
    changeZoom(pinchData.x, pinchData.y, ev.scale/pinchData.lastZoom);
    pinchData.lastZoom = ev.scale;
}

// Touchscreen move event handlers.
let panData = {x: 0, y: 0};
hammertime.on('panstart', function(ev) {
    panData = {x: 0, y: 0};
    panMove(ev);
})
hammertime.on('panmove', panMove)

function panMove(ev) {
    const rect = map.getBoundingClientRect();
    zoomData.x += (ev.deltaX - panData.x) / rect.width * zoomData.zoom;
    zoomData.y += (ev.deltaY - panData.y) / rect.height * zoomData.zoom;
    panData = {x: ev.deltaX, y: ev.deltaY};
    updateZoom();
}

// Mouse wheel zoom event handler.
mapContainer.addEventListener('wheel', function(event) {
    // Compute the cursor position as a percentage of the map size.
    const rect = map.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
   
    // Determine the direction of the scroll and adjust the zoom level.
    const sign = event.deltaY < 0 ? 1 : -1;
    changeZoom(x, y, 1 + sign * 0.05);
});

const filterPanel = document.getElementById('sidebar');
function toggleFilter() {
    filterPanel.classList.toggle('disabled');
}




function updateNamatamaText(pin) {
    var namatamaText = document.getElementById('namatamaText');
    namatamaText.innerHTML = '<strong>Category:</strong> ' + pin.category + '<br>' +
                             '<strong>Title:</strong> ' + pin.title + '<br>' +
                             '<strong>Image:</strong> <img src="' + pin.dataImg + '" style="">';
}

function clearNamatamaText() {
    var namatamaText = document.getElementById('namatamaText');
    namatamaText.innerHTML = 'Nice work! Now go find an easter egg. ❤️';
}

