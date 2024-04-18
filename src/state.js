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
}

function setMap (map) {
  state.currentMap = map;
  clearMap();
  document.getElementById('map').style.backgroundImage = `url(${map.mapImage})`;
  fetchMapDataFromSupabase(map.name);
}

function setMapData (data) {
  clearMap();
  clearFilterMenu();
  state.display = {
    categories: [],
  }

  state.mapData = data;
  state.userMapData = JSON.parse(JSON.stringify(data)); // Deep copy.

  for (const category of data.categories) {
    const c = {
      visible: true,
      highlighted: false,
      focused: false,
      name: category.name,
      raw: category,
      ui: {},
      groups: [],
    };
    state.display.categories.push(c);

    for (const group of category.groups) {
      const g = {
        visible: true,
        highlighted: false,
        focused: false,
        name: group.name,
        icon: group.icon,
        description: group.description,
        category: c,
        raw: group,
        ui: {},
        data: [],
      };
      c.groups.push(g);

      for (const pin of group.data) {
        const p = {
          name: pin.name,
          highlighted: false,
          focused: false,
          description: pin.description,
          image: pin.image,
          type: 'point',
          points: [[pin.x, pin.y]],
          raw: pin,
          ui: {},
          category: c,
          group: g,
        };
        g.data.push(p);
      }
    }
  }

  buildFiltersMenu();
  buildMapPins();
  buildDetailsPanels();
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

function addPin (category, group, name, coords) {
  const c = state.display.categories.find(c => c.name === category);
  if (!c) {
    console.error('couldn\'t find category:', category);
    return;
  }

  const g = c.groups.find(g => g.name === group);
  if (!g) {
    console.error('couldn\'t find group:', group);
    return;
  }

  const p = {
    focused: false,
    name: name,
    description: '',
    type: 'point',
    points: [[coords.x, coords.y]],
    ui: {},
    category: c,
    group: g,
  };

  g.data.push(p);
  createPinOnMap(c, g, p);
}

function toggleEditMode () {
  state.editMode = !state.editMode;
  app.classList.toggle('edit-mode');
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
  group.ui.detailsEl.querySelector('.group-description').textContent = description;
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
  pin.ui.detailsInfoEl.querySelector('.description').textContent = description;
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
  if (g.focused == focused) return;
  setGroupFocusNoUI(g, focused);
  refreshDetailsPanel();
}

function setGroupFocusNoUI (g, focused) {
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

function setGroupHighlight (g, highlighted) {
  if (g.highlighted == highlighted) return;

  g.highlighted = highlighted;

  if (highlighted) {
    g.ui.menuEl.classList.add('highlight');
    g.ui.mapEl.classList.add('highlight');
  } else {
    g.ui.menuEl.classList.remove('highlight');
    g.ui.mapEl.classList.remove('highlight');
  }

  refreshDetailsPanel();
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

      panel.appendChild(groupItemEl);
    }
  }

  detailsPanelContainer.replaceChild(panel, detailsPanelContainer.firstChild);
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