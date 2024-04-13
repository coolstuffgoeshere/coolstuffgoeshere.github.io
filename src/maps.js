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
var currentMapUrl = "monaco";
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
        currentMapUrl = map.urlName;
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
  const hashMap = hash.split('?')[0];
  console.log(hashMap);
  const hashParams = hash.split('?')[1];
  console.log(hashParams);

  let selectedMap = maps.find(map => map.urlName.toLowerCase() === hashMap.toLowerCase());

  if (!selectedMap) {
      // Set Monaco as the default map if no hash route is specified
      selectedMap = maps.find(map => map.urlName.toLowerCase() === 'monaco');
  }
  console.log(selectedMap);

  document.getElementById('map').style.backgroundImage = `url(${selectedMap.mapImage})`;
  currentMap = selectedMap.name;
    currentMapUrl = selectedMap.urlName;
    currentFile = selectedMap.fileName;
  fetch(selectedMap.fileName)
      .then(response => response.json())
      .then(data => {
          pins = data;
          clearMap();
          loadPins();

          // Extract pin data from the URL
          const urlParams = hashParams.replace(/%25/g, '%').replace(/%3A/g, ':').replace(/%2F/g, '/').replace(/%26/g, '&');            
          const category = urlParams.split('&')[0].split('=')[1];
          const title = urlParams.split('&')[1].split('=')[1];
          const x = urlParams.split('&')[2].split('=')[1];
          const y = urlParams.split('&')[3].split('=')[1];
          const pinImg = urlParams.split('&')[4].split('=')[1];
          const dataImg = urlParams.split('&')[5].split('=')[1];
          console.log(category);
          console.log(title);
          console.log(x);
          console.log(y);
          console.log(pinImg);
          console.log(dataImg);

          if (category && title && x && y && pinImg && dataImg) {
              const newPinData = {
                  category,
                  title,
                  coords: { x, y },
                  pinImg,
                  dataImg
              };
              
              createPin(newPinData); // Add a new pin directly
              updateSidebar(); // Update the sidebar with the new pin
              console.log(newPinData);
          }
      })
      .catch(error => console.error('Error loading JSON:', error));
}