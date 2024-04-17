function createToggleEye () {
  const attr = 'checked';
  const iconOn = 'mdi-eye';
  const iconOff = 'mdi-eye-off-outline';

  const eye = document.createElement('div');
  eye.classList.add('toggle-icon', 'mdi', iconOn);
  eye.setAttribute(attr, '');

  eye.setChecked = (checked) => {
    if (checked) {
      eye.setAttribute(attr, '');
      eye.classList.remove(iconOff);
      eye.classList.add(iconOn);
    } else {
      eye.removeAttribute(attr);
      eye.classList.remove(iconOn);
      eye.classList.add(iconOff);
    }
  }

  return eye;
}

// Build the Map Menu of those Maps & give them the functions needed when clicked on.
function buildMapMenu () {
  const mapChoices = document.getElementById('map-drawer');

  for (const map of state.maps) {
    const choice = document.createElement('div');
    choice.textContent = map.name;
    choice.classList.add('item');
    choice.onclick = () => setMap(map);
    mapChoices.appendChild(choice);
  }
}

function clearFilterMenu () {
  const first = filterDrawer.firstElementChild;
  filterDrawer.innerHTML = '';
  filterDrawer.appendChild(first);
}

function buildFiltersMenu () {
  clearFilterMenu()
  // console.log(data)

  for (const category of state.display.categories) {
    category.el = document.createElement('div');
    category.el.classList.add('category');
    filterDrawer.appendChild(category.el);

    // Header
    const categoryHeader = document.createElement('div');
    categoryHeader.classList.add('category-header');
    category.el.appendChild(categoryHeader);

    const categoryEye = createToggleEye();
    categoryEye.onclick = () => toggleCategoryVisibility(category);
    category.toggleEl = categoryEye;
    const categoryTitle = document.createElement('div');
    categoryTitle.classList.add('category-title');
    categoryTitle.textContent = category.name;
    const categoryEdit = document.createElement('div');
    categoryEdit.classList.add('mdi', 'mdi-pencil', 'category-edit-button', 'edit-mode');
    if (!state.editMode) categoryEdit.classList.add('hidden');
    categoryEdit.onclick = () => editCategoryPopup(category);

    categoryHeader.appendChild(categoryEye);
    categoryHeader.appendChild(categoryTitle);
    categoryHeader.appendChild(categoryEdit);

    // Groups
    for (const group of category.groups) {
      group.el = document.createElement('div');
      group.el.classList.add('group');
      category.el.appendChild(group.el);

      const groupEye = createToggleEye();
      groupEye.onclick = () => toggleGroupVisibility(group);
      group.toggleEl = groupEye;

      const groupIcon = document.createElement('img');
      groupIcon.classList.add('group-icon');
      groupIcon.src = group.icon || 'assets/icons/fried-egg.png';

      const groupTitle = document.createElement('div');
      groupTitle.classList.add('group-title');
      groupTitle.textContent = group.name;

      const groupEdit = document.createElement('div');
      groupEdit.classList.add('mdi', 'mdi-pencil', 'group-edit-button', 'edit-mode');
      if (!state.editMode) groupEdit.classList.add('hidden');
      groupEdit.onclick = () => editGroupPopup(group);

      group.el.appendChild(groupEye);
      group.el.appendChild(groupIcon);
      group.el.appendChild(groupTitle);
      group.el.appendChild(groupEdit);
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

function blankMap () {
  data = [];
  clearMap();
  createAllPinsOnMap(data);
  clearFilterMenu()
  createPinsAndCategoriesInMenu(data);
}

// Clear the Map
function clearMap () {
  document.getElementById('pinEditDiv').innerHTML = '';
  const map = document.getElementById('map');
  map.innerHTML = ''; // Clear all child elements (pins) from the map
}

function buildMapPins () {
  for (const category of state.display.categories) {
    for (const group of category.groups) {
      for (const pin of group.data) {
        pin.el = createPinOnMap(category, group, pin);
      }
    }
  }
}

// Create a single pin on the map.
function createPinOnMap (category, group, pin) {
  console.log('pin:', pin)
  // console.log(currentMapUrl)
  const pinElement = document.createElement('div');
  pinElement.classList.add('pin');
  const [x, y] = pin.points[0];
  pinElement.style.left = x.replace('%%', '%');
  pinElement.style.top = y.replace('%%', '%');
  pinElement.title = pin.name;

  const pinImage = document.createElement('img');
  pinImage.src = group.icon || 'assets/icons/fried-egg.png';

  pinImage.alt = pin.name;

  const popup = createPopup(pin);

  pinElement.appendChild(pinImage);
  pinElement.appendChild(popup);
  document.getElementById('map').appendChild(pinElement);

  pinElement.onmouseenter = () => {
    popup.classList.add('active');
    updateNamatamaText(pin);
  };

  pinElement.onmouseleave = () => {
    popup.classList.remove('active');
    clearNamatamaText();
  };

  // Create URL for the pin and replace unwanted characters
  const pinUrl = window.location.origin + window.location.pathname + '#' + state.currentMap.urlName.toLowerCase() + '?category=' + encodeURIComponent(pin.category) + '&title=' + encodeURIComponent(pin.name) + '&x=' + encodeURIComponent(pin.x + '%') + '&y=' + encodeURIComponent(pin.y + '%') + '&pinImg=' + encodeURIComponent(group.icon) + '&dataImg=' + encodeURIComponent(pin.image);

  // Add a click event listener to copy the URL to clipboard
  pinElement.onclick = () => {
    navigator.clipboard.writeText(pinUrl)
      .then(() => {
        console.log('URL copied to clipboard: ' + pinUrl);
        // alert('URL copied to clipboard: ' + pinUrl);
      })
      .catch((err) => {
        console.error('Failed to copy URL to clipboard: ', err);
      });
  };

  return pinElement;
}


function showPinEdit (pin) {
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

function editCategoryPopup (category) {
  const name = prompt(`Modify category name`, category.name);
  if (!name) return;

  editCategoryName(category, name);
}

function editGroupPopup (group) {
  const name = prompt(`Modify group name`, group.name);
  if (!name) return;

  editGroupName(group, name);
}