// Adjust the map container size based on the viewport.
let mapContainer = document.getElementById('map-container');
const r = mapContainer.getBoundingClientRect();
const min = Math.min(r.width, r.height);
map.style.width = min + 'px';
map.style.height = min + 'px';

let observer = new ResizeObserver(function(mutations) {
    const r = mapContainer.getBoundingClientRect();
    const min = Math.min(r.width, r.height);
    map.style.width = min + 'px';
    map.style.height = min + 'px';
});

observer.observe(mapContainer);

// Toggle the filter panel.
const filterPanel = document.getElementById('sidebar');
function toggleFilter() {
    filterPanel.classList.toggle('disabled');
}