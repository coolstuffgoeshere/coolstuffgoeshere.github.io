const detailsPanelContainer = document.getElementById('details-panel-container');

// https://stackoverflow.com/a/11381730/7065110
function isMobile () {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

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

function buildFiltersMenuCategory (category) {
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
}

function buildFiltersMenuGroup (group) {
  const groupEl = document.createElement('div');
  group.ui.menuEl = groupEl;
  groupEl.classList.add('group');
  group.category.ui.menuEl.appendChild(groupEl);

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

  if (!state.isMobile) {
    groupEl.onmouseenter = () => setGroupHighlight(group, true);
    groupEl.onmouseleave = () => setGroupHighlight(group, false);
  }
  groupEl.onclick = () => toggleGroupFocus(group);
}

function buildFiltersMenu () {
  clearFilterMenu()
  // console.log(data)

  for (const category of state.display.categories) {
    buildFiltersMenuCategory(category);

    // Groups
    for (const group of category.groups) {
      buildFiltersMenuGroup(group);
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

    category.ui.menuEl.appendChild(newGroupEl);

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

// Clear the Map
function clearMap () {
  // document.getElementById('pinEditDiv').innerHTML = '';
  const map = document.getElementById('map');
  map.innerHTML = ''; // Clear all child elements (pins) from the map
}

function buildMapGroup (group) {
  const groupEl = document.createElement('div');
  groupEl.classList.add('group');
  group.ui.mapEl = groupEl;
  map.appendChild(groupEl);
}

function buildMapPins () {
  map.appendChild(state.cursor.el);
  for (const category of state.display.categories) {
    for (const group of category.groups) {
      buildMapGroup(group);

      for (const pin of group.data) {
        createPinOnMap(pin);
      }
    }
  }
}

// Create a single pin on the map.
function createPinOnMap (pin) {
  console.log('pin:', pin)
  // console.log(currentMapUrl)
  const pinEl = document.createElement('div');
  pin.ui.mapEl = pinEl;

  pinEl.classList.add('pin');
  const [x, y] = pin.points[0];
  pinEl.style.left = `${x}%`;
  pinEl.style.top = `${y}%`;

  const pinImage = document.createElement('img');
  pinImage.src = pin.group.icon || 'assets/icons/fried-egg.png';

  pinImage.alt = pin.name;

  const popup = createPopup(pin);

  pinEl.appendChild(pinImage);
  pinEl.appendChild(popup);
  document.getElementById('map').appendChild(pinEl);

  pinEl.onclick = (e) => {
    e.stopPropagation();
    togglePinFocus(pin);
  };
  if (!state.isMobile) {
    pinEl.onmouseenter = () => setPinHighlight(pin, true);
    pinEl.onmouseleave = () => setPinHighlight(pin, false);
  }

  // Create URL for the pin and replace unwanted characters
  const pinUrl = window.location.origin + window.location.pathname + '#' + state.currentMap.urlName.toLowerCase() + '?category=' + encodeURIComponent(pin.category) + '&title=' + encodeURIComponent(pin.name) + '&x=' + encodeURIComponent(pin.x + '%') + '&y=' + encodeURIComponent(pin.y + '%') + '&pinImg=' + encodeURIComponent(pin.group.icon) + '&dataImg=' + encodeURIComponent(pin.image);

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

  pin.group.ui.mapEl.appendChild(pinEl);
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
        if (!state.isMobile) {
          itemEl.onmouseenter = () => setPinHighlightOnMap(pin, true);
          itemEl.onmouseleave = () => setPinHighlightOnMap(pin, false);
        }

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

        // const editPinPosition = document.createElement('div');
        // editPinPosition.classList.add('button', 'secondary');
        // editPinPosition.textContent = 'Edit Position';
        // editPinPosition.onclick = () => editPinPositionPopup(pin);

        const editDeletePin = document.createElement('div');
        editDeletePin.classList.add('button', 'secondary');
        editDeletePin.textContent = 'Delete Pin';
        editDeletePin.onclick = () => deletePin(pin);

        editPinEl.appendChild(editPinNameEl);
        editPinEl.appendChild(editPinDescriptionEl);
        editPinEl.appendChild(editImageEl);
        // editPinEl.appendChild(editPinPosition);
        editPinEl.appendChild(editDeletePin);
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

function createNewCategoryPopup () {
  const name = prompt(`Category name`);
  if (!name) return;

  newCategory(name);
}

function createNewGroupPopup (category) {
  const name = prompt(`Group name`);
  if (!name) return;

  const icon = prompt(`Group icon URL`);

  const description = prompt(`Group description`);

  newGroup(category, name, icon, description);
}

function createNewPinPopup (group) {
  const name = prompt(`Pin name`);
  if (!name) return;

  const description = prompt(`Pin description`);

  const image = prompt(`Pin image URL`);

  newPin(group, name, description, image, 'point', [state.cursor.point]);
}