// State of the app used to render the UI.
const state = {
  maps: [],
  currentMap: null,
  mapData: null,
  userMapData: null,
  display: {
    categories: [],
  },
  editMode: false,
  cursor: {
    point: [0.5, 0.5],
    el: document.getElementById('map-cursor'),
  },
  isMobile: isMobile(),
  ui: {
    welcomeEl: document.querySelector('.welcome'),
    welcomeEditEl: document.querySelector('.welcome.edit-mode'),
  }
};

(() => {
  const panelEl = document.querySelector('.details-panel');

  if (state.isMobile) {
    panelEl.innerHTML = '';
  }

  panelEl.classList.remove('hidden');

  const mapContainer = document.getElementById('map-container');
  mapContainer.onclick = () => {
    clearFocus();
  }

  let pressStartPosition = null;
  let pressLongestDistance = 0;
  let wasMouseDragged = false;

  map.onmousedown = (event) => {
	if (event.button != 0) {
		return;
	}

	wasMouseDragged = false;
	
	const [x, y] = getPointerMapPosition(event);

	pressStartPosition = {x: x, y: y};
	pressLongestDistance = 0;
  }

  map.onmousemove = (event) => {
	if (event.button != 0) {
		return;
	}

	wasMouseDragged = true;
	
	const [x, y] = getPointerMapPosition(event);
	const distanceFromStart = pressStartPosition ? Math.hypot(x - pressStartPosition.x, y - pressStartPosition.y) : 0;

	pressLongestDistance = distanceFromStart>pressLongestDistance ? distanceFromStart : pressLongestDistance;
  }

  map.onmouseup = (event) => {
	if (event.button != 0 | !state.editMode) {
		return;
	}

	if (pressLongestDistance > 0) {
		return;
	}

	// the cursor position should not be changed if the user is clicking on something other than the map div or cursor div
	// there should be a better way of checking if the element is the map div, but this works for now
	const elementBelowMouse = document.elementFromPoint(event.clientX, event.clientY);
	const elementClassList = Array.from(elementBelowMouse.classList);
	if (elementBelowMouse.id != "map" && !elementClassList.includes("mdi")) {
		return;
	}

	const [x, y] = pressStartPosition ? [pressStartPosition.x, pressStartPosition.y] : getPointerMapPosition(event);
	setCursorPosition(x, y);
  }

  map.onclick = (event) => {
	if (event.button != 0) {
		return;
	}

	// we should not stop propagation if the mouse was clicked
	if (!wasMouseDragged && !state.editMode) {
		return;
	}

	// this needs to be done with .onclick or else
	// the category in the drawer will be deselected
	event.stopPropagation();
  }
})()


function blankMap () {
  clearMap();
  clearFilterMenu();

  state.mapData = {
    categories: [],
  };
  state.userMapData = {
    categories: [],
  };
  state.display.categories = [];
  
  buildFiltersMenu();
  buildMapPins();
  buildDetailsPanels();
  refreshDetailsPanel();
}

function setMap (map) {
  state.currentMap = map;
  clearMap();
  document.getElementById('map').style.backgroundImage = `url(${map.mapImage})`;
  fetchMapDataFromSupabase(map.name);
  setCursorPosition(0.5, 0.5);
}

function setMapData (data) {
  clearMap();
  clearFilterMenu();
  state.display = {
    categories: [],
  }

  state.mapData = data;
  state.userMapData = {
    categories: [],
  };
  // state.userMapData = JSON.parse(JSON.stringify(data)); // Deep copy.

  for (const category of data.categories) {
    const c = newCategory(category.name, true);

    for (const group of category.groups) {
      const g = newGroup(c, group.name, group.icon, group.description, true);

      for (const pin of group.data) {
        newPin(g, pin.name, pin.description, pin.image, pin.type, pin.points, true);
      }
    }
  }

  buildFiltersMenu();
  buildMapPins();
  buildDetailsPanels();
  refreshDetailsPanel();
}

function setCursorPosition (x, y) {
  state.cursor.point = [x, y];
  state.cursor.el.style.left = `${x * 100}%`;
  state.cursor.el.style.top = `${y * 100}%`;
}

function toggleCategoryVisibility (c) {
  setCategoryVisibility(c, !c.visible);

  for (const g of c.groups) {
    setGroupVisibility(g, c.visible);
  }
}

function setCategoryVisibility (c, visible) {
  if (c.visible == visible) return;

  c.visible = visible;
  c.ui.toggleEl.setChecked(visible);
}

function toggleGroupVisibility (g) {
  setGroupVisibility(g, !g.visible);

  let categoryVisible = false;
  for (const group of g.category.groups) {
    categoryVisible ||= group.visible;
  }
  setCategoryVisibility(g.category, categoryVisible);
}

function setGroupVisibility (g, visible) {
  if (g.visible == visible) return;

  g.visible = visible;
  g.ui.toggleEl.setChecked(visible);

  if (visible) {
    g.ui.mapEl.classList.remove('hidden');
  } else {
    g.ui.mapEl.classList.add('hidden');
  }
}

function deletePin (pinIndex) {
  console.log("Begin Delete");
  console.log(pinIndex);

  if (pinIndex > -1) {
    data.splice(pinIndex, 1); // Remove one element at pinIndex
    console.log("Pin deleted successfully.");
    clearMap();
    createAllPinsOnMap(data);
    clearFilterMenu()
    createPinsAndCategoriesInMenu(data);

    // Clear pinEditDiv div
    document.getElementById('pinEditDiv').innerHTML = '';

  } else {
    console.log("Pin not found in array.");
  }
}

function savePinEdit (index) {
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
  createAllPinsOnMap(data);
  clearFilterMenu()
  createPinsAndCategoriesInMenu(data);

  // Clear pinEditDiv div
  document.getElementById('pinEditDiv').innerHTML = '';
}

function toggleEditMode () {
  state.editMode = !state.editMode;
  app.classList.toggle('edit-mode');
  refreshDetailsPanel();
}

function editCategoryName (category, name) {
  category.name = name;
  category.ui.menuTitleEl.textContent = name;
  category.raw.name = name;
}

function editGroupIcon (group, icon) {
  const iconUrl = icon || 'assets/icon/fried-egg.png';

  group.icon = icon;
  group.ui.menuEl.querySelector('.group-icon').src = iconUrl;
  group.ui.detailsEl.querySelector('.group-icon').src = iconUrl;
  group.raw.icon = icon;
}

function editGroupName (group, name) {
  group.name = name;
  group.ui.menuTitleEl.textContent = name;
  group.ui.detailsEl.querySelector('.group-name').textContent = name;
  group.raw.name = name;
}

function editGroupDescription (group, description) {
  group.description = description;
  group.ui.detailsEl.querySelector('.group-description').innerHTML = marked.parse(description || '');
  group.raw.description = description;
}

function editPinName (pin, name) {
  pin.name = name;
  pin.ui.mapEl.title = name;
  pin.ui.mapEl.querySelector('img').alt = name;
  pin.ui.detailsItemEl.querySelector('.name').textContent = name;
  pin.ui.detailsInfoEl.querySelector('.name').textContent = name;
  pin.raw.name = name;
}

function editPinDescription (pin, description) {
  pin.description = description;
  pin.ui.detailsInfoEl.querySelector('.description').innerHTML = marked.parse(description || '');
  pin.raw.description = description;
}

function editPinImage (pin, image) {
  pin.image = image;
  pin.ui.detailsInfoEl.querySelector('.image').src = image || '';
  pin.raw.image = image;
}

function clearFocus () {
  const hasPinFocus = state.display.categories.some(
    c => c.groups.some(
      g => g.data.some(p => p.focused || p.highlighted)
    )
  );

  if (hasPinFocus) {
    togglePinFocus(null);
    togglePinHighlight(null);
  } else {
    toggleGroupFocus(null);
    toggleGroupHighlight(null);
  }
}

function toggleGroupFocus (g) {
  console.log('toggle!')
  if (!g || !g.focused) {
    for (const c of state.display.categories) {
      for (const gg of c.groups) {
        setGroupFocusNoUI(gg, false);
      }
    }
  }

  if (g) {
    setGroupFocusNoUI(g, !g.focused);
  }

  refreshDetailsPanel();
}

function setGroupFocus (g, focused) {
  console.log('set!')
  if (g.focused == focused) return;
  setGroupFocusNoUI(g, focused);
  refreshDetailsPanel();
}

function setGroupFocusNoUI (g, focused) {
  console.log('set no UI!')

  if (g.focused == focused) return;

  g.focused = focused;

  if (focused) {
    g.ui.menuEl.classList.add('focus');
    g.ui.mapEl.classList.add('focus');
  } else {
    g.ui.menuEl.classList.remove('focus');
    g.ui.mapEl.classList.remove('focus');
  }
}

function toggleGroupHighlight (g) {
  console.log('toggle H!')

  if (!g || !g.highlighted) {
    for (const c of state.display.categories) {
      for (const gg of c.groups) {
        setGroupHighlightNoUI(gg, false);
      }
    }
  }

  if (g) {
    setGroupHighlightNoUI(g, !g.highlighted);
  }

  refreshDetailsPanel();
}

function setGroupHighlight (g, highlighted) {
  console.log('set H!')

  if (g.highlighted == highlighted) return;
  setGroupHighlightNoUI(g, highlighted);
  refreshDetailsPanel();
}

function setGroupHighlightNoUI (g, highlighted) {
  if (g.highlighted == highlighted) return;

  g.highlighted = highlighted;

  if (highlighted) {
    g.ui.menuEl.classList.add('highlight');
    g.ui.mapEl.classList.add('highlight');
  } else {
    g.ui.menuEl.classList.remove('highlight');
    g.ui.mapEl.classList.remove('highlight');
  }
}

function togglePinFocus (pin) {
  if (!pin || !pin.focused) {
    for (const c of state.display.categories) {
      for (const g of c.groups) {
        for (const p of g.data) {
          setPinFocusNoUI(p, false);
        }
      }
    }
  }

  if (pin) {
    setPinFocusNoUI(pin, !pin.focused);
  }

  refreshDetailsPanel();
}

function setPinFocusNoUI (pin, focused) {
  if (pin.focused == focused) return;

  pin.focused = focused;

  if (focused) {
    pin.ui.mapEl.classList.add('focus');
  } else {
    pin.ui.mapEl.classList.remove('focus');
  }
}

function togglePinHighlight (pin) {
  if (!pin || !pin.highlighted) {
    for (const c of state.display.categories) {
      for (const g of c.groups) {
        for (const p of g.data) {
          setPinHighlightNoUI(p, false);
        }
      }
    }
  }

  if (pin) {
    setPinHighlightNoUI(pin, !pin.highlighted);
  }

  refreshDetailsPanel();
}

function setPinHighlight (pin, highlighted) {
  if (pin.highlighted == highlighted) return;

  // Unhighlight all pins first.
  if (highlighted) {
    for (const c of state.display.categories) {
      for (const g of c.groups) {
        for (const p of g.data) {
          setPinHighlightNoUI(pin, false);
        }
      }
    }
  }

  setPinHighlightNoUI(pin, highlighted);
  refreshDetailsPanel();
}

function setPinHighlightNoUI (pin, highlighted) {
  if (pin.highlighted == highlighted) return;

  pin.highlighted = highlighted;
  setPinHighlightOnMap(pin, highlighted);
}

function setPinHighlightOnMap (pin, highlighted) {
  if (highlighted) {
    pin.ui.mapEl.classList.add('highlight');
  } else {
    pin.ui.mapEl.classList.remove('highlight');
  }
}

function refreshDetailsPanel () {
  const panel = document.createElement('div');
  panel.classList.add('details-panel');

  const { group, pin } = findGroupPinToDetail();
  console.log('details:', group, pin);
  if (group) {
    panel.appendChild(group.ui.detailsEl);

    if (pin) {
      panel.appendChild(pin.ui.detailsInfoEl);
    } else {
      const groupItemEl = document.createElement('div');
      groupItemEl.classList.add('details-group-items');

      for (const p of group.data) {
        groupItemEl.appendChild(p.ui.detailsItemEl);
      }

      groupItemEl.appendChild(group.ui.newPinEl);

      panel.appendChild(groupItemEl);
    }
  } else if (!state.isMobile) {
    if (state.editMode) {
      panel.appendChild(state.ui.welcomeEditEl);
    } else {
      panel.appendChild(state.ui.welcomeEl);
    }
  }

  for (const child of detailsPanelContainer.children) {
    child.remove();
  }
  detailsPanelContainer.appendChild(panel);
}

function findGroupPinToDetail () {
  // First check if any group or pin is highlighted.
  for (const c of state.display.categories) {
    for (const g of c.groups) {
      for (const p of g.data) {
        if (p.highlighted) {
          return { group: g, pin: p };
        }
      }

      if (g.highlighted) {
        return { group: g, pin: null };
      }
    }
  }

  // Else check if any group is focused.\
  for (const c of state.display.categories) {
    for (const g of c.groups) {
      for (const p of g.data) {
        if (p.focused) {
          return { group: g, pin: p };
        }
      }

      if (g.focused) {
        return { group: g, pin: null };
      }
    }
  }

  return { group: null, pin: null };
}

function deletePin (pin, noRefresh = false) {
  const g = pin.group;

  if (pin.focused) {
    togglePinFocus(null);
  }
  if (pin.highlighted) {
    setPinHighlight(pin, false);
  }

  g.ui.mapEl.removeChild(pin.ui.mapEl);
  g.data = g.data.filter(p => p !== pin);
  g.raw.data = g.raw.data.filter(p => p !== pin.raw);

  if (!noRefresh) {
    refreshDetailsPanel();
  }
}

function relocatePin (pin) {
	const [cursorX, cursorY] = [state.cursor.point[0] * 100, state.cursor.point[1] * 100];

	pin.points[0] = [cursorX, cursorY];

	const pinEl = pin.ui.mapEl;
	pinEl.style.left = `${cursorX}%`;
	pinEl.style.top = `${cursorY}%`;
}

function deleteGroup (group, noRefresh = false) {
  const c = group.category;

  if (group.focused) {
    toggleGroupFocus(null);
  }
  if (group.highlighted) {
    setGroupHighlight(group, false);
  }

  for (const p of group.data) {
    deletePin(p, true);
  }

  c.ui.menuEl.removeChild(group.ui.menuEl);
  map.removeChild(group.ui.mapEl);
  c.groups = c.groups.filter(g => g !== group);
  c.raw.groups = c.raw.groups.filter(g => g !== group.raw);

  if (!noRefresh) {
    refreshDetailsPanel();
  }
}

function deleteCategory (category) {
  for (const g of category.groups) {
    deleteGroup(g, true);
  }

  filterDrawer.removeChild(category.ui.menuEl);
  state.display.categories = state.display.categories.filter(c => c !== category);
  state.userMapData.categories = state.userMapData.categories.filter(c => c !== category.raw);

  refreshDetailsPanel();
}

function newCategory (name, noRefresh = false) {
  const raw = {
    name: name,
    groups: [],
  };
  state.userMapData.categories.push(raw);

  const c = {
    visible: true,
    highlighted: false,
    focused: false,
    name: name,
    raw: raw,
    ui: {},
    groups: [],
  };
  state.display.categories.push(c);

  if (!noRefresh) {
    buildFiltersMenu();
  }

  return c;
}

function newGroup (category, name, icon, description, noRefresh = false) {
  const raw = {
    name: name,
    icon: icon,
    description: description,
    data: [],
  };
  category.raw.groups.push(raw);

  const g = {
    visible: true,
    highlighted: false,
    focused: false,
    name: name,
    icon: icon,
    description: description,
    category: category,
    raw: raw,
    ui: {},
    data: [],
  };
  category.groups.push(g);

  if (!noRefresh) {
    buildFiltersMenu();
    buildMapGroup(g);
    buildDetailsPanels();
  }

  return g;
}

function newPin (group, name, description, image, type, points, noRefresh = false) {
  const raw = {
    name: name,
    description: description,
    image: image,
    type: type,
    points: points,
  };
  group.raw.data.push(raw);

  const p = {
    name: name,
    highlighted: false,
    focused: false,
    description: description,
    image: image,
    type: type,
    points: points,
    raw: raw,
    ui: {},
    category: group.category,
    group: group,
  };
  group.data.push(p);

  if (!noRefresh) {
    createPinOnMap(p);
    buildDetailsPanels();
  }

  return p;
}

function movePin (pin, point) {

}