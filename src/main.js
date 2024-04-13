

const app = document.getElementById('app');


const map = document.getElementById('map');

// Event Listeners

// Update the event listeners for MENU-BUTTONS to toggle the display of choices
document.querySelectorAll('.menu-button').forEach(function(button) {
  button.addEventListener('click', function() {
      this.classList.toggle('active');
  });
});

// Close the choices when clicking outside of the buttons
document.addEventListener('click', function(event) {
  if (!event.target.closest('.menu-button')) {
      document.querySelectorAll('.menu-button').forEach(function(button) {
          button.classList.remove('active');
      });
  }
});

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

document.getElementById('clearButton').addEventListener('click', function() {
  pins = []; // Clear all pins
  clearMap(); // Clear pins from the map
});

// Listen for hash changes to trigger map loading
window.addEventListener('hashchange', loadMap);

// Load map when the page loads
window.onload = loadMap;


