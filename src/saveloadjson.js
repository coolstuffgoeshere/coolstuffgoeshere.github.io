function loadPinsFromFile (event) {

  var file = event.target.files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
    var contents = event.target.result;
    try {
      data = JSON.parse(contents);

      clearMap();
      createAllPinsOnMap(data);
      clearFilterMenu()
      createPinsAndCategoriesInMenu(data);

    } catch (error) {
      console.error("Error parsing JSON:", error);
      alert("Error parsing JSON file.");
    }
  };

  reader.readAsText(file);

}

function savePinsToFile () {
  var currentFile = state.currentMap.urlName;
  var json = JSON.stringify(data, null, 2);
  var blob = new Blob([json], { type: "application/json" });
  var url = URL.createObjectURL(blob);

  var a = document.createElement("a");
  a.style.display = 'none';
  document.body.appendChild(a);
  a.href = url;
  a.download = currentFile;
  a.click();
  window.URL.revokeObjectURL(url);
}
