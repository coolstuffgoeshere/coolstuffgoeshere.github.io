const detailsPanelContainer = document.getElementById('details-panel-container');

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
    const categoryEl = document.createElement('div');
    category.ui.menuEl = categoryEl;
    categoryEl.classList.add('category');
    filterDrawer.appendChild(categoryEl);

    // Header
    const categoryHeader = document.createElement('div');
    categoryHeader.classList.add('category-header');
    categoryEl.appendChild(categoryHeader);

    const categoryEye = createToggleEye();
    categoryEye.onclick = () => toggleCategoryVisibility(category);
    category.ui.toggleEl = categoryEye;
    const categoryTitle = document.createElement('div');
    categoryTitle.classList.add('category-title');
    categoryTitle.textContent = category.name;
    category.ui.menuTitleEl = categoryTitle;


    const categoryEdit = document.createElement('div');
    categoryEdit.classList.add('category-edit-button', 'edit-mode');

    const categoryEditName = document.createElement('div');
    categoryEditName.classList.add('mdi', 'mdi-pencil');
    categoryEditName.onclick = () => editCategoryNamePopup(category);

    const categoryDelete = document.createElement('div');
    categoryDelete.classList.add('mdi', 'mdi-delete');
    categoryDelete.onclick = () => deleteCategory(category);

    categoryEdit.appendChild(categoryEditName);
    categoryEdit.appendChild(categoryDelete);

    categoryHeader.appendChild(categoryEye);
    categoryHeader.appendChild(categoryTitle);
    categoryHeader.appendChild(categoryEdit);

    // Groups
    for (const group of category.groups) {
      const groupEl = document.createElement('div');
      group.ui.menuEl = groupEl;
      groupEl.classList.add('group');
      category.ui.menuEl.appendChild(groupEl);

      const groupEye = createToggleEye();
      groupEye.onclick = () => toggleGroupVisibility(group);
      group.ui.toggleEl = groupEye;

      const groupIcon = document.createElement('img');
      groupIcon.classList.add('group-icon');
      groupIcon.src = group.icon || 'assets/icons/fried-egg.png';

      const groupTitle = document.createElement('div');
      groupTitle.classList.add('group-title');
      groupTitle.textContent = group.name;
      group.ui.menuTitleEl = groupTitle;

      const groupEdit = document.createElement('div');
      groupEdit.classList.add('group-edit-button', 'edit-mode');

      const groupEditName = document.createElement('div');
      groupEditName.classList.add('mdi', 'mdi-pencil');
      groupEditName.onclick = () => editGroupNamePopup(group);

      const groupDelete = document.createElement('div');
      groupDelete.classList.add('mdi', 'mdi-delete');
      groupDelete.onclick = () => deleteGroup(group);

      groupEdit.appendChild(groupEditName);
      groupEdit.appendChild(groupDelete);

      groupEl.appendChild(groupEye);
      groupEl.appendChild(groupIcon);
      groupEl.appendChild(groupTitle);
      groupEl.appendChild(groupEdit);

      groupEl.onclick = () => toggleGroupFocus(group);
      groupEl.onmouseenter = () => setGroupHighlight(group, true);
      groupEl.onmouseleave = () => setGroupHighlight(group, false);
    }

    const newGroupEl = document.createElement('div');
    newGroupEl.classList.add('button', 'button-accent', 'new-group', 'edit-mode');
    newGroupEl.onclick = () => createNewGroupPopup(category);

    const newGroupButton = document.createElement('div');
    newGroupButton.classList.add('icon', 'mdi', 'mdi-plus');

    const newGroupText = document.createElement('div');
    newGroupText.classList.add('text');
    newGroupText.textContent = 'NEW GROUP';

    newGroupEl.appendChild(newGroupButton);
    newGroupEl.appendChild(newGroupText);

    categoryEl.appendChild(newGroupEl);

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

  const newCategoryEl = document.createElement('div');
  newCategoryEl.classList.add('button', 'button-accent', 'new-category', 'edit-mode');
  newCategoryEl.onclick = () => createNewCategoryPopup();

  const newCategoryButton = document.createElement('div');
  newCategoryButton.classList.add('icon', 'mdi', 'mdi-plus');

  const newCategoryText = document.createElement('div');
  newCategoryText.classList.add('text');
  newCategoryText.textContent = 'NEW CATEGORY';

  newCategoryEl.appendChild(newCategoryButton);
  newCategoryEl.appendChild(newCategoryText);

  filterDrawer.appendChild(newCategoryEl);
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
      const groupEl = document.createElement('div');
      groupEl.classList.add('group');
      group.ui.mapEl = groupEl;
      map.appendChild(groupEl);

      for (const pin of group.data) {
        createPinOnMap(category, group, pin);
      }
    }
  }
}

// Create a single pin on the map.
function createPinOnMap (category, group, pin) {
  console.log('pin:', pin)
  // console.log(currentMapUrl)
  const pinEl = document.createElement('div');
  pin.ui.mapEl = pinEl;

  pinEl.classList.add('pin');
  const [x, y] = pin.points[0];
  pinEl.style.left = x.replace('%%', '%');
  pinEl.style.top = y.replace('%%', '%');
  pinEl.title = pin.name;

  const pinImage = document.createElement('img');
  pinImage.src = group.icon || 'assets/icons/fried-egg.png';

  pinImage.alt = pin.name;

  const popup = createPopup(pin);

  pinEl.appendChild(pinImage);
  pinEl.appendChild(popup);
  document.getElementById('map').appendChild(pinEl);

  // pinEl.onmouseenter = () => {
  //   popup.classList.add('active');
  //   updateNamatamaText(pin);
  // };

  // pinEl.onmouseleave = () => {
  //   popup.classList.remove('active');
  //   clearNamatamaText();
  // };

  pinEl.onclick = () => togglePinFocus(pin);
  pinEl.onmouseenter = () => setPinHighlight(pin, true);
  pinEl.onmouseleave = () => setPinHighlight(pin, false);

  // Create URL for the pin and replace unwanted characters
  const pinUrl = window.location.origin + window.location.pathname + '#' + state.currentMap.urlName.toLowerCase() + '?category=' + encodeURIComponent(pin.category) + '&title=' + encodeURIComponent(pin.name) + '&x=' + encodeURIComponent(pin.x + '%') + '&y=' + encodeURIComponent(pin.y + '%') + '&pinImg=' + encodeURIComponent(group.icon) + '&dataImg=' + encodeURIComponent(pin.image);

  // Add a click event listener to copy the URL to clipboard
  // pinEl.onclick = () => {
  //   navigator.clipboard.writeText(pinUrl)
  //     .then(() => {
  //       console.log('URL copied to clipboard: ' + pinUrl);
  //       // alert('URL copied to clipboard: ' + pinUrl);
  //     })
  //     .catch((err) => {
  //       console.error('Failed to copy URL to clipboard: ', err);
  //     });
  // };

  group.ui.mapEl.appendChild(pinEl);
}

function buildDetailsPanels () {
  for (const category of state.display.categories) {
    for (const group of category.groups) {
      const groupEl = document.createElement('div');
      group.ui.detailsEl = groupEl;
      groupEl.classList.add('details-header');

      const iconEl = document.createElement('img');
      iconEl.classList.add('group-icon');
      iconEl.src = group.icon || 'assets/icons/fried-egg.png';

      const nameEl = document.createElement('div');
      nameEl.classList.add('group-name');
      nameEl.textContent = group.name;

      const descriptionEl = document.createElement('div');
      descriptionEl.classList.add('group-description');
      descriptionEl.textContent = group.description;

      groupEl.appendChild(iconEl);
      groupEl.appendChild(nameEl);
      groupEl.appendChild(descriptionEl);

      // Edit mode stuff.
      const editGroupEl = document.createElement('div');
      editGroupEl.classList.add('edit-mode');
      groupEl.appendChild(editGroupEl);

      const editIconEl = document.createElement('div');
      editIconEl.classList.add('button', 'secondary');
      editIconEl.textContent = 'Edit Icon URL';
      editIconEl.onclick = () => editGroupIconPopup(group);

      const editGroupNameEl = document.createElement('div');
      editGroupNameEl.classList.add('button', 'secondary');
      editGroupNameEl.textContent = 'Edit Name';
      editGroupNameEl.onclick = () => editGroupNamePopup(group);

      const editGroupDescriptionEl = document.createElement('div');
      editGroupDescriptionEl.classList.add('button', 'secondary');
      editGroupDescriptionEl.textContent = 'Edit Description';
      editGroupDescriptionEl.onclick = () => editGroupDescriptionPopup(group);

      editGroupEl.appendChild(editIconEl);
      editGroupEl.appendChild(editGroupNameEl);
      editGroupEl.appendChild(editGroupDescriptionEl);

      for (const pin of group.data) {
        // Item for the list of pins in that group.
        const itemEl = document.createElement('div');
        pin.ui.detailsItemEl = itemEl;
        itemEl.classList.add('group-item');

        const itemNameEl = document.createElement('div');
        itemNameEl.classList.add('name');
        itemNameEl.textContent = pin.name;

        itemEl.appendChild(itemNameEl);

        itemEl.onclick = () => {
          togglePinFocus(pin);
          setPinHighlightOnMap(pin, false);
        }
        itemEl.onmouseenter = () => setPinHighlightOnMap(pin, true);
        itemEl.onmouseleave = () => setPinHighlightOnMap(pin, false);

        // Details about that specific pin.
        const infoEl = document.createElement('div');
        pin.ui.detailsInfoEl = infoEl;
        infoEl.classList.add('details-item');

        const infoNameEl = document.createElement('div');
        infoNameEl.classList.add('name');
        infoNameEl.textContent = pin.name;
        infoEl.appendChild(infoNameEl);

        const infoDescriptionEl = document.createElement('div');
        infoDescriptionEl.classList.add('description');
        infoDescriptionEl.textContent = pin.description;
        infoEl.appendChild(infoDescriptionEl);

        const infoImageEl = document.createElement('img');
        infoImageEl.classList.add('image');
        infoImageEl.src = pin.image || '';
        infoEl.appendChild(infoImageEl);

        // Edit mode stuff.
        const editPinEl = document.createElement('div');
        editPinEl.classList.add('edit-mode');
        infoEl.appendChild(editPinEl);

        const editPinNameEl = document.createElement('div');
        editPinNameEl.classList.add('button', 'secondary');
        editPinNameEl.textContent = 'Edit Name';
        editPinNameEl.onclick = () => editPinNamePopup(pin);

        const editPinDescriptionEl = document.createElement('div');
        editPinDescriptionEl.classList.add('button', 'secondary');
        editPinDescriptionEl.textContent = 'Edit Description';
        editPinDescriptionEl.onclick = () => editPinDescriptionPopup(pin);

        const editImageEl = document.createElement('div');
        editImageEl.classList.add('button', 'secondary');
        editImageEl.textContent = 'Edit Image URL';
        editImageEl.onclick = () => editPinImagePopup(pin);

        const editPinPosition = document.createElement('div');
        editPinPosition.classList.add('button', 'secondary');
        editPinPosition.textContent = 'Edit Position';
        editPinPosition.onclick = () => editPinPositionPopup(pin);

        editPinEl.appendChild(editPinNameEl);
        editPinEl.appendChild(editPinDescriptionEl);
        editPinEl.appendChild(editImageEl);
        editPinEl.appendChild(editPinPosition);
      }

      const newPinEl = document.createElement('div');
      newPinEl.classList.add('button', 'button-accent', 'new-pin', 'edit-mode');
      newPinEl.onclick = () => createNewPinPopup(group);

      const newPinButton = document.createElement('div');
      newPinButton.classList.add('icon', 'mdi', 'mdi-plus');

      const newPinText = document.createElement('div');
      newPinText.classList.add('text');
      newPinText.textContent = 'NEW PIN';

      newPinEl.appendChild(newPinButton);
      newPinEl.appendChild(newPinText);

      group.ui.newPinEl = newPinEl;
    }
  }
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

function editCategoryNamePopup (category) {
  const name = prompt(`Modify category name`, category.name);
  if (!name) return;

  editCategoryName(category, name);
}

function editGroupNamePopup (group) {
  const name = prompt(`Modify group name`, group.name);
  if (!name) return;

  editGroupName(group, name);
}

function editGroupIconPopup (group) {
  const icon = prompt(`Modify group image URL`, group.icon);

  if (icon === null) return;

  if (icon === '') {
    icon = null;
  }

  editGroupIcon(group, icon);
}

function editGroupDescriptionPopup (group) {
  const description = prompt(`Modify group description`, group.description);
  if (!description) return;

  editGroupDescription(group, description);
}

function editPinNamePopup (pin) {
  const name = prompt(`Modify pin name`, pin.name);
  if (!name) return;

  editPinName(pin, name);
}

function editPinDescriptionPopup (pin) {
  const description = prompt(`Modify pin description`, pin.description);
  if (!description) return;

  editPinDescription(pin, description);
}

function editPinImagePopup (pin) {
  const image = prompt(`Modify pin image URL`, pin.image);

  if (image === null) return;

  if (image === '') {
    image = null;
  }

  editPinImage(pin, image);
}