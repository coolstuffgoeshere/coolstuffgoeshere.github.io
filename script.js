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

function createPin(pin) {
    var pinElement = document.createElement('div');
    pinElement.classList.add('pin');
    pinElement.style.left = pin.coords.x;
    pinElement.style.top = pin.coords.y;
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
    });

    pinElement.addEventListener('mouseleave', function() {
        popup.classList.remove('active');
    });

    pinElement.addEventListener('click', function() {
        togglePopup(popup);
        updateSidebar(); // Update the sidebar when pin visibility changes
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


function deletePin(pin) {
    var index = pins.indexOf(pin);
    if (index !== -1) {
        pins.splice(index, 1);
        clearMap();
        loadPins();
        updateSidebar();
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
            <button onclick="deletePin(${pins.indexOf(pin)})">Delete</button>
        </div>`;
}

function deletePin(index) {
    if (confirm("Are you sure you want to delete this pin?")) {
        pins.splice(index, 1);
        updateSidebar();
        clearMap(); // Clear existing pins from the map
        loadPins(); // Reload pins onto the map after deletion
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

    pins[index].category = editCategory;
    pins[index].title = editTitle;
    pins[index].coords.x = editCoordsX;
    pins[index].coords.y = editCoordsY;
    pins[index].pinImg = editPinImg;
    pins[index].dataImg = editDataImg;

    updateSidebar();
    clearMap(); // Clear pins from the map
    loadPins(); // Reload pins onto the map after modification

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

document.getElementById('sidebarToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('optionsToggle').addEventListener('click', function() {
    var optionsBar = document.getElementById('optionsBar');
    optionsBar.style.display = optionsBar.style.display === 'none' ? 'block' : 'none';
});

document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', function() {
      selectedLocation = this.textContent.trim(); // Set selectedLocation based on the button text
      var selectedMap = maps.find(map => map.name === selectedLocation);

      if (selectedMap) {
          document.getElementById('map').style.backgroundImage = `url(${selectedMap.mapImage})`;
          currentMap = selectedMap.name;
          currentFile = selectedMap.fileName;
          fetch(selectedMap.defaultData)
              .then(response => response.json())
              .then(data => {
                  pins = data;
                  clearMap();
                  loadPins();
              })
              .catch(error => console.error('Error loading JSON:', error));
      }
  });
});


document.getElementById('map').addEventListener('click', addPin);

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

// Load map based on the URL hash route
function loadMap() {
  const hash = window.location.hash.substring(1); // Extract the hash part of the URL
  console.log(hash);

  let selectedMap = maps.find(map => map.urlName.toLowerCase() === hash.toLowerCase());

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
      })
      .catch(error => console.error('Error loading JSON:', error));
}

// Listen for hash changes to trigger map loading
window.addEventListener('hashchange', loadMap);

// Load map when the page loads
window.onload = loadMap;