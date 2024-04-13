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