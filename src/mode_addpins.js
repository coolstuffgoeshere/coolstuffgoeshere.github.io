const addPinsModeToggle =  document.getElementById('add-pins-mode');
document.getElementById('map').addEventListener('click', function(event) {
    if (addPinsModeToggle.checked) {
        addLocalPin(event);
    }

    getCoordsFromClick(event); // This is here so I can see the X & Y coordinates on a map click in console.log for debugging purposes.
});

function addLocalPin(event) {
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
  console.log("New Pins");
  console.log(pins);
  createLocalPin(pin);
  addLocalPinAndCategoryToMenu(pin);
}

function createLocalPin(pin) {
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

function addLocalPinAndCategoryToMenu(pin) {
  if (!pin) {
      return;
  }

  var existingCategory = document.querySelector('.category[title="' + pin.category + '"]');
  if (existingCategory) {
      var pinCheckbox = document.createElement('input');
      pinCheckbox.type = 'checkbox';
      pinCheckbox.checked = true;
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
        //   togglePopup(popup);
          showPinEdit(pin);
      });

      var pinItem = document.createElement('div');
      pinItem.appendChild(pinCheckbox);
      pinItem.appendChild(pinLabel);
      existingCategory.appendChild(pinItem);
  } else {
      var newCategory = document.createElement('div');
      newCategory.classList.add('category');
      newCategory.title = pin.category;

      var categoryTitle = document.createElement('h4');
      categoryTitle.textContent = pin.category;
      newCategory.appendChild(categoryTitle);

      var pinCheckbox = document.createElement('input');
      pinCheckbox.type = 'checkbox';
      pinCheckbox.checked = true;
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
          showPinEdit(pin, filterDrawer);
      });

      var pinItem = document.createElement('div');
      pinItem.appendChild(pinCheckbox);
      pinItem.appendChild(pinLabel);
      newCategory.appendChild(pinItem);

      filterDrawer.appendChild(newCategory);
  }
}

function getCoordsFromClick(event) {
  var map = document.getElementById('map');
  var rect = map.getBoundingClientRect();
  var pinSize = 3; // Adjust based on pin size (3 works best)
  var x = ((event.clientX - rect.left) / map.offsetWidth * 100) - (pinSize / 2) + '%';
  var y = ((event.clientY - rect.top) / map.offsetHeight * 100) - (pinSize / 2) + '%';

// Calculate the correction value based on the zoom level
var correctionValue = 1.8; // I guess not needed anymore.



  // Adjust coordinates based on zoom level and correction value
  x = ((parseFloat(x) + zoomData.x) / zoomData.zoom - correctionValue) + '%';
  y = ((parseFloat(y) + zoomData.y) / zoomData.zoom - correctionValue) + '%';

  console.log(correctionValue);
  console.log(x);
  console.log(y);
  
  return {x: x, y: y};
}
