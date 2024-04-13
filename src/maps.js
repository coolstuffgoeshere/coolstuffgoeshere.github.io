var maps = [
  {
      name: "Monaco",
      urlName: "monaco",
      mapImage: "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/MonacoOverview_Hi-Res.jpg",
      fileName: "data/map/monaco.json",
  },
  {
      name: "Seoul",
      urlName: "seoul",
      mapImage: "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/SeoulOverview_Hi-Res.jpg",
      fileName: "data/map/seoul.json",
  },
  {
      name: "Skyway Stadium",
      urlName: "skywaystadium",
      mapImage: "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/Atsuhiro_Skyway-Stadium_Overview-Map.png",
      fileName: "data/map/skyway.json",
  },
  {
      name: "Las Vegas",
      urlName: "lasvegas",
      mapImage: "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/Atsuhiro_Las-Vegas_Overview-MAp.png",
      fileName: "data/map/vegas.json",
  },
  {
      name: "SYS$Horizon",
      urlName: "syshorizon",
      mapImage: "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/SYSHORIZON_mapOverview.jpg",
      fileName: "data/map/syshorizon.json",
  }
];
var currentMap = "Monaco";
var currentFile = "data/map/monaco.json";

// Inject map choices in the menu.
const mapChoices = document.getElementById('map-choices');
for (let map of maps) {
    const choice = document.createElement('div');
    choice.textContent = map.name;
    choice.onclick = function() {
        selectedLocation = map.name;
        document.getElementById('map').style.backgroundImage = `url(${map.mapImage})`;
        currentMap = map.name;
        currentFile = map.fileName;
        fetch(map.fileName)
            .then(response => response.json())
            .then(data => {
                pins = data;
                clearMap();
                loadPins();
            })
            .catch(error => console.error('Error loading JSON:', error));
    };
    mapChoices.appendChild(choice);
}

// Load map based on the URL hash route
function loadMap() {
  const hash = window.location.hash.substring(1); // Extract the hash part of the URL
  console.log(hash);

  let selectedMap = maps.find(map => map.urlName.toLowerCase() === hash.toLowerCase());

  if (!selectedMap) {
      // Set Monaco as the default map if no hash route is specified
      selectedMap = maps.find(map => map.urlName.toLowerCase() === 'monaco');
  }
  console.log(selectedMap);

  document.getElementById('map').style.backgroundImage = `url(${selectedMap.mapImage})`;
  currentMap = selectedMap.name;
  currentFile = selectedMap.fileName;

  fetch(selectedMap.fileName)
      .then(response => response.json())
      .then(data => {
          pins = data;
          clearMap();
          loadPins();
      })
      .catch(error => console.error('Error loading JSON:', error));
}