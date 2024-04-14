
// function deletePin(index) {
//   if (confirm("Are you sure you want to delete this pin?")) {
//       pins.splice(index, 1);
//       updateSidebar();
//       clearMap(); // Clear existing pins from the map
//       loadPins(); // Reload pins onto the map after deletion
//       document.getElementById('editMode').innerHTML = ''; // Clear the editMode section
//   }
// }

// function showPinEdit(pin, sidebar) {
//   var editMode = document.getElementById('editMode');
//   editMode.innerHTML = `
//       <div id="editPin">
//           <h3>Editing Map Pin: ${pin.category} - ${pin.title}</h3>
//           <label for="editCategory">Category:</label>
//           <input type="text" id="editCategory" value="${pin.category}"><br>
//           <label for="editTitle">Title:</label>
//           <input type="text" id="editTitle" value="${pin.title}"><br>
//           <label for="editCoordsX">Coordinates (X):</label>
//           <input type="text" id="editCoordsX" value="${pin.coords.x}"><br>
//           <label for="editCoordsY">Coordinates (Y):</label>
//           <input type="text" id="editCoordsY" value="${pin.coords.y}"><br>
//           <label for="editPinImg">Pin Image URL:</label>
//           <input type="text" id="editPinImg" value="${pin.pinImg}"><br>
//           <label for="editDataImg">Data Image URL:</label>
//           <input type="text" id="editDataImg" value="${pin.dataImg}"><br>
//           <button onclick="savePinEdit(${pins.indexOf(pin)})">Save & Close</button>
//           <button onclick="deletePin(${pins.indexOf(pin)}); document.getElementById('editMode').innerHTML = '';">Delete & Close</button>
//       </div>`;
// }


// function savePinEdit(index) {
//   var editCategory = document.getElementById('editCategory').value;
//   var editTitle = document.getElementById('editTitle').value;
//   var editCoordsX = document.getElementById('editCoordsX').value;
//   var editCoordsY = document.getElementById('editCoordsY').value;
//   var editPinImg = document.getElementById('editPinImg').value;
//   var editDataImg = document.getElementById('editDataImg').value;

//   if (!editCategory || !editTitle) {
//       alert("Category and Title cannot be empty!");
//       return;
//   }

//   pins[index].category = editCategory;
//   pins[index].title = editTitle;
//   pins[index].coords.x = editCoordsX;
//   pins[index].coords.y = editCoordsY;
//   pins[index].pinImg = editPinImg;
//   pins[index].dataImg = editDataImg;

//   updateSidebar();
//   clearMap(); 
//   loadPins();

//   // Clear editMode div
//   document.getElementById('editMode').innerHTML = '';
// }



// function loadPinsFromFile(file) {
//   var reader = new FileReader();
//   reader.onload = function(event) {
//       var loadedPins = JSON.parse(event.target.result);
//       pins = loadedPins;
//       clearMap(); // Clear existing pins from the map
//       loadPins(); // Load the new pins onto the map
//   };
//   reader.readAsText(file);
// }



// function savePinsToFile() {
//   var json = JSON.stringify(pins, null, 2);
//   var blob = new Blob([json], {type: "application/json"});
//   var url = URL.createObjectURL(blob);

//   var a = document.createElement("a");
//   a.style.display = 'none';
//   document.body.appendChild(a);
//   a.href = url;
//   a.download = currentFile;
//   a.click();
//   window.URL.revokeObjectURL(url);
// }

// function loadPins() {
//   pins.forEach(function(pin) {
//       createPin(pin);
//   });
//   updateSidebar();
// }