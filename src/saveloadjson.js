function loadPinsFromFile (event) {
  var file = event.target.files[0];
  var reader = new FileReader();

  console.log(`Loading pins from ${file.name}!`);

  reader.onload = function (event) {
    var contents = event.target.result;
    try {
      data = JSON.parse(contents);

      setMapData(data);

	  console.log(`Finished loading pins from ${file.name}!`);

    } catch (error) {
      console.error("Error parsing JSON:", error);
      alert("Error parsing JSON file.");
    }
  };

  reader.readAsText(file);

}

function savePinsToFile () {
  console.log("Saving pins to JSON file!");
  console.log(state.userMapData);

  var currentFile = state.currentMap.urlName;
  var json = JSON.stringify(state.userMapData, null, 2);
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
