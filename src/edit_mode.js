const editModeToggle =  document.getElementById('edit-mode');
document.getElementById('map').addEventListener('click', function(event) {
    if (editModeToggle.checked) {
        addPin(event);
    }
});

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
              // alert('URL copied to clipboard: ' + pinUrl);
          })
          .catch(function(err) {
              console.error('Failed to copy URL to clipboard: ', err);
          });
  });
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
  var coords = getCoordsFromClick(event);
  
  // Check if title is null or blank then stop
  if (!title) {
      return;
  }
  
  var pin = {
    category: category,
    title: title,
    coords: coords,
    pinImg: 'assets/icons/fried-egg.png',
    dataImg: 'assets/icons/fried-egg.png',
  };
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