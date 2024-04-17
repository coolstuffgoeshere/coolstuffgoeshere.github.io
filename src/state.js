
// State of the app used to render the UI.
const state = {
  maps: [],
  currentMap: null,
  mapData: null,
  userMapData: null,
  display: {
    categories: [],
  },
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
      focused: false,
      name: category.name,
      groups: [],
    };
    state.display.categories.push(c);

    for (const group of category.groups) {
      const g = {
        visible: true,
        focused: false,
        name: group.name,
        icon: group.icon,
        description: group.description,
        category: c,
        data: [],
      };
      c.groups.push(g);

      for (const pin of group.data) {
        const p = {
          focused: false,
          name: pin.name,
          description: pin.description,
          type: 'point',
          points: [[pin.x, pin.y]],
          category: c,
          group: g,
        };
        g.data.push(p);
      }
    }
  }

  buildFiltersMenu();
  buildMapPins();
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
  c.toggleEl.setChecked(visible);
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
  g.toggleEl.setChecked(visible);

  for (const p of g.data) {
    if (visible) {
      p.el.classList.remove('hidden');
    } else {
      p.el.classList.add('hidden');
    }
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
    category: c,
    group: g,
  };

  g.data.push(p);
  createPinOnMap(c, g, p);
}