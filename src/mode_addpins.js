const addPinsModeToggle = document.getElementById('add-pins-mode');
document.getElementById('map').addEventListener('click', function (event) {
  if (addPinsModeToggle.checked) {
    newPinPrompt(event);
  }

  getCoordsFromClick(event); // This is here so I can see the X & Y coordinates on a map click in console.log for debugging purposes.
});

function newPinPrompt (event) {
  const category = prompt('Enter the category for the new pin:');

  // Check if category is null or blank then stop
  if (!category) {
    return;
  }

  const group = prompt('Enter the group for the new pin:');
  if (!group) {
    return;
  }

  const title = prompt('Enter the title for the new pin:');
  const coords = getCoordsFromClick(event);

  // Check if title is null or blank then stop
  if (!title) {
    return;
  }

  addPin(category, group, title, coords);
}


function getCoordsFromClick (event) {
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

  return { x: x, y: y };
}
